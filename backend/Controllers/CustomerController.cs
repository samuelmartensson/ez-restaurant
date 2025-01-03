using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Responses;
using Models.Requests;
using Stripe;
using Clerk.Net.Client;
using System.Text;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class CustomerController(
    RestaurantContext context,
    SiteConfigurationService siteConfigurationService,
    SectionConfigurationService sectionConfigurationService,
    UserService userService,
    ClerkApiClient clerkApiClient
) : ControllerBase
{
    private RestaurantContext context = context;
    private UserService userService = userService;
    private SiteConfigurationService siteConfigurationService = siteConfigurationService;
    private SectionConfigurationService sectionConfigurationService = sectionConfigurationService;
    private ClerkApiClient clerkApiClient = clerkApiClient;


    private async Task<Database.Models.User> assertUser()
    {
        var user = await userService.GetUser(User);
        if (user == null)
        {
            throw new Exception("User not found.");
        }

        return user;
    }

    [Authorize(Policy = "UserPolicy")]
    [HttpGet("customer")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(CustomerResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrCreateCustomer()
    {
        if (User.Identity?.Name == null)
        {
            return BadRequest(new { message = "User identity not found." });
        }

        var user = await userService.GetUser(User);

        if (user == null)
        {
            var newCustomer = new Customer { Subscription = SubscriptionState.Free };
            try
            {
                await context.Customers.AddAsync(newCustomer);
                await context.SaveChangesAsync();
                await context.Users.AddAsync(new Database.Models.User { Id = User.Identity.Name, CustomerId = newCustomer.Id });
                await context.SaveChangesAsync();
            }
            catch
            {
                context.Customers.Remove(newCustomer);
                await context.SaveChangesAsync();
            }
            return Ok(new List<CustomerResponse>());
        }

        var clerkUser = await clerkApiClient.Users[user.Id].GetAsync();

        var options = new CustomerListOptions { Email = clerkUser?.EmailAddresses?.First().EmailAddressProp };
        options.AddExpand("data.subscriptions");
        var service = new CustomerService();
        Stripe.Customer? stripeCustomer = (await service.ListAsync(options)).FirstOrDefault();
        Subscription? subscription = stripeCustomer?.Subscriptions.FirstOrDefault();
        CancelInfo cancelInfo = new CancelInfo
        {
            IsCanceled = subscription?.CancelAt.HasValue ?? false,
            periodEnd = subscription?.CurrentPeriodEnd,
            IsExpired = DateTime.Now > subscription?.CurrentPeriodEnd
        };
        if (subscription != null)
        {
            cancelInfo.IsCanceled = subscription.CancelAt.HasValue;
            cancelInfo.periodEnd = subscription.CurrentPeriodEnd;
            cancelInfo.IsExpired = DateTime.Now > subscription.CurrentPeriodEnd;
        }


        var customer = await context.Customers
        .Include(c => c.CustomerConfigs)
        .FirstOrDefaultAsync(c => c.Id == user.CustomerId);
        var customerConfigs = customer?.CustomerConfigs.Select(c => new CustomerConfigResponse
        {
            Domain = c.Domain,
            HeroType = c.HeroType,
            Theme = c.Theme,
            SiteName = c.SiteName,
            SiteMetaTitle = c.SiteMetaTitle,
            Logo = c.Logo,
            Adress = c.Adress,
            Phone = c.Phone,
            Email = c.Email,
            CustomDomain = c.CustomDomain
        }).ToList();

        return Ok(
            new CustomerResponse
            {
                Subscription = customer?.Subscription ?? SubscriptionState.Free,
                CustomerConfigs = customerConfigs ?? new List<CustomerConfigResponse>(),
                CancelInfo = cancelInfo
            }
            );
    }

    public record CreateConfigRequest(string domain);
    [HttpPut("config")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateConfig([FromBody] CreateConfigRequest config)
    {
        try
        {
            var user = await assertUser();
            var customer = await context.Customers.Include(c => c.CustomerConfigs).FirstOrDefaultAsync(c => c.Id == user.CustomerId);
            if (customer?.Subscription == SubscriptionState.Free && customer.CustomerConfigs.Count() > 0)
            {
                throw new Exception("Can only create 1 domain on Free plan.");
            }

            if (config.domain.Trim() == "")
            {
                throw new Exception("Domain can't be empty");
            }

            var domainAlreadyExists = await context.CustomerConfigs
                .AnyAsync(c => c.Domain.ToLower() == config.domain.ToLower());

            if (domainAlreadyExists)
            {
                throw new Exception("Domain already exists");
            }

            await siteConfigurationService.CreateSiteConfiguration(config.domain, user.CustomerId);
            return Ok(new { message = "Success" });
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

    [HttpDelete("config")]
    [Authorize(Policy = "KeyPolicy")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> RemoveConfig([FromQuery] string key)
    {
        try
        {
            await siteConfigurationService.RemoveSiteConfiguration(key);
            return Ok(new { message = "Success" });
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Free)]
    [HttpPost("site-configuration")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadSiteConfiguration([FromForm] UpdateSiteConfigurationRequest siteConfiguration, [FromQuery] string key)
    {
        await siteConfigurationService.UpdateSiteConfiguration(siteConfiguration, key);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Free)]
    [HttpPost("site-configuration-assets")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadSiteConfigurationAssets([FromForm] UploadSiteConfigurationAssetsRequest assets, [FromQuery] string key)
    {
        await siteConfigurationService.UpdateSiteConfigurationAssets(assets, key);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost("hero")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadHero([FromForm] UploadHeroAssetsRequest assets, [FromForm] List<string> removedAssets, [FromForm] UploadHeroRequest fields, [FromQuery] string key)
    {
        await sectionConfigurationService.UpdateHero(assets, removedAssets, fields, key);
        return Ok(new { message = "Success" });
    }

    public record VercelErrorInner(string code, string message);
    public record VercelError(VercelErrorInner error);
    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost("domain")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> RegisterDomain([FromQuery] string key, [FromQuery] string domainName)
    {
        var vercelToken = Environment.GetEnvironmentVariable("VERCEL_TOKEN");
        var projectId = "prj_6kb7M2XxJs42SjJ8pVpgCIcmlIgi";
        var teamId = "team_ejexGzALAEl9jCP3BWkU0m6X";
        var requestBody = new
        {
            name = domainName,
        };
        var jsonRequestBody = JsonConvert.SerializeObject(requestBody);
        var customerConfig = await context.CustomerConfigs
            .FirstOrDefaultAsync((x) => x.Domain.Replace(" ", "").ToLower() == key.Replace(" ", "").ToLower());

        if (customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        };

        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {vercelToken}");
            var response = await client.PostAsync(
                $"https://api.vercel.com/v10/projects/{projectId}/domains?teamId={teamId}",
                new StringContent(jsonRequestBody, Encoding.UTF8, new MediaTypeHeaderValue("application/json"))
            );

            if (response.IsSuccessStatusCode)
            {


                customerConfig.CustomDomain = domainName;
                await context.SaveChangesAsync();
                return Ok(new { message = "Domain successfully registered" });
            }
            else
            {
                var errorResponseStr = await response.Content.ReadAsStringAsync();

                var errorResponse = await response.Content.ReadFromJsonAsync<VercelError>();
                return BadRequest(new { message = errorResponse?.error?.message ?? "Error registering domain", error = errorResponse?.error?.code ?? "unknown" });
            }
        }
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpDelete("domain")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteDomain([FromQuery] string key)
    {
        var vercelToken = Environment.GetEnvironmentVariable("VERCEL_TOKEN");
        var projectId = "prj_6kb7M2XxJs42SjJ8pVpgCIcmlIgi";
        var teamId = "team_ejexGzALAEl9jCP3BWkU0m6X";
        var customerConfig = await context.CustomerConfigs
            .FirstOrDefaultAsync((x) => x.Domain.Replace(" ", "").ToLower() == key.Replace(" ", "").ToLower());

        if (customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        };

        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {vercelToken}");
            var response = await client.DeleteAsync(
                $"https://api.vercel.com/v9/projects/{projectId}/domains/{customerConfig.CustomDomain}?teamId={teamId}");

            if (response.IsSuccessStatusCode)
            {
                customerConfig.CustomDomain = "";
                await context.SaveChangesAsync();
                return Ok(new { message = "Domain successfully removed." });
            }
            else
            {
                var errorResponse = await response.Content.ReadFromJsonAsync<VercelError>();
                return BadRequest(new { message = errorResponse?.error?.message ?? "Error removing domain", error = errorResponse?.error?.code ?? "unknown" });
            }
        }
    }
}


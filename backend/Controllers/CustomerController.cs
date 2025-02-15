using System.ComponentModel.DataAnnotations;
using Clerk.Net.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Requests;
using Models.Responses;
using Stripe;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class CustomerController(
    RestaurantContext context,
    SiteConfigurationService siteConfigurationService,
    UserService userService,
    AnalyticsService analyticsService,
    VercelService vercelService,
    ClerkApiClient clerkApiClient,
    TranslationContext translationContext
) : ControllerBase
{
    private RestaurantContext context = context;
    private UserService userService = userService;
    private AnalyticsService analyticsService = analyticsService;
    private VercelService vercelService = vercelService;
    private SiteConfigurationService siteConfigurationService = siteConfigurationService;
    private ClerkApiClient clerkApiClient = clerkApiClient;
    private TranslationContext translationContext = translationContext;

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
            var newCustomer = new Customer { Subscription = SubscriptionState.Free, IsFirstSignIn = true };
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
            return Ok(new CustomerResponse
            {
                IsFirstSignIn = true,
                Subscription = SubscriptionState.Free,
                CustomerConfigs = new List<CustomerConfigResponse>(),
            });
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
            Languages = c.Languages.Split(",").ToList(),
            HeroType = c.HeroType,
            Theme = c.Theme,
            SiteName = c.SiteName,
            SiteMetaTitle = c.SiteMetaTitle,
            Logo = c.Logo,
            Adress = c.Adress,
            Phone = c.Phone,
            Email = c.Email,
            CustomDomain = c.CustomDomain,
            Currency = c.Currency,
            AvailableLanguages = translationContext.languages,
            DefaultLanguage = c.DefaultLanguage
        }).ToList();

        return Ok(
            new CustomerResponse
            {
                IsFirstSignIn = false,
                Subscription = subscription != null ? customer?.Subscription ?? SubscriptionState.Free : SubscriptionState.Free,
                CustomerConfigs = customerConfigs ?? new List<CustomerConfigResponse>(),
                CancelInfo = cancelInfo,
            }
            );
    }

    public record CreateConfigRequest(string domain);
    [HttpPut("config")]
    [RequireSubscription(SubscriptionState.Free)]
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
    [RequireSubscription(SubscriptionState.Free)]
    [Authorize(Policy = "KeyPolicy")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> RemoveConfig([FromQuery, Required] string key)
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
    public async Task<IActionResult> UploadSiteConfiguration([FromForm] UpdateSiteConfigurationRequest siteConfiguration, [FromQuery, Required] CommonQueryParameters queryParameters)
    {
        await siteConfigurationService.UpdateSiteConfiguration(siteConfiguration, queryParameters);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Free)]
    [HttpPost("site-configuration-assets")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadSiteConfigurationAssets([FromForm] UploadSiteConfigurationAssetsRequest assets, [FromQuery, Required] CommonQueryParameters queryParameters)
    {
        await siteConfigurationService.UpdateSiteConfigurationAssets(assets, queryParameters);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Free)]
    [HttpPost("languages")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateSiteLanguages([FromForm] UpdateSiteLanguagesRequest request, [FromQuery, Required] CommonQueryParameters queryParameters)
    {
        await siteConfigurationService.UpdateSiteLanguages(request, queryParameters);
        return Ok(new { message = "Success" });
    }

    public record VercelErrorInner(string code, string message);
    public record VercelError(VercelErrorInner error);

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost("domain")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> RegisterDomain([FromQuery, Required] string key, [FromQuery] string domainName)
    {
        var customerConfig = await context.CustomerConfigs
            .FirstOrDefaultAsync((x) => x.Domain.Replace(" ", "").ToLower() == key.Replace(" ", "").ToLower());

        if (customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }
        ;

        var response = await vercelService.CreateDomain(domainName);
        if (response.IsSuccessStatusCode)
        {
            customerConfig.CustomDomain = domainName;
            await context.SaveChangesAsync();
            return Ok(new { message = "Domain successfully registered" });
        }
        else
        {
            var errorResponse = await response.Content.ReadFromJsonAsync<VercelError>();
            if (errorResponse?.error?.code == "domain_already_in_use")
            {
                return BadRequest(new { message = errorResponse?.error?.message ?? "This domain is already registered by a different domain or account.", error = errorResponse?.error?.code ?? "unknown" });
            }
            return BadRequest(new { message = errorResponse?.error?.message ?? "Error registering domain", error = errorResponse?.error?.code ?? "unknown" });
        }
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpDelete("domain")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteDomain([FromQuery, Required] string key)
    {
        var customerConfig = await context.CustomerConfigs
            .FirstOrDefaultAsync((x) => x.Domain.Replace(" ", "").ToLower() == key.Replace(" ", "").ToLower());

        if (customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }
        ;

        if (string.IsNullOrEmpty(customerConfig.CustomDomain) || customerConfig.CustomDomain == null)
        {
            return NotFound(new { message = "Custom domain not found." });
        }
        ;

        var response = await vercelService.DeleteDomain(customerConfig.CustomDomain);
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

    [Authorize(Policy = "KeyPolicy")]
    [HttpGet("analytics")]
    [Produces("application/json")]
    [RequireSubscription(SubscriptionState.Premium)]
    [ProducesResponseType(typeof(AnalyticsResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAnalytics([FromQuery, Required] string key)
    {
        var result = await analyticsService.GetReport(key);
        return Ok(result);
    }

}
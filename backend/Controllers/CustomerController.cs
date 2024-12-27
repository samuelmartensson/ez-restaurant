using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Responses;
using Models.Requests;
using Stripe;
using Clerk.Net.Client;

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
    [HttpGet("get-customer")]
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
        Stripe.Customer stripeCustomer = (await service.ListAsync(options)).First();
        Subscription subscription = stripeCustomer.Subscriptions.First();


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
        }).ToList();

        return Ok(
            new CustomerResponse
            {
                Subscription = customer?.Subscription ?? SubscriptionState.Free,
                CustomerConfigs = customerConfigs ?? new List<CustomerConfigResponse>(),
                CancelInfo = new CancelInfo
                {
                    IsCanceled = subscription.CancelAt.HasValue,
                    periodEnd = subscription.CurrentPeriodEnd,
                    IsExpired = DateTime.Now > subscription.CurrentPeriodEnd
                }
            }
            );
    }

    public record CreateConfigRequest(string domain);
    [HttpPut("create-config")]
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

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Free)]
    [HttpPost("upload-site-configuration")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadSiteConfiguration([FromForm] UpdateSiteConfigurationRequest siteConfiguration, [FromQuery] string key)
    {
        await siteConfigurationService.UpdateSiteConfiguration(siteConfiguration, key);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Free)]
    [HttpPost("upload-site-configuration-assets")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadSiteConfigurationAssets([FromForm] UploadSiteConfigurationAssetsRequest assets, [FromQuery] string key)
    {
        await siteConfigurationService.UpdateSiteConfigurationAssets(assets, key);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost("upload-hero")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadHero([FromForm] UploadHeroAssetsRequest assets, [FromForm] List<string> removedAssets, [FromForm] UploadHeroRequest fields, [FromQuery] string key)
    {
        await sectionConfigurationService.UpdateHero(assets, removedAssets, fields, key);
        return Ok(new { message = "Success" });
    }
}


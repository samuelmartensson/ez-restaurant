using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class CustomerController(
    RestaurantContext context,
    MenuService menuService,
    S3Service s3Service,
    SiteConfigurationService siteConfigurationService,
    UserService userService
) : ControllerBase
{
    private RestaurantContext context = context;
    private MenuService menuService = menuService;
    private UserService userService = userService;
    private S3Service s3Service = s3Service;
    private SiteConfigurationService siteConfigurationService = siteConfigurationService;


    private string ResolveBucketObjectKey(string key)
    {
        return s3Service._bucketURL + key;
    }

    private async Task<Database.Models.User> assertUser()
    {
        var user = await userService.GetUser(User);
        if (user == null)
        {
            throw new Exception("User not found.");
        }

        return user;
    }


    [HttpGet("get-customer-config")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetCustomerConfig([FromQuery] string key)
    {
        var customerConfig = context.CustomerConfigs.FirstOrDefault((x) => x.Domain == key);
        if (string.IsNullOrEmpty(key) || customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }

        return Ok(new
        {
            config = customerConfig,
            heroUrl = ResolveBucketObjectKey($"{customerConfig.Domain}/hero.jpg"),
            iconUrl = ResolveBucketObjectKey($"{customerConfig.Domain}/logo"),
            menuBackdropUrl = ResolveBucketObjectKey($"{customerConfig.Domain}/menu-backdrop.jpg"),
            fontUrl = ResolveBucketObjectKey($"{customerConfig.Domain}/font.ttf"),
        });
    }

    [HttpGet("get-customer-menu")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCustomerMenu([FromQuery] string key)
    {
        var menuItems = await context.MenuItems
            .Where(m => m.CustomerConfigDomain == key)
            .ToListAsync();

        if (string.IsNullOrEmpty(key) || menuItems == null)
        {
            return NotFound(new { message = "Menu not found for the provided key." });
        }

        return Ok(menuItems);
    }


    [Authorize(Policy = "UserPolicy")]
    [HttpGet("get-customer")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrCreateCustomer()
    {
        var user = await userService.GetUser(User);

        if (user == null && User.Identity?.Name != null)
        {
            var newCustomer = new Customer { Subscription = "free" };
            await context.Customers.AddAsync(newCustomer);
            await context.SaveChangesAsync();
            await context.Users.AddAsync(new Database.Models.User { Id = User.Identity.Name, CustomerId = newCustomer.Id });
            await context.SaveChangesAsync();
            return Ok(new { message = "Success" });
        }

        var configs = await context.CustomerConfigs
            .Where(cf => cf.CustomerId == user.CustomerId)
            .ToListAsync();

        return Ok(new { message = "Success", configs });
    }

    public record CreateConfigRequest(string domain);

    [Authorize(Policy = "UserPolicy")]
    [HttpPut("create-config")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateConfig([FromBody] CreateConfigRequest config)
    {
        try
        {
            var user = await assertUser();
            await siteConfigurationService.CreateSiteConfiguration(config.domain, user.CustomerId);
            return Ok(new { message = "Success" });
        }
        catch (Exception e)
        {
            return BadRequest(new { message = e.Message });
        }
    }

    [Authorize(Policy = "KeyPolicy")]
    [HttpPost("upload-customer-menu")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadCustomerMenu([FromForm] string menuItemsJson, [FromForm] List<IFormFile> files, [FromQuery] string key)
    {
        if (string.IsNullOrEmpty(key))
        {
            return BadRequest("Key is required.");
        }

        await menuService.UploadCustomerMenu(menuItemsJson, files, key);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [HttpPost("upload-site-configuration")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadSiteConfiguration([FromForm] string siteConfigurationJson, [FromForm] IFormFile? logo, [FromQuery] string key)
    {
        if (string.IsNullOrEmpty(key))
        {
            return BadRequest("Key is required.");
        }

        await siteConfigurationService.UpdateSiteConfiguration(siteConfigurationJson, logo, key);
        return Ok(new { message = "Success" });
    }
}


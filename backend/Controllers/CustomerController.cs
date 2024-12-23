using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Responses;
using Models.Requests;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class CustomerController(
    RestaurantContext context,
    S3Service s3Service,
    SiteConfigurationService siteConfigurationService,
    SectionConfigurationService sectionConfigurationService,
    UserService userService
) : ControllerBase
{
    private RestaurantContext context = context;
    private UserService userService = userService;
    private S3Service s3Service = s3Service;
    private SiteConfigurationService siteConfigurationService = siteConfigurationService;
    private SectionConfigurationService sectionConfigurationService = sectionConfigurationService;


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
    [ProducesResponseType(typeof(CustomerConfigResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCustomerConfig([FromQuery] string key)
    {
        var customerConfig = await context.CustomerConfigs
            .Include(cf => cf.SiteSectionHero)
            .FirstOrDefaultAsync((x) => x.Domain.Replace(" ", "").ToLower() == key.Replace(" ", "").ToLower());

        if (string.IsNullOrEmpty(key) || customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }

        var response = new CustomerConfigResponse
        {
            Domain = customerConfig.Domain,
            Logo = customerConfig.Logo,
            Font = customerConfig.Font,
            Theme = customerConfig.Theme,
            SiteMetaTitle = customerConfig.SiteMetaTitle,
            SiteName = customerConfig.SiteName,
            HeroType = customerConfig.HeroType,
            MenuBackdropUrl = ResolveBucketObjectKey($"{customerConfig.Domain}/menu-backdrop.jpg"),
            Sections = new SectionsResponse
            {
                Hero = new SiteSectionHeroResponse
                {
                    HeroImage = customerConfig.SiteSectionHero?.Image ?? "",
                    OrderUrl = customerConfig.SiteSectionHero?.OrderUrl ?? ""
                }
            }
        };

        return Ok(response);

    }

    [HttpGet("get-customer-menu")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(MenuResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCustomerMenu([FromQuery] string key)
    {
        var menuCategories = await context.MenuCategorys
            .Include(mc => mc.MenuItems)
            .Where(mc => mc.CustomerConfigDomain == key)
            .ToListAsync();


        if (string.IsNullOrEmpty(key) || menuCategories == null)
        {
            return NotFound(new { message = "Menu not found for the provided key." });
        }

        var menuCategoriesResponse = menuCategories.Select(mc => new MenuCategoryResponse
        {
            Id = mc.Id,
            Name = mc.Name
        })
        .ToList();

        var menuItemsResponse = menuCategories
            .SelectMany(mc => mc.MenuItems)
            .ToList()
            .Select(m => new MenuItemResponse
            {
                Id = m.Id,
                Name = m.Name,
                CategoryId = m.MenuCategoryId,
                Price = m.Price,
                Description = m.Description,
                Tags = m.Tags,
                Image = m.Image,
            })
            .ToList();

        return Ok(new MenuResponse
        {
            Categories = menuCategoriesResponse,
            MenuItems = menuItemsResponse
        });
    }

    [Authorize(Policy = "UserPolicy")]
    [HttpGet("get-customer")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<CustomerResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOrCreateCustomer()
    {
        var user = await userService.GetUser(User);

        if (User.Identity?.Name == null)
        {
            return BadRequest(new { message = "User identity not found." });
        }

        if (user == null)
        {
            var newCustomer = new Customer { Subscription = "free" };
            await context.Customers.AddAsync(newCustomer);
            await context.SaveChangesAsync();
            await context.Users.AddAsync(new Database.Models.User { Id = User.Identity.Name, CustomerId = newCustomer.Id });
            await context.SaveChangesAsync();
            return Ok(new List<CustomerResponse>());
        }

        var configs = await context.CustomerConfigs
        .Where(cf => cf.CustomerId == user.CustomerId)
        .ToListAsync();

        return Ok(configs.Select(c => new CustomerResponse
        {
            Domain = c.Domain,
            CustomerId = c.CustomerId,
            HeroType = c.HeroType,
            Theme = c.Theme,
            SiteName = c.SiteName,
            SiteMetaTitle = c.SiteMetaTitle,
            Logo = c.Logo,
            Adress = c.Adress,
            Phone = c.Phone,
            Email = c.Email,
        }));
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
    [HttpPost("upload-site-configuration")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadSiteConfiguration([FromForm] UpdateSiteConfigurationRequest siteConfiguration, [FromQuery] string key)
    {
        await siteConfigurationService.UpdateSiteConfiguration(siteConfiguration, key);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [HttpPost("upload-site-configuration-assets")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadSiteConfigurationAssets([FromForm] UploadSiteConfigurationAssetsRequest assets, [FromQuery] string key)
    {
        await siteConfigurationService.UpdateSiteConfigurationAssets(assets, key);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [HttpPost("upload-hero")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadHero([FromForm] UploadHeroAssetsRequest assets, [FromForm] List<string> removedAssets, [FromForm] UploadHeroRequest fields, [FromQuery] string key)
    {
        await sectionConfigurationService.UpdateHero(assets, removedAssets, fields, key);
        return Ok(new { message = "Success" });
    }
}


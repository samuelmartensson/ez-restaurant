using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Requests;
using Models.Responses;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class PublicController(RestaurantContext context, EmailService emailService) : ControllerBase
{
    private RestaurantContext context = context;
    private EmailService emailService = emailService;

    [HttpGet("get-customer-config")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(CustomerConfigResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCustomerConfig([FromQuery] string key)
    {
        var customerConfig = await context.CustomerConfigs
            .Include(cf => cf.SiteSectionHero)
            .Include(cf => cf.SiteSectionAbout)
            .Include(cf => cf.SectionVisibility)
            .Include(cf => cf.OpeningHours)
            .FirstOrDefaultAsync((x) => x.Domain.Replace(" ", "").ToLower() == key.Replace(" ", "").ToLower() || x.CustomDomain == key);

        if (string.IsNullOrEmpty(key) || customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }

        var openingHours = customerConfig.OpeningHours.Select(o =>
        new OpeningHourResponse
        {
            OpenTime = o.OpenTime.ToString(@"hh\:mm"),
            CloseTime = o.CloseTime.ToString(@"hh\:mm"),
            Day = o.Day,
            Id = o.Id,
            IsClosed = o.IsClosed,
            Label = o.Label
        }).ToList();

        var response = new CustomerConfigResponse
        {
            Domain = customerConfig.Domain,
            Logo = customerConfig.Logo,
            Font = customerConfig.Font,
            Theme = customerConfig.Theme,
            SiteMetaTitle = customerConfig.SiteMetaTitle,
            SiteName = customerConfig.SiteName,
            HeroType = customerConfig.HeroType,
            Adress = customerConfig.Adress,
            Email = customerConfig.Email,
            Phone = customerConfig.Phone,
            InstagramUrl = customerConfig.InstagramUrl,
            Currency = customerConfig.Currency,
            MapUrl = customerConfig.MapUrl,
            CustomDomain = customerConfig.CustomDomain,
            OpeningHours = openingHours,
            SectionVisibility = new SectionVisibilityResponse
            {
                ContactFormVisible = customerConfig?.SectionVisibility?.ContactFormVisible ?? false
            },
            Sections = new SectionsResponse
            {
                Hero = new SiteSectionHeroResponse
                {
                    HeroImage = customerConfig?.SiteSectionHero?.Image ?? "",
                    OrderUrl = customerConfig?.SiteSectionHero?.OrderUrl ?? ""
                },
                About = new SiteSectionAboutResponse
                {
                    Image = customerConfig?.SiteSectionAbout?.Image ?? "",
                    Description = customerConfig?.SiteSectionAbout?.Description ?? ""
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
        var customerConfig = await context.CustomerConfigs
            .FirstOrDefaultAsync((x) => x.Domain.Replace(" ", "").ToLower() == key.Replace(" ", "").ToLower() || x.CustomDomain == key);
        if (customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }

        var menuCategories = await context.MenuCategorys
            .Include(mc => mc.MenuItems)
            .Where(mc => mc.CustomerConfigDomain == customerConfig.Domain)
            .ToListAsync();


        if (string.IsNullOrEmpty(key) || menuCategories == null)
        {
            return NotFound(new { message = "Menu not found for the provided key." });
        }

        var menuCategoriesResponse = menuCategories.OrderBy(x => x.Order).Select(mc => new MenuCategoryResponse
        {
            Id = mc.Id,
            Name = mc.Name,
            Order = mc.Order,
            Description = mc.Description ?? ""
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

    [HttpPost("contact")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ContactForm([FromBody] ContactRequest request, [FromQuery] string key)
    {
        await emailService.SendEmail(request, key);

        return Ok(new { message = "Success" });
    }
}


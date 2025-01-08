using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Requests;
using Models.Responses;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class PublicController(RestaurantContext context, EmailService emailService, TranslationContext translationContext, TranslationService translationService) : ControllerBase
{
    private RestaurantContext context = context;
    private TranslationContext translationContext = translationContext;
    private EmailService emailService = emailService;
    private TranslationService translationService = translationService;

    private string t(ICollection<Translation> translations, string key)
    {
        return translations.FirstOrDefault(t => t.Key == key)?.Value ?? "";
    }

    private async Task<List<OpeningHourResponse>> GetOpeningHours(CustomerConfig customerConfig, string Key, string Language)
    {
        var openingHourTasks = customerConfig.OpeningHours.Select(async o => new OpeningHour
        {
            CustomerConfigDomain = o.CustomerConfigDomain,
            OpenTime = o.OpenTime,
            CloseTime = o.CloseTime,
            Day = o.Day,
            Id = o.Id,
            IsClosed = o.IsClosed,
            Label = await translationService.GetByKey(
                Language,
                Key,
                $"open_hour_{o.Id}"
            ) ?? o.Label
        }).ToList();

        var openingHourList = await Task.WhenAll(openingHourTasks);
        return openingHourList.ToList().Select(o =>
            new OpeningHourResponse
            {
                OpenTime = o.OpenTime.ToString(@"hh\:mm"),
                CloseTime = o.CloseTime.ToString(@"hh\:mm"),
                Day = o.Day,
                Id = o.Id,
                IsClosed = o.IsClosed,
                Label = o.Label
            }).ToList();
    }

    [HttpGet("get-customer-config")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(CustomerConfigResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCustomerConfig([FromQuery, Required] string Key, [FromQuery, Required] string Language)
    {
        var cf = await context.CustomerConfigs.FirstOrDefaultAsync((x) =>
                x.Domain.Replace(" ", "").ToLower() == Key.Replace(" ", "").ToLower() ||
                x.CustomDomain == Key
            );
        string resolvedLanguage = Language ?? cf?.Languages.Split(",").First() ?? "";

        if (string.IsNullOrEmpty(resolvedLanguage))
        {
            return BadRequest(new { message = "Language could not be resolved." });
        }

        var customerConfig = await context.CustomerConfigs
            .Include(cf => cf.SiteSectionHero)
            .Include(cf => cf.SiteSectionAbout)
            .Include(cf => cf.SectionVisibility)
            .Include(cf => cf.OpeningHours)
            .Include(cf => cf.Translations.Where(t => t.LanguageCode == resolvedLanguage))
            .FirstOrDefaultAsync((x) =>
                x.Domain.Replace(" ", "").ToLower() == Key.Replace(" ", "").ToLower() ||
                x.CustomDomain == Key
            );

        if (customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }

        var openingHours = await GetOpeningHours(customerConfig, Key, resolvedLanguage);
        var response = new CustomerConfigResponse
        {
            Domain = customerConfig.Domain,
            Languages = customerConfig.Languages.Split(",").ToList(),
            Logo = customerConfig.Logo,
            Font = customerConfig.Font,
            Theme = customerConfig.Theme,
            SiteMetaTitle = t(customerConfig.Translations, "site:short_description") ?? customerConfig.SiteMetaTitle,
            SiteName = t(customerConfig.Translations, "site:name") ?? customerConfig.SiteName,
            HeroType = customerConfig.HeroType,
            Adress = customerConfig.Adress,
            Email = customerConfig.Email,
            Phone = customerConfig.Phone,
            InstagramUrl = customerConfig.InstagramUrl,
            Currency = customerConfig.Currency,
            MapUrl = customerConfig.MapUrl,
            CustomDomain = customerConfig.CustomDomain,
            OpeningHours = openingHours,
            AvailableLanguages = translationContext.languages,
            DefaultLanguage = customerConfig.DefaultLanguage,
            SectionVisibility = new SectionVisibilityResponse
            {
                ContactFormVisible = customerConfig.SectionVisibility?.ContactFormVisible ?? false
            },
            Sections = new SectionsResponse
            {
                Hero = new SiteSectionHeroResponse
                {
                    HeroImage = customerConfig.SiteSectionHero?.Image ?? "",
                    OrderUrl = customerConfig.SiteSectionHero?.OrderUrl ?? ""
                },
                About = new SiteSectionAboutResponse
                {
                    Image = customerConfig.SiteSectionAbout?.Image ?? "",
                    Description = t(customerConfig.Translations, "about:description") ?? "",
                    AboutTitle = translationContext.GetTranslation(resolvedLanguage, "about:title")
                }
            },
            SiteTranslations = translationContext.GetBaseTranslations(resolvedLanguage)
        };

        return Ok(response);

    }

    [HttpGet("get-customer-menu")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(MenuResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCustomerMenu([FromQuery, Required] CommonQueryParameters queryParameters)
    {
        var key = queryParameters.Key;
        var customerConfig = await context.CustomerConfigs
            .Include(cf => cf.MenuCategorys)
                .ThenInclude(mc => mc.MenuItems)
            .Select(cf => new
            {
                CustomerConfig = cf,
                Translations = cf.Translations.Where(t =>
                    t.LanguageCode == queryParameters.Language &&
                    (t.Key.Contains("menu_item") || t.Key.Contains("menu_category"))
                ),
                cf.MenuCategorys
            })
            .FirstOrDefaultAsync(x =>
                x.CustomerConfig.Domain.Replace(" ", "").ToLower() == key.Replace(" ", "").ToLower() ||
                x.CustomerConfig.CustomDomain == key);


        if (customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }

        if (string.IsNullOrEmpty(key) || customerConfig.MenuCategorys == null)
        {
            return NotFound(new { message = "Menu not found for the provided key." });
        }
        var translationMap = customerConfig.Translations.ToDictionary(t => t.Key);
        var menuCategoriesResponse = customerConfig.MenuCategorys.OrderBy(x => x.Order).Select(mc =>
            new MenuCategoryResponse
            {
                Id = mc.Id,
                Order = mc.Order,
                Name = translationMap.GetValueOrDefault($"menu_category_{mc.Id}_name")?.Value ?? mc.Name,
                Description = translationMap.GetValueOrDefault($"menu_category_{mc.Id}_description")?.Value ?? mc.Description ?? ""
            })
            .ToList();

        var menuItemsResponse = customerConfig.MenuCategorys
            .SelectMany(m => m.MenuItems)
            .OrderBy(m => m.Order)
            .ToList()
            .Select(m => new MenuItemResponse
            {
                Id = m.Id,
                Name = translationMap.GetValueOrDefault($"menu_item_{m.Id}_name")?.Value ?? m.Name,
                Description = translationMap.GetValueOrDefault($"menu_item_{m.Id}_description")?.Value ?? m.Description,
                Tags = translationMap.GetValueOrDefault($"menu_item_{m.Id}_tags")?.Value ?? m.Tags,
                CategoryId = m.MenuCategoryId,
                Price = m.Price,
                Image = m.Image,
                Order = m.Order
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
    public async Task<IActionResult> ContactForm([FromBody] ContactRequest request, [FromQuery, Required] string key)
    {
        await emailService.SendEmail(request, key);

        return Ok(new { message = "Success" });
    }
}


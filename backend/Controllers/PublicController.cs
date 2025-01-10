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
        var openingHourTasks = customerConfig.OpeningHours.Select(async o => new OpeningHourResponse
        {
            OpenTime = o.OpenTime.ToString(@"hh\:mm"),
            CloseTime = o.CloseTime.ToString(@"hh\:mm"),
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

        return openingHourList.ToList();
    }

    [HttpGet("get-customer-config-meta")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(CustomerConfigMetaResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCustomerConfigMeta([FromQuery, Required] string Key, [FromQuery, Required] string Language)
    {
        var cf = await context.CustomerConfigs.Include(cf => cf.Translations).FirstOrDefaultAsync((x) =>
                x.Domain.Replace(" ", "").ToLower() == Key.Replace(" ", "").ToLower() ||
                x.CustomDomain == Key
            );
        if (cf == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }
        string resolvedLanguage = Language ?? cf.Languages.Split(",").First() ?? "";

        if (string.IsNullOrEmpty(resolvedLanguage))
        {
            return BadRequest(new { message = "Language could not be resolved." });
        }
        return Ok(new CustomerConfigMetaResponse
        {
            DefaultLanguage = cf.DefaultLanguage,
            Domain = cf.Domain,
            Languages = cf.Languages.Split(",").ToList(),
            SiteName = t(cf.Translations, "site:name") ?? cf.SiteName,
            Currency = cf.Currency,
        });
    }

    [HttpGet("about")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(SiteSectionAboutResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> About([FromQuery, Required] CommonQueryParameters queryParameters)
    {
        var key = queryParameters.Key?.Trim().ToLower();
        string language = queryParameters.Language;
        var customerConfig = await context.CustomerConfigs
            .Include(cf => cf.SiteSectionAbout)
            .Include(cf => cf.Translations.Where(t => t.LanguageCode == language))
            .FirstOrDefaultAsync(x => x.Domain.Replace(" ", "").ToLower() == key || x.CustomDomain == queryParameters.Key);

        if (customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }

        return Ok(new SiteSectionAboutResponse
        {
            Image = customerConfig.SiteSectionAbout?.Image ?? string.Empty,
            Description = t(customerConfig.Translations, "about:description") ?? string.Empty,
            AboutTitle = translationContext.GetTranslation(language, "about:title")
        });
    }


    [HttpGet("get-customer-translations")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(CustomerConfigTranslations), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCustomerTranslations([FromQuery, Required] string Key, [FromQuery, Required] string Language)
    {
        var cf = await context.CustomerConfigs.FirstOrDefaultAsync((x) =>
                x.Domain.Replace(" ", "").ToLower() == Key.Replace(" ", "").ToLower() ||
                x.CustomDomain == Key
            );
        if (cf == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }
        string resolvedLanguage = Language ?? cf.Languages.Split(",").First() ?? "";

        if (string.IsNullOrEmpty(resolvedLanguage))
        {
            return BadRequest(new { message = "Language could not be resolved." });
        }

        return Ok(new CustomerConfigTranslations
        {
            SiteTranslations = translationContext.GetBaseTranslations(resolvedLanguage),
        });
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
            ThemeColorConfig = customerConfig.ThemeColorConfig,
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
        if (string.IsNullOrEmpty(queryParameters.Key))
            return NotFound(new { message = "Key is required." });

        string normalizedKey = queryParameters.Key.Trim().ToLower();

        var customerConfig = await context.CustomerConfigs
            .Where(cf => cf.Domain.Trim().ToLower() == normalizedKey || cf.CustomDomain == normalizedKey)
            .Include(cf => cf.MenuCategorys)
            .ThenInclude(mc => mc.MenuItems)
            .Select(cf => new
            {
                Config = cf,
                Translations = cf.Translations.Where(t =>
                    t.LanguageCode == queryParameters.Language &&
                    (t.Key.StartsWith("menu_item") || t.Key.StartsWith("menu_category"))
                )
            })
            .FirstOrDefaultAsync();

        if (customerConfig == null)
            return NotFound(new { message = "CustomerConfig not found for the provided key." });


        var translationMap = customerConfig.Translations.ToDictionary(t => t.Key);

        var menuCategoriesResponse = customerConfig.Config.MenuCategorys
            .OrderBy(mc => mc.Order)
            .Select(mc => new MenuCategoryResponse
            {
                Id = mc.Id,
                Order = mc.Order,
                Name = translationMap.GetValueOrDefault($"menu_category_{mc.Id}_name")?.Value ?? mc.Name,
                Description = translationMap.GetValueOrDefault($"menu_category_{mc.Id}_description")?.Value ?? mc.Description ?? ""
            })
            .ToList();

        var menuItemsResponse = customerConfig.Config.MenuCategorys
            .SelectMany(mc => mc.MenuItems)
            .OrderBy(mi => mi.Order)
            .Select(mi => new MenuItemResponse
            {
                Id = mi.Id,
                Name = translationMap.GetValueOrDefault($"menu_item_{mi.Id}_name")?.Value ?? mi.Name,
                Description = translationMap.GetValueOrDefault($"menu_item_{mi.Id}_description")?.Value ?? mi.Description,
                Tags = translationMap.GetValueOrDefault($"menu_item_{mi.Id}_tags")?.Value ?? mi.Tags,
                CategoryId = mi.MenuCategoryId,
                Price = mi.Price,
                Image = mi.Image,
                Order = mi.Order
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


using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models.Requests;
using Models.Responses;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class PublicController(
    RestaurantContext context,
    EmailService emailService,
    TranslationContext translationContext,
    TranslationService translationService,
    CacheService cacheService
) : ControllerBase
{
    private RestaurantContext context = context;
    private TranslationContext translationContext = translationContext;
    private TranslationService translationService = translationService;
    private EmailService emailService = emailService;


    private string? t(ICollection<Translation> translations, string key)
    {
        return translations.FirstOrDefault(t => t.Key == key)?.Value;
    }

    private List<OpeningHourResponse> GetOpeningHours(CustomerConfig customerConfig)
    {
        return customerConfig.OpeningHours.Select(o => new OpeningHourResponse
        {
            OpenTime = o.OpenTime.ToString(@"hh\:mm"),
            CloseTime = o.CloseTime.ToString(@"hh\:mm"),
            Day = o.Day,
            Id = o.Id,
            IsClosed = o.IsClosed,
            Label = customerConfig.Translations
                        .FirstOrDefault(t => t.Key == $"open_hour_{o.Id}")?.Value ?? o.Label
        }).ToList();
    }

    [HttpGet("get-customer-config-meta")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(CustomerConfigMetaResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCustomerConfigMeta([FromQuery, Required] string Key, [FromQuery, Required] string Language)
    {
        Stopwatch stopwatch = Stopwatch.StartNew();
        var cf = await context.CustomerConfigs.Where((x) =>
                x.Domain == Key || x.CustomDomain == Key
            ).Select(x => new
            {
                x.Languages,
                x.DefaultLanguage,
                x.Domain,
                x.SiteName,
                x.Currency,
                x.SiteSectionHero.Image
            }).FirstOrDefaultAsync();

        if (cf == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }
        string resolvedLanguage = Language ?? cf.Languages.Split(",").First() ?? "";

        if (string.IsNullOrEmpty(resolvedLanguage))
        {
            return BadRequest(new { message = "Language could not be resolved." });
        }


        stopwatch.Stop();
        Console.WriteLine($"GetCustomerMeta: {stopwatch.ElapsedMilliseconds} milliseconds");

        return Ok(new CustomerConfigMetaResponse
        {
            DefaultLanguage = cf.DefaultLanguage,
            Domain = cf.Domain,
            Languages = cf.Languages.Split(",").ToList(),
            SiteName = await translationService.GetByKey(resolvedLanguage, Key, "site:name") ?? cf.SiteName,
            Currency = cf.Currency,
            Image = cf.Image
        });
    }

    [HttpGet("about")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(SiteSectionAboutResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> About([FromQuery, Required] CommonQueryParameters queryParameters)
    {
        Stopwatch stopwatch = Stopwatch.StartNew();
        var key = queryParameters.Key;
        string language = queryParameters.Language;
        var customerConfig = await context.CustomerConfigs
            .AsNoTracking()
            .Where(x => x.Domain == key || x.CustomDomain == queryParameters.Key)
            .Select(cf => new
            {
                cf.SiteSectionAbout,
                Translations = cf.Translations
                                .Where(t => t.LanguageCode == language)
            })
            .FirstOrDefaultAsync();

        if (customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }


        stopwatch.Stop();
        Console.WriteLine($"About: {stopwatch.ElapsedMilliseconds} milliseconds");

        return Ok(new SiteSectionAboutResponse
        {
            Image = customerConfig.SiteSectionAbout?.Image ?? string.Empty,
            Description = t(customerConfig.Translations.ToList(), "about:description") ?? string.Empty,
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
    public async Task<IActionResult> GetCustomerConfig([FromQuery, Required] string Key, [FromQuery, Required] string Language, [FromQuery] bool cache)
    {
        Console.Write(HttpContext.Request.Host);
        Stopwatch stopwatch = Stopwatch.StartNew();
        var customerConfig = await cacheService.GetOrAdd($"customerConfig-{Key}-{Language}", async () =>
        {
            // If cache misses, fetch data from Supabase
            var result = await context.CustomerConfigs
                    .AsNoTracking()
                    .AsSplitQuery()
                    .Where((x) => x.Domain == Key || x.CustomDomain == Key)
                    .Include(cf => cf.SiteSectionHero)
                    .Include(cf => cf.SiteSectionAbout)
                    .Include(cf => cf.SiteSectionGallery)
                    .Include(cf => cf.SectionVisibility)
                    .Include(cf => cf.OpeningHours)
                    .Include(cf => cf.NewsArticles)
                    .FirstOrDefaultAsync();

            return result;
        }, cache);

        string resolvedLanguage = Language ?? customerConfig?.Languages.Split(",").First() ?? "";

        if (string.IsNullOrEmpty(resolvedLanguage))
        {
            return BadRequest(new { message = "Language could not be resolved." });
        }
        if (customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided Key." });
        }

        var translations = await context.Translations
            .Where(t => t.CustomerConfigDomain == customerConfig.Domain && t.LanguageCode == resolvedLanguage)
            .ToListAsync();
        customerConfig.Translations = translations;

        var openingHours = GetOpeningHours(customerConfig);
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
            TiktokUrl = customerConfig.TiktokUrl,
            FacebookUrl = customerConfig.FacebookUrl,
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
                },
                Gallery = customerConfig.SiteSectionGallery.Select(g => new SiteSectionGalleryResponse
                {
                    Id = g.Id,
                    Image = g.Image
                }).ToList(),
                NewsArticles = customerConfig.NewsArticles.Where(a => a.Published).OrderByDescending(a => a.Date).Select(a => new NewsArticleResponse
                {
                    Id = a.Id,
                    Title = t(customerConfig.Translations, $"news_title_{a.Id}") ?? a.Title,
                    Content = t(customerConfig.Translations, $"news_content_{a.Id}") ?? a.Content,
                    Image = a.Image,
                    Date = a.Date,
                    UpdatedAt = a.UpdatedAt
                }).ToList(),
            },
            SiteTranslations = translationContext.GetBaseTranslations(resolvedLanguage)
        };
        stopwatch.Stop();
        Console.WriteLine($"GetCustomerConfig: {stopwatch.ElapsedMilliseconds} milliseconds");

        return Ok(response);
    }

    [HttpGet("get-customer-menu")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(MenuResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCustomerMenu([FromQuery, Required] CommonQueryParameters queryParameters, [FromQuery] bool cache)
    {
        Stopwatch stopwatch = Stopwatch.StartNew();
        if (string.IsNullOrEmpty(queryParameters.Key))
            return NotFound(new { message = "Key is required." });

        var customerConfig = await cacheService.GetOrAdd($"customerMenu-{queryParameters.Key}-{queryParameters.Language}", async () =>
        {
            var result = await context.CustomerConfigs
                .Where(cf => cf.Domain == queryParameters.Key || cf.CustomDomain == queryParameters.Key)
                .Include(cf => cf.MenuCategorys)
                .ThenInclude(mc => mc.MenuItems)
                .AsSplitQuery()
                .FirstOrDefaultAsync();

            return result;
        }, cache);

        if (customerConfig == null)
            return NotFound(new { message = "CustomerConfig not found for the provided key." });

        var translations = await context.Translations
            .Where(t => t.LanguageCode == queryParameters.Language && (t.Key.StartsWith("menu_item") || t.Key.StartsWith("menu_category")))
            .ToListAsync();

        var translationMap = translations.ToDictionary(t => t.Key);

        var menuCategoriesResponse = customerConfig.MenuCategorys
            .OrderBy(mc => mc.Order)
            .Select(mc => new MenuCategoryResponse
            {
                Id = mc.Id,
                Order = mc.Order,
                Name = translationMap.GetValueOrDefault($"menu_category_{mc.Id}_name")?.Value ?? mc.Name,
                Description = translationMap.GetValueOrDefault($"menu_category_{mc.Id}_description")?.Value ?? mc.Description ?? ""
            })
            .ToList();

        var menuItemsResponse = customerConfig.MenuCategorys
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

        stopwatch.Stop();
        Console.WriteLine($"GetCustomerMenu: {stopwatch.ElapsedMilliseconds} milliseconds");

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


using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class HeroService(RestaurantContext context, S3Service s3Service, TranslationService translationService)
{
    private RestaurantContext context = context;
    private readonly S3Service s3Service = s3Service;
    private TranslationService translationService = translationService;


    private async Task<CustomerConfig> GetCustomerConfig(string key)
    {
        var customerConfig = await context.CustomerConfigs
                    .Include(cf => cf.SiteSectionHero)
                    .FirstOrDefaultAsync((x) => x.Domain == key);

        if (customerConfig?.SiteSectionHero == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }

        return customerConfig;
    }

    public async Task UpdateHero(UploadHeroRequest fields, string key)
    {
        var customerConfig = await GetCustomerConfig(key);

        if (customerConfig.SiteSectionHero == null)
        {
            var newHero = new SiteSectionHero { CustomerConfigDomain = customerConfig.Domain, Image = "" };
            await context.SiteSectionHeros.AddAsync(newHero);
            customerConfig.SiteSectionHero = newHero;
        }

        customerConfig.SiteSectionHero.OrderUrl = fields?.OrderUrl ?? "";

        var languages = ((await context.CustomerConfigs
            .Select(x => new { x.Languages, x.Domain })
            .Where((x) => x.Domain == key)
            .FirstOrDefaultAsync())?.Languages ?? "").Split(",").ToList();

        var localizedTranslations = languages.Select(language => (language, new Dictionary<string, string> {
                { "site:name", fields?.LocalizedFields[language]?.SiteName ?? "" },
                { "site:short_description", fields?.LocalizedFields[language]?.SiteMetaTitle ?? "" }
            })).ToList();

        await translationService.CreateOrUpdateByKeys(localizedTranslations, key);

        await context.SaveChangesAsync();
    }

    public async Task UpdateHeroAssets(UploadHeroAssetsRequest assets, List<string> removedAssets, CommonQueryParameters queryParameters)
    {
        var customerConfig = await GetCustomerConfig(queryParameters.Key);
        await s3Service.UpdateAssets(customerConfig.SiteSectionHero, $"{queryParameters.Key}/hero/", assets, removedAssets);
        await context.SaveChangesAsync();
    }

    public async Task<Dictionary<string, HeroResponse>> GetHero(CommonQueryParameters queryParameters)
    {
        var customerConfig = await GetCustomerConfig(queryParameters.Key);

        var languages = (await context.CustomerConfigs
            .Select(x => new { x.Languages, x.Domain })
            .Where((x) => x.Domain == queryParameters.Key)
            .FirstOrDefaultAsync())?.Languages ?? "";

        var responseDictionary = new Dictionary<string, HeroResponse>();

        foreach (var language in languages.Split(",").ToList())
        {
            if (string.IsNullOrEmpty(language)) continue;

            var localizedResponse = new HeroResponse
            {
                SiteName = await translationService.GetByKey(language, queryParameters.Key, "site:name") ?? "",
                SiteMetaTitle = await translationService.GetByKey(language, queryParameters.Key, "site:short_description") ?? "",
                HeroImage = customerConfig.SiteSectionHero?.Image ?? "",
                OrderUrl = customerConfig.SiteSectionHero?.OrderUrl ?? "",
            };

            responseDictionary[language] = localizedResponse;
        }

        return responseDictionary;
    }
}

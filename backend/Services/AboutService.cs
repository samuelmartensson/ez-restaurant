using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class AboutService(RestaurantContext context, S3Service s3Service, TranslationService translationService)
{
    private RestaurantContext context = context;
    private readonly S3Service s3Service = s3Service;
    private TranslationService translationService = translationService;


    public async Task<Dictionary<string, AboutResponse>?> GetAbout(CommonQueryParameters queryParameters)
    {
        var about = await context.SiteSectionAbouts
            .FirstOrDefaultAsync((x) => x.CustomerConfigDomain == queryParameters.Key);

        if (about == null) return null;

        var languages = (await context.CustomerConfigs
            .Select(x => new { x.Languages, x.Domain })
            .Where((x) => x.Domain == queryParameters.Key)
            .FirstOrDefaultAsync())?.Languages ?? "";

        var responseDictionary = new Dictionary<string, AboutResponse>();

        foreach (var language in languages.Split(",").ToList())
        {
            if (string.IsNullOrEmpty(language)) continue;

            var localizedResponse = new AboutResponse
            {
                Image = about.Image,
                Description = await translationService.GetByKey(language, queryParameters.Key, "about:description") ?? ""
            };

            responseDictionary[language] = localizedResponse;
        }

        return responseDictionary;
    }
    public async Task UpdateAbout(UploadAboutRequest request, CommonQueryParameters queryParameters)
    {
        string tKey = "about:description";
        var customerConfig = await context.CustomerConfigs
            .Include(cf => cf.SiteSectionAbout)
            .FirstOrDefaultAsync((x) => x.Domain == queryParameters.Key);

        if (customerConfig == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }

        if (customerConfig.SiteSectionAbout == null)
        {
            var newAbout = new SiteSectionAbout { CustomerConfigDomain = customerConfig.Domain, Image = "", Description = tKey };
            await context.SiteSectionAbouts.AddAsync(newAbout);
            customerConfig.SiteSectionAbout = newAbout;
        }

        var languages = ((await context.CustomerConfigs
            .Select(x => new { x.Languages, x.Domain })
            .Where((x) => x.Domain == queryParameters.Key)
            .FirstOrDefaultAsync())?.Languages ?? "").Split(",").ToList();

        var localizedTranslations = languages.Select(language => (language, new Dictionary<string, string> {
                { tKey, request.LocalizedFields[language].Description ?? "" },
            })).ToList();

        await translationService.CreateOrUpdateByKeys(
            localizedTranslations,
            queryParameters.Key
        );

        customerConfig.SiteSectionAbout.Description = request.LocalizedFields[languages.First()].Description ?? "";

        await context.SaveChangesAsync();
    }

    public async Task UpdateAboutAssets(UploadAboutAssetsRequest assets, List<string> removedAssets, CommonQueryParameters queryParameters)
    {
        var customerConfig = await context.CustomerConfigs
            .Include(cf => cf.SiteSectionAbout)
            .FirstOrDefaultAsync((x) => x.Domain == queryParameters.Key);

        if (customerConfig?.SiteSectionAbout == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }

        await s3Service.UpdateAssets(customerConfig.SiteSectionAbout, $"{queryParameters.Key}/about", assets, removedAssets);
        await context.SaveChangesAsync();
    }
}

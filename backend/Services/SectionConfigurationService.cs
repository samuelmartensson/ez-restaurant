using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class SectionConfigurationService(RestaurantContext context, S3Service s3Service, TranslationService translationService)
{
    private RestaurantContext context = context;
    private TranslationService translationService = translationService;
    private readonly S3Service s3Service = s3Service;

    public async Task UpdateHero(UploadHeroAssetsRequest assets, List<string> removedAssets, UploadHeroRequest fields, string key)
    {
        var customerConfig = await context.CustomerConfigs.Include(cf => cf.SiteSectionHero).FirstOrDefaultAsync((x) => x.Domain == key);

        if (customerConfig == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }

        if (customerConfig.SiteSectionHero == null)
        {
            var newHero = new SiteSectionHero { CustomerConfigDomain = customerConfig.Domain, Image = "" };
            await context.SiteSectionHeros.AddAsync(newHero);
            customerConfig.SiteSectionHero = newHero;
        }

        customerConfig.SiteSectionHero.OrderUrl = fields?.OrderUrl ?? "";

        var siteSectionHeroType = customerConfig.SiteSectionHero.GetType();
        foreach (var name in removedAssets)
        {
            await s3Service.DeleteFileAsync($"{key}/hero/{name}");
            var matchingProperty = siteSectionHeroType.GetProperty(name);
            if (matchingProperty != null)
            {
                matchingProperty.SetValue(customerConfig.SiteSectionHero, "");
            }
        }

        var uploadRequestType = typeof(UploadHeroAssetsRequest);
        foreach (var property in uploadRequestType.GetProperties())
        {
            var file = property.GetValue(assets) as IFormFile;
            if (file != null)
            {
                string url = await s3Service.UploadFileAsync(file, $"{key}/hero/{property.Name.ToLowerInvariant()}");
                var matchingProperty = siteSectionHeroType.GetProperty(property.Name);
                if (matchingProperty != null)
                {
                    matchingProperty.SetValue(customerConfig.SiteSectionHero, url);
                }
            }
        }

        await context.SaveChangesAsync();
    }

    public async Task UpdateAbout(UploadAboutAssetsRequest assets, List<string> removedAssets, UploadAboutRequest fields, CommonQueryParameters queryParameters)
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

        await translationService.CreateOrUpdateByKey(
            queryParameters.Language,
            queryParameters.Key,
            tKey,
            fields?.Description
        );
        customerConfig.SiteSectionAbout.Description = fields?.Description ?? "";

        var siteSectionAboutType = customerConfig.SiteSectionAbout.GetType();
        foreach (var name in removedAssets)
        {
            await s3Service.DeleteFileAsync($"{queryParameters.Key}/about/{name}");
            var matchingProperty = siteSectionAboutType.GetProperty(name);
            if (matchingProperty != null)
            {
                matchingProperty.SetValue(customerConfig.SiteSectionAbout, "");
            }
        }

        var uploadRequestType = typeof(UploadAboutAssetsRequest);
        foreach (var property in uploadRequestType.GetProperties())
        {
            var file = property.GetValue(assets) as IFormFile;
            if (file != null)
            {
                string url = await s3Service.UploadFileAsync(file, $"{queryParameters.Key}/about/{property.Name.ToLowerInvariant()}");
                var matchingProperty = siteSectionAboutType.GetProperty(property.Name);
                if (matchingProperty != null)
                {
                    matchingProperty.SetValue(customerConfig.SiteSectionAbout, url);
                }
            }
        }

        await context.SaveChangesAsync();
    }
}

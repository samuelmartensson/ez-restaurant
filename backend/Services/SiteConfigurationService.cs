using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class SiteConfigurationService(RestaurantContext context, S3Service s3Service, OpeningHourService openingHourService, TranslationService translationService)
{
    private readonly RestaurantContext context = context;
    private readonly S3Service s3Service = s3Service;
    private TranslationService translationService = translationService;

    private readonly OpeningHourService openingHourService = openingHourService;


    public async Task UpdateSiteLanguages(UpdateSiteLanguagesRequest request, CommonQueryParameters queryParameters)
    {
        var key = queryParameters.Key;
        var customerConfig = await context.CustomerConfigs.FirstOrDefaultAsync((x) => x.Domain == key);
        if (customerConfig == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }

        customerConfig.Languages = string.Join(",", request.Languages);
        customerConfig.DefaultLanguage = request.DefaultLanguage;
        await context.SaveChangesAsync();
    }

    public async Task UpdateSiteConfiguration(UpdateSiteConfigurationRequest siteConfiguration, CommonQueryParameters queryParameters)
    {
        var key = queryParameters.Key;
        var customerConfig = await context.CustomerConfigs.Include(cf => cf.SectionVisibility).FirstOrDefaultAsync((x) => x.Domain == key);
        if (customerConfig == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }
        if (customerConfig.SectionVisibility == null)
        {
            customerConfig.SectionVisibility = new SectionVisibility
            {
                CustomerConfigDomain = key
            };
        }

        await translationService.CreateOrUpdateByKey(queryParameters.Language, queryParameters.Key, "site:name", siteConfiguration.SiteName);
        await translationService.CreateOrUpdateByKey(queryParameters.Language, queryParameters.Key, "site:short_description", siteConfiguration.SiteMetaTitle);


        customerConfig.SiteName = siteConfiguration.SiteName;
        customerConfig.SiteMetaTitle = siteConfiguration.SiteMetaTitle;
        customerConfig.Theme = siteConfiguration.Theme;
        customerConfig.Adress = siteConfiguration.Adress;
        customerConfig.Email = siteConfiguration.Email;
        customerConfig.InstagramUrl = siteConfiguration.InstagramUrl;
        customerConfig.TiktokUrl = siteConfiguration.TiktokUrl;
        customerConfig.FacebookUrl = siteConfiguration.FacebookUrl;
        customerConfig.Currency = siteConfiguration.Currency;
        customerConfig.MapUrl = siteConfiguration.MapUrl;
        customerConfig.Phone = siteConfiguration.Phone;
        customerConfig.ThemeColorConfig = siteConfiguration.ThemeColorConfig;
        customerConfig.SectionVisibility.ContactFormVisible = siteConfiguration.ContactFormVisible;

        if (siteConfiguration.Logo == "REMOVE")
        {
            await s3Service.DeleteFileAsync($"{key}/logo");
            customerConfig.Logo = "";
        }
        if (siteConfiguration.Font == "REMOVE")
        {
            await s3Service.DeleteFileAsync($"{key}/font");
            customerConfig.Font = "";
        }
        await context.SaveChangesAsync();
    }

    public async Task UpdateSiteConfigurationAssets(UploadSiteConfigurationAssetsRequest assets, CommonQueryParameters queryParameters)
    {
        var key = queryParameters.Key;
        var customerConfig = context.CustomerConfigs.FirstOrDefault((x) => x.Domain == key);
        if (customerConfig == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }

        if (assets.Logo != null)
        {
            string url = await s3Service.UploadFileAsync(assets.Logo, $"{key}/logo");
            customerConfig.Logo = url;
        }

        if (assets.Font != null)
        {
            string url = await s3Service.UploadFileAsync(assets.Font, $"{key}/font");
            customerConfig.Font = url;
        }
        await context.SaveChangesAsync();
    }

    public async Task CreateSiteConfiguration(string domain, int customerId)
    {
        var defaultOpeningHours = openingHourService.InitializeWeeklyOpeningHours(domain);
        var newConfig = new CustomerConfig
        {
            CustomerId = customerId,
            Domain = domain,
            HeroType = 1,
            SiteName = domain,
            Theme = "rustic",
            Currency = "SEK",
            Logo = "",
            SiteMetaTitle = "",
            OpeningHours = defaultOpeningHours,
            Languages = "English",
            DefaultLanguage = "English",
            SectionVisibility = new SectionVisibility
            {
                CustomerConfigDomain = domain
            }
        };

        await context.CustomerConfigs.AddAsync(newConfig);
        await context.SaveChangesAsync();
    }

    public async Task RemoveSiteConfiguration(string domain)
    {
        var config = await context.CustomerConfigs.FirstOrDefaultAsync(c => c.Domain == domain);
        if (config == null)
        {
            throw new Exception("CustomerConfig not found");
        }
        context.CustomerConfigs.Remove(config);
        await s3Service.DeleteAllFilesAsync(domain);
        await context.SaveChangesAsync();
    }
}

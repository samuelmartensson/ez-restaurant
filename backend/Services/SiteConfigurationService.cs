using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class SiteConfigurationService(RestaurantContext context, S3Service s3Service, OpeningHourService openingHourService)
{
    private readonly RestaurantContext context = context;
    private readonly S3Service s3Service = s3Service;
    private readonly OpeningHourService openingHourService = openingHourService;


    public async Task UpdateSiteConfiguration(UpdateSiteConfigurationRequest siteConfiguration, string key)
    {
        var customerConfig = context.CustomerConfigs.FirstOrDefault((x) => x.Domain == key);
        if (customerConfig == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }

        customerConfig.SiteName = siteConfiguration.SiteName;
        customerConfig.SiteMetaTitle = siteConfiguration.SiteMetaTitle;
        customerConfig.Theme = siteConfiguration.Theme;
        customerConfig.Adress = siteConfiguration.Adress;
        customerConfig.Email = siteConfiguration.Email;
        customerConfig.InstagramUrl = siteConfiguration.InstagramUrl;
        customerConfig.Phone = siteConfiguration.Phone;
        customerConfig.AboutUsDescription = siteConfiguration.AboutUsDescription;

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

    public async Task UpdateSiteConfigurationAssets(UploadSiteConfigurationAssetsRequest assets, string key)
    {
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
            Logo = "",
            SiteMetaTitle = "",
            SiteName = domain,
            Theme = "rustic",
            OpeningHours = defaultOpeningHours,
            AboutUsDescription = ""
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

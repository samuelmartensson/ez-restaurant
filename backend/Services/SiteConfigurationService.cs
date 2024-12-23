using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class SiteConfigurationService(RestaurantContext context, S3Service s3Service)
{
    private RestaurantContext context = context;
    private readonly S3Service s3Service = s3Service;


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
        customerConfig.Phone = siteConfiguration.Phone;
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
        var domainAlreadyExists = await context.CustomerConfigs
            .AnyAsync(c => c.Domain.ToLower() == domain.ToLower());

        if (domainAlreadyExists)
        {
            throw new Exception("Domain already exists");
        }

        var newConfig = new CustomerConfig
        {
            CustomerId = customerId,
            Domain = domain,
            HeroType = 1,
            Logo = "",
            SiteMetaTitle = "",
            SiteName = domain,
            Theme = "rustic",
        };

        await context.CustomerConfigs.AddAsync(newConfig);
        await context.SaveChangesAsync();
    }
}

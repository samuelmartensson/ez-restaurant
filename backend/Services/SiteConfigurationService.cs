using System.Text.Json;
using Microsoft.EntityFrameworkCore;

public class SiteConfigurationService(RestaurantContext context, S3Service s3Service)
{
    private RestaurantContext context = context;
    private readonly S3Service s3Service = s3Service;

    public record UpdateSiteConfigurationRequest
    (
        string SiteName,
        string SiteMetaTitle,
        string Theme,
        string? Logo,
        string? Adress,
        string? Phone,
        string? Email
    );

    public async Task UpdateSiteConfiguration(string siteConfigurationJson, IFormFile? logo, string key)
    {
        var customerConfig = context.CustomerConfigs.FirstOrDefault((x) => x.Domain == key);
        if (string.IsNullOrEmpty(key) || customerConfig == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }

        var siteConfiguration = JsonSerializer.Deserialize<UpdateSiteConfigurationRequest>(siteConfigurationJson, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        });

        if (siteConfiguration == null)
        {
            throw new Exception("Missing input.");
        }

        if (logo != null)
        {
            string imageUrl = await s3Service.UploadFileAsync(logo, $"{key}/logo");
            customerConfig.Logo = imageUrl;
        }

        customerConfig.SiteName = siteConfiguration.SiteName;
        customerConfig.SiteMetaTitle = siteConfiguration.SiteMetaTitle;
        customerConfig.Theme = siteConfiguration.Theme;
        customerConfig.Adress = siteConfiguration.Adress;
        customerConfig.Email = siteConfiguration.Email;
        customerConfig.Phone = siteConfiguration.Phone;
        await context.SaveChangesAsync();
    }


    public record CreateConfigRequest(string domain);

    public async Task CreateSiteConfiguration(string domain, int customerId)
    {
        var domainAlreadyExists = await context.CustomerConfigs.AnyAsync(c => c.Domain == domain);

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

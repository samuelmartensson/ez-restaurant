using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class SectionConfigurationService(RestaurantContext context, S3Service s3Service)
{
    private RestaurantContext context = context;
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
            await s3Service.DeleteFileAsync($"{key}/{name}");
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
                string url = await s3Service.UploadFileAsync(file, $"{key}/{property.Name.ToLowerInvariant()}");
                var matchingProperty = siteSectionHeroType.GetProperty(property.Name);
                if (matchingProperty != null)
                {
                    matchingProperty.SetValue(customerConfig.SiteSectionHero, url);
                }
            }
        }

        await context.SaveChangesAsync();
    }
}

using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class GalleryService(RestaurantContext context, S3Service s3Service, IHttpContextAccessor httpContext)
{
    private RestaurantContext context = context;
    private readonly S3Service s3Service = s3Service;
    private readonly IHttpContextAccessor httpContext = httpContext;

    public async Task AddGalleryImage(UploadGalleryAssetsRequest assets, CommonQueryParameters queryParameters)
    {
        var customerConfig = ContextHelper.GetConfig(httpContext.HttpContext);

        foreach (var asset in assets.Images)
        {
            if (asset != null)
            {
                var newGallery = new SiteSectionGallery { CustomerConfigDomain = customerConfig.Domain, Image = "" };
                context.SiteSectionGallerys.Add(newGallery);
                await context.SaveChangesAsync();
                string url = await s3Service.UploadFileAsync(asset, $"{queryParameters.Key}/gallery/{newGallery.Id}");
                newGallery.Image = url;
            }
        }

        await context.SaveChangesAsync();
    }

    public async Task RemoveGalleryImage(int id, CommonQueryParameters queryParameters)
    {
        var customerConfig = await context.CustomerConfigs
                .Include(cf => cf.SiteSectionGallery)
                .FirstOrDefaultAsync((x) => x.Domain == queryParameters.Key);

        if (customerConfig == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }

        var galleryEntry = customerConfig.SiteSectionGallery.FirstOrDefault(g => g.Id == id);

        if (galleryEntry == null)
        {
            throw new Exception("Gallery entry not found.");
        }

        await s3Service.DeleteFileAsync($"{queryParameters.Key}/gallery/{galleryEntry.Id}");
        context.SiteSectionGallerys.Remove(galleryEntry);
        await context.SaveChangesAsync();
    }
}

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

    public async Task AddGalleryImage(UploadGalleryAssetsRequest assets, CommonQueryParameters queryParameters)
    {
        var customerConfig = await context.CustomerConfigs
            .FirstOrDefaultAsync((x) => x.Domain == queryParameters.Key);

        if (customerConfig == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }

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

    public async Task<List<NewsArticleResponse>> ListNewsArticles(CommonQueryParameters queryParameters)
    {
        var articles = await context.NewsArticles
            .Where((x) => x.CustomerConfigDomain == queryParameters.Key).OrderBy(a => a.UpdatedAt).Reverse().ToListAsync();

        return articles?.Select(a => new NewsArticleResponse
        {
            Id = a.Id,
            Title = a.Title,
            Content = a.Content,
            Date = a.Date,
            UpdatedAt = a.UpdatedAt,
            Published = a.Published
        }).ToList() ?? new List<NewsArticleResponse>();
    }

    public async Task<NewsArticleResponse> GetNewsArticle(int id, CommonQueryParameters queryParameters)
    {
        var article = await context.NewsArticles
            .FirstOrDefaultAsync((x) => x.CustomerConfigDomain == queryParameters.Key && x.Id == id);

        if (article == null)
        {
            throw new Exception("Article not found.");
        }

        var title = await translationService.GetByKey(queryParameters.Language, queryParameters.Key, $"news_title_{article.Id}");
        var content = await translationService.GetByKey(queryParameters.Language, queryParameters.Key, $"news_content_{article.Id}");

        return new NewsArticleResponse
        {
            Id = article.Id,
            Title = title ?? article.Title,
            Content = content ?? article.Content,
            Date = article.Date,
            UpdatedAt = article.UpdatedAt,
            Published = article.Published,
            Image = article.Image
        };
    }

    public async Task UpdateNewsArticle(int id, AddNewsArticleRequest request, CommonQueryParameters queryParameters)
    {
        var existingArticle = await context.NewsArticles
            .FirstOrDefaultAsync((x) => x.CustomerConfigDomain == queryParameters.Key && x.Id == id);
        if (existingArticle == null)
        {
            throw new Exception("Article not found.");
        }

        existingArticle.UpdatedAt = DateTime.UtcNow;
        existingArticle.Published = request.Published;

        if (request.Image != null)
        {
            var url = await s3Service.UploadFileAsync(request.Image, $"{queryParameters.Key}/news/{existingArticle.Id}");
            existingArticle.Image = url;
        }
        else if (request.RemoveImage)
        {
            await s3Service.DeleteFileAsync($"{queryParameters.Key}/news/{existingArticle.Id}");
            existingArticle.Image = "";
        }

        await translationService.CreateOrUpdateByKeys(
            queryParameters.Language,
            queryParameters.Key,
            new Dictionary<string, string>
            {
                { $"news_title_{existingArticle.Id}", request.Title },
                { $"news_content_{existingArticle.Id}", request.Content }
            }
        );

        await context.SaveChangesAsync();
    }

    public async Task AddNewsArticle(AddNewsArticleRequest request, CommonQueryParameters queryParameters)
    {
        var customerConfig = await context.CustomerConfigs
            .FirstOrDefaultAsync((x) => x.Domain == queryParameters.Key);

        if (customerConfig == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }

        var newArticle = new NewsArticle
        {
            CustomerConfigDomain = customerConfig.Domain,
            Title = request.Title,
            Content = request.Content,
            Date = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Published = request.Published
        };
        context.Add(newArticle);
        await context.SaveChangesAsync();

        await translationService.CreateOrUpdateByKeys(
            queryParameters.Language,
            queryParameters.Key,
            new Dictionary<string, string>
            {
                { $"news_title_{newArticle.Id}", request.Title },
                { $"news_content_{newArticle.Id}", request.Content }
            }
        );

        await context.SaveChangesAsync();
    }
}

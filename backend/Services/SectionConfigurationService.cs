using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class SectionConfigurationService(RestaurantContext context, S3Service s3Service, TranslationService translationService)
{
    private RestaurantContext context = context;
    private TranslationService translationService = translationService;
    private readonly S3Service s3Service = s3Service;

    public async Task UpdateAssets<T>(T section, string bucketKey, object assets, List<string> removedAssets)
    {
        var sectionType = section!.GetType();

        foreach (var name in removedAssets)
        {
            await s3Service.DeleteFileAsync($"{bucketKey}/{name}");
            var matchingProperty = sectionType.GetProperty(name);
            if (matchingProperty != null)
            {
                matchingProperty.SetValue(section, "");
            }
        }

        var uploadRequestType = assets.GetType();
        foreach (var property in uploadRequestType.GetProperties())
        {
            var file = property.GetValue(assets) as IFormFile;
            if (file != null)
            {
                string url = await s3Service.UploadFileAsync(file, $"{bucketKey}/{property.Name.ToLowerInvariant()}");
                var matchingProperty = sectionType.GetProperty(property.Name);
                if (matchingProperty != null)
                {
                    matchingProperty.SetValue(section, url);
                }
            }
        }
    }

    public async Task UpdateHero(UploadHeroRequest fields, string key)
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
        var customerConfig = await context.CustomerConfigs
            .Include(cf => cf.SiteSectionHero)
            .FirstOrDefaultAsync((x) => x.Domain == queryParameters.Key);

        if (customerConfig?.SiteSectionHero == null)
        {
            throw new Exception("CustomerConfig not found for the provided key.");
        }

        await UpdateAssets(customerConfig.SiteSectionHero, $"{queryParameters.Key}/hero/", assets, removedAssets);
        await context.SaveChangesAsync();
    }

    public async Task<Dictionary<string, HeroResponse>> GetHero(CommonQueryParameters queryParameters)
    {
        var hero = await context.CustomerConfigs
            .Include(cf => cf.SiteSectionHero)
            .FirstOrDefaultAsync((x) => x.Domain == queryParameters.Key);
        if (hero == null) throw new Exception("Hero not found.");

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
                HeroImage = hero.SiteSectionHero?.Image ?? "",
                OrderUrl = hero.SiteSectionHero?.OrderUrl ?? "",
            };

            responseDictionary[language] = localizedResponse;
        }

        return responseDictionary;
    }

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

        await UpdateAssets(customerConfig.SiteSectionAbout, $"{queryParameters.Key}/about", assets, removedAssets);
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

    public async Task<Dictionary<string, NewsArticleResponse>> GetNewsArticle(int id, CommonQueryParameters queryParameters)
    {
        var article = await context.NewsArticles
            .FirstOrDefaultAsync((x) => x.CustomerConfigDomain == queryParameters.Key && x.Id == id);

        if (article == null)
        {
            throw new Exception("Article not found.");
        }

        var languages = (await context.CustomerConfigs
            .Select(x => new { x.Languages, x.Domain })
            .Where((x) => x.Domain == queryParameters.Key)
            .FirstOrDefaultAsync())?.Languages ?? "";

        var responseDictionary = new Dictionary<string, NewsArticleResponse>();

        foreach (var language in languages.Split(",").ToList())
        {
            if (string.IsNullOrEmpty(language)) continue;

            var localizedResponse = new NewsArticleResponse
            {
                Id = article.Id,
                Title = await translationService.GetByKey(language, queryParameters.Key, $"news_title_{article.Id}") ?? article.Title,
                Content = await translationService.GetByKey(language, queryParameters.Key, $"news_content_{article.Id}") ?? article.Content,
                Date = article.Date,
                UpdatedAt = article.UpdatedAt,
                Published = article.Published,
                Image = article.Image
            };

            responseDictionary[language] = localizedResponse;
        }

        return responseDictionary;
    }

    public async Task RemoveNewsArticle(int id, CommonQueryParameters queryParameters)
    {
        var article = await context.NewsArticles
            .FirstOrDefaultAsync((x) => x.CustomerConfigDomain == queryParameters.Key && x.Id == id);

        if (article == null)
        {
            throw new Exception("Article not found.");
        }
        await s3Service.DeleteFileAsync($"{queryParameters.Key}/news/{article.Id}");
        context.NewsArticles.Remove(article);
        await context.SaveChangesAsync();
    }

    public async Task UpdateNewsArticle(int id, AddNewsArticleRequest request, CommonQueryParameters queryParameters)
    {
        var existingArticle = await context.NewsArticles
            .FirstOrDefaultAsync((x) => x.CustomerConfigDomain == queryParameters.Key && x.Id == id);
        if (existingArticle == null)
        {
            throw new Exception("Article not found.");
        }
        var languages = ((await context.CustomerConfigs
            .Select(x => new { x.Languages, x.Domain })
            .Where((x) => x.Domain == queryParameters.Key)
            .FirstOrDefaultAsync())?.Languages ?? "").Split(",").ToList();

        existingArticle.UpdatedAt = DateTime.UtcNow;
        existingArticle.Published = request.Published;

        var localizedTranslations = languages.Select(language => (language, new Dictionary<string, string> {
                { $"news_title_{existingArticle.Id}", request.LocalizedFields[language].Title },
                { $"news_content_{existingArticle.Id}", request.LocalizedFields[language].Content }
            })).ToList();


        await translationService.CreateOrUpdateByKeys(
            localizedTranslations,
            queryParameters.Key
        );

        await context.SaveChangesAsync();
    }

    public async Task UpdateNewsArticleAssets(int id, AddNewsArticleAssetsRequest assets, List<string> removedAssets, CommonQueryParameters queryParameters)
    {
        var existingArticle = await context.NewsArticles
            .FirstOrDefaultAsync((x) => x.CustomerConfigDomain == queryParameters.Key && x.Id == id);
        if (existingArticle == null)
        {
            throw new Exception("Article not found.");
        }
        existingArticle.UpdatedAt = DateTime.UtcNow;

        await UpdateAssets(existingArticle, $"{queryParameters.Key}/news/{existingArticle.Id}", assets, removedAssets);
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
        var languages = ((await context.CustomerConfigs
            .Select(x => new { x.Languages, x.Domain })
            .Where((x) => x.Domain == queryParameters.Key)
            .FirstOrDefaultAsync())?.Languages ?? "").Split(",").ToList();

        var newArticle = new NewsArticle
        {
            CustomerConfigDomain = customerConfig.Domain,
            Title = request.LocalizedFields[languages.First()].Title,
            Content = request.LocalizedFields[languages.First()].Content,
            Date = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Published = request.Published
        };
        context.Add(newArticle);
        await context.SaveChangesAsync();

        var localizedTranslations = languages.Select(language => (language, new Dictionary<string, string> {
                { $"news_title_{newArticle.Id}", request.LocalizedFields[language].Title },
                { $"news_content_{newArticle.Id}", request.LocalizedFields[language].Content }
            })).ToList();

        await translationService.CreateOrUpdateByKeys(
            localizedTranslations,
            queryParameters.Key
        );


        await context.SaveChangesAsync();
    }
}

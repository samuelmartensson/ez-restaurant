using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class NewsArticleService(RestaurantContext context, S3Service s3Service, TranslationService translationService)
{
    private RestaurantContext context = context;
    private TranslationService translationService = translationService;
    private readonly S3Service s3Service = s3Service;

    public async Task<List<NewsArticleResponse>> ListNewsArticles(CommonQueryParameters queryParameters)
    {
        var articles = await context.NewsArticles
            .Where((x) => x.CustomerConfigDomain == queryParameters.Key).OrderBy(a => a.UpdatedAt).Reverse().ToListAsync();

        var translations = await context.Translations
            .Where(t => t.CustomerConfigDomain == queryParameters.Key &&
                        t.LanguageCode == queryParameters.Language &&
                        t.Key.StartsWith("news_"))
            .ToListAsync();

        return articles?.Select(a => new NewsArticleResponse
        {
            Id = a.Id,
            Title = translations.FirstOrDefault(t => t.Key == $"news_title_{a.Id}")?.Value ?? a.Title,
            Content = translations.FirstOrDefault(t => t.Key == $"news_content_{a.Id}")?.Value ?? a.Content,
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

        await s3Service.UpdateAssets(existingArticle, $"{queryParameters.Key}/news/{existingArticle.Id}", assets, removedAssets);
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

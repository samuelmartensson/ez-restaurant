using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class TranslationService(RestaurantContext context)
{
    private RestaurantContext context = context;

    public async Task<string?> GetByKey(string language, string domain, string translationKey)
    {
        var existing = await context.Translations
            .FirstOrDefaultAsync(t =>
                t.CustomerConfigDomain == domain &&
                t.LanguageCode == language &&
                t.Key == translationKey
            );

        return existing?.Value;
    }

    public async Task DeleteByKeys(string domain, List<string> translationKeys)
    {
        var existingTranslations = await context.Translations
            .Where(t =>
                t.CustomerConfigDomain == domain &&
                translationKeys.Contains(t.Key)
            )
            .ToListAsync();

        context.RemoveRange(existingTranslations);
    }

    public async Task DeleteByKey(string domain, string translationKey)
    {
        var existingTranslation = await context.Translations
            .FirstOrDefaultAsync(t =>
                t.CustomerConfigDomain == domain &&
                t.Key == translationKey
            );

        if (existingTranslation != null)
            context.Remove(existingTranslation);
    }


    public async Task CreateOrUpdateByKey(string language, string domain, string translationKey, string? value)
    {
        if (value == null) return;

        var existing = await context.Translations
            .FirstOrDefaultAsync(t =>
                t.CustomerConfigDomain == domain &&
                t.LanguageCode == language &&
                t.Key == translationKey
            );

        if (existing != null)
        {
            existing.Value = value;
        }
        else
        {
            await context.AddAsync(new Translation
            {
                CustomerConfigDomain = domain,
                Key = translationKey,
                Value = value,
                LanguageCode = language
            });
        }
    }

    public async Task CreateOrUpdateByKeys(string language, string domain, Dictionary<string, string> translations)
    {
        foreach (var translation in translations)
        {
            var translationKey = translation.Key;
            var value = translation.Value;
            await CreateOrUpdateByKey(
                language,
                domain,
                translationKey,
                value
            );
        }
    }

}

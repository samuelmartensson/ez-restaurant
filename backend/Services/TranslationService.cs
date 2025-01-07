using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class TranslationService(RestaurantContext context)
{
    private RestaurantContext context = context;

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
}

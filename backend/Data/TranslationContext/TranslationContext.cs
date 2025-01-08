using Models.Responses;

public class TranslationContext
{
    private readonly Dictionary<string, Dictionary<string, string>> _translations;
    public readonly List<string> languages = new List<string> { "English", "Svenska" };

    public TranslationContext()
    {
        _translations = new Dictionary<string, Dictionary<string, string>>();
        _translations[languages[0]] = TranslationsEnglish.Translations;
        _translations[languages[1]] = TranslationsSwedish.Translations;
    }

    public SiteTranslationsResponse GetBaseTranslations(string language)
    {
        // Create a new response object to return the translations
        var response = new SiteTranslationsResponse
        {
            ContactUs = GetTranslation(language, "contact_us"),
            OpenHours = GetTranslation(language, "open_hours"),
            Menu = GetTranslation(language, "menu"),
            AboutTitle = GetTranslation(language, "about:title"),
            OrderNow = GetTranslation(language, "order_now"),
            Monday = GetTranslation(language, "monday"),
            Tuesday = GetTranslation(language, "tuesday"),
            Wednesday = GetTranslation(language, "wednesday"),
            Thursday = GetTranslation(language, "thursday"),
            Friday = GetTranslation(language, "friday"),
            Saturday = GetTranslation(language, "saturday"),
            Sunday = GetTranslation(language, "sunday"),
            AllRightsReserved = GetTranslation(language, "all_rights_reserved")
        };

        return response;
    }

    public string GetTranslation(string language, string key)
    {
        if (_translations.ContainsKey(language) && _translations[language].ContainsKey(key))
        {
            return _translations[language][key];
        }

        // If the translation is not found, return a default message
        return $"Translation not found for key '{key}' in language '{language}'";
    }
}

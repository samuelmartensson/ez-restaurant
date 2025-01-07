namespace Models.Requests
{
    public class AddTranslationRequest
    {
        required public string Domain { get; set; }
        required public string Key { get; set; }
        required public string Value { get; set; }
        required public string LanguageCode { get; set; }
    };
}

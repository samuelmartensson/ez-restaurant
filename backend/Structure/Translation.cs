public class Translation
{
    public int Id { get; set; }
    required public string Key { get; set; }
    required public string Value { get; set; }
    required public string LanguageCode { get; set; }
    required public string CustomerConfigDomain { get; set; }
    public CustomerConfig? CustomerConfig { get; set; }
}
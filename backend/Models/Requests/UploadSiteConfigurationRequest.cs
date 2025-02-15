namespace Models.Requests
{
    public class UploadSiteConfigurationAssetsRequest
    {
        public IFormFile? Logo { get; set; }
        public IFormFile? Font { get; set; }
    };


    public class UpdateSiteLanguagesRequest
    {
        required public List<string> Languages { get; set; }
        required public string DefaultLanguage { get; set; }
    }


    public class UpdateSiteConfigurationRequest
    {
        required public string Theme { get; set; }
        required public string Currency { get; set; }
        public bool ContactFormVisible { get; set; }
        public string? Logo { get; set; }
        public string? Font { get; set; }
        public string? Adress { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? InstagramUrl { get; set; }
        public string? TiktokUrl { get; set; }
        public string? FacebookUrl { get; set; }
        public string? MapUrl { get; set; } = "";
        public string? ThemeColorConfig { get; set; } = "";

    };
}

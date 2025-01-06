namespace Models.Requests
{
    public class UploadSiteConfigurationAssetsRequest
    {
        public IFormFile? Logo { get; set; }
        public IFormFile? Font { get; set; }
    };

    public class UpdateSiteConfigurationRequest
    {
        required public string SiteName { get; set; }
        required public string SiteMetaTitle { get; set; }
        required public string Theme { get; set; }
        public bool ContactFormVisible { get; set; }
        public string? Logo
        { get; set; }
        public string? Font { get; set; }
        public string? Adress { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? InstagramUrl { get; set; }
        public string? MapUrl { get; set; } = "";

    };
}

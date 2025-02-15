namespace Models.Requests
{
    public class UploadHeroAssetsRequest
    {
        public IFormFile? Image { get; set; }
    };

    public class UploadHeroLocalizedFields
    {
        public string? SiteName { get; set; }
        public string? SiteMetaTitle { get; set; }

    }
    public class UploadHeroRequest
    {
        public string? OrderUrl { get; set; }
        public required Dictionary<string, UploadHeroLocalizedFields> LocalizedFields { get; set; }
    };


}

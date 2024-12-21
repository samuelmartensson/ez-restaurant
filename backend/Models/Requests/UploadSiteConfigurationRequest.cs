namespace Models.Requests
{
    public class UploadSiteConfigurationAssetsRequest
    {
        public IFormFile? Logo { get; set; }
        public IFormFile? Font { get; set; }
    };

    public record UpdateSiteConfigurationRequest
    (
        string SiteName,
        string SiteMetaTitle,
        string Theme,
        string? Logo,
        string? Adress,
        string? Phone,
        string? Email
    );
}

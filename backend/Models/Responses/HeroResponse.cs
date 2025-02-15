namespace Models.Requests
{
    public class HeroResponse
    {
        required public string SiteName { get; set; }
        required public string SiteMetaTitle { get; set; }
        public required string HeroImage { get; set; }
        public required string OrderUrl { get; set; }
    };
}

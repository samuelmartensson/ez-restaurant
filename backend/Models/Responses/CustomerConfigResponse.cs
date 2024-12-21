namespace Models.Responses
{
    public class SiteSectionHeroResponse
    {
        public required string HeroImage { get; set; }
        public required string OrderUrl { get; set; }
    }

    public class SectionsResponse
    {
        public required SiteSectionHeroResponse Hero { get; set; }
    }

    public class CustomerConfigResponse
    {
        public int HeroType { get; set; }
        public required string Theme { get; set; }
        required public string SiteName { get; set; }
        required public string SiteMetaTitle { get; set; }
        required public string Logo { get; set; }
        public string? Font { get; set; } = "";
        public string? Adress { get; set; } = "";
        public string? Phone { get; set; } = "";
        public string? Email { get; set; } = "";
        public string? MenuBackdropUrl { get; set; }

        public required SectionsResponse Sections { get; set; }
    }
}
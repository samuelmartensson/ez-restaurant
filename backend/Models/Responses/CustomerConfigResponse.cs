namespace Models.Responses
{
    public class SiteSectionHeroResponse
    {
        public required string HeroImage { get; set; }
        public required string OrderUrl { get; set; }
    }

    public class SiteSectionAboutResponse
    {
        public required string Image { get; set; }
        public required string Description { get; set; }
    }

    public class SectionsResponse
    {
        public required SiteSectionHeroResponse Hero { get; set; }
        public required SiteSectionAboutResponse About { get; set; }
    }

    public class SectionVisibilityResponse
    {
        public bool ContactFormVisible { get; set; } = false;
    }

    public class CustomerConfigResponse
    {
        public int HeroType { get; set; }
        public required string Theme { get; set; }
        public required string Domain { get; set; }
        required public string SiteName { get; set; }
        required public string SiteMetaTitle { get; set; }
        required public string Logo { get; set; }
        public string? Font { get; set; } = "";
        public string? Adress { get; set; } = "";
        public string? Phone { get; set; } = "";
        public string? Email { get; set; } = "";
        public string? InstagramUrl { get; set; } = "";
        public string? MapUrl { get; set; } = "";
        public string? CustomDomain { get; set; } = "";
        public SectionVisibilityResponse? SectionVisibility { get; set; }
        public SectionsResponse? Sections { get; set; }
        public List<OpeningHourResponse> OpeningHours { get; set; } = new List<OpeningHourResponse>();
    }
}
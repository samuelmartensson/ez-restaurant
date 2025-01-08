namespace Models.Responses
{
    public class SiteTranslationsResponse
    {
        public required string AboutTitle { get; set; }
        public required string ContactUs { get; set; }
        public required string OpenHours { get; set; }
        public required string Menu { get; set; }
        public required string OrderNow { get; set; }
        public required string Monday { get; set; }
        public required string Tuesday { get; set; }
        public required string Wednesday { get; set; }
        public required string Thursday { get; set; }
        public required string Friday { get; set; }
        public required string Saturday { get; set; }
        public required string Sunday { get; set; }
        public required string AllRightsReserved { get; set; }
    }

    public class SiteSectionHeroResponse
    {
        public required string HeroImage { get; set; }
        public required string OrderUrl { get; set; }
    }

    public class SiteSectionAboutResponse
    {
        public required string Image { get; set; }
        public required string Description { get; set; }
        public required string AboutTitle { get; set; }
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
        public required List<string> Languages { get; set; }
        required public string SiteName { get; set; }
        required public string SiteMetaTitle { get; set; }
        required public string Currency { get; set; }
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
        public SiteTranslationsResponse? SiteTranslations { get; set; }
    }
}
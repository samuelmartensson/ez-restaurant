public class CustomerConfig
{
    required public string Domain { get; set; }
    public int CustomerId { get; set; }
    public int HeroType { get; set; }
    required public string Theme { get; set; }
    required public string SiteName { get; set; }
    required public string SiteMetaTitle { get; set; }
    required public string AboutUsDescription { get; set; }
    required public string Logo { get; set; }
    public string? Font { get; set; } = "";
    public string? Adress { get; set; } = "";
    public string? Phone { get; set; } = "";
    public string? Email { get; set; } = "";
    public string? CustomDomain { get; set; } = "";
    public string? InstagramUrl { get; set; } = "";
    public string? MapUrl { get; set; } = "";
    required public SectionVisibility SectionVisibility { get; set; }
    public Customer? Customer { get; set; }
    public SiteSectionAbout? SiteSectionAbout { get; set; }
    public SiteSectionHero? SiteSectionHero { get; set; }
    public ICollection<MenuCategory> MenuCategorys { get; set; } = new List<MenuCategory>();
    public ICollection<OpeningHour> OpeningHours { get; set; } = new List<OpeningHour>();
}
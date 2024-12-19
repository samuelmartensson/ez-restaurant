public class CustomerConfig
{
    public required string Domain { get; set; }
    public int CustomerId { get; set; }
    public int HeroType { get; set; }
    public required string Theme { get; set; }
    required public string SiteName { get; set; }
    required public string SiteMetaTitle { get; set; }
    required public string Logo { get; set; }
    public string? Adress { get; set; } = "";
    public string? Phone { get; set; } = "";
    public string? Email { get; set; } = "";

    public Customer? Customer { get; set; }
    public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    public ICollection<OpeningHour> OpeningHours { get; set; } = new List<OpeningHour>();

}
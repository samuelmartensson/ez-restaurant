public class SiteSectionHero
{
    public int Id { get; set; }
    public required string Image { get; set; }
    public string OrderUrl { get; set; } = "";
    required public string CustomerConfigDomain { get; set; }
    public CustomerConfig? CustomerConfig { get; set; }

}
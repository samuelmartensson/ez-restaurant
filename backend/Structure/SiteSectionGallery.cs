public class SiteSectionGallery
{
    public int Id { get; set; }
    public required string Image { get; set; }
    required public string CustomerConfigDomain { get; set; }
    public CustomerConfig? CustomerConfig { get; set; }

}
public class SectionVisibility
{
    public int Id { get; set; }
    public bool ContactFormVisible { get; set; } = true;

    required public string CustomerConfigDomain { get; set; }
    public CustomerConfig? CustomerConfig { get; set; }
}
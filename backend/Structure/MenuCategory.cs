public class MenuCategory
{
    public int Id { get; set; }
    required public string CustomerConfigDomain { get; set; }
    required public string Name { get; set; }
    public CustomerConfig? CustomerConfig { get; set; }
    public ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();

}

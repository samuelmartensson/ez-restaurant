public class MenuItem
{
    public int Id { get; set; }
    required public string CustomerConfigDomain { get; set; }

    required public string Name { get; set; }

    required public string Category { get; set; }
    public decimal Price { get; set; }

    public string? Description { get; set; } = "";

    public string? Tags { get; set; } = "";

    public string? Image { get; set; } = "";
    public CustomerConfig? CustomerConfig { get; set; }

}

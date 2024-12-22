public class MenuItem
{
    public int Id { get; set; }
    public int MenuCategoryId { get; set; }

    required public string Name { get; set; }

    public decimal Price { get; set; }

    public string? Description { get; set; } = "";

    public string? Tags { get; set; } = "";

    public string? Image { get; set; } = "";
    public MenuCategory? MenuCategory { get; set; }

}

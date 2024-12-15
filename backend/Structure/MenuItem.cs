using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("menu_item")]
public class MenuItem
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("domain")]
    [Column("project_id")]
    public required string ProjectId { get; set; }

    required public string Name { get; set; }

    required public string Category { get; set; }
    public decimal Price { get; set; }

    public string? Description { get; set; } = "";

    public string? Tags { get; set; } = "";

    public string? Image { get; set; } = "";
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("customer_config")]

public class CustomerConfig
{
    [Key]
    public int Customer_id { get; set; }

    public required string Domain { get; set; }

    [Column("hero_type")]
    public int HeroType { get; set; }

    public required string Theme { get; set; }




}
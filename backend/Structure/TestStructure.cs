using System.ComponentModel.DataAnnotations.Schema;

[Table("teststructure")]

public class TestStructure
{
    public required string Test { get; set; }
    public int Number { get; set; }
}
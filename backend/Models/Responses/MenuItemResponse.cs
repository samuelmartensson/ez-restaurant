using System.ComponentModel.DataAnnotations;

namespace Models.Responses
{
    public class MenuItemResponse
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int Order { get; set; }
        [Required]
        public string Name { get; set; } = "";
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public decimal Price { get; set; }
        [Required]
        public string? Description { get; set; } = "";
        public string? Tags { get; set; } = "";
        public string? Image { get; set; } = "";
    }
}
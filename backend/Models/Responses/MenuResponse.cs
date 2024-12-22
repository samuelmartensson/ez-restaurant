using System.ComponentModel.DataAnnotations;

namespace Models.Responses
{
    public class MenuResponse
    {
        [Required]
        public required List<MenuCategoryResponse> Categories { get; set; } = new List<MenuCategoryResponse>();
        [Required]
        public required List<MenuItemResponse> MenuItems { get; set; } = new List<MenuItemResponse>();

    }
}
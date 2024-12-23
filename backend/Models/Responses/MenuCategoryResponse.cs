using System.ComponentModel.DataAnnotations;

namespace Models.Responses
{
    public class MenuCategoryResponse
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = "";
        [Required]
        public int Order { get; set; }

    }
}
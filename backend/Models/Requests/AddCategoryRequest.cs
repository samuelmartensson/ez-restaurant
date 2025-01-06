namespace Models.Requests
{
    public class AddCategoryRequest
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public required int Id { get; set; }
        public int? Order { get; set; }
    };
}

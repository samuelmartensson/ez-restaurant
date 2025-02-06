namespace Models.Requests
{
    public class NewsArticleResponse
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required DateTime Date { get; set; }
        public required DateTime UpdatedAt { get; set; }
        public string Content { get; set; } = "";
        public bool Published { get; set; }
        public string? Image { get; set; }
    };
}

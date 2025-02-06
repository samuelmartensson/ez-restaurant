namespace Models.Requests
{
    public class AddNewsArticleRequest
    {
        public required string Title { get; set; }
        public string Content { get; set; } = "";
        public bool Published { get; set; }
        public bool RemoveImage { get; set; }
        public IFormFile? Image { get; set; }
    };
}

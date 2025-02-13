namespace Models.Requests
{

    public class AddNewsArticleLocalizedFields
    {
        public required string Title { get; set; }
        public string Content { get; set; } = "";
    }

    public class AddNewsArticleAssetsRequest
    {
        public IFormFile? Image { get; set; }
    }

    public class AddNewsArticleRequest
    {
        public required Dictionary<string, AddNewsArticleLocalizedFields> LocalizedFields { get; set; }
        public bool Published { get; set; }
        public bool RemoveImage { get; set; }
    };
}

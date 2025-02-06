public class NewsArticle
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required DateTime Date { get; set; }
    public required DateTime UpdatedAt { get; set; }
    public string Content { get; set; } = "";
    public bool Published { get; set; } = false;
    public string Image { get; set; } = "";
    required public string CustomerConfigDomain { get; set; }
    public CustomerConfig? CustomerConfig { get; set; }
}
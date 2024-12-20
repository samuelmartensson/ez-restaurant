namespace Models.Responses
{
    public class CustomerResponse
    {
        public string Domain { get; set; } = "";
        public int CustomerId { get; set; }
        public int HeroType { get; set; }
        public string Theme { get; set; } = "";
        public string SiteName { get; set; } = "";
        public string SiteMetaTitle { get; set; } = "";
        public string Logo { get; set; } = "";
        public string? Adress { get; set; } = "";
        public string? Phone { get; set; } = "";
        public string? Email { get; set; } = "";
    }
}
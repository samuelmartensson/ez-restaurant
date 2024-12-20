namespace Models.Responses
{
    public class MenuResponse
    {
        public int Id { get; set; }
        public string CustomerConfigDomain { get; set; } = "";

        public string Name { get; set; } = "";

        public string Category { get; set; } = "";
        public decimal Price { get; set; }

        public string? Description { get; set; } = "";

        public string? Tags { get; set; } = "";

        public string? Image { get; set; } = "";
    }
}
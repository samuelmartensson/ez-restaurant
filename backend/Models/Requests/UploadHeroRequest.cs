namespace Models.Requests
{
    public class UploadHeroAssetsRequest
    {
        public IFormFile? Image { get; set; }
    };

    public class UploadHeroRequest
    {
        public string? OrderUrl { get; set; }
    };


}

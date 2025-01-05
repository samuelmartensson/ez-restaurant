namespace Models.Requests
{
    public class UploadAboutAssetsRequest
    {
        public IFormFile? Image { get; set; }
    };

    public class UploadAboutRequest
    {
        public string? Description { get; set; }
    };


}

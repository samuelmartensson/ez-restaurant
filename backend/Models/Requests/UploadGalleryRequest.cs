namespace Models.Requests
{
    public class UploadGalleryAssetsRequest
    {
        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
    };

}

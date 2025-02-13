namespace Models.Requests
{
    public class UploadAboutAssetsRequest
    {
        public IFormFile? Image { get; set; }
    };


    public class UploadAboutLocalizedFields
    {
        public string? Description { get; set; }
    }

    public class UploadAboutRequest
    {
        public required Dictionary<string, UploadAboutLocalizedFields> LocalizedFields { get; set; }
    };


}

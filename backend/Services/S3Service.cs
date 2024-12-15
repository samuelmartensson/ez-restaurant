using Amazon;
using Amazon.S3;
using Amazon.S3.Transfer;

public class S3Service
{

    private readonly IAmazonS3 _s3Client;
    public readonly string _bucketName = "ez-rest";
    public readonly string _bucketURL;


    public S3Service()
    {
        _s3Client = new AmazonS3Client(RegionEndpoint.EUNorth1);
        _bucketURL = $"https://{_bucketName}.s3.eu-north-1.amazonaws.com/";
    }

    public async Task<bool> UploadFileAsync(IFormFile formFile, string keyName)
    {
        try
        {
            if (formFile == null || formFile.Length == 0)
            {
                Console.WriteLine("No file selected for upload.");
                return false;
            }

            var fileTransferUtility = new TransferUtility(_s3Client);

            // Create a memory stream to hold the file data
            using (var memoryStream = new MemoryStream())
            {
                // Copy the file content to the memory stream
                await formFile.CopyToAsync(memoryStream);
                // Seek back to the beginning of the memory stream before uploading
                memoryStream.Seek(0, SeekOrigin.Begin);
                await fileTransferUtility.UploadAsync(memoryStream, _bucketName, keyName);
                Console.WriteLine($"File uploaded to S3 with key: {keyName}");
                return true;
            }
        }
        catch (AmazonS3Exception e)
        {
            Console.WriteLine($"Error uploading file: {e.Message}");
            return false;
        }
    }

}

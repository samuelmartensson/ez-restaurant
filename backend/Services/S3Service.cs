using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
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

    public async Task<string> UploadFileAsync(IFormFile formFile, string keyName)
    {
        try
        {
            if (formFile == null || formFile.Length == 0)
            {
                throw new Exception("No file selected for upload.");
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
                return _bucketURL + keyName;
            }
        }
        catch (AmazonS3Exception e)
        {
            throw new Exception($"Error uploading file to S3: {e.Message}", e);
        }

    }

    public async Task<bool> DeleteFileAsync(string keyName)
    {
        try
        {
            await _s3Client.DeleteAsync(_bucketName, keyName, null);
            return true;
        }
        catch (AmazonS3Exception e)
        {
            throw new Exception($"Error deleting file from S3: {e.Message}", e);
        }

    }

    public async Task<bool> DeleteAllFilesAsync(string prefix)
    {
        try
        {
            var listRequest = new ListObjectsV2Request
            {
                BucketName = _bucketName,
                Prefix = prefix
            };

            var listResponse = await _s3Client.ListObjectsV2Async(listRequest);

            var deleteRequest = new DeleteObjectsRequest
            {
                BucketName = _bucketName,
                Objects = new List<KeyVersion>()
            };

            foreach (var obj in listResponse.S3Objects)
            {
                deleteRequest.Objects.Add(new KeyVersion { Key = obj.Key });
            }

            if (deleteRequest.Objects.Count > 0)
            {
                var deleteResponse = await _s3Client.DeleteObjectsAsync(deleteRequest);
                Console.WriteLine($"Successfully deleted {deleteResponse.DeletedObjects.Count} objects.");
            }
            return true;
        }
        catch (Exception e)
        {
            throw new Exception($"Error deleting files from S3: {e.Message}", e);
        }
    }

}

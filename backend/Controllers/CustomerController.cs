using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class CustomerController(RestaurantContext context, MenuService menuService) : ControllerBase
{
    private RestaurantContext context = context;
    private MenuService menuService = menuService;




    private string ResolveBucketObjectKey(string key)
    {
        return new S3Service()._bucketURL + key;
    }


    [HttpGet("get-customer-config")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetCustomerConfig([FromQuery] string key)
    {
        var customerConfig = context.CustomerConfigs.FirstOrDefault((x) => x.Domain == key);

        if (string.IsNullOrEmpty(key) || customerConfig == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }

        return Ok(customerConfig);
    }

    [HttpGet("get-customer-menu")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetCustomerMenu([FromQuery] string key)
    {
        var menuItems = context.MenuItems
            .Where(m => m.ProjectId == key)
            .ToList();

        if (string.IsNullOrEmpty(key) || menuItems == null)
        {
            return NotFound(new { message = "Menu not found for the provided key." });
        }

        return Ok(menuItems);
    }

    [HttpGet("get-customer-assets")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetCustomerAssets([FromQuery] string key)
    {
        var customerConfig = context.CustomerConfigs.FirstOrDefault((x) => x.Domain == key);

        return Ok(new
        {
            heroUrl = ResolveBucketObjectKey("NZF0096.jpg"),
            fontUrl = ResolveBucketObjectKey("CircularStd-Book.ttf")
        });
    }


    [HttpPost("upload-customer-asset")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadCustomerAsset(IFormFile file)
    {
        S3Service s3 = new S3Service();

        string uploadSucceeded = await s3.UploadFileAsync(file, Guid.NewGuid().ToString());

        if (uploadSucceeded != "")
        {
            Console.WriteLine("Upload succeeded!");
            return Ok(new { message = "File uploaded successfully" });
        }
        else
        {
            return BadRequest(new { message = "Upload failed" });
        }
    }

    [HttpPost("upload-customer-menu")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadCustomerMenu([FromForm] string menuItemsJson, [FromForm] List<IFormFile> files, [FromQuery] string key)
    {
        if (string.IsNullOrEmpty(key))
        {
            return BadRequest("Key is required.");
        }

        await menuService.UploadCustomerMenu(menuItemsJson, files, key);
        return Ok(new { message = "Success" });
    }
}


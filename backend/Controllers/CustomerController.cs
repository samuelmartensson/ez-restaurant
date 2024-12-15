using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class CustomerController(RestaurantContext context) : ControllerBase
{
    private RestaurantContext context = context;

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

        bool uploadSucceeded = await s3.UploadFileAsync(file, Guid.NewGuid().ToString());

        if (uploadSucceeded)
        {
            Console.WriteLine("Upload succeeded!");
            return Ok(new { message = "File uploaded successfully" });
        }
        else
        {
            return BadRequest(new { message = "Upload failed" });
        }
    }


    public record Input
    {
        public int Id { get; set; }

        required public string Name { get; set; }

        required public string Category { get; set; }
        public decimal Price { get; set; }

        public string? Description { get; set; } = "";

        public string? Tags { get; set; } = "";

        public string? Image { get; set; } = "";
    }
    [HttpPost("upload-customer-menu")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadCustomerMenu(List<Input> menuItems, [FromQuery] string key)
    {
        var existingMenuItems = await context.MenuItems
            .Where(m => m.ProjectId == key)
            .ToListAsync();



        if (menuItems == null || !menuItems.Any())
        {
            context.MenuItems.RemoveRange(existingMenuItems);
            await context.SaveChangesAsync();

            return Ok(new List<MenuItem>());
        }

        if (string.IsNullOrEmpty(key))
        {
            return BadRequest("Key is required.");
        }


        var incomingMenuItemIds = menuItems.Select(m => m.Id).ToList();

        var itemsToDelete = existingMenuItems
                    .Where(m => !incomingMenuItemIds.Contains(m.Id))
                    .ToList();
        context.MenuItems.RemoveRange(itemsToDelete);


        // Update or add new items
        foreach (var menuItem in menuItems)
        {
            // Find the existing item or create a new one
            var existingItem = existingMenuItems.FirstOrDefault(m => m.Id == menuItem.Id);

            if (existingItem != null)
            {
                existingItem.Name = menuItem.Name;
                existingItem.Description = menuItem.Description;
                existingItem.Price = menuItem.Price;
                existingItem.Image = menuItem.Image;
                existingItem.Tags = menuItem.Tags;
                existingItem.Category = menuItem.Category;
                existingItem.Id = menuItem.Id;
                // Update other properties as needed
            }
            else
            {
                var newMenuItem = new MenuItem
                {
                    ProjectId = key,
                    Name = menuItem.Name,
                    Description = menuItem.Description,
                    Price = menuItem.Price,
                    Image = menuItem.Image,
                    Tags = menuItem.Tags,
                    Category = menuItem.Category,
                    Id = menuItem.Id
                };
                context.MenuItems.Add(newMenuItem);
            }
        }




        await context.SaveChangesAsync();

        return Ok(menuItems);
    }

}


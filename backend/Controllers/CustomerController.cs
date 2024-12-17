using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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


    public class Input
    {
        public int Id { get; set; }
        public string TempId { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public string? Tags { get; set; }
    }


    [HttpPost("upload-customer-menu")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadCustomerMenu([FromForm] string menuItemsJson, [FromForm] List<IFormFile> files, [FromQuery] string key)
    {
        S3Service s3 = new S3Service();
        var menuItems = JsonSerializer.Deserialize<List<Input>>(menuItemsJson, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,

        });

        var existingMenuItems = await context.MenuItems
            .Where(m => m.ProjectId == key)
            .ToListAsync();

        if (menuItems == null || !menuItems.Any())
        {
            context.MenuItems.RemoveRange(existingMenuItems);
            foreach (var item in existingMenuItems)
            {
                string imageUrlKey = $"{key}/{item.Id}";
                await s3.DeleteFileAsync(imageUrlKey);
            }
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

        foreach (var item in itemsToDelete)
        {
            string imageUrlKey = $"{key}/{item.Id}";
            await s3.DeleteFileAsync(imageUrlKey);
        }

        foreach (var menuItem in menuItems)
        {
            var existingItem = existingMenuItems.FirstOrDefault(m => m.Id == menuItem.Id);
            if (existingItem != null)
            {
                existingItem.Name = menuItem.Name;
                existingItem.Description = menuItem.Description;
                existingItem.Price = menuItem.Price;
                existingItem.Tags = menuItem.Tags;
                existingItem.Category = menuItem.Category;
                existingItem.Id = menuItem.Id;

                var file = files.FirstOrDefault(f => f.FileName == menuItem.Id.ToString());
                if (file != null)
                {
                    string imageUrl = await s3.UploadFileAsync(file, $"{key}/{file.FileName}");
                    existingItem.Image = imageUrl;
                };
            }
            else
            {
                var newMenuItem = new MenuItem
                {
                    ProjectId = key,
                    Name = menuItem.Name,
                    Description = menuItem.Description,
                    Price = menuItem.Price,
                    Tags = menuItem.Tags,
                    Category = menuItem.Category,
                };
                context.MenuItems.Add(newMenuItem);
                await context.SaveChangesAsync();

                var file = files.FirstOrDefault(f => f.FileName == menuItem.TempId);
                if (file != null)
                {
                    string imageUrl = await s3.UploadFileAsync(file, $"{key}/{newMenuItem.Id}");
                    newMenuItem.Image = imageUrl;
                };

            }
        }
        await context.SaveChangesAsync();

        return Ok(menuItems);
    }
}


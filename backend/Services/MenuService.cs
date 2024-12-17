using Microsoft.EntityFrameworkCore;
using System.Text.Json;

public class MenuService(RestaurantContext context, S3Service s3Service)
{
    private RestaurantContext context = context;
    private readonly S3Service s3Service = s3Service;

    public record AddNewMenuItemInput
    (
        int Id,
        string TempId,
        string Name,
        string Category,
        decimal Price,
        string? Image,
        string? Description,
        string? Tags
    );


    public async Task UploadCustomerMenu(string menuItemsJson, List<IFormFile> files, string key)
    {
        var menuItems = JsonSerializer.Deserialize<List<AddNewMenuItemInput>>(menuItemsJson, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        });

        if (menuItems == null || !menuItems.Any())
        {
            await DeleteAllMenuItems(key);
            await context.SaveChangesAsync();
            return;
        }

        var existingMenuItems = await GetExistingMenuItems(key);
        await DeleteOldMenuItems(existingMenuItems, menuItems.Select(m => m.Id).ToList(), key);
        await ProcessMenuItems(menuItems, existingMenuItems, files, key);
        await context.SaveChangesAsync();
    }

    private async Task<List<MenuItem>> GetExistingMenuItems(string key)
    {
        return await context.MenuItems
            .Where(m => m.ProjectId == key)
            .ToListAsync();
    }


    private async Task DeleteOldMenuItems(List<MenuItem> existingMenuItems, List<int> incomingMenuItemIds, string key)
    {
        var itemsToDelete = existingMenuItems
            .Where(m => !incomingMenuItemIds.Contains(m.Id))
            .ToList();

        context.MenuItems.RemoveRange(itemsToDelete);

        foreach (var item in itemsToDelete)
        {
            string imageUrlKey = $"{key}/{item.Id}";
            await s3Service.DeleteFileAsync(imageUrlKey);
        }
    }

    private async Task ProcessMenuItems(List<AddNewMenuItemInput> menuItems, List<MenuItem> existingMenuItems, List<IFormFile> files, string key)
    {
        foreach (var menuItem in menuItems)
        {
            var existingItem = existingMenuItems.FirstOrDefault(m => m.Id == menuItem.Id);
            if (existingItem != null)
            {
                await UpdateExistingMenuItem(existingItem, menuItem, files, key);
            }
            else
            {
                await AddNewMenuItem(menuItem, files, key);
            }
        }
    }

    private async Task UpdateExistingMenuItem(MenuItem existingItem, AddNewMenuItemInput menuItem, List<IFormFile> files, string key)
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
            string imageUrl = await s3Service.UploadFileAsync(file, $"{key}/{file.FileName}");
            existingItem.Image = imageUrl;
        }

        if (menuItem.Image == "REMOVE")
        {
            string imageUrlKey = $"{key}/{existingItem.Id}";
            await s3Service.DeleteFileAsync(imageUrlKey);
            existingItem.Image = "";
        }
    }


    private async Task AddNewMenuItem(AddNewMenuItemInput menuItem, List<IFormFile> files, string key)
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
        // Save to access newMenuItem.Id
        await context.SaveChangesAsync();

        var file = files.FirstOrDefault(f => f.FileName == menuItem.TempId);
        if (file != null)
        {
            string imageUrl = await s3Service.UploadFileAsync(file, $"{key}/{newMenuItem.Id}");
            newMenuItem.Image = imageUrl;
        }
    }

    private async Task DeleteAllMenuItems(string key)
    {
        var existingMenuItems = await GetExistingMenuItems(key);
        context.MenuItems.RemoveRange(existingMenuItems);

        foreach (var item in existingMenuItems)
        {
            string imageUrlKey = $"{key}/{item.Id}";
            await s3Service.DeleteFileAsync(imageUrlKey);
        }
    }
}

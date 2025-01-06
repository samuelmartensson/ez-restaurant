using Microsoft.EntityFrameworkCore;
using Models.Requests;
using System.Text.Json;

public class MenuService(RestaurantContext context, S3Service s3Service)
{
    private RestaurantContext context = context;
    private readonly S3Service s3Service = s3Service;

    public class AddNewMenuItemInput
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public int CategoryId { get; set; }
        public decimal Price { get; set; }
        public string? TempId { get; set; }
        public string? Image { get; set; }
        public string? Description { get; set; }
        public string? Tags { get; set; }
    }


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

    public async Task UpdateCategoryOrder(List<AddCategoryRequest> request, string key)
    {
        var existingCategories = await context.MenuCategorys
            .Where(mc => mc.CustomerConfigDomain == key)
            .ToListAsync();

        foreach (AddCategoryRequest item in request)
        {
            var existingCategory = existingCategories.First(c => c.Id == item.Id);
            existingCategory.Order = item.Order ?? 0;
        }

        await context.SaveChangesAsync();
    }

    public async Task UpdateOrCreateCategory(AddCategoryRequest request, string key)
    {
        var existingCategory = await GetCategoryById(request.Id, key);
        if (existingCategory != null)
        {
            existingCategory.Name = request.Name;
            existingCategory.Description = request.Description;
        }
        else
        {
            await context.MenuCategorys.AddAsync(new MenuCategory { CustomerConfigDomain = key, Name = request.Name, Description = request.Description, Order = request.Order ?? 0 });
        }

        await context.SaveChangesAsync();
    }

    public async Task DeleteCategory(int id, string key)
    {
        var existingCategory = await GetCategoryById(id, key);
        if (existingCategory == null)
        {
            throw new Exception("Category not found.");
        }
        context.MenuCategorys.Remove(existingCategory);
        await context.SaveChangesAsync();
    }

    private async Task<MenuCategory?> GetCategoryById(int id, string key)
    {
        var existingCategories = await context.MenuCategorys
            .Where(mc => mc.CustomerConfigDomain == key)
            .ToListAsync();
        var existingCategory = existingCategories.FirstOrDefault(c => c.Id == id);

        return existingCategory;
    }

    private async Task<List<MenuItem>> GetExistingMenuItems(string key)
    {
        return (await context.MenuCategorys
            .Include(mc => mc.MenuItems)
            .Where(mc => mc.CustomerConfigDomain == key)
            .ToListAsync())
            .SelectMany(mc => mc.MenuItems)
            .ToList();
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
        existingItem.MenuCategoryId = menuItem.CategoryId;
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
            Name = menuItem.Name,
            Description = menuItem.Description,
            Price = menuItem.Price,
            Tags = menuItem.Tags,
            MenuCategoryId = menuItem.CategoryId,
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

using Microsoft.EntityFrameworkCore;
using Models.Requests;
using System.Text.Json;

public class MenuService(RestaurantContext context, S3Service s3Service, TranslationService translationService)
{
    private RestaurantContext context = context;
    private readonly S3Service s3Service = s3Service;
    private TranslationService translationService = translationService;

    public class AddNewMenuItemInput
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required int Order { get; set; }
        public int CategoryId { get; set; }
        public decimal Price { get; set; }
        public string? TempId { get; set; }
        public string? Image { get; set; }
        public string? Description { get; set; }
        public string? Tags { get; set; }
    }

    private static string GetCategoryNameTKey(int key)
    {
        return $"menu_category_{key}_name";
    }
    private static string GetCategoryDescTKey(int key)
    {
        return $"menu_category_{key}_description";
    }
    private static string GetItemNameTKey(int key)
    {
        return $"menu_item_{key}_name";
    }
    private static string GetItemDescTKey(int key)
    {
        return $"menu_item_{key}_description";
    }
    private static string GetItemTagTKey(int key)
    {
        return $"menu_item_{key}_tags";
    }

    private async Task UpdateItemTKeys(CommonQueryParameters queryParameters, int id, AddNewMenuItemInput menuItem)
    {
        await translationService.CreateOrUpdateByKeys(
            queryParameters.Language,
            queryParameters.Key,
            new Dictionary<string, string>
            {
                { GetItemNameTKey(id), menuItem.Name },
                { GetItemDescTKey(id), menuItem.Description ?? "" },
                { GetItemTagTKey(id), menuItem.Tags ?? "" }
            });
    }

    private async Task DeleteItemTKeys(List<MenuItem> existingMenuItems, string key)
    {
        var nameKeys = existingMenuItems.Select(item => GetItemNameTKey(item.Id)).ToList();
        var descKeys = existingMenuItems.Select(item => GetItemDescTKey(item.Id)).ToList();
        var tagKeys = existingMenuItems.Select(item => GetItemTagTKey(item.Id)).ToList();
        var allTKeys = new[] { nameKeys, descKeys, tagKeys }
            .SelectMany(x => x)
            .ToList();
        await translationService.DeleteByKeys(key, allTKeys);
    }

    public async Task UploadCustomerMenu(string menuItemsJson, List<IFormFile> files, CommonQueryParameters queryParameters)
    {
        var menuItems = JsonSerializer.Deserialize<List<AddNewMenuItemInput>>(menuItemsJson, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
        });

        if (menuItems == null || !menuItems.Any())
        {
            await DeleteAllMenuItems(queryParameters.Key);
            await context.SaveChangesAsync();
            return;
        }

        var existingMenuItems = await GetExistingMenuItems(queryParameters.Key);
        await DeleteOldMenuItems(existingMenuItems, menuItems.Select(m => m.Id).ToList(), queryParameters.Key);
        await ProcessMenuItems(menuItems, existingMenuItems, files, queryParameters);
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

    public async Task UpdateOrCreateCategory(AddCategoryRequest request, CommonQueryParameters queryParameters)
    {
        var existingCategory = await GetCategoryById(request.Id, queryParameters.Key);
        int tKey;
        if (existingCategory != null)
        {
            tKey = existingCategory.Id;
            existingCategory.Name = request.Name;
            existingCategory.Description = request.Description;
        }
        else
        {
            var category = new MenuCategory
            {
                CustomerConfigDomain = queryParameters.Key,
                Name = request.Name,
                Description = request.Description,
                Order = request.Order ?? 0
            };
            await context.MenuCategorys.AddAsync(category);
            await context.SaveChangesAsync();
            tKey = category.Id;
        }

        await translationService.CreateOrUpdateByKeys(
            queryParameters.Language,
            queryParameters.Key,
            new Dictionary<string, string>
            {
                { GetCategoryNameTKey(tKey), request.Name },
                { GetCategoryDescTKey(tKey), request.Description ?? "" }
            });

        await context.SaveChangesAsync();
    }

    public async Task DeleteCategory(int id, string key)
    {
        var existingCategory = await GetCategoryById(id, key);
        if (existingCategory == null)
        {
            throw new Exception("Category not found.");
        }

        await translationService.DeleteByKeys(key, new List<string>() {
            GetCategoryNameTKey(existingCategory.Id),
            GetCategoryDescTKey(existingCategory.Id),
        });
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
        await DeleteItemTKeys(itemsToDelete, key);

        foreach (var item in itemsToDelete)
        {
            string imageUrlKey = $"{key}/{item.Id}";
            await s3Service.DeleteFileAsync(imageUrlKey);
        }
    }

    private async Task ProcessMenuItems(List<AddNewMenuItemInput> menuItems, List<MenuItem> existingMenuItems, List<IFormFile> files, CommonQueryParameters queryParameters)
    {
        foreach (var menuItem in menuItems)
        {
            var existingItem = existingMenuItems.FirstOrDefault(m => m.Id == menuItem.Id);
            if (existingItem != null)
            {
                await UpdateExistingMenuItem(existingItem, menuItem, files, queryParameters);
            }
            else
            {
                await AddNewMenuItem(menuItem, files, queryParameters);
            }
        }
    }

    private async Task UpdateExistingMenuItem(MenuItem existingItem, AddNewMenuItemInput menuItem, List<IFormFile> files, CommonQueryParameters queryParameters)
    {
        var key = queryParameters.Key;
        existingItem.Name = menuItem.Name;
        existingItem.Description = menuItem.Description;
        existingItem.Tags = menuItem.Tags;
        await UpdateItemTKeys(queryParameters, existingItem.Id, menuItem);

        existingItem.Price = menuItem.Price;
        existingItem.MenuCategoryId = menuItem.CategoryId;
        existingItem.Id = menuItem.Id;
        existingItem.Order = menuItem.Order;

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


    private async Task AddNewMenuItem(AddNewMenuItemInput menuItem, List<IFormFile> files, CommonQueryParameters queryParameters)
    {
        var newMenuItem = new MenuItem
        {
            Name = menuItem.Name,
            Description = menuItem.Description,
            Price = menuItem.Price,
            Tags = menuItem.Tags,
            MenuCategoryId = menuItem.CategoryId,
            Order = menuItem.Order
        };

        await context.MenuItems.AddAsync(newMenuItem);
        await context.SaveChangesAsync();
        await UpdateItemTKeys(queryParameters, newMenuItem.Id, menuItem);

        var file = files.FirstOrDefault(f => f.FileName == menuItem.TempId);
        if (file != null)
        {
            string imageUrl = await s3Service.UploadFileAsync(file, $"{queryParameters.Key}/{newMenuItem.Id}");
            newMenuItem.Image = imageUrl;
        }
    }

    private async Task DeleteAllMenuItems(string key)
    {
        var existingMenuItems = await GetExistingMenuItems(key);
        context.MenuItems.RemoveRange(existingMenuItems);
        await DeleteItemTKeys(existingMenuItems, key);

        foreach (var item in existingMenuItems)
        {
            string imageUrlKey = $"{key}/{item.Id}";
            await s3Service.DeleteFileAsync(imageUrlKey);
        }
    }
}

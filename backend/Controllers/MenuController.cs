using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Requests;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class MenuController(
    MenuService menuService
) : ControllerBase
{
    private MenuService menuService = menuService;

    [Authorize(Policy = "KeyPolicy")]
    [HttpPost("items")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadCustomerMenu([FromForm] string menuItemsJson, [FromForm] List<IFormFile> files, [FromQuery] string key)
    {
        await menuService.UploadCustomerMenu(menuItemsJson, files, key);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [HttpPost("category")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> AddCategory(AddCategoryRequest request, [FromQuery] string key)
    {
        await menuService.UpdateOrCreateCategory(request, key);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [HttpPost("category/order")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateCategoryOrder(List<AddCategoryRequest> request, [FromQuery] string key)
    {
        await menuService.UpdateCategoryOrder(request, key);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [HttpDelete("category")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteCategory([FromQuery] int id, [FromQuery] string key)
    {
        await menuService.DeleteCategory(id, key);
        return Ok(new { message = "Success" });
    }
}


using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Requests;

namespace webapi.Controllers;

[Authorize(Policy = "KeyPolicy")]
[ApiController]
[Route("[controller]")]
public class MenuController(MenuService menuService) : ControllerBase
{
    private MenuService menuService = menuService;

    [RequireSubscription(SubscriptionState.Free)]
    [HttpPost("items")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadCustomerMenu([FromForm] string menuItemsJson, [FromForm] List<IFormFile> files, [FromQuery, Required] CommonQueryParameters queryParameters)
    {
        await menuService.UploadCustomerMenu(menuItemsJson, files, queryParameters);
        return Ok(new { message = "Success" });
    }

    [RequireSubscription(SubscriptionState.Free)]
    [HttpPost("category")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> AddCategory(AddCategoryRequest request, [FromQuery, Required] CommonQueryParameters queryParameters)
    {
        await menuService.UpdateOrCreateCategory(request, queryParameters);
        return Ok(new { message = "Success" });
    }

    [RequireSubscription(SubscriptionState.Free)]
    [HttpPost("category/order")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateCategoryOrder(List<AddCategoryRequest> request, [FromQuery, Required] string key)
    {
        await menuService.UpdateCategoryOrder(request, key);
        return Ok(new { message = "Success" });
    }

    [RequireSubscription(SubscriptionState.Free)]
    [HttpDelete("category")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteCategory([FromQuery] int id, [FromQuery, Required] string key)
    {
        await menuService.DeleteCategory(id, key);
        return Ok(new { message = "Success" });
    }
}


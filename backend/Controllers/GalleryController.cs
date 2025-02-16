using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Requests;

namespace webapi.Controllers;

[Authorize(Policy = "KeyPolicy")]
[RequireSubscription(SubscriptionState.Premium)]
[ApiController]
[Route("[controller]")]
public class GalleryController(GalleryService galleryService) : ControllerBase
{
    private GalleryService galleryService = galleryService;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadGalleryImage([FromForm] UploadGalleryAssetsRequest assets, [FromQuery] CommonQueryParameters queryParameters)
    {
        await galleryService.AddGalleryImage(assets, queryParameters);
        return Ok(new { message = "Success" });
    }

    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteGalleryImage([FromQuery] int id, [FromQuery] CommonQueryParameters queryParameters)
    {
        await galleryService.RemoveGalleryImage(id, queryParameters);
        return Ok(new { message = "Success" });
    }
}


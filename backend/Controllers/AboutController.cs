using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Requests;

namespace webapi.Controllers;

[Authorize(Policy = "KeyPolicy")]
[RequireSubscription(SubscriptionState.Premium)]
[ApiController]
[Route("[controller]")]
public class AboutController(AboutService aboutService) : ControllerBase
{
    private AboutService aboutService = aboutService;


    [HttpGet]
    [ProducesResponseType(typeof(Dictionary<string, AboutResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAbout([FromQuery] CommonQueryParameters queryParameters)
    {
        var data = await aboutService.GetAbout(queryParameters);
        if (data == null)
        {
            return NotFound("About not found.");
        }
        return Ok(data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadAbout([FromBody] UploadAboutRequest fields, [FromQuery] CommonQueryParameters queryParameters)
    {
        await aboutService.UpdateAbout(fields, queryParameters);
        return Ok(new { message = "Success" });
    }

    [HttpPost("assets")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadAboutAssets([FromForm] UploadAboutAssetsRequest assets, [FromForm] List<string> removedAssets, [FromQuery] CommonQueryParameters queryParameters)
    {
        await aboutService.UpdateAboutAssets(assets, removedAssets, queryParameters);
        return Ok(new { message = "Success" });
    }
}


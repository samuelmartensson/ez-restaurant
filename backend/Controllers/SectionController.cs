using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Requests;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class SectionController(
    SectionConfigurationService sectionConfigurationService
) : ControllerBase
{
    private SectionConfigurationService sectionConfigurationService = sectionConfigurationService;

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost("hero")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadHero([FromForm] UploadHeroAssetsRequest assets, [FromForm] List<string> removedAssets, [FromForm] UploadHeroRequest fields, [FromQuery, Required] string key)
    {
        await sectionConfigurationService.UpdateHero(assets, removedAssets, fields, key);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost("about")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadAbout([FromForm] UploadAboutAssetsRequest assets, [FromForm] List<string> removedAssets, [FromForm] UploadAboutRequest fields, [FromQuery] CommonQueryParameters queryParameters)
    {
        await sectionConfigurationService.UpdateAbout(assets, removedAssets, fields, queryParameters);
        return Ok(new { message = "Success" });
    }
}


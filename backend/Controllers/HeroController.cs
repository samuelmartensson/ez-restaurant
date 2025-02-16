using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Requests;

namespace webapi.Controllers;

[Authorize(Policy = "KeyPolicy")]
[RequireSubscription(SubscriptionState.Free)]
[ApiController]
[Route("[controller]")]
public class HeroController(HeroService heroService) : ControllerBase
{
    private HeroService heroService = heroService;

    [HttpGet]
    [ProducesResponseType(typeof(Dictionary<string, HeroResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHero([FromQuery] CommonQueryParameters queryParameters)
    {
        var data = await heroService.GetHero(queryParameters);
        return Ok(data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadHero([FromBody] UploadHeroRequest fields, [FromQuery, Required] string key)
    {
        await heroService.UpdateHero(fields, key);
        return Ok(new { message = "Success" });
    }

    [HttpPost("assets")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadHeroAssets([FromForm] UploadHeroAssetsRequest assets, [FromForm] List<string> removedAssets, [FromQuery] CommonQueryParameters queryParameters)
    {
        await heroService.UpdateHeroAssets(assets, removedAssets, queryParameters);
        return Ok(new { message = "Success" });
    }
}


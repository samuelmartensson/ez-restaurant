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

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost("gallery")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadGalleryImage([FromForm] UploadGalleryAssetsRequest assets, [FromQuery] CommonQueryParameters queryParameters)
    {
        await sectionConfigurationService.AddGalleryImage(assets, queryParameters);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpDelete("gallery")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteGalleryImage([FromQuery] int id, [FromQuery] CommonQueryParameters queryParameters)
    {
        await sectionConfigurationService.RemoveGalleryImage(id, queryParameters);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpGet("news")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<NewsArticleResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListNewsArticles([FromQuery] CommonQueryParameters queryParameters)
    {
        var data = await sectionConfigurationService.ListNewsArticles(queryParameters);
        return Ok(data);
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpGet("news/{id}")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(NewsArticleResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetNewsArticle(int id, [FromQuery] CommonQueryParameters queryParameters)
    {
        var data = await sectionConfigurationService.GetNewsArticle(id, queryParameters);
        return Ok(data);
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost("news")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> AddNewsArticle([FromBody] AddNewsArticleRequest request, [FromQuery] CommonQueryParameters queryParameters)
    {
        await sectionConfigurationService.AddNewsArticle(request, queryParameters);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPut("news/{id}")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateNewsArticle(int id, [FromForm] AddNewsArticleRequest request, [FromQuery] CommonQueryParameters queryParameters)
    {
        await sectionConfigurationService.UpdateNewsArticle(id, request, queryParameters);
        return Ok(new { message = "Success" });
    }
}


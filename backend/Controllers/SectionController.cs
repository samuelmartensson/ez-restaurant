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
    [HttpGet("hero")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Dictionary<string, HeroResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetHero([FromQuery] CommonQueryParameters queryParameters)
    {
        var data = await sectionConfigurationService.GetHero(queryParameters);
        return Ok(data);
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost("hero")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadHero([FromBody] UploadHeroRequest fields, [FromQuery, Required] string key)
    {
        await sectionConfigurationService.UpdateHero(fields, key);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost("hero/assets")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadHeroAssets([FromForm] UploadHeroAssetsRequest assets, [FromForm] List<string> removedAssets, [FromQuery] CommonQueryParameters queryParameters)
    {
        await sectionConfigurationService.UpdateHeroAssets(assets, removedAssets, queryParameters);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpGet("about")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(Dictionary<string, AboutResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAbout([FromQuery] CommonQueryParameters queryParameters)
    {
        var data = await sectionConfigurationService.GetAbout(queryParameters);
        if (data == null)
        {
            return NotFound("About not found.");
        }
        return Ok(data);
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost("about")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadAbout([FromBody] UploadAboutRequest fields, [FromQuery] CommonQueryParameters queryParameters)
    {
        await sectionConfigurationService.UpdateAbout(fields, queryParameters);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost("about/assets")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UploadAboutAssets([FromForm] UploadAboutAssetsRequest assets, [FromForm] List<string> removedAssets, [FromQuery] CommonQueryParameters queryParameters)
    {
        await sectionConfigurationService.UpdateAboutAssets(assets, removedAssets, queryParameters);
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
    [ProducesResponseType(typeof(Dictionary<string, NewsArticleResponse>), StatusCodes.Status200OK)]
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
    [HttpDelete("news/{id}")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteNewsArticle(int id, [FromQuery] CommonQueryParameters queryParameters)
    {
        await sectionConfigurationService.RemoveNewsArticle(id, queryParameters);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPut("news/{id}")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateNewsArticle(int id, [FromBody] AddNewsArticleRequest request, [FromQuery] CommonQueryParameters queryParameters)
    {
        await sectionConfigurationService.UpdateNewsArticle(id, request, queryParameters);
        return Ok(new { message = "Success" });
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPut("news/{id}/assets")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateNewsArticleAssets(int id, [FromForm] AddNewsArticleAssetsRequest request, [FromForm] List<string> removedAssets, [FromQuery] CommonQueryParameters queryParameters)
    {
        await sectionConfigurationService.UpdateNewsArticleAssets(id, request, removedAssets, queryParameters);
        return Ok(new { message = "Success" });
    }
}


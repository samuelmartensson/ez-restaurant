using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Requests;

namespace webapi.Controllers;

[Authorize(Policy = "KeyPolicy")]
[RequireSubscription(SubscriptionState.Premium)]
[ApiController]
[Route("[controller]")]
public class NewsArticleController(NewsArticleService newsArticleService) : ControllerBase
{
    private NewsArticleService newsArticleService = newsArticleService;

    [HttpGet]
    [ProducesResponseType(typeof(List<NewsArticleResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListNewsArticles([FromQuery] CommonQueryParameters queryParameters)
    {
        var data = await newsArticleService.ListNewsArticles(queryParameters);
        return Ok(data);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Dictionary<string, NewsArticleResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetNewsArticle(int id, [FromQuery] CommonQueryParameters queryParameters)
    {
        var data = await newsArticleService.GetNewsArticle(id, queryParameters);
        return Ok(data);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> AddNewsArticle([FromBody] AddNewsArticleRequest request, [FromQuery] CommonQueryParameters queryParameters)
    {
        await newsArticleService.AddNewsArticle(request, queryParameters);
        return Ok(new { message = "Success" });
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteNewsArticle(int id, [FromQuery] CommonQueryParameters queryParameters)
    {
        await newsArticleService.RemoveNewsArticle(id, queryParameters);
        return Ok(new { message = "Success" });
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateNewsArticle(int id, [FromBody] AddNewsArticleRequest request, [FromQuery] CommonQueryParameters queryParameters)
    {
        await newsArticleService.UpdateNewsArticle(id, request, queryParameters);
        return Ok(new { message = "Success" });
    }

    [HttpPut("{id}/assets")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateNewsArticleAssets(int id, [FromForm] AddNewsArticleAssetsRequest request, [FromForm] List<string> removedAssets, [FromQuery] CommonQueryParameters queryParameters)
    {
        await newsArticleService.UpdateNewsArticleAssets(id, request, removedAssets, queryParameters);
        return Ok(new { message = "Success" });
    }
}


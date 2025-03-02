using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Requests;
using Models.Responses;

namespace webapi.Controllers;

[Authorize(Policy = "KeyPolicy")]
[ApiController]
[Route("[controller]")]
public class OpeningHourController(
OpeningHourService openingHourService
) : ControllerBase
{
    private readonly OpeningHourService openingHourService = openingHourService;

    [RequireSubscription(SubscriptionState.Free)]
    [HttpGet]
    [ProducesResponseType(typeof(List<Dictionary<string, OpeningHourResponse>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOpeningHours([FromQuery, Required] CommonQueryParameters queryParameters)
    {
        var openingHours = await openingHourService.GetOpeningHours(queryParameters);
        return Ok(openingHours);
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateOpeningHours(List<AddOpeningHourRequest> newOpeningHours, [FromQuery, Required] CommonQueryParameters queryParameters)
    {
        await openingHourService.UpdateOpeningHours(queryParameters, newOpeningHours);
        return Ok(new { message = "Success" });
    }
}


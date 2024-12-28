using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Models.Responses;
using Models.Requests;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class OpeningHourController(
    OpeningHourService openingHourService
) : ControllerBase
{
    private readonly OpeningHourService openingHourService = openingHourService;

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Free)]
    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(typeof(List<OpeningHourResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOpeningHours([FromQuery] string key)
    {
        var openingHours = (await openingHourService.GetOpeningHours(key))
            .Select(o => new OpeningHourResponse
            {
                OpenTime = o.OpenTime.ToString(@"hh\:mm"),
                CloseTime = o.CloseTime.ToString(@"hh\:mm"),
                Day = o.Day,
                Id = o.Id,
                IsClosed = o.IsClosed
            });
        return Ok(openingHours);
    }

    [Authorize(Policy = "KeyPolicy")]
    [RequireSubscription(SubscriptionState.Premium)]
    [HttpPost]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateOpeningHours(List<AddOpeningHourRequest> newOpeningHours, [FromQuery] string key)
    {
        await openingHourService.UpdateOpeningHours(key, newOpeningHours);
        return Ok(new { message = "Success" });
    }
}


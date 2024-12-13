using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class CustomerController(RestaurantContext context) : ControllerBase
{
    private readonly RestaurantContext _context = context;


    [HttpGet("get-customer-config")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetCustomerConfig([FromQuery] string key)
    {

        var customerConfigs = new Dictionary<string, CustomerConfig>
        {
        };

        var cg = _context.CustomerConfigs.FirstOrDefault((x) => x.Domain == key);

        if (string.IsNullOrEmpty(key) || cg == null)
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }

        return Ok(cg);
    }
}
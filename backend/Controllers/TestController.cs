using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class TestController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<TestController> _logger;

    public TestController(ILogger<TestController> logger)
    {
        _logger = logger;
    }

    [HttpPost("post-test")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult PostTest([FromBody] string request)
    {
        string test = "system";
        return Ok(new { test = test + " post test" });
    }


    public class CustomerConfig
    {
        required public string Name { get; set; }
        required public string Theme { get; set; }
        required public int HeroType { get; set; }
    }

    [HttpGet("get-customer-config")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetCustomerConfig([FromQuery] string key)
    {
        var customerConfigs = new Dictionary<string, CustomerConfig>
        {
            { "testdomain", new CustomerConfig { Name = "MinButik", HeroType = 1, Theme = "rustic" } },
            { "elpaso", new CustomerConfig { Name = "El Paso", HeroType = 2, Theme = "modern" } },
            { "test", new CustomerConfig { Name = "Test Customer", HeroType = 2, Theme = "modern" } }
        };

        if (string.IsNullOrEmpty(key) || !customerConfigs.ContainsKey(key))
        {
            return NotFound(new { message = "CustomerConfig not found for the provided key." });
        }

        return Ok(customerConfigs[key]);
    }


}
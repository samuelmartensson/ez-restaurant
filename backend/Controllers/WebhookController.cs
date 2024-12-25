using Clerk.Net.Client;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace webapi.Controllers;

[Route("webhook")]
public class StripeWebHook(
    RestaurantContext context,
    ClerkApiClient clerkApiClient
) : ControllerBase
{
    private RestaurantContext context = context;
    private ClerkApiClient clerkApiClient = clerkApiClient;

    [HttpPost]
    public async Task<IActionResult> Index()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

        try
        {
            var stripeEvent = EventUtility.ParseEvent(json);
            if (stripeEvent.Type == EventTypes.InvoicePaid)
            {
                var paymentIntent = stripeEvent.Data.Object as Invoice;
                var allUsers = await clerkApiClient.Users.GetAsync();
                var clerkUser = allUsers?.FirstOrDefault(u =>
                    u.EmailAddresses?.FirstOrDefault(e => e.EmailAddressProp == paymentIntent?.CustomerEmail) != null);

                if (clerkUser == null)
                {
                    return BadRequest();
                }

                var user = await context.Users.Include(u => u.Customer).FirstOrDefaultAsync(u => u.Id == clerkUser.Id);
                if (user?.Customer == null)
                {
                    return BadRequest();
                }
                user.Customer.Subscription = SubscriptionState.Premium;
                await context.SaveChangesAsync();
            }
            else
            {
                // Unexpected event type
                Console.WriteLine("Unhandled event type: {0}", stripeEvent.Type);
            }
            return Ok();
        }
        catch (StripeException e)
        {
            return BadRequest();
        }
    }
}

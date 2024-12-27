
using Clerk.Net.Client;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace webapi.Controllers
{
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
                const string endpointSecret = "whsec_SiXsiS6H3T32zxW1BIBozbZuiBvNMHgv";
                var stripeEvent = EventUtility.ConstructEvent(json,
                    Request.Headers["Stripe-Signature"], endpointSecret);

                if (stripeEvent.Type == EventTypes.InvoicePaymentSucceeded)
                {
                    var paymentIntent = stripeEvent.Data.Object as Invoice;
                    var subscriptionExpireTime = paymentIntent?.Lines.First().Period.End;
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

                    if (subscriptionExpireTime != null)
                    {
                        user.Customer.Subscription = SubscriptionState.Premium;
                        user.Customer.SubscriptionExpireAt = subscriptionExpireTime;
                    }

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
                return BadRequest(e.Message);
            }
        }
    }
}


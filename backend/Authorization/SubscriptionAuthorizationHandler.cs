using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

public class SubscriptionRequirement : IAuthorizationRequirement
{
    public SubscriptionState RequiredState { get; }

    public SubscriptionRequirement(SubscriptionState requiredState)
    {
        RequiredState = requiredState;
    }
}


public class SubscriptionAuthorizationHandler(RestaurantContext dbContext) : AuthorizationHandler<SubscriptionRequirement>
{
    private RestaurantContext dbContext = dbContext;
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, SubscriptionRequirement requirement)
    {
        var userId = context.User.Identity?.Name;

        if (string.IsNullOrEmpty(userId))
        {
            context.Fail();
        }

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            context.Fail();
            return;
        }
        var customer = await dbContext.Customers.FirstOrDefaultAsync(c => c.Id == user.CustomerId);
        if (customer == null)
        {
            context.Fail();
            return;
        }

        if (customer.Subscription != 0 && DateTime.Now > customer.SubscriptionExpireAt)
        {
            context.Fail();
        }

        if (customer.Subscription >= requirement.RequiredState)
        {
            context.Succeed(requirement);
        }
    }
}

public class RequireSubscriptionAttribute : AuthorizeAttribute
{
    public RequireSubscriptionAttribute(SubscriptionState requiredState)
        : base(policy: $"SubscriptionState-{requiredState}")
    {
    }
}

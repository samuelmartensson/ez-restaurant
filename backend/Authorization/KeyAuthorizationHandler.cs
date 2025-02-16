using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

public class KeyRequirement : IAuthorizationRequirement
{
    // Custom conditions could be added here
}

public class KeyAuthorizationHandler(RestaurantContext dbContext) : AuthorizationHandler<KeyRequirement>
{

    private RestaurantContext dbContext = dbContext;
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, KeyRequirement requirement)
    {
        var userId = context.User.Identity?.Name;

        if (string.IsNullOrEmpty(userId))
        {
            context.Fail();
            return;
        }

        var httpContext = context.Resource as DefaultHttpContext;
        var requestKey = httpContext?.Request.Query["key"].ToString();

        if (string.IsNullOrEmpty(requestKey))
        {
            context.Fail(new AuthorizationFailureReason(this, "Key is required"));
            return;
        }

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            context.Fail();
            return;
        }

        var config = await dbContext.CustomerConfigs.FirstOrDefaultAsync(c => c.Domain == requestKey && c.CustomerId == user.CustomerId);
        if (config == null)
        {
            context.Fail();
            return;
        }

        if (httpContext != null)
        {
            httpContext.Items["config"] = config;
            httpContext.Items["user"] = user;
        }
        context.Succeed(requirement);
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

public class UserRequirement : IAuthorizationRequirement
{
    // Custom conditions could be added here
}

public class UserAuthorizationHandler(RestaurantContext dbContext) : AuthorizationHandler<UserRequirement>
{

    private RestaurantContext dbContext = dbContext;
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, UserRequirement requirement)
    {
        var userId = context.User.Identity?.Name;

        if (string.IsNullOrEmpty(userId))
        {
            context.Fail();
            return;
        }

        context.Succeed(requirement);
    }
}

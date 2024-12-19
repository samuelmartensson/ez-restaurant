using Microsoft.AspNetCore.Authorization;

public class UserRequirement : IAuthorizationRequirement
{
    // Custom conditions could be added here
}

public class UserAuthorizationHandler() : AuthorizationHandler<UserRequirement>
{
    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, UserRequirement requirement)
    {
        var userId = context.User.Identity?.Name;

        if (string.IsNullOrEmpty(userId))
        {
            context.Fail();
        }

        context.Succeed(requirement);
    }
}

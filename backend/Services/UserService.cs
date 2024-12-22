using Database.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

public class UserService(RestaurantContext context)
{
    private RestaurantContext context = context;
    public record CreateConfigRequest(string domain);

    public async Task<User?> GetUser(ClaimsPrincipal user)
    {
        var userId = user.Identity?.Name;
        var dbUser = await context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        return dbUser;
    }
}

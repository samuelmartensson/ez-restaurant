
using Database.Models;

public static class ContextHelper
{
    public static CustomerConfig GetConfig(this HttpContext? httpContext)
    {
        if (httpContext == null)
            throw new ArgumentNullException(nameof(httpContext));

        if (!httpContext.Items.TryGetValue("config", out var config) || config is not CustomerConfig typedConfig)
        {
            throw new InvalidOperationException("Configuration of type CustomerConfig not found in HttpContext.");
        }

        return typedConfig;
    }

    public static User GetUser(this HttpContext? httpContext)
    {
        if (httpContext == null)
            throw new ArgumentNullException(nameof(httpContext));

        if (!httpContext.Items.TryGetValue("user", out var user) || user is not User typedUser)
        {
            throw new InvalidOperationException("User not found in HttpContext.");
        }

        return typedUser;
    }
}

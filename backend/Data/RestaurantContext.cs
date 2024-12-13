
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

public class RestaurantContext : DbContext
{
    public RestaurantContext(DbContextOptions<RestaurantContext> options)
        : base(options)
    { }
    public required DbSet<CustomerConfig> CustomerConfigs { get; set; }
    public required DbSet<Customer> Customers { get; set; }

}




using Database.Models;

public class Customer
{
    public int Id { get; set; }
    required public string Subscription { get; set; }
    public ICollection<CustomerConfig> CustomerConfigs { get; set; } = new List<CustomerConfig>();
    public ICollection<User> Users { get; set; } = new List<User>();
}
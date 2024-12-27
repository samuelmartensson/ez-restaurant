using Database.Models;

public enum SubscriptionState
{
    Free,
    Premium
}

public class Customer
{
    public int Id { get; set; }
    required public SubscriptionState Subscription { get; set; }
    public DateTime? SubscriptionExpireAt { get; set; }
    public ICollection<CustomerConfig> CustomerConfigs { get; set; } = new List<CustomerConfig>();
    public ICollection<User> Users { get; set; } = new List<User>();
}
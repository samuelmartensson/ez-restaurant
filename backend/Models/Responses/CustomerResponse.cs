namespace Models.Responses
{
    public class CancelInfo
    {
        public bool IsCanceled { get; set; }
        public bool IsExpired { get; set; }
        public DateTime? periodEnd { get; set; }
    }
    public class CustomerResponse
    {
        public string Domain { get; set; } = "";
        public CancelInfo? CancelInfo { get; set; }
        public SubscriptionState Subscription { get; set; }
        public List<CustomerConfigResponse> CustomerConfigs { get; set; } = new List<CustomerConfigResponse>();
    }
}
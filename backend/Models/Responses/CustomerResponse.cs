namespace Models.Responses
{
    public class CustomerResponse
    {
        public string Domain { get; set; } = "";
        public SubscriptionState Subscription { get; set; }
        public List<CustomerConfigResponse> CustomerConfigs { get; set; } = new List<CustomerConfigResponse>();
    }
}
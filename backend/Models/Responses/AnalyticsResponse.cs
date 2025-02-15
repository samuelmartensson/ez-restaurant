namespace Models.Requests
{
    public class AnalyticsResponse
    {
        public required Dictionary<string, string> PreviousMenu { get; set; }
        public required Dictionary<string, string> CurrentMenu { get; set; }
        public required Dictionary<string, string> Previous { get; set; }
        public required Dictionary<string, string> Current { get; set; }
    };
}

namespace Models.Requests
{
    public class AddOpeningHourRequest
    {
        public required int Id { get; set; }
        public required string Label { get; set; }
        public TimeSpan OpenTime { get; set; }
        public TimeSpan CloseTime { get; set; }
    };
}

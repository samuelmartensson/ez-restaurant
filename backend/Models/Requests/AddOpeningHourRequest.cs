namespace Models.Requests
{
    public class AddOpeningHourRequest
    {
        public required int Id { get; set; }
        public required string OpenTime { get; set; }
        public required string CloseTime { get; set; }
        public required bool IsClosed { get; set; }
        public string? Label { get; set; }
    };
}

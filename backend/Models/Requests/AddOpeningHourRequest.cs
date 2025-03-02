namespace Models.Requests
{

    public class AddOpenHourLocalizedFields
    {
        public string? Label { get; set; }
    }

    public class AddOpeningHourRequest
    {
        public required int Id { get; set; }
        public required string OpenTime { get; set; }
        public required string CloseTime { get; set; }
        public required bool IsClosed { get; set; }
        public required Dictionary<string, AddOpenHourLocalizedFields> LocalizedFields { get; set; }
    };
}


namespace Models.Responses
{
    public class OpeningHourResponse
    {
        public required int Id { get; set; }
        public required CustomDayOfWeek Day { get; set; }
        public required string OpenTime { get; set; }
        public required string CloseTime { get; set; }
        public bool IsClosed { get; set; }
    };
}

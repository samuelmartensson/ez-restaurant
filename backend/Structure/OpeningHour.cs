public enum CustomDayOfWeek
{
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7
}

public class OpeningHour
{
    public int Id { get; set; }
    required public string CustomerConfigDomain { get; set; }
    public CustomDayOfWeek Day { get; set; }
    public TimeSpan OpenTime { get; set; }
    public TimeSpan CloseTime { get; set; }
    public bool IsClosed { get; set; }
    public CustomerConfig? CustomerConfig { get; set; }
}

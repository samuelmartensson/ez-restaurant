public class OpeningHour
{
    public int Id { get; set; }
    required public string CustomerConfigDomain { get; set; }
    public DayOfWeek Day { get; set; }
    public TimeSpan OpenTime { get; set; }
    public TimeSpan CloseTime { get; set; }
    public CustomerConfig? CustomerConfig { get; set; }
}

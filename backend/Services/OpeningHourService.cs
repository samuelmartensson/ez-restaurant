
using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class OpeningHourService(RestaurantContext context)
{
    private RestaurantContext context = context;

    public List<OpeningHour> InitializeWeeklyOpeningHours(string domain)
    {
        var openingHours = new List<OpeningHour>();
        var daysOfWeek = Enum.GetValues<CustomDayOfWeek>();

        foreach (var day in daysOfWeek)
        {
            if (day == 0) continue;
            openingHours.Add(new OpeningHour
            {
                CustomerConfigDomain = domain,
                Day = day,
                OpenTime = new TimeSpan(8, 0, 0),
                CloseTime = new TimeSpan(20, 0, 0)
            });
        }

        return openingHours;
    }

    public async Task<List<OpeningHour>> GetOpeningHours(string domain)
    {
        var openingHours = await context.OpeningHours.Where(o => o.CustomerConfigDomain == domain).ToListAsync();

        return openingHours;
    }

    public TimeSpan ParseTimeString(string timeString)
    {
        if (TimeSpan.TryParse(timeString, out var timeSpan))
        {
            return timeSpan;
        }
        else
        {
            throw new FormatException($"Invalid time format: {timeString}");
        }
    }

    public async Task UpdateOpeningHours(string domain, List<AddOpeningHourRequest> newOpeningHours)
    {
        var existingOpeningHours = await context.OpeningHours.Where(o => o.CustomerConfigDomain == domain).ToListAsync();
        var itemsToDelete = existingOpeningHours
            .Where(m => !newOpeningHours.Select(o => o.Id).Contains(m.Id)).ToList();
        context.OpeningHours.RemoveRange(itemsToDelete);

        foreach (var newHour in newOpeningHours)
        {
            var existingHour = existingOpeningHours.FirstOrDefault(o => o.Id == newHour.Id);
            var openTime = ParseTimeString(newHour.OpenTime);
            var closeTime = ParseTimeString(newHour.CloseTime);

            if (existingHour != null)
            {
                existingHour.OpenTime = openTime;
                existingHour.CloseTime = closeTime;
                existingHour.IsClosed = newHour.IsClosed;
                existingHour.Label = newHour.Label;
            }
            else
            {
                // Special hours
                await context.AddAsync(new OpeningHour
                {
                    CustomerConfigDomain = domain,
                    CloseTime = closeTime,
                    OpenTime = openTime,
                    IsClosed = newHour.IsClosed,
                    Label = newHour.Label,
                    Day = 0,
                });
            };
        }
        await context.SaveChangesAsync();
    }
}

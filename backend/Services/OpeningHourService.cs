
using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class OpeningHourService(RestaurantContext context, TranslationService translationService)
{
    private RestaurantContext context = context;
    private TranslationService translationService = translationService;


    private static string ConstructTranslationKey(int key)
    {
        return $"open_hour_{key}";
    }

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

    public async Task<List<OpeningHour>> GetOpeningHours(CommonQueryParameters queryParameters)
    {
        var openingHours = await context.OpeningHours.Where(o => o.CustomerConfigDomain == queryParameters.Key).ToListAsync();

        var openingHourTasks = openingHours.Select(async o => new OpeningHour
        {
            CustomerConfigDomain = o.CustomerConfigDomain,
            OpenTime = o.OpenTime,
            CloseTime = o.CloseTime,
            Day = o.Day,
            Id = o.Id,
            IsClosed = o.IsClosed,
            Label = await translationService.GetByKey(
                queryParameters.Language,
                queryParameters.Key,
                ConstructTranslationKey(o.Id)
            ) ?? o.Label
        }).ToList();

        var openingHourList = await Task.WhenAll(openingHourTasks);

        return openingHourList.ToList();
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

    public async Task UpdateOpeningHours(CommonQueryParameters queryParameters, List<AddOpeningHourRequest> newOpeningHours)
    {
        var existingOpeningHours = await context.OpeningHours.Where(o => o.CustomerConfigDomain == queryParameters.Key).ToListAsync();
        var itemsToDelete = existingOpeningHours
            .Where(m => !newOpeningHours.Select(o => o.Id).Contains(m.Id)).ToList();

        context.OpeningHours.RemoveRange(itemsToDelete);
        await translationService.DeleteByKeys(
            queryParameters.Key,
            itemsToDelete.Select(item => ConstructTranslationKey(item.Id)).ToList()
        );

        foreach (var newHour in newOpeningHours)
        {
            var existingHour = existingOpeningHours.FirstOrDefault(o => o.Id == newHour.Id);
            var openTime = ParseTimeString(newHour.OpenTime);
            var closeTime = ParseTimeString(newHour.CloseTime);
            int translationId = 0;
            bool isSpecial = existingHour?.Day == 0;

            if (existingHour != null)
            {
                existingHour.OpenTime = openTime;
                existingHour.CloseTime = closeTime;
                existingHour.IsClosed = newHour.IsClosed;
                existingHour.Label = newHour.Label;
                translationId = existingHour.Id;
            }
            else
            {
                // Special hours
                isSpecial = true;
                var openHour = new OpeningHour
                {
                    CustomerConfigDomain = queryParameters.Key,
                    CloseTime = closeTime,
                    OpenTime = openTime,
                    IsClosed = newHour.IsClosed,
                    Label = newHour.Label,
                    Day = 0,
                };
                await context.AddAsync(openHour);
                await context.SaveChangesAsync();
                translationId = openHour.Id;
            };

            if (isSpecial)
            {
                await translationService.CreateOrUpdateByKey(
                    queryParameters.Language,
                    queryParameters.Key,
                    ConstructTranslationKey(translationId),
                    newHour.Label
                );
            }

        }
        await context.SaveChangesAsync();
    }
}

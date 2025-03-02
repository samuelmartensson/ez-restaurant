
using Microsoft.EntityFrameworkCore;
using Models.Requests;
using Models.Responses;

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

    public async Task<List<Dictionary<string, OpeningHourResponse>>> GetOpeningHours(CommonQueryParameters queryParameters)
    {
        var openingHours = await context.OpeningHours
            .Where(o => o.CustomerConfigDomain == queryParameters.Key)
            .OrderBy(o => o.Day)
            .ToListAsync();
        var openingHourList = new List<Dictionary<string, OpeningHourResponse>>();

        if (!openingHours.Any())
        {
            var openingHoursInit = InitializeWeeklyOpeningHours(queryParameters.Key);
            await context.AddRangeAsync(openingHoursInit);
            await context.SaveChangesAsync();
            openingHours = openingHoursInit;
        }

        var languages = (await context.CustomerConfigs
            .Select(x => new { x.Languages, x.Domain })
            .Where((x) => x.Domain == queryParameters.Key)
            .FirstOrDefaultAsync())?.Languages ?? "";

        foreach (var o in openingHours)
        {
            var responseDictionary = new Dictionary<string, OpeningHourResponse>();

            foreach (var language in languages.Split(",").ToList())
            {
                if (string.IsNullOrEmpty(language)) continue;

                var translatedLabel = await translationService.GetByKey(
                    language,
                    queryParameters.Key,
                    ConstructTranslationKey(o.Id)
                );

                var localizedResponse = new OpeningHourResponse
                {

                    OpenTime = o.OpenTime.ToString(),
                    CloseTime = o.CloseTime.ToString(),
                    Day = o.Day,
                    Id = o.Id,
                    IsClosed = o.IsClosed,
                    Label = translatedLabel ?? o.Label
                };

                responseDictionary[language] = localizedResponse;
            }
            openingHourList.Add(responseDictionary);
        }

        return openingHourList;
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
        var languages = ((await context.CustomerConfigs
            .Select(x => new { x.Languages, x.Domain })
            .Where((x) => x.Domain == queryParameters.Key)
            .FirstOrDefaultAsync())?.Languages ?? "").Split(",").ToList();



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
                existingHour.Label = newHour.LocalizedFields[languages.First()].Label ?? "";
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
                    Label = newHour.LocalizedFields[languages.First()].Label ?? "",
                    Day = 0,
                };
                await context.AddAsync(openHour);
                await context.SaveChangesAsync();
                translationId = openHour.Id;
            }

            if (isSpecial)
            {
                var localizedTranslations = languages.Select(language => (language, new Dictionary<string, string> {
                    { ConstructTranslationKey(translationId), newHour.LocalizedFields[language].Label ?? "" },
                })).ToList();

                await translationService.CreateOrUpdateByKeys(
                    localizedTranslations,
                    queryParameters.Key
                );
            }

        }
        await context.SaveChangesAsync();
    }
}

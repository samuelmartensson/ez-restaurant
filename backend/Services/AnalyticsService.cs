using Google.Analytics.Data.V1Beta;
using Google.Type;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Models.Requests;
using Models.Responses;

public class AnalyticsService
{
    // Dev
    private string propertyId = "471957797";

    public AnalyticsService(IWebHostEnvironment env)
    {
        if (env.IsProduction())
        {
            propertyId = "477194031";
        }
    }

    private Filter GetDomainFilter(string domain)
    {
        return new Filter
        {
            FieldName = "customEvent:domain",
            StringFilter = new Filter.Types.StringFilter
            {
                Value = domain
            }
        };
    }

    private Dictionary<string, string> MapReportToKeyValuePair(RunReportResponse report)
    {
        var result = report.Rows.FirstOrDefault()?.MetricValues.Select((r, i) => new
        {
            Key = report.MetricHeaders[i].Name,
            r.Value
        }).ToDictionary(x => x.Key, x => x.Value);

        return result ?? new Dictionary<string, string>();
    }

    private RunReportRequest GetReportRequestForTimePeriod(string domain, string startDate, string endDate)
    {
        return new RunReportRequest
        {
            Property = "properties/" + propertyId,
            Dimensions = {
                new Dimension { Name = "customEvent:domain" },
            },
            Metrics = {
                new Metric { Name = "newUsers" },
                new Metric { Name = "sessions" },
            },
            DateRanges = {
                new DateRange {
                    StartDate = startDate,
                    EndDate = endDate
                },
            },
            DimensionFilter = new FilterExpression
            {
                Filter = GetDomainFilter(domain)
            }
        };
    }

    private RunReportRequest GetMenuReportRequestForTimePeriod(string domain, string startDate, string endDate)
    {
        return new RunReportRequest
        {
            Property = "properties/" + propertyId,
            Dimensions = {
                new Dimension { Name = "customEvent:domain" },
            },
            Metrics = {
                new Metric { Name = "sessions" },
            },
            DateRanges = {
                new DateRange {
                    StartDate = startDate,
                    EndDate = endDate
                },
            },
            DimensionFilter = new FilterExpression
            {
                AndGroup = new FilterExpressionList
                {
                    Expressions =  {
                        new FilterExpression {
                            Filter = GetDomainFilter(domain)
                        },
                        new FilterExpression {
                            Filter = new Filter
                            {
                                FieldName = "pageLocation",
                                StringFilter = new Filter.Types.StringFilter
                                {
                                    Value = "/menu",
                                    MatchType = Filter.Types.StringFilter.Types.MatchType.Contains
                                }
                            }
                        },
                    }
                }

            }
        };
    }

    public async Task<AnalyticsResponse> GetReport(string key)
    {
        // Using a default constructor instructs the client to use the credentials
        // specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
        BetaAnalyticsDataClient client = BetaAnalyticsDataClient.Create();
        var requestMenuPrevious = GetMenuReportRequestForTimePeriod(key, "60daysAgo", "30daysAgo");
        var requestMenuNow = GetMenuReportRequestForTimePeriod(key, "30daysAgo", "today");

        var requestPrevious = GetReportRequestForTimePeriod(key, "60daysAgo", "30daysAgo");
        var requestNow = GetReportRequestForTimePeriod(key, "30daysAgo", "today");


        RunReportResponse responseMenuPrevious = await client.RunReportAsync(requestMenuPrevious);
        RunReportResponse responseMenuNow = await client.RunReportAsync(requestMenuNow);

        RunReportResponse responsePrevious = await client.RunReportAsync(requestPrevious);
        RunReportResponse responseNow = await client.RunReportAsync(requestNow);

        var resultMenuPrevious = MapReportToKeyValuePair(responseMenuPrevious);
        var resultMenuNow = MapReportToKeyValuePair(responseMenuNow);

        var resultPrevious = MapReportToKeyValuePair(responsePrevious);
        var resultNow = MapReportToKeyValuePair(responseNow);

        return new AnalyticsResponse
        {
            PreviousMenu = resultMenuPrevious,
            CurrentMenu = resultMenuNow,
            Previous = resultPrevious,
            Current = resultNow
        };
    }
}

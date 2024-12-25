using Database.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text;

public class QoplaService(RestaurantContext context)
{
    private RestaurantContext context = context;

    public static async Task<string> FetchQoplaMenu(string url)
    {
        const string qoplaApi = "https://api.qopla.com/graphql";
        url = url.Replace("https://qopla.com/restaurant/", "");
        string returnStr = "";
        string publicId = url.Split("/")[1];
        using (HttpClient client = new HttpClient())
        {
            try
            {


                string jsonPayload = $@"
        {{
            ""operationName"": ""getShopByPublicId"",
            ""variables"": {{
                ""publicId"": ""{publicId}""
            }},
            ""query"": ""query getShopByPublicId($publicId: String!) {{
              getShopByPublicId(publicId: $publicId) {{
                id
                publicId
                name
                desc
                companyId
                imageUrl
                bannerUrl
                organisationNumber
                menuIds
                activeHours {{
                  closed
                  date
                  dayOfWeek
                  desc
                  startingHour
                  stoppingHour
                  __typename
                }}
                contactInformation {{
                  ... on ContactInformation {{
                    ...contactInformationResults
                    __typename
                  }}
                  __typename
                }}
                settings {{
                  shopTables {{
                    id
                    name
                    tableId
                    posId
                    __typename
                  }}
                  showOnKDSWithinMinutesBeforePickup
                  partnerPromotionId
                  onlineSettings {{
                    ... on ShopOnlineSettings {{
                      ...onlineSettingsResults
                      __typename
                    }}
                    __typename
                  }}
                  homeDeliverySettings {{
                    ... on ShopHomeDeliverySettings {{
                      ...homeDeliverySettingsResults
                      __typename
                    }}
                    __typename
                  }}
                  cateringSettings {{
                    ... on ShopCateringSettings {{
                      ...cateringSettingsResults
                      __typename
                    }}
                    __typename
                  }}
                  __typename
                }}
                __typename
              }}
            }}
            ""
        }}";
                HttpContent content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync(qoplaApi, content);
                if (response.IsSuccessStatusCode)
                {
                    returnStr = await response.Content.ReadAsStringAsync();
                    Console.WriteLine(returnStr);
                }
                else
                {
                    Console.WriteLine($"Error: {response.StatusCode}");
                    returnStr = response.StatusCode.ToString();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                returnStr = ex.Message;
            }
            return returnStr;
        }

    }
}

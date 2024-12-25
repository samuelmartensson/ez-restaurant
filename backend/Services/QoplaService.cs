using Database.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System.Security.Claims;
using System.Text;

public class QoplaService(RestaurantContext context)
{
    private RestaurantContext context = context;

    public record IdResponse(string id, string companyId, string[] menuIds);
    public record MenuItem(string ProductId, string Price, string Name);

    private static readonly string qoplaApi = "https://api.qopla.com/graphql";
    public static async Task<string> FetchQoplaMenu(string url)
    {
        url = url.Replace("https://qopla.com/restaurant/", "");
        string publicId = url.Split("/")[1];

        using (HttpClient client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Accept-Language", "en-US,en;q=0.9,sv;q=0.8");
            client.DefaultRequestHeaders.Add("Connection", "keep-alive");
            client.DefaultRequestHeaders.Add("DNT", "1");
            client.DefaultRequestHeaders.Add("Origin", "https://qopla.com");
            client.DefaultRequestHeaders.Add("Referer", "https://qopla.com/");
            client.DefaultRequestHeaders.Add("Sec-Fetch-Dest", "empty");
            client.DefaultRequestHeaders.Add("Sec-Fetch-Mode", "cors");
            client.DefaultRequestHeaders.Add("Sec-Fetch-Site", "same-site");
            client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
            client.DefaultRequestHeaders.Add("accept", "*/*");
            client.DefaultRequestHeaders.Add("Authorization", "Bearer");
            client.DefaultRequestHeaders.Add("sec-ch-ua", "\"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"");
            client.DefaultRequestHeaders.Add("sec-ch-ua-mobile", "?0");
            client.DefaultRequestHeaders.Add("sec-ch-ua-platform", "\"macOS\"");

            try
            {
                IdResponse idr = await GetQoplaIds(client, publicId);
                var test = await GetMenus(client, idr);
                return test.ToString();
            }

            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
            }
            return "peener";
        }
    }
    private static async Task<IdResponse> GetQoplaIds(HttpClient client, string publicId)
    {
        IdResponse idResponse = new IdResponse("", "", [""]);





        var jsonPayload = new
        {
            operationName = "getShopByPublicId",
            variables = new { publicId },
            query = @"
                query getShopByPublicId($publicId: String!) {
                  getShopByPublicId(publicId: $publicId) {
                    id
                    publicId
                    name
                    desc
                    companyId
                    imageUrl
                    bannerUrl
                    organisationNumber
                    menuIds
                    activeHours {
                      closed
                      date
                      dayOfWeek
                      desc
                      startingHour
                      stoppingHour
                    }
                    contactInformation {
                      email
                      addressLine
                      city
                      phoneNumber
                    }
                    settings {
                      shopTables {
                        id
                        name
                        tableId
                        posId
                      }
                      onlineSettings {
                        commentPlaceholder
                        enableOnlineOrders
                        onlineMenuIds
                      }
                    }
                  }
                }
            "
        };

        var content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(jsonPayload), Encoding.UTF8, "application/json");

        HttpResponseMessage response = await client.PostAsync(qoplaApi, content);
        if (response.IsSuccessStatusCode)
        {
            JObject jsonObject = JObject.Parse(await response.Content.ReadAsStringAsync());

            var id = jsonObject["data"]?["getShopByPublicId"]?["id"]?.ToString();
            var companyId = jsonObject["data"]?["getShopByPublicId"]?["companyId"]?.ToString();
            var menuIds = jsonObject["data"]?["getShopByPublicId"]?["menuIds"]?.ToObject<string[]>();
            idResponse = new IdResponse(id ?? "", companyId ?? "", menuIds ?? [""]);
        }
        else
        {
            Console.WriteLine($"Error: {response}");
        }
        return idResponse;
    }
    private static async Task<List<MenuItem>> GetMenus(HttpClient client, IdResponse idr)
    {
        List<MenuItem> menuItems = new List<MenuItem>();




        var jsonPayload = new
        {
            operationName = "getMenusByIds",
            variables = new { menuIds = new[] { idr.menuIds } },
            query = @"
        query getMenusByIds($menuIds: [String], $includeDisabled: Boolean) {
          getMenusByIds(menuIds: $menuIds, includeDisabled: $includeDisabled) {
            id
            name
            description
            companyId
            isExpressMenu
            eatingOptions
            disabled
            sortOrder
            rotate
            rotationGroupName
            allowTopSeller
            thirdPartyDeliveryTypes
            menuLocks {
              lockedBy
              locked
              lockedEndDate
              lockComment
              servicesToLock
            }
            deleted
            updatedAt
            expressStartMenu {
              header
              description
              expressStartMenuItemList {
                refMenuItemId
                expressStartMenuItemType
                imageUrl
              }
            }
            activeHours {
              closed
              date
              dayOfWeek
              desc
              startingHour
              stoppingHour
            }
            menuChangelogs {
              username
              updatedAt
            }
            menuProductCategories {
              id
              name
              upsellCategory
              upsellCategoryAtPayment
              imageUrl
              imageResizedUrls {
                small
                medium
                large
              }
              description
              open
              sortOrder
              color
              posFavorite
              partnerPromotionImageType
              menuBundleProducts {
                id
                price
                sortOrder
                color
                activeHours {
                  dayOfWeek
                }
                bundleCategoryColors {
                  bundleProductCategoryId
                  color
                }
                menuBundleModifications {
                  refProductId
                  modifications {
                    sizes {
                      name
                      price
                      addonPrice
                    }
                    flavours {
                      name
                      price
                      addonPrice
                    }
                  }
                }
                refBundleProduct {
                  id
                  articleNumber
                  description
                  contents
                  name
                  imageUrl
                  imageResizedUrls {
                    small
                    medium
                    large
                  }
                  companyId
                  defaultPrice
                  priceType
                  vatRate
                  refProductCategoryId
                  allergens {
                    id
                    name
                    desc
                  }
                  bundleProductCategories {
                    id
                    limit
                    name
                    refProductIdList
                    kdsUnitDisplayName
                    color
                    sortOrder
                  }
                }
              }
              menuProducts {
                id
                price
                sortOrder
                color
                activeHours {
                  dayOfWeek
                }
                modifications {
                  sizes {
                    name
                    price
                    addonPrice
                  }
                  flavours {
                    name
                    price
                    addonPrice
                  }
                }
                refProduct {
                  id
                  articleNumber
                  refProductCategoryId
                  name
                  imageUrl
                }
              }
            }
          }
        }
    "
        };


        var content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(jsonPayload), Encoding.UTF8, "application/json");

        HttpResponseMessage response = await client.PostAsync(qoplaApi, content);
        if (response.IsSuccessStatusCode)
        {
            JObject jsonObject = JObject.Parse(await response.Content.ReadAsStringAsync());

            menuItems = jsonObject["data"]?["getMenusByIds"]?["menuProductCategories"]?
                                .SelectMany(category => category["menuProducts"] ?? "")
                                .Select(product => new
                                 MenuItem(product["id"].ToString() ?? "", product["price"].ToString() ?? "", product["refProduct"]?["name"].ToString() ?? ""))
                               .ToList() ?? menuItems;


        }
        else
        {
            Console.WriteLine($"Error: {response}");
        }
        return menuItems;
    }

}





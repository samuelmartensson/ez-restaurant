
using System.Text;
using System.Net.Http.Headers;
using Newtonsoft.Json;

public class VercelService
{
    public readonly string _token;
    public readonly string _projectId = "prj_6kb7M2XxJs42SjJ8pVpgCIcmlIgi";
    public readonly string _teamId = "team_ejexGzALAEl9jCP3BWkU0m6X";

    public VercelService()
    {
        _token = Environment.GetEnvironmentVariable("VERCEL_TOKEN") ?? "";
    }

    public async Task<HttpResponseMessage> CreateDomain(string domainName)
    {
        var requestBody = new
        {
            name = domainName,
        };

        var jsonRequestBody = JsonConvert.SerializeObject(requestBody);
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_token}");
            return await client.PostAsync(
                $"https://api.vercel.com/v10/projects/{_projectId}/domains?teamId={_teamId}",
                new StringContent(jsonRequestBody, Encoding.UTF8, new MediaTypeHeaderValue("application/json"))
            );
        }
    }

    public async Task<HttpResponseMessage> DeleteDomain(string domainName)
    {
        using (var client = new HttpClient())
        {
            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {_token}");
            return await client.DeleteAsync(
                $"https://api.vercel.com/v9/projects/{_projectId}/domains/{domainName}?teamId={_teamId}");
        }
    }
}

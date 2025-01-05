using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Models.Requests;

public class EmailService(RestaurantContext context, IHostEnvironment env)
{
    private RestaurantContext context = context;
    private readonly IHostEnvironment env = env;

    private static string smtpServer = "smtp-relay.brevo.com";
    private static int smtpPort = 587;
    private static string fromEmail = "sam@adflow.se";
    private static string username = "sam@adflow.se";
    private static string password = Environment.GetEnvironmentVariable("SMTP_PASSWORD") ?? "";

    public async Task SendEmail(ContactRequest request, string key)
    {
        var config = await context.CustomerConfigs.FirstOrDefaultAsync(c => c.Domain == key);
        StringBuilder sb = new StringBuilder();
        sb.AppendLine($"{config?.SiteName ?? key}");
        sb.AppendLine();
        sb.AppendLine(request.Name);
        sb.AppendLine(request.Email);
        sb.AppendLine();
        sb.AppendLine("<strong>Message:</strong>");
        sb.AppendLine(request.Description);
        string body = sb.ToString().Replace(Environment.NewLine, "<br>");

        try
        {
            if (config?.Email == null || string.IsNullOrEmpty(config.Email))
            {
                return;
            }

            var client = new SmtpClient(smtpServer)
            {
                Port = smtpPort,
                Credentials = new NetworkCredential(username, password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail),
                Subject = "New contact form submission",
                Body = body,
                IsBodyHtml = true
            };
            if (env.IsDevelopment())
            {
                mailMessage.To.Add("samuel137@live.se");
            }
            else
            {
                // TODO: enable when production
                // mailMessage.To.Add(config.Email);
            }

            await client.SendMailAsync(mailMessage);
            Console.WriteLine("Email sent successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error sending email: " + ex.Message);
        }
    }
}

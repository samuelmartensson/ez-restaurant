using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);
//swagger url: http://localhost:5232/swagger/index.html

builder.Configuration.AddEnvironmentVariables();


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
  {

      options.AddPolicy("Prod",
          builder => builder
                .WithOrigins("https://*.tidochplats.se", "https://ez-restaurant-admin.vercel.app")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
              );
  });

builder.Services.AddCors(options =>
{
    options.AddPolicy("Dev",
        builder => builder
            // .WithOrigins("http://localhost:3000", "https://localhost:3000", "http://localhost:3001", "https://localhost:3001", "http://localhost:5173")
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(x =>
    {
        // Authority is the URL of your clerk instance
        x.Authority = builder.Configuration["AppSettings:clerkUrl"];
        x.TokenValidationParameters = new TokenValidationParameters()
        {
            // Disable audience validation as we aren't using it
            ValidateAudience = false,
            NameClaimType = ClaimTypes.NameIdentifier
        };
        x.Events = new JwtBearerEvents()
        {

            // Additional validation for AZP claim
            OnTokenValidated = context =>
            {
                var azp = context.Principal?.FindFirstValue("azp");

                if (builder.Environment.EnvironmentName == "Development")
                {
                    // AuthorizedParty is the base URL of your frontend.
                    if (string.IsNullOrEmpty(azp) || !azp.Equals("http://localhost:3000"))
                        context.Fail("AZP Claim is invalid or missing");

                    return Task.CompletedTask;
                }

                // Check if the AZP claim exists
                if (string.IsNullOrEmpty(azp))
                {
                    context.Fail("AZP Claim is invalid or missing");
                    return Task.CompletedTask;
                }

                // Ensure the AZP matches any subdomain of example.com
                var authorizedDomain = builder.Configuration["AppSettings:authorizedDomain"]; // Ensure this includes the leading dot
                if (!Uri.TryCreate(azp, UriKind.Absolute, out var azpUri) ||
                    !azpUri.Host.EndsWith(authorizedDomain, StringComparison.OrdinalIgnoreCase))
                {
                    context.Fail("AZP Claim does not match the allowed domain");
                    return Task.CompletedTask;
                }

                return Task.CompletedTask;
            }

        };
    });





string path = $"Data Source = {Environment.GetEnvironmentVariable("sqliterestaurantpath")};foreign keys=true" ?? "NO PATH. ERROR";

builder.Services.AddDbContext<RestaurantContext>(options => options.UseSqlite(path));
builder.Services.AddScoped<MenuService>();
builder.Services.AddScoped<SiteConfigurationService>();
builder.Services.AddScoped<S3Service>();
builder.Services.AddScoped<UserService>();

builder.Services.AddScoped<IAuthorizationHandler, KeyAuthorizationHandler>();
builder.Services.AddScoped<IAuthorizationHandler, UserAuthorizationHandler>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("UserPolicy", policy =>
        policy.Requirements.Add(new UserRequirement()));
    options.AddPolicy("KeyPolicy", policy =>
        policy.Requirements.Add(new KeyRequirement()));
});



var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<RestaurantContext>();
    dbContext.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("Dev");
}
else
{
    app.UseCors("Prod");
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();


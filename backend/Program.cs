using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Clerk.Net.DependencyInjection;
using Stripe;
StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

var builder = WebApplication.CreateBuilder(args);
//swagger url: http://localhost:5232/swagger/index.html

builder.Configuration.AddEnvironmentVariables();


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SupportNonNullableReferenceTypes();
});
builder.Services.AddClerkApiClient(config =>
{
    config.SecretKey = Environment.GetEnvironmentVariable("CLERK_SECRET_KEY") ?? "";
});

builder.Services.AddControllers();
builder.Services.AddCors(options =>
  {

      options.AddPolicy("Prod",
          builder => builder
                .WithOrigins("https://*.ezrest.se", "https://ez-restaurant-admin.vercel.app", "https://www.ezrest.se")
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
                // AuthorizedParty is the base URL of your frontend.
                if (string.IsNullOrEmpty(azp) || !azp.Equals(builder.Configuration["AppSettings:authorizedDomain"]))
                    context.Fail("AZP Claim is invalid or missing");

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
builder.Services.AddScoped<SectionConfigurationService>();

builder.Services.AddScoped<IAuthorizationHandler, KeyAuthorizationHandler>();
builder.Services.AddScoped<IAuthorizationHandler, UserAuthorizationHandler>();
builder.Services.AddScoped<IAuthorizationHandler, SubscriptionAuthorizationHandler>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("UserPolicy", policy =>
        policy.Requirements.Add(new UserRequirement()));
    options.AddPolicy("KeyPolicy", policy =>
        policy.Requirements.Add(new KeyRequirement()));
    options.AddPolicy("SubscriptionState-Free", policy =>
        policy.Requirements.Add(new SubscriptionRequirement(SubscriptionState.Free)));
    options.AddPolicy("SubscriptionState-Premium", policy =>
        policy.Requirements.Add(new SubscriptionRequirement(SubscriptionState.Premium)));

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


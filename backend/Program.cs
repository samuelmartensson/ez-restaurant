using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

var builder = WebApplication.CreateBuilder(args);
//swagger url: http://localhost:5232/swagger/index.html


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddCors(options =>
  {

      options.AddPolicy("Prod",
          builder => builder
                .WithOrigins("https://*.tidochplats.se")
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
        x.Authority = "https://upright-killdeer-60.clerk.accounts.dev";
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
                if (string.IsNullOrEmpty(azp) || !azp.Equals("http://localhost:3000"))
                    context.Fail("AZP Claim is invalid or missing");

                return Task.CompletedTask;
            }
        };
    });





string path = $"Data Source = {Environment.GetEnvironmentVariable("sqliterestaurantpath")}" ?? "NO PATH. ERROR";

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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Console.WriteLine("test db success: " + CreateTestDb.createTestDbWithData(path));
    // app.UseSwagger();
    // app.UseSwaggerUI();
    app.UseCors("Dev");
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();


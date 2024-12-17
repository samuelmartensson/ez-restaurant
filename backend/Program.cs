using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

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

string path = $"Data Source = {Environment.GetEnvironmentVariable("sqliterestaurantpath")}" ?? "NO PATH. ERROR";

builder.Services.AddDbContext<RestaurantContext>(options => options.UseSqlite(path));
builder.Services.AddScoped<MenuService>();
builder.Services.AddScoped<S3Service>();



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    Console.WriteLine("test db success: " + CreateTestDb.createTestDbWithData(path));
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("Dev");
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();


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
              .WithOrigins("https://helptype.se", "https://www.helptype.se", "https://djcarldurelius.se", "https://wwww.djcarldurelius.se")// todo fix prod cors
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
            .AllowAnyMethod()
            .AllowCredentials());
});
string path = System.Environment.GetEnvironmentVariable("sqlitedbtypingtestpath") ?? "NO PATH. ERROR";


builder.Services.AddDbContext<RestaurantContext>(options =>
options.UseSqlite($"Data Source = {path}"));




var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();




app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

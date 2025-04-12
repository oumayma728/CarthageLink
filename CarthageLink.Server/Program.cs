using CarthageLink.Server.Data;
using CarthageLink.Server.Repositories;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.Text;
using System.Text.Json.Serialization;
using static CarthageLink.Server.Repositories.ILicenseRepository;
using static CarthageLink.Server.Repositories.ISensorDataRepository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Register MQTT service
builder.Services.AddScoped<IMQTTService, MQTTService>(); // Changed from AddScoped
builder.Services.AddScoped<MqttBackgroundService>(); // Add MongoDB

// Register DatabaseSettings
builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("DatabaseSettings"));

// Register MongoClient as Singleton
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<DatabaseSettings>>().Value;
    return new MongoClient(settings.Connection); // MongoClient
});

// Register MongoDatabase as Singleton
builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
    var mongoClient = sp.GetRequiredService<IMongoClient>();
    var settings = sp.GetRequiredService<IOptions<DatabaseSettings>>().Value;
    return mongoClient.GetDatabase(settings.DatabaseName); // MongoDatabase
});

// Add JWT TokenService
builder.Services.AddSingleton<ITokenService, TokenService>(); // stateless service, no need to use AddScoped

// Add repositories, stateful services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IFactoryRepository, FactoryRepository>();
builder.Services.AddScoped<ILicenseRepository, LicenseRepository>();
builder.Services.AddScoped<IDeviceRepository, DeviceRepository>();
builder.Services.AddScoped<ISensorDataRepository, SensorDataRepository>();

// Add services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IFactoryService, FactoryService>();
builder.Services.AddScoped<ILicenseService, LicenseService>();
builder.Services.AddScoped<IDeviceService, DeviceService>();
builder.Services.AddScoped<ISensorDataService, SensorDataService>(); // Change from Singleton to Scoped

builder.Services.AddControllers();

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var mqttService = scope.ServiceProvider.GetRequiredService<IMQTTService>();
    await mqttService.ConnectAsync();
    await mqttService.SubscribeAsync("backend-test"); // ✅ Put your real topic here

}

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();

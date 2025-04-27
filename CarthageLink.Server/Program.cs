using CarthageLink.Server.Data;
using CarthageLink.Server.Hubs;
using CarthageLink.Server.Repositories;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.Text;
using System.Text.Json.Serialization;
using static CarthageLink.Server.Repositories.IDeviceRepository;
using static CarthageLink.Server.Repositories.ILicenseRepository;
using static CarthageLink.Server.Repositories.ISensorDataRepository;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSignalR(); // Add SignalR

// Register MQTT service
builder.Services.AddSingleton<IMQTTService, MQTTService>();
builder.Services.AddHostedService<MqttBackgroundService>(); // Now valid

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
builder.Services.AddScoped<IReportRepository, ReportRepository>(); // ✅ if it's DI

builder.Services.AddSingleton<IUserRepository, UserRepository>();
builder.Services.AddSingleton<IFactoryRepository, FactoryRepository>();
builder.Services.AddSingleton<ILicenseRepository, LicenseRepository>();
builder.Services.AddSingleton<IDeviceRepository, DeviceRepository>();
builder.Services.AddSingleton<ISensorDataRepository, SensorDataRepository>();
builder.Services.AddHostedService<AlertMonitorService>();

// Add services
builder.Services.AddSingleton<IAlertService, AlertService>();
builder.Services.AddScoped<IReportService, ReportService>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IFactoryService, FactoryService>();
builder.Services.AddScoped<ILicenseService, LicenseService>();
builder.Services.AddScoped<IDeviceService, DeviceService>();
builder.Services.AddScoped<IInsightsService, InsightsService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", options =>
    {
        options.WithOrigins("https://localhost:3000", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Required for SignalR auth
    });
});

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
   options.Events = new JwtBearerEvents
{
    OnMessageReceived = context =>
    {
        var accessToken = context.Request.Query["access_token"];
        var path = context.HttpContext.Request.Path;

        // Check both hub paths
        if (!string.IsNullOrEmpty(accessToken) &&
            (path.StartsWithSegments("/sensorHub") || path.StartsWithSegments("/alertHub")))
        {
            context.Token = accessToken;
        }

        return Task.CompletedTask;
    }
};

});

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseDefaultFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseRouting();
app.UseCors("AllowAll");
app.MapHub<SensorHub>("/sensorHub"); // <-- Add this!

app.MapHub<AlertHub>("/alertHub"); // Ensure the correct path for the alert hub

app.UseHttpsRedirection();
app.MapControllers();

app.Run();

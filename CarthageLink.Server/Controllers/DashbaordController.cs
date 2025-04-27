using Microsoft.AspNetCore.Mvc;
using CarthageLink.Server.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using CarthageLink.Server.Data;

namespace CarthageLink.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMongoCollection<Device> _devices;
    private readonly IMongoCollection<Factory> _factory;
    private readonly IMongoCollection<User> _user;
    private readonly IMongoCollection<License> _license;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(
        IOptions<DatabaseSettings> databaseSettings,
        IMongoClient mongoClient,
        ILogger<DashboardController> logger)
    {
        var database = mongoClient.GetDatabase(databaseSettings.Value.DatabaseName);
        _devices = database.GetCollection<Device>("Devices");
        _factory = database.GetCollection<Factory>("Factory");
        _user = database.GetCollection<User>("User");
        _license = database.GetCollection<License>("License");
        _logger = logger;
    }

    [HttpGet("counts")]
    public async Task<IActionResult> GetCounts()
    {
        try
        {
            var activeDevices = await _devices
    .CountDocumentsAsync(d => d.Status == DeviceStatus.Active);

            var activeFactories = await _factory
                .CountDocumentsAsync(FilterDefinition<Factory>.Empty);

            var activeUsers = await _user
                .CountDocumentsAsync(FilterDefinition<User>.Empty);
            var activeLicenses = await _license
                .CountDocumentsAsync(FilterDefinition<License>.Empty);

            return Ok(new
            {
                Devices = activeDevices,
                Factories = activeFactories,
                Users = activeUsers,
                Licenses = activeLicenses
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching dashboard counts");
            return StatusCode(500, "Error retrieving dashboard data");
        }
    }

    [HttpGet("trends")]
    public async Task<IActionResult> GetTrends([FromQuery] int days = 7)
    {
        try
        {
            var endDate = DateTime.UtcNow.Date;
            var startDate = endDate.AddDays(-days + 1);

            // Ensure we have valid date ranges
            if (days <= 0 || days > 365)
            {
                return BadRequest("Days parameter must be between 1 and 365");
            }

            // Device trend aggregation
            var deviceTrend = await _devices.Aggregate()
                .Match(d => d.Status== DeviceStatus.Active &&
                      d.LastConnected != null &&
                      d.LastConnected >= startDate &&
                      d.LastConnected <= endDate)

.Group(d => new { Date = d.LastConnected.HasValue ? d.LastConnected.Value.Date : DateTime.MinValue },
                    g => new {
                        Timestamp = g.Key.Date,
                        Count = g.Count()
                    })
                .SortBy(d => d.Timestamp)
                .ToListAsync();

            // Fill in missing dates with zero counts
            var completeDeviceTrend = Enumerable.Range(0, days)
                .Select(offset => startDate.AddDays(offset))
                .GroupJoin(deviceTrend,
                    date => date,
                    trend => trend.Timestamp,
                    (date, trends) => new {
                        Timestamp = date,
                        Count = trends.FirstOrDefault()?.Count ?? 0
                    })
                .ToList();

            return Ok(new
            {
                DeviceTrend = completeDeviceTrend,
                FactoryTrend = new object[0], // Implement similarly for factories
                UserTrend = new object[0]    // Implement similarly for users
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching dashboard trends");
            return StatusCode(500, new
            {
                Message = "An error occurred while fetching trends",
                Detailed = ex.Message
            });
        }
    }


}
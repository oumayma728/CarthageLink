using CarthageLink.Server.Models;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using System.Xml.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CarthageLink.Server.Services
{
    public class AlertMonitorService : BackgroundService
    {
        private readonly IMongoCollection<SensorData> _sensorDataCollection;
        private readonly IAlertService _alertService;
        private readonly ILogger<AlertMonitorService> _logger;

        public AlertMonitorService(
            IMongoDatabase database,
            IAlertService alertService,
            ILogger<AlertMonitorService> logger)
        {
            _sensorDataCollection = database.GetCollection<SensorData>("SensorData");
            _alertService = alertService;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckForAlerts();
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }

        private static readonly Dictionary<SensorType, (double min, double max)> _alertThresholds = new()
        {
            { SensorType.Temperature, (10, 35) },  // 0
            { SensorType.Humidity, (30, 70) },     // 1
            { SensorType.Speedometer, (0, 50) },   // 2
            { SensorType.Accelerometer, (5, 15) }, // 3
            { SensorType.Waterlevel, (10, 90) }     // 4
        };

        private bool TryParseSensorType(string key, out SensorType sensorType)
        {
            // Log the raw key being parsed
            _logger.LogDebug($"Attempting to parse sensor type from key: '{key}'");

            var normalizedKey = char.ToUpperInvariant(key[0]) + key.Substring(1).ToLowerInvariant();
            var success = Enum.TryParse(normalizedKey, out sensorType);

            // Log the parsing result
            if (success)
            {
                _logger.LogDebug($"Successfully parsed sensor type: {sensorType} ({(int)sensorType}) from key: '{key}'");
            }
            else
            {
                _logger.LogWarning($"Failed to parse sensor type from key: '{key}'");
            }

            return success;
        }

        private async Task CheckForAlerts()
        {
            try
            {
                _logger.LogInformation("Starting alert check...");
                var recentData = await _sensorDataCollection
                    .Find(d => d.Timestamp > DateTime.UtcNow.AddMinutes(-1))
                    .ToListAsync();

                _logger.LogInformation($"Found {recentData.Count} recent data entries to process");

                foreach (var data in recentData)
                {
                    _logger.LogDebug($"Processing device {data.DeviceId} with {data.Data.Count} sensor readings");

                    foreach (var kvp in data.Data)
                    {
                        _logger.LogDebug($"Processing sensor key: '{kvp.Key}', value: {kvp.Value}");

                        if (TryParseSensorType(kvp.Key, out SensorType sensorType))
                        {
                            // Log sensor type info with its numeric value
                            _logger.LogInformation($"Sensor Type: {sensorType} ({(int)sensorType}), Value: {kvp.Value}");

                            if (_alertThresholds.TryGetValue(sensorType, out var range))
                            {
                                _logger.LogDebug($"Threshold range for {sensorType}: Min={range.min}, Max={range.max}");

                                if (kvp.Value < range.min)
                                {
                                    var message = $"{sensorType} value is too LOW! ({kvp.Value})";
                                    _logger.LogWarning($"Creating LOW alert: {message}");

                                    await _alertService.CreateAndSendAlertAsync(
                                        data.DeviceId,
                                        sensorType,
                                        message,
                                        kvp.Value);
                                }
                                else if (kvp.Value > range.max)
                                {
                                    var message = $"{sensorType} value is too HIGH! ({kvp.Value})";
                                    _logger.LogWarning($"Creating HIGH alert: {message}");

                                    await _alertService.CreateAndSendAlertAsync(
                                        data.DeviceId,
                                        sensorType,
                                        message,
                                        kvp.Value);
                                }
                            }
                            else
                            {
                                _logger.LogWarning($"No threshold range found for sensor type: {sensorType} ({(int)sensorType})");
                            }
                        }
                    }
                }
                _logger.LogInformation("Completed alert check");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during alert check");
            }
        }
    }
}
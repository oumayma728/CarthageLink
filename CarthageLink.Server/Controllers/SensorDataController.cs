using CarthageLink.Server.Hubs;
using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using System.Text.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CarthageLink.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorDataController : ControllerBase
    {
        private readonly ISensorDataRepository _sensorDataRepository;
        private readonly IAlertService _alertService;
        private readonly IHubContext<AlertHub> _alertHubContext;
        private readonly ILogger<SensorDataController> _logger;
        private readonly Dictionary<SensorType, (double min, double max)> _alertThresholds;

        public SensorDataController(
            ISensorDataRepository sensorDataRepository,
            IAlertService alertService,
            IHubContext<AlertHub> alertHubContext,
            ILogger<SensorDataController> logger)
        {
            _sensorDataRepository = sensorDataRepository;
            _alertService = alertService;
            _alertHubContext = alertHubContext;
            _logger = logger;

            // Initialize alert thresholds (move to config if needed)
            _alertThresholds = new Dictionary<SensorType, (double min, double max)>
            {
                { SensorType.Temperature, (10, 35) },
                { SensorType.Humidity, (20, 80) },
                { SensorType.Speedometer, (0, 120) },
                { SensorType.Accelerometer, (-5, 5) },
                { SensorType.Waterlevel, (0, 100) }
            };
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var sensorData = await _sensorDataRepository.GetAllAsync();
                return Ok(sensorData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all sensor data");
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SensorData sensorData)
        {
            if (sensorData == null)
            {
                return BadRequest(new { message = "Sensor data cannot be null." });
            }

            try
            {
                // 1. First save sensor data (highest priority)
                await _sensorDataRepository.InsertAsync(sensorData);

                // 2. Process alerts in parallel (non-blocking)
                _ = ProcessAlertsAsync(sensorData); // Fire-and-forget

                return Ok(new { message = "Data added successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error posting sensor data");
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

        private async Task ProcessAlertsAsync(SensorData sensorData)
        {
            try
            {
                // Add debug log for the raw sensor data
                _logger.LogInformation($"Processing sensor data for device {sensorData.DeviceId}. Raw data: {JsonSerializer.Serialize(sensorData.Data)}");

                foreach (var kvp in sensorData.Data)
                {
                    if (TryParseSensorType(kvp.Key, out SensorType sensorType))
                    {
                        // Log the parsed sensor type and its numeric value
                        _logger.LogInformation($"Processing sensor: Key={kvp.Key}, Type={(int)sensorType} ({sensorType}), Value={kvp.Value}");

                        if (_alertThresholds.TryGetValue(sensorType, out var range))
                        {
                            if (kvp.Value < range.min || kvp.Value > range.max)
                            {
                                var alertMessage = kvp.Value < range.min
                                    ? $"{sensorType} value is too LOW! ({kvp.Value})"
                                    : $"{sensorType} value is too HIGH! ({kvp.Value})";

                                // Log the alert being created
                                _logger.LogInformation($"Creating alert: {alertMessage}");

                                var alert = new Alert
                                {
                                    DeviceId = sensorData.DeviceId,
                                    SensorType = sensorType,
                                    Message = alertMessage,
                                    Value = kvp.Value,
                                    Timestamp = DateTime.UtcNow
                                };

                                // Send real-time alert (SignalR)
                                await _alertHubContext.Clients.All.SendAsync("ReceiveAlert", alert);

                                // Save alert to database
                                await _alertService.CreateAndSendAlertAsync(
                                    sensorData.DeviceId,
                                    sensorType,
                                    alertMessage,
                                    kvp.Value);
                            }
                        }
                        else
                        {
                            _logger.LogWarning($"No threshold range found for sensor type: {sensorType} ({(int)sensorType})");
                        }
                    }
                    else
                    {
                        _logger.LogWarning($"Failed to parse sensor type from key: {kvp.Key}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing alerts");
            }
        }

        private bool TryParseSensorType(string key, out SensorType sensorType)
        {
            var normalizedKey = key.ToLower() switch
            {
                "temp" or "temperature" => "Temperature",
                "hum" or "humidity" => "Humidity",
                "speed" or "speedometer" => "Speedometer",
                "accel" or "accelerometer" => "Accelerometer",
                "water" or "waterlevel" => "Waterlevel",
                _ => char.ToUpperInvariant(key[0]) + key.Substring(1).ToLowerInvariant()
            };

            return Enum.TryParse(normalizedKey, out sensorType);
        }

        [HttpGet("{deviceId}")]
        public async Task<IActionResult> Get(string deviceId)
        {
            if (!ObjectId.TryParse(deviceId, out _))
            {
                return BadRequest(new { message = $"'{deviceId}' is not a valid 24 digit hex string." });
            }

            try
            {
                var sensorData = await _sensorDataRepository.GetLatestByDeviceId(deviceId);
                if (sensorData == null)
                {
                    return NotFound(new { message = "No sensor data found for the specified device ID." });
                }
                return Ok(sensorData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting data for device {deviceId}");
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

        [HttpGet("{deviceId}/{field}")]
        public async Task<IActionResult> Get(string deviceId, string field, [FromQuery] int limit = 20)
        {
            if (!ObjectId.TryParse(deviceId, out _))
            {
                return BadRequest(new { message = $"'{deviceId}' is not a valid 24 digit hex string." });
            }

            if (limit <= 0)
            {
                return BadRequest(new { message = "Limit must be a positive integer." });
            }

            try
            {
                var sensorData = await _sensorDataRepository.GetbyFieldAndDeviceIdAsync(deviceId, field, limit);
                if (sensorData == null || sensorData.Count == 0)
                {
                    return NotFound(new { message = "No sensor data found for the specified device ID and field." });
                }
                return Ok(sensorData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting {field} data for device {deviceId}");
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }
    }
}
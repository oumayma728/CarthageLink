using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using Microsoft.AspNetCore.SignalR;
using System.Text;

using System.Text.Json;

namespace CarthageLink.Server.Services
{
    public class MqttBackgroundService(IMQTTService MQTTService, ILogger<MqttBackgroundService> logger, ISensorDataRepository sensorDataRepository, IHubContext<SensorHub> hubContext) : BackgroundService
    {
        private readonly IMQTTService _mqttService = MQTTService;
        private readonly ILogger<MqttBackgroundService> _logger = logger;
        private readonly IHubContext<SensorHub> _hubContext = hubContext;
        private readonly ISensorDataRepository _sensorDataRepository = sensorDataRepository;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("MQTT Background Service started.");
            await _mqttService.ConnectAsync();

            // Subscribe to the sensor data topic
            await _mqttService.SubscribeAsync("CarthageLink/6617f12e4d1f4a1d88c6c9a1/Data", async message =>
            {
                try
                {
                    var topic = message.Topic; // e.ApplicationMessage.Topic;
                    byte[] payloadBytes = message.Payload;
                    string payloadString = Encoding.UTF8.GetString(payloadBytes);

                    var topicParts = topic.Split('/');
                    if (topicParts.Length < 3)
                    {
                        _logger.LogWarning("Invalid topic format: {Topic}", topic);
                        return;
                    }

                    // Extract device ID from the topic
                    string deviceId = topicParts[1];

                    // Deserialize payload to Dictionary<string, double>
                    var data = JsonSerializer.Deserialize<Dictionary<string, double>>(payloadString);

                    if (data == null)
                    {
                        _logger.LogWarning("Invalid payload data: {Payload}", payloadString);
                        return;
                    }

                    var sensorData = new SensorData
                    {
                        Timestamp = DateTime.UtcNow,
                        DeviceId = deviceId,
                        Data = data
                    };

                    // Store in MongoDB
                    await _sensorDataRepository.InsertAsync(sensorData);

                    // 📢 Check for alert conditions
                    var thresholds = new Dictionary<string, (double limit, string emoji, string label)>
{
    { "temperature", (100, "🔥", "Temperature too high") },
    { "humidity", (90, "💧", "Humidity level too high") },
    { "speedometer", (120, "🚗", "Overspeed detected") },
    { "accelerometer", (70, "🌀", "High vibration detected") },
    { "waterlevel", (80, "🌊", "Water level critical") }
};

                    var alerts = new List<string>();

                    foreach (var kvp in data)
                    {
                        var key = kvp.Key.ToLower(); // Normalize key
                        var value = kvp.Value;

                        if (thresholds.ContainsKey(key) && value >= thresholds[key].limit)
                        {
                            var (limit, emoji, label) = thresholds[key];
                            alerts.Add($"{emoji} {label}: {value}");
                        }
                    }

                    // 📤 Send alerts to FactoryAdmin and SuperAdmin groups
                    foreach (var alert in alerts)
                    {
                        await _hubContext.Clients.Group("FactoryAdmin").SendAsync("ReceiveAlert", alert);
                        await _hubContext.Clients.Group("SuperAdmin").SendAsync("ReceiveAlert", alert);
                    }

                    // Send real-time update to clients subscribed to this device
                    await _hubContext.Clients.Group(deviceId).SendAsync("ReceiveSensorData", sensorData);

                    // Log the message
                    _logger.LogInformation("Received message on topic {Topic}: {Payload}", message.Topic, Encoding.UTF8.GetString(message.Payload));

                    // Send real-time update via SignalR
                    //await _hubContext.Clients.All.SendAsync("ReceiveSensorData", sensorData);
                    await _hubContext.Clients.Group(deviceId).SendAsync("ReceiveSensorData", sensorData);

                    _logger.LogInformation("Received message on topic {Topic}: {Payload}", message.Topic, Encoding.UTF8.GetString(message.Payload));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to process MQTT message.");
                }
            });
        }
    }
}
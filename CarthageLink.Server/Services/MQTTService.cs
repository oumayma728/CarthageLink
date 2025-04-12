using CarthageLink.Server.Models;
using System.Text;
using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;
using System.Text.Json;
namespace CarthageLink.Server.Services
{
    public interface IMQTTService
    {
        Task ConnectAsync();
        Task PublishAsync(string topic, string payload);
        Task SubscribeAsync(string topic);
    }

    public class MQTTService : IMQTTService
    {
        private readonly ISensorDataService _sensorDataService;
        private readonly ILogger<MQTTService> _logger;
        private readonly IConfiguration _configuration;
        private readonly IMqttClient _mqttClient;
        private readonly CancellationTokenSource _cancellationTokenSource = new();

        public MQTTService(ILogger<MQTTService> logger, IConfiguration configuration, ISensorDataService sensorDataService)
        {
            _sensorDataService = sensorDataService;
           _logger = logger;
            _configuration = configuration;

            var factory = new MqttFactory();
            _mqttClient = factory.CreateMqttClient();

            _mqttClient.ConnectedAsync += async e =>
            {
                _logger.LogInformation("Successfully connected to the MQTT Broker.");
                await Task.CompletedTask; // Fix for CS1998
            };

            _mqttClient.DisconnectedAsync += async e =>
            {
                if (_cancellationTokenSource.IsCancellationRequested)
                    return; // Stop reconnect attempts if app is shutting down

                _logger.LogWarning("Disconnected from MQTT Broker. Reconnecting...");
                await Task.Delay(TimeSpan.FromSeconds(5));

                await ConnectAsync(); // Auto-reconnect in 5 seconds
            };

        }

        private string BrokerUrl => _configuration["Emqx:BrokerUrl"]!;
        private int Port => int.Parse(_configuration["Emqx:Port"]!);
        private string Username => _configuration["Emqx:Username"]!;
        private string Password => _configuration["Emqx:Password"]!;
        private string ClientId => $"{_configuration["Emqx:ClientId"]}_{GenerateRandomString(6)}";

        private static string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return new string([.. Enumerable.Repeat(chars, length).Select(s => s[new Random().Next(s.Length)])]);
        }

        public async Task ConnectAsync()
        {
            var options = new MqttClientOptionsBuilder()
                .WithTcpServer(BrokerUrl, Port)
                .WithCredentials(Username, Password)
                .WithClientId(ClientId)
                .WithCleanSession()
                .Build();

            try
            {
                await _mqttClient.ConnectAsync(options, _cancellationTokenSource.Token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to connect to the MQTT Broker.");
                throw; // Allow caller to handle the error
            }
        }

        public async Task PublishAsync(string topic, string payload)
        {

            if (!_mqttClient.IsConnected)
                await ConnectAsync(); // Ensure connection before publishing

            var message = new MqttApplicationMessageBuilder()
                .WithTopic(topic)
                .WithPayload(payload)
                .WithQualityOfServiceLevel(MqttQualityOfServiceLevel.AtLeastOnce)
                .Build();

            await _mqttClient.PublishAsync(message);
            _logger.LogInformation("Published message to topic {Topic}: {Payload}", topic, payload);
        }

        public async Task SubscribeAsync(string topic)
        {
            if (!_mqttClient.IsConnected)
                await ConnectAsync(); // Ensure connection before subscribing

            // Subscribe to the topic
            await _mqttClient.SubscribeAsync(new MqttTopicFilterBuilder().WithTopic(topic).Build());

            // Set the callback to handle messages
            _mqttClient.ApplicationMessageReceivedAsync += async e =>
            {
                var topic = e.ApplicationMessage.Topic;
                var payloadString = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);

                _logger.LogInformation(" Received message from topic {Topic} with payload: {Payload}", topic, payloadString);

                try
                {
                    var sensorData = JsonSerializer.Deserialize<SensorData>(payloadString);

                    if (sensorData != null)
                    {
                        // Ensure that sensor and value fields are populated
                        if (string.IsNullOrEmpty(sensorData.Sensor))
                        {
                            sensorData.Sensor = "Unknown Sensor"; // Set a default value if missing
                        }

                        if (sensorData.Value == 0) // Assuming 0 is an invalid value in your case
                        {
                            sensorData.Value = 0; // Set a default value if missing
                        }

                        // Add timestamp (optional: can be set as server timestamp)
                        sensorData.Timestamp = DateTime.UtcNow;

                        // Save the sensor data to the database
                        await _sensorDataService.SaveSensorDataAsync(sensorData);
                        _logger.LogInformation("Sensor data saved to database.");
                    }
                    else
                    {
                        _logger.LogWarning("Failed to deserialize payload into SensorData.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception while processing MQTT message.");
                }
            };

            _logger.LogInformation("Subscribed to topic: {Topic}", topic);
        }






    }
}

using MQTTnet;
using MQTTnet.Client;
using MQTTnet.Protocol;
using MQTTnet.Server;
using System.Text;

namespace CarthageLink.Server.Services
{
    public interface IMQTTService
    {
        Task ConnectAsync();
        Task PublishAsync(string topic, string payload);
        Task SubscribeAsync(string topic, Func<MqttApplicationMessage, Task> messageHandler);
    }

    public class MQTTService : IMQTTService
    {

        private readonly ILogger<MQTTService> _logger;
        private readonly IConfiguration _configuration;
        private readonly IMqttClient _mqttClient;
        private readonly CancellationTokenSource _cancellationTokenSource = new();
        private readonly List<(string topic, Func<MqttApplicationMessage, Task> handler)> _subscriptions = new();

        public MQTTService(ILogger<MQTTService> logger, IConfiguration configuration)
        {

            _logger = logger;
            _configuration = configuration;

            var factory = new MqttFactory();
            _mqttClient = factory.CreateMqttClient();

            // When connected to MQTT broker, log the event and resubscribe to any topics
            _mqttClient.ConnectedAsync += async e =>
            {
                _logger.LogInformation("Successfully connected to the MQTT Broker.");
                _logger.LogInformation("Re-subscribing to previously subscribed topics...");

                foreach (var (topic, handler) in _subscriptions)
                {
                    try
                    {
                        await _mqttClient.SubscribeAsync(new MqttTopicFilterBuilder().WithTopic(topic).Build());

                        _mqttClient.ApplicationMessageReceivedAsync += async msg =>
                        {
                            if (msg.ApplicationMessage.Topic == topic)
                            {
                                _logger.LogInformation("Received message from topic {Topic}: {Payload}", topic, Encoding.UTF8.GetString(msg.ApplicationMessage.Payload));
                                await handler(msg.ApplicationMessage); // Process the message
                            }
                        };

                        _logger.LogInformation("Re-subscribed to topic: {Topic}", topic);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error subscribing to topic: {Topic}", topic);
                    }
                }
                await Task.CompletedTask;
            };

            // When disconnected, log the event and attempt to reconnect
            _mqttClient.DisconnectedAsync += async e =>
            {
                if (_cancellationTokenSource.IsCancellationRequested)
                    return;

                _logger.LogWarning("Disconnected from MQTT Broker. Reconnecting...");
                await Task.Delay(TimeSpan.FromSeconds(5)); // Wait before reconnecting
                await ConnectAsync(); // Try reconnecting
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
            return new string(Enumerable.Repeat(chars, length)
                                        .Select(s => s[new Random().Next(s.Length)])
                                        .ToArray());
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

            try
            {
                await _mqttClient.PublishAsync(message);
                _logger.LogInformation("Published message to topic {Topic}: {Payload}", topic, payload);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to publish message to topic {Topic}. Payload: {Payload}", topic, payload);
            }
        }

        public async Task SubscribeAsync(string topic, Func<MqttApplicationMessage, Task> messageHandler)
        {
            _subscriptions.Add((topic, messageHandler));

            if (!_mqttClient.IsConnected)
                await ConnectAsync(); // Ensure connection before subscribing

            try
            {
                await _mqttClient.SubscribeAsync(new MqttTopicFilterBuilder().WithTopic(topic).Build());

                _mqttClient.ApplicationMessageReceivedAsync += async e =>
                {
                    _logger.LogInformation("Received message from topic {Topic}", e.ApplicationMessage.Topic);
                    await messageHandler(e.ApplicationMessage);
                };

                _logger.LogInformation("Subscribed to topic: {Topic}", topic);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to subscribe to topic {Topic}", topic);
            }
        }
    }
}

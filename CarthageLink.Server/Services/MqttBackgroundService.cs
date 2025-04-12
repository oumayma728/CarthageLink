
namespace CarthageLink.Server.Services
{
    public class MqttBackgroundService(IMQTTService mqttService, ILogger<MqttBackgroundService> logger) : BackgroundService
    {
        private readonly IMQTTService _mqttService = mqttService;
        private readonly ILogger<MqttBackgroundService> _logger = logger;

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("MQTT Background Service started.");
            await _mqttService.ConnectAsync();
        }
    }
}

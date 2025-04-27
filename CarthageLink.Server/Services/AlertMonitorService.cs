using CarthageLink.Server.Models;
using MongoDB.Driver;
using System.Xml.Linq;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace CarthageLink.Server.Services
{
    public class AlertMonitorService : BackgroundService
    {
        private readonly IMongoCollection<SensorData> _sensorDataCollection;
        private readonly IAlertService _alertService;

        public AlertMonitorService(IMongoDatabase database, IAlertService alertService)
        {
            _sensorDataCollection = database.GetCollection<SensorData>("SensorData");
            _alertService = alertService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken) //t runs when app starts
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                //It calls CheckForAlerts() every 1 minute.
                await CheckForAlerts();
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); 
            }
        }

        //This dictionary tells the service what counts as "too high" for each sensor.

        private static readonly Dictionary<SensorType, (double min, double max)> _alertThresholds = new()
{
    { SensorType.Temperature, (10, 35) },       // Example: too cold <10, too hot >35
    { SensorType.Humidity, (30, 70) },
    { SensorType.Speedometer, (0, 50) },
 { SensorType.Accelerometer, (5, 15) },  
  { SensorType.Waterlevel, (5, 20) }
};

        private bool TryParseSensorType(string key, out SensorType sensorType)
        {
            // Normalize the key: Trim and convert to PascalCase
            var normalizedKey = char.ToUpperInvariant(key[0]) + key.Substring(1).ToLowerInvariant();

            return Enum.TryParse(normalizedKey, out sensorType);
        }


        private async Task CheckForAlerts()
        {
            var recentData = await _sensorDataCollection
                .Find(d => d.Timestamp > DateTime.UtcNow.AddMinutes(-1))
                .ToListAsync();
            //Each data represents a device's sensor readings.
            foreach (var data in recentData)


            {//Each sensor (like temperature, humidity) is a key-value pair:
             //kvp.Key → name of the sensor
             //kvp.Value → the reading(number)
                foreach (var kvp in data.Data)
                {
                    if (TryParseSensorType(kvp.Key, out SensorType sensorType))
                    {
                        if (_alertThresholds.TryGetValue(sensorType, out var range))
                        {
                            if (kvp.Value < range.min)
                            {
                                await _alertService.CreateAndSendAlertAsync(
                                    data.DeviceId,
                                    sensorType,
                                    $"{sensorType} value is too LOW! ({kvp.Value})",
                                    kvp.Value);
                            }
                            else if (kvp.Value > range.max)
                            {
                                await _alertService.CreateAndSendAlertAsync(
                                    data.DeviceId,
                                    sensorType,
                                    $"{sensorType} value is too HIGH! ({kvp.Value})",
                                    kvp.Value);
                            }
                        }


                    }

                }
            }
        }
    }
}
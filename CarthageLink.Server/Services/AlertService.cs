using CarthageLink.Server.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using System;
using System.Threading.Tasks;

namespace CarthageLink.Server.Services
{
   

    public interface IAlertService
    {
        Task CreateAndSendAlertAsync(string deviceId, SensorType sensorType, string message, double value);
        Task<List<Alert>> GetAlertsBetweenAsync(DateTime startDate, DateTime endDate);
    }

    public class AlertService : IAlertService
    {
        private readonly IMongoCollection<Alert> _alertsCollection;

        public AlertService(IMongoDatabase database)
        {
            _alertsCollection = database.GetCollection<Alert>("Alerts");
        }

        public async Task CreateAndSendAlertAsync(string deviceId, SensorType sensorType, string message, double value)
        {
            var alert = new Alert
            {
                DeviceId = deviceId,
                SensorType = sensorType,
                Message = message,
                Value = value,
                Timestamp = DateTime.UtcNow
            };

            // Save to MongoDB
            await _alertsCollection.InsertOneAsync(alert);

            // Optionally: send real-time alert via SignalR or email
            Console.WriteLine($"[ALERT] {sensorType} | Device: {deviceId} | {message} | Value: {value}");

        }
        public async Task<List<Alert>> GetAlertsBetweenAsync(DateTime startDate, DateTime endDate)
        {
            var filter = Builders<Alert>.Filter.And(
                Builders<Alert>.Filter.Gte(a => a.Timestamp, startDate),
                Builders<Alert>.Filter.Lte(a => a.Timestamp, endDate)
            );

            return await _alertsCollection.Find(filter).ToListAsync();
        }

    }
}

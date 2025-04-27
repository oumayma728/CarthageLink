using MongoDB.Bson;

namespace CarthageLink.Server.Models
{
    public class Alert
    {
        public ObjectId Id { get; set; }
        public string DeviceId { get; set; } = string.Empty;
        public SensorType SensorType { get; set; }
        public string Message { get; set; } = string.Empty;
        public double Value { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}

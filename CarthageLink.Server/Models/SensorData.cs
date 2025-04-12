using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace CarthageLink.Server.Models
{
    public class SensorData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] // This is fine for the Id
        public string? Id { get; set; }

        [BsonElement("deviceId")]
        public string DeviceId { get; set; } = string.Empty;

        [BsonElement("sensor")]
        public string Sensor { get; set; } = string.Empty; // Match the "sensor" field in the payload

        [BsonElement("value")]
        public double Value { get; set; } // Match the "value" field in the payload

        [BsonElement("timestamp")]
        public DateTime Timestamp { get; set; }
    }
}

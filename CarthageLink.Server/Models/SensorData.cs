using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace CarthageLink.Server.Models
{
    public enum SensorType
    {
        Temperature = 0,    // °C
        Humidity = 1,       // %
        Speedometer = 2,    // km/h
        Accelerometer = 3,  // m/s²
        Waterlevel = 4,     // cm
        System = 5          // System alerts
    }


    public class SensorData
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("timestamp")]
        //[BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [BsonElement("deviceId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string DeviceId { get; set; } = string.Empty;

        [BsonElement("data")]
        public Dictionary<string, double> Data { get; set; } = new Dictionary<string, double>();
        public SensorType SensorType { get; set; } 

    }
}

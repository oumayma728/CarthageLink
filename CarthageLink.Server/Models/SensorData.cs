using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace CarthageLink.Server.Models
{
    public enum SensorType
    {
        Temperature,
        Humidity,
        Speedometer,
        Accelerometer,
        Waterlevel
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

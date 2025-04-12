using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CarthageLink.Server.Models
{
    public class Device
    {
        public enum DeviceStatus
        {
            Active,
            Inactive,
            Maintenance
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("Name")]
        public string? Name { get; set; }

        [BsonElement("MacAddress")]
        public string? MacAddress { get; set; }

        [BsonElement("Status")]
        public string? Status { get; set; }

        [BsonElement("sensor")]
        public string Sensor { get; set; } = string.Empty; // Match the "sensor" field in the payload

        [BsonElement("value")]
        public string Value { get; set; } = string.Empty;// Match the "value" field in the payload

        [BsonElement("FactoryId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? FactoryId { get; set; }

        [BsonElement("AssignedUsers")]
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string>? AssignedUsers { get; set; }

        [BsonElement("LastConnected")]
        public DateTime? LastConnected { get; set; } = DateTime.UtcNow;
    }
}

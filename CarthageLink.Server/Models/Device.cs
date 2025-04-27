using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CarthageLink.Server.Models
{
    public enum DeviceStatus
    {
        Active,
        Inactive,
        Maintenance
    }
    public class Location
    {
        [BsonElement("latitude")]
        public double Latitude { get; set; }

        [BsonElement("longitude")]
        public double Longitude { get; set; }
    }

    public class Device
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("Name")]
        public string? Name { get; set; }

        [BsonElement("MacAddress")]
        public string? MacAddress { get; set; }

        [BsonElement("Status")]
        [BsonRepresentation(BsonType.String)] // Stores enum as string
        public DeviceStatus Status { get; set; }

        [BsonElement("FactoryId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? FactoryId { get; set; }

        [BsonElement("AssignedUsers")]
        [BsonRepresentation(BsonType.ObjectId)]
        public List<string>? AssignedUsers { get; set; }

        [BsonElement("LastConnected")]
        public DateTime? LastConnected { get; set; } = DateTime.UtcNow;

        [BsonElement("location")]
        public Location? Location { get; set; }
    }
}
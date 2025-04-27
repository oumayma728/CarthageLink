using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CarthageLink.Server.Models
{
    public class Factory
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("Name")]
        public required string Name { get; set; }

        [BsonElement("Description")]
        public required string Description { get; set; }

        [BsonElement("TaxNumber")]
        public required string TaxNumber { get; set; }

        [BsonElement("Location")]
        public required string Location { get; set; } 

        [BsonElement("FactoryEmail")]
        public required string FactoryEmail { get; set; }

        public string? FactoryAdminId { get; set; }

        [BsonElement("assignedDevices")]
        public List<string>? AssignedDevices { get; set; }

        [BsonElement("licenseKey")]
        public string? LicenseKey { get; set; }

        [BsonElement("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

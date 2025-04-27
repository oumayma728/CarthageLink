using System.ComponentModel.DataAnnotations;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace CarthageLink.Server.Models
{
    public enum LicenseStatus
    {
        Active,
        Expired,
        Suspended,
        Pending
    }
    public class License
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ? Id { get; set; }
        [Required]
        [BsonElement("key")]
        public string ?Key { get; set; }

        [BsonElement("assignedTo")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? AssignedTo { get; set; }

        [BsonElement("factoryId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? FactoryId { get; set; }

        [BsonElement("UserId")]

        public string? UserId { get; set; }
        [BsonElement("devices")]
        public List<string> Devices { get; set; } = new List<string>();
        [BsonElement("userRole")]
        public UserRole UserRole { get; set; }
        [BsonElement("status")]
        public LicenseStatus Status { get; set; }
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }

        [BsonElement("expiresAt")]
        public DateTime? ExpiresAt { get; set; } // Nullable

    }
}

using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CarthageLink.Server.Models
{
    public enum UserRole
    {
        SuperAdmin =0,
        FactoryAdmin=1,
        Operator=2
    }
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonElement("Name")]
        public string? Name { get; set; }
        [BsonElement("email")]
        public string? Email { get; set; } 

        [BsonElement("phone")]
        [RegularExpression(@"^\+216\d{8}$", ErrorMessage = "Phone number must be in the format +216 12345678.")]
        public string? Phone { get; set; }

        [BsonElement("password")]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$",
        ErrorMessage = "Password must be at least 8 characters long ")]
        public string ?Password { get; set; } 

        [BsonElement("role")]
        [BsonRepresentation(BsonType.String)]
        public UserRole? Role { get; set;}
        [BsonElement("factoryId")]
        [BsonRepresentation(BsonType.ObjectId)]

       
        public string? FactoryId { get; set; }

        [BsonElement("assignedDevices")]
        public List<string>? AssignedDevices { get; set; }

        [BsonElement("LicenseKey")]
        public string? LicenseKey { get; set; }
        [BsonElement("factoryname")]
        public string? FactoryName { get; set; }
        [BsonElement("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}

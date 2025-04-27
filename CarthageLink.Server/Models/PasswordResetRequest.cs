using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CarthageLink.Server.Models
{
    public class PasswordResetRequest
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string? Email { get; set; }
        public string? Token { get; set; }
        public DateTime Expiration { get; set; }
        public bool IsUsed { get; set; }
    }
}

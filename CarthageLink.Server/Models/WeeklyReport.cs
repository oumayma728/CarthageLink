using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace CarthageLink.Server.Models
{
    public class WeeklyReport
    {
        [BsonId] // This attribute tells MongoDB to use this property for the _id field
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } // Add the _id property (Id)
        public string DeviceId { get; set; }  // <-- make sure this exists

        [JsonPropertyName("startDate")]
        public DateTime StartDate { get; set; }
        [JsonPropertyName("endDate")]
        public DateTime EndDate { get; set; }

        [JsonPropertyName("totalSensorDataPoints")]
        public int TotalSensorDataPoints { get; set; }

        [JsonPropertyName("totalAlerts")]
        public int TotalAlerts { get; set; }

        [JsonPropertyName("mostCommonAlertType")]
        public string MostCommonAlertType { get; set; }

        [JsonPropertyName("averageSensorValues")]
        public Dictionary<string, double> AverageSensorValues { get; set; }

    }
}

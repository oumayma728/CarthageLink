using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace CarthageLink.Server.Models
{
    public class WeeklyReport
    {
        [BsonId] // This attribute tells MongoDB to use this property for the _id field
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } // Add the _id property (Id)
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TotalSensorDataPoints { get; set; }
        public int TotalAlerts { get; set; }
        public string MostCommonAlertType { get; set; }
        public Dictionary<string, double> AverageSensorValues { get; set; } = new();
    }

}

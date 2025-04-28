namespace CarthageLink.Server.Models
{
    public class IssueReport
    { public string Id { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public string Reporter { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;


    }
}

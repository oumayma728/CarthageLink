using CarthageLink.Server.Services;
using Microsoft.AspNetCore.SignalR;
using CarthageLink.Server.Models;

namespace CarthageLink.Server.Hubs
{
    public class AlertHub : Hub
    {
        // Example method to send alerts
        public async Task SendAlert(Alert alert)
        {
            await Clients.All.SendAsync("ReceiveAlert", alert);
        }
        public async Task ReportIssue(IssueReport issue)
        {
            // Save to database if needed
            // Then broadcast as an alert
            var alert = new Alert
            {
                DeviceId = "System",
                SensorType = 0, // Special type for issues
                Message = $"{issue.Type} reported: {issue.Description}",
                Timestamp = DateTime.UtcNow,
                //Severity = "High"
            };

            await Clients.All.SendAsync("ReceiveAlert", alert);
        }
    }

}

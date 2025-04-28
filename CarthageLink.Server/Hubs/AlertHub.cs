using CarthageLink.Server.Models;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace CarthageLink.Server.Hubs
{
    public class AlertHub : Hub
    {
        private readonly IReportService _reportService;

        public AlertHub(IReportService reportService)
        {
            _reportService = reportService;
        }

        public async Task SendAlert(Alert alert)
        {
            await Clients.All.SendAsync("ReceiveAlert", alert);
        }

        public async Task ReportIssue(IssueReport issue)
        {
            // Save the issue
            await _reportService.SaveIssueReportAsync(issue);

            // Broadcast as an alert using your existing model
            var alert = new Alert
            {
                DeviceId = "System",
                SensorType = 0, // Special type for issues
                Message = $"{issue.Type}: {issue.Description}",
                Value = 0, // Default value for issues
                Timestamp = DateTime.UtcNow
                // SensorName and Severity are optional
            };

            await Clients.All.SendAsync("ReceiveAlert", alert);
        }
    }
}
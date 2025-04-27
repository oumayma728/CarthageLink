// IssuesController.cs
using CarthageLink.Server.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

[ApiController]
[Route("api/[controller]")]
public class IssuesController : ControllerBase
{
    private readonly IHubContext<AlertHub> _hubContext;

    public IssuesController(IHubContext<AlertHub> hubContext)
    {
        _hubContext = hubContext;
    }

    [HttpPost]
    public async Task<IActionResult> ReportIssue([FromBody] IssueReport issue)
    {
        // Save to database if needed

        // Broadcast via SignalR
        await _hubContext.Clients.All.SendAsync("ReceiveAlert", new
        {
            DeviceId = "System",
            SensorType = 0,
            SensorName = "System Issue",
            Value = issue.Type,
            Message = $"{issue.Type}: {issue.Description}",
            Timestamp = DateTime.UtcNow,
            Severity = "High"
        });

        return Ok();
    }
}

public class IssueReport
{
    public string Type { get; set; }
    public string Description { get; set; }
    public string Reporter { get; set; }
}
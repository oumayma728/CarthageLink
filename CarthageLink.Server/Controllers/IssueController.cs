using CarthageLink.Server.Hubs;
using CarthageLink.Server.Models;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class IssuesController : ControllerBase
{
    private readonly IHubContext<AlertHub> _hubContext;
    private readonly IReportService _reportService;

    public IssuesController(
        IHubContext<AlertHub> hubContext,
        IReportService reportService)
    {
        _hubContext = hubContext;
        _reportService = reportService;
    }

    [HttpPost]
    public async Task<IActionResult> ReportIssue([FromBody] IssueReport issue)
    {
        try
        {
            // Save the issue
            var success = await _reportService.SaveIssueReportAsync(issue);
            if (!success)
            {
                return BadRequest("Invalid issue data");
            }

            // Broadcast via SignalR using your existing Alert model
            await _hubContext.Clients.All.SendAsync("ReceiveAlert", new Alert
            {
                DeviceId = "System",
                SensorType = 0, // Special type for issues
                Message = $"{issue.Type}: {issue.Description}",
                Value = 0, // Default value for issues
                Timestamp = DateTime.UtcNow
                // SensorName and Severity are optional
            });

            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentIssues([FromQuery] int count = 10)
    {
        try
        {
            var issues = await _reportService.GetRecentIssuesAsync(count);
            return Ok(issues);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }
}
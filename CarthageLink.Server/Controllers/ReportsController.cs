using CarthageLink.Server.DTO;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportsController(IReportService reportService)
    {
        _reportService = reportService;
    }

    [HttpPost("generate")]
    public async Task<IActionResult> GenerateReport([FromBody] ReportRequestDto request)
    {
        var report = await _reportService.GenerateReportForPeriodAsync(request.StartDate, request.EndDate);
        await _reportService.SaveWeeklyReportAsync(report);
        return Ok(report);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllReports()
    {
        var reports = await _reportService.GetAllReportsAsync();
        return Ok(reports);
    }
}

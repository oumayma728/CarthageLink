using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using System.Collections.Concurrent;

namespace CarthageLink.Server.Services
{
    public interface IReportService
    {
        Task<WeeklyReport> GenerateReportForPeriodAsync(DateTime startDate, DateTime endDate);
        Task SaveWeeklyReportAsync(WeeklyReport report);
        Task<List<WeeklyReport>> GetAllReportsAsync();
        Task<List<WeeklyReport>> GetReportsByDeviceIdAsync(string deviceId);
        Task<WeeklyReport> GetReportByIdAsync(string id);
        Task<bool> SaveIssueReportAsync(IssueReport issue);
        Task<List<IssueReport>> GetRecentIssuesAsync(int count = 10);
    }


    public class ReportService : IReportService
    {
        private readonly ISensorDataRepository _sensorDataRepository;
        private readonly IAlertService _alertService;
        private readonly IReportRepository _ReportRepository;

        public ReportService(
            ISensorDataRepository sensorDataRepository,
            IAlertService alertService,
            IReportRepository reportRepository)
        {
            _sensorDataRepository = sensorDataRepository;
            _alertService = alertService;
            _ReportRepository = reportRepository;
        }
        private static readonly ConcurrentDictionary<string, IssueReport> _issueReports = new();
        private static readonly object _lock = new();
        public async Task<bool> SaveIssueReportAsync(IssueReport issue)
        {
            try
            {
                // Basic validation
                if (string.IsNullOrWhiteSpace(issue.Type) ||
                    string.IsNullOrWhiteSpace(issue.Description))
                {
                    return false;
                }

                // Set additional properties
                issue.Id = Guid.NewGuid().ToString();
                issue.Timestamp = DateTime.UtcNow;

                // Add to in-memory store
                lock (_lock)
                {
                    _issueReports.TryAdd(issue.Id, issue);
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<IssueReport>> GetRecentIssuesAsync(int count = 10)
        {
            return _issueReports.Values
                .OrderByDescending(x => x.Timestamp)
                .Take(count)
                .ToList();
        }
        public async Task<WeeklyReport> GenerateReportForPeriodAsync(DateTime startDate, DateTime endDate)
        {
            if (endDate < startDate)
            {
                throw new ArgumentException("End date must be after start date");
            }

            var sensorData = await _sensorDataRepository.GetDataBetweenAsync(startDate, endDate);
            var alerts = await _alertService.GetAlertsBetweenAsync(startDate, endDate);

            sensorData ??= new List<SensorData>();
            alerts ??= new List<Alert>();

            // Ensure that if data is not available, we still return an empty report
            var report = new WeeklyReport
            {
                StartDate = startDate,
                EndDate = endDate,
                TotalSensorDataPoints = sensorData.Count,
                TotalAlerts = alerts.Count,
                MostCommonAlertType = alerts
                    .GroupBy(a => a.SensorType)
                    .OrderByDescending(g => g.Count())
                    .FirstOrDefault()?.Key.ToString() ?? "None",
                AverageSensorValues = sensorData
                    .Where(d => d?.Data != null && d.Data.Any()) // Ensure Data exists and contains entries
                    .GroupBy(d => d.SensorType)
                    .ToDictionary(
                        g => g.Key.ToString(),
                        g => g.Average(d => d.Data.ContainsKey(g.Key.ToString()) ? d.Data[g.Key.ToString()] : 0.0)
                    )
            };

            return report;
        }




        public async Task SaveWeeklyReportAsync(WeeklyReport report)
        {
            await _ReportRepository.InsertAsync(report);
        }

        public async Task<List<WeeklyReport>> GetAllReportsAsync()
        {
            return await _ReportRepository.GetAllAsync();
        }
        public async Task<List<WeeklyReport>> GetReportsByDeviceIdAsync(string deviceId)

        {
            return await _ReportRepository.GetReportsByDeviceIdAsync(deviceId);
        }
        public async Task<WeeklyReport> GetReportByIdAsync(string id)
        {
            return await _ReportRepository.GetReportByIdAsync(id);
        }



    }
}

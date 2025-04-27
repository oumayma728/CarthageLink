using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;

namespace CarthageLink.Server.Services
{
    public interface IReportService
    {
        Task<WeeklyReport> GenerateReportForPeriodAsync(DateTime startDate, DateTime endDate);
        Task SaveWeeklyReportAsync(WeeklyReport report);
        Task<List<WeeklyReport>> GetAllReportsAsync();
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

        public async Task<WeeklyReport> GenerateReportForPeriodAsync(DateTime startDate, DateTime endDate)
        {
            var sensorData = await _sensorDataRepository.GetDataBetweenAsync(startDate, endDate);
            var alerts = await _alertService.GetAlertsBetweenAsync(startDate, endDate);

            var report = new WeeklyReport
            {
                StartDate = startDate,
                EndDate = endDate,
                TotalSensorDataPoints = sensorData.Count(),
                TotalAlerts = alerts.Count(),
                MostCommonAlertType = alerts
         .GroupBy(a => a.SensorType)
         .OrderByDescending(g => g.Count())
         .FirstOrDefault()?.Key.ToString() ?? "None",
                AverageSensorValues = sensorData
         .GroupBy(d => d.SensorType)
         .ToDictionary(
             g => g.Key.ToString(),
             g => g.Average(d => d.Data.ContainsKey(g.Key.ToString()) ? d.Data[g.Key.ToString()] : 0.0) // Access the value from the Data dictionary
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
    }


}

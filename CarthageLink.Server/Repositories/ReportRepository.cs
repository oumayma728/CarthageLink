using CarthageLink.Server.Models;
using MongoDB.Driver;

namespace CarthageLink.Server.Repositories
{
    public interface IReportRepository
    {
        Task InsertAsync(WeeklyReport report);
        Task<List<WeeklyReport>> GetAllAsync();
    }
    public class ReportRepository : IReportRepository
    {
        private readonly IMongoCollection<WeeklyReport> _report;

        public ReportRepository(IMongoDatabase database)
        {
            _report = database.GetCollection<WeeklyReport>("WeeklyReports");
        }

        public async Task InsertAsync(WeeklyReport report)
        {
            await _report.InsertOneAsync(report);
        }

        public async Task<List<WeeklyReport>> GetAllAsync()
        {
            return await _report.Find(_ => true).ToListAsync();
        }
    }

}

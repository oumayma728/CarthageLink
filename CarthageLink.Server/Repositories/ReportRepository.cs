using CarthageLink.Server.Models;
using MongoDB.Driver;
using System.Threading.Tasks;

namespace CarthageLink.Server.Repositories
{
    public interface IReportRepository
    {
        Task InsertAsync(WeeklyReport report);
        Task<List<WeeklyReport>> GetAllAsync();
        Task<List<WeeklyReport>> GetReportsByDeviceIdAsync(string deviceId);
        Task<WeeklyReport> GetReportByIdAsync(string id);

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
        public async Task<List<WeeklyReport>> GetReportsByDeviceIdAsync(string deviceId)
        {
            var filter = Builders<WeeklyReport>.Filter.Eq(r => r.DeviceId, deviceId);
            return await _report.Find(filter).ToListAsync();
        }
        public async Task<WeeklyReport> GetReportByIdAsync(string id)
        {
            var filter = Builders<WeeklyReport>.Filter.Eq(r => r.Id, id);
            return await _report.Find(filter).FirstOrDefaultAsync();
        }



    }

}

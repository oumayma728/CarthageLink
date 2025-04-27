using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;

namespace CarthageLink.Server.Services
{
    public interface IInsightsService
    {
        Task<List<Object>> GetInsights();
        Task<Object> GetFactoryInsight(string factoryId);
    }

    public class InsightsService(IFactoryRepository _factoryRepository, IUserRepository _userRepository, IDeviceRepository _deviceRepository) : IInsightsService
    {
        public async Task<List<Object>> GetInsights()
        {
            var factories = await _factoryRepository.GetAllFactoriesAsync();
            var insights = new List<Object>();
            foreach (var factory in factories)
            {
                var devices = await _deviceRepository.GetByFactoryIdAsync(factory.Id!);
                var users = await _userRepository.GetUserByFactoryIdAsync(factory.Id!);
                insights.Add(new
                {
                    FactoryId = factory.Id,
                    FactoryName = factory.Name,
                    DeviceCount = devices.Count(),
                    UserCount = users.Count
                });
            }
            return insights;
        }

        public async Task<Object> GetFactoryInsight(string factoryId)
        {
            var users = await _userRepository.GetUserByFactoryIdAsync(factoryId);
            var devices = await _deviceRepository.GetByFactoryIdAsync(factoryId);

            return new
            {
                Users = users,
                Devices = devices
            };
        }
    }

}
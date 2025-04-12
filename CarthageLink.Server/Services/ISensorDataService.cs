using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CarthageLink.Server.Services
{
    public interface ISensorDataService
    {
        Task SaveSensorDataAsync(SensorData data);
        Task<List<SensorData>> GetRecentDataAsync(string deviceId);
    }

    public class SensorDataService : ISensorDataService
    {
        private readonly ISensorDataRepository _repository;
        private readonly ILogger<SensorDataService> _logger;

        public SensorDataService(
            ISensorDataRepository repository,
            ILogger<SensorDataService> logger)
        {
            _repository = repository;
            _logger = logger;
        }

        public async Task SaveSensorDataAsync(SensorData data)
        {
            try
            {
                await _repository.CreateAsync(data);
                _logger.LogInformation("Sensor data saved: {Data}", data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving sensor data.");
                throw;
            }
        }

        public async Task<List<SensorData>> GetRecentDataAsync(string deviceId)
        {
            try
            {
                return await _repository.GetByDeviceIdAsync(deviceId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching sensor data for device {DeviceId}", deviceId);
                throw;
            }
        }
    }
}

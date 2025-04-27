using CarthageLink.Server.Data;
using CarthageLink.Server.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Runtime.InteropServices;
using System.Security.Cryptography.X509Certificates;

namespace CarthageLink.Server.Repositories
{
    public interface IDeviceRepository
    {
        Task<IEnumerable<Device>> GetAllDevicesAsync();
        Task UpdateDeviceAsync(Device updatedDevice);
        Task CreateDeviceAsync(Device device);
        Task DeleteDeviceAsync(string deviceId);
        Task<Device> GetDeviceByIdAsync(string deviceId);
        Task<List<Device>> GetByFactoryIdAsync(string factoryId);       
        public class DeviceRepository : IDeviceRepository
        {
            private readonly IMongoCollection<Device> _device;
            private readonly IMongoCollection<Models.License> _Licence;

            //Constructor
            public DeviceRepository(IOptions<DatabaseSettings> settings)
            {
                var mongoClient = new MongoClient(settings.Value.Connection);
                var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
                _device = database.GetCollection<Device>("Devices");

            }

            public async Task<IEnumerable<Device>> GetAllDevicesAsync()
            {
                return await _device.Find(factory => true).ToListAsync();//Find all users and converts the result to a list

            }
            public async Task<List<Device>> GetByFactoryIdAsync(string factoryId)
            {
                return await _device.Find(d => d.FactoryId == factoryId).ToListAsync();
            }


            public async Task<Device> GetDeviceByIdAsync(string deviceId)
            {
                return await _device.Find(d => d.Id == deviceId).FirstOrDefaultAsync();
            }
            
            public async Task CreateDeviceAsync(Device device)
            {
                await _device.InsertOneAsync(device);
            }
            public async Task UpdateDeviceAsync(Device updatedDevice)
            {
                var filter = Builders<Device>.Filter.Eq(d => d.Id, updatedDevice.Id); // Creates a filter to find the user by their ID

                var update = Builders<Device>.Update
                    .Set(d => d.Name, updatedDevice.Name)
                    .Set(d => d.MacAddress, updatedDevice.MacAddress)
                    .Set(d => d.Status, updatedDevice.Status)
                    .Set(d => d.AssignedUsers, updatedDevice.AssignedUsers);

                // Perform the update
                await _device.UpdateOneAsync(filter, update);

                // Fetch and return the updated device
                await _device.Find(d => d.Id == updatedDevice.Id).FirstOrDefaultAsync();
            }

            public async Task DeleteDeviceAsync(string deviceId)
            {
                var filter = Builders<Device>.Filter.Eq(d => d.Id, deviceId);

                await _device.DeleteOneAsync(deviceId);

            }

        }
    }
}

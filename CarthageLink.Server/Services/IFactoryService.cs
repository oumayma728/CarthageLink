using System.Security.Claims;
using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarthageLink.Server.Services
{
    public interface IFactoryService
    {

        Task  <string> CreateFactoryAsync(Factory factory);
        // Get all Factories
        Task<IEnumerable<Factory>> GetAllFactoriesAsync(); // returns collection (IEnumerable<User>) of User objects.
        Task<IEnumerable<Device>> GetFactoryDevicesAsync(string factoryId);

        // Get factory by Id
        Task<Factory?> GetFactoryByIdAsync(string id);
        Task<Factory?> GetFactoryByTaxNumberAsync(string number);
        Task<Factory?> GetFactoryByAdminIdAsync(string adminId);
        // Update factory
        Task UpdateFactoryAsync(Factory factory);
        Task UpdateFactoryAdminIdAsync(string factoryId, string adminId);

        // Delete factory
        Task<bool> DeleteFactoryAsync(string id);
        Task<IEnumerable<User>> GetFactoryUsersAsync(string factoryId);
    }
    // The UserService class implements IUserService
    public class FactoryService : IFactoryService
    {
        private readonly IFactoryRepository _factoryRepository;
        private readonly IDeviceRepository _deviceRepository;
        private readonly IUserRepository _userRepository;

        public FactoryService(IFactoryRepository factoryRepository, IDeviceRepository deviceRepository , IUserRepository  userRepository) 
        {
            _factoryRepository = factoryRepository;
            _deviceRepository = deviceRepository;
            _userRepository = userRepository;
        }
        private string GenerateLicenseKey()
        {
            return Guid.NewGuid().ToString("N").ToUpper(); // Generates a random 32-character key
        }

        // Create a list to hold User objects, and it can only be set once
        //private readonly List<Factory> _Factory = new List<Factory>();

        // Create Factory
        public async Task<string> CreateFactoryAsync(Factory factory)
        {
            // Generate a license key (you can customize this method to your needs)
            string licenseKey = GenerateLicenseKey();
            factory.LicenseKey = licenseKey;  // Assign generated key to the factory

            // Register the factory (passing the factory and the generated key)
            await _factoryRepository.RegisterFactoryAsync(factory, licenseKey);


            // Return the generated license key
            return licenseKey;
        }

        // Get All Factories
        public async Task<IEnumerable<Factory>> GetAllFactoriesAsync()
        {
            var factories = await _factoryRepository.GetAllFactoriesAsync();

            // Convert to a List to use Count
            var factoryList = factories.ToList();

            if (factoryList.Count == 0)
                throw new Exception("No factories found.");

            return factoryList;
        }


        // Get Factory by ID
        public async Task<Factory?> GetFactoryByIdAsync(string id)
        {
            return await _factoryRepository.GetFactoryByIdAsync(id)
           ?? throw new Exception("Factory not found.");

        }
        public async Task<Factory?> GetFactoryByTaxNumberAsync(string number)
        {
            return await _factoryRepository.GetFactoryByTaxNumberAsync(number);
        }
        // Update Factory
        public async Task UpdateFactoryAsync(Factory updateFactory)
        {
            // Validate if user exists
            var existingFactory = await _factoryRepository.GetFactoryByIdAsync(updateFactory.Id) 
                ?? throw new Exception("Factory not found.");

            // Update the user
            await _factoryRepository.UpdateFactoryAsync(updateFactory);
        }



        // Delete User
        public async Task<bool> DeleteFactoryAsync(string id)
        {
            var Factory = await _factoryRepository.GetFactoryByIdAsync(id);
            if (Factory == null)
            {
                return false;
            }

            await _factoryRepository.DeleteFactoryAsync(id);
            return true;
        }
        public async Task<Factory?> GetFactoryByAdminIdAsync(string adminId)
        {
            if (string.IsNullOrEmpty(adminId))
            {
                return null;
            }

            // Fetch the factory where AdminId matches the given adminId
            return await _factoryRepository.GetFactoryByAdminIdAsync(adminId);
        }
        public async Task<IEnumerable<Device>> GetFactoryDevicesAsync(string factoryId)
        {
            if (string.IsNullOrEmpty(factoryId))
            {
                return []; // Return empty list if factory ID is invalid.
            }

            return await _deviceRepository.GetByFactoryIdAsync(factoryId);
        }
        public async Task<IEnumerable<User>> GetFactoryUsersAsync(string factoryId)
        {
            if (string.IsNullOrEmpty(factoryId))
            {
                return []; // Return empty list if factory ID is invalid.
            }

            return await _userRepository.GetAllFactoryUsersAsync(factoryId);
        }

        public async Task UpdateFactoryAdminIdAsync(string factoryId, string adminId)
        {
            await _factoryRepository.UpdateFactoryAdminIdAsync(factoryId, adminId);
        }


    }
}

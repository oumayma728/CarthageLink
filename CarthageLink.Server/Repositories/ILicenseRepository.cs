using System.ComponentModel;
using CarthageLink.Server.Data;
using CarthageLink.Server.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using License = CarthageLink.Server.Models.License;

namespace CarthageLink.Server.Repositories
{
    public interface ILicenseRepository
    {
        Task CreateLicenseAsync(License license);
        Task<License> GetLicenseByKeyAsync(string licenseKey);
        Task<License> GetByIdAsync(string id);
        Task<IEnumerable<License>> GetAllLicensesAsync();
        Task UpdateStatusAsync(string id, LicenseStatus status);
        //Task<License> UpdateAsync(String id, Dictionary<string, object> updateFields);
        Task DeleteAsync(string id);
        Task<IEnumerable<License>> GetLicensesByFactoryIdAsync(string factoryId);

        Task<License?> UpdateLicenseAsync(string id, License updatedLicense);
        public class LicenseRepository : ILicenseRepository
        {
            private readonly IMongoCollection<Models.License> _license;

            //Constructor
            public LicenseRepository(IOptions<DatabaseSettings> settings)
            {
                var mongoClient = new MongoClient(settings.Value.Connection);
                var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
                _license = database.GetCollection<License>("License");

            }
            public async Task CreateLicenseAsync(License license)
            {
                await _license.InsertOneAsync(license);


            }
            public async Task<License> GetLicenseByKeyAsync(string licenseKey)
            {
                return await _license.Find(l => l.Key == licenseKey).FirstOrDefaultAsync();
            }
            public async Task<License> GetByIdAsync(string id)
            {
                return await _license.Find(l => l.Id == id).FirstOrDefaultAsync();
            }
            public async Task<IEnumerable<License>> GetAllLicensesAsync()
            {
                return await _license.Find(Builders<License>.Filter.Empty).ToListAsync();
            }
            public async Task UpdateStatusAsync(string id, LicenseStatus status)
            {
                var filter = Builders<License>.Filter.Eq(l => l.Id, id);
                var update = Builders<License>.Update.Set(l => l.Status, status);

                await _license.UpdateOneAsync(filter, update);
            }
            public async Task<IEnumerable<License>> GetLicensesByFactoryIdAsync(string factoryId)
            {
                var filter = Builders<License>.Filter.Eq(l => l.FactoryId, factoryId);
                return await _license.Find(filter).ToListAsync();
            }

            public async Task<License?> UpdateLicenseAsync(string id, License updatedLicense)
            {
                var filter = Builders<License>.Filter.Eq(l => l.Id, id);
                var options = new FindOneAndReplaceOptions<License>
                {
                    ReturnDocument = ReturnDocument.After
                };

                return await _license.FindOneAndReplaceAsync(filter, updatedLicense, options);
            }

            public async Task DeleteAsync(string id)
            {
                await _license.DeleteOneAsync(l => l.Id == id);
            }

        } } }

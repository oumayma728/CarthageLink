using CarthageLink.Server.Data;
using CarthageLink.Server.Models;
using DnsClient.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Bson;

using MongoDB.Driver;
namespace CarthageLink.Server.Data
{
    public class MongoDbContext
    {
        private readonly MongoClient _client;
        private readonly IMongoDatabase _database;
        private readonly ILogger<MongoDbContext> _logger;
        private readonly DatabaseSettings _databaseSettings;


public MongoDbContext(IOptions<DatabaseSettings> databaseSettings, ILogger<MongoDbContext> logger)
    {
        _logger = logger;
        _databaseSettings = databaseSettings.Value;

        var connectionString = _databaseSettings.Connection;
        var databaseName = _databaseSettings.DatabaseName;

        _client = new MongoClient(connectionString);
        _database = _client.GetDatabase(databaseName);
    }


    // MongoDB collections
    public IMongoCollection<User> User => _database.GetCollection<User>("User");
        public IMongoCollection<Factory> Factory => _database.GetCollection<Factory>("Factory");
        public IMongoCollection<Device> Device => _database.GetCollection<Device>("Device");
        public IMongoCollection<License> License => _database.GetCollection<License>("License");
        public IMongoCollection<SensorData> SensorData => _database.GetCollection<SensorData>("SensorData");

    }
}

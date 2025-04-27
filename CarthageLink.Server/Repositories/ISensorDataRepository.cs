using CarthageLink.Server.Data;
using CarthageLink.Server.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace CarthageLink.Server.Repositories
{
    public interface ISensorDataRepository
    {
        Task <string> InsertAsync(SensorData sensorData);
        Task<List<SensorData>> GetAllAsync();
        Task<SensorData?> GetByIdAsync(string id);
        Task DeleteAsync(string id);
        Task<List<SensorData>> GetByDeviceIdAsync(string deviceId);
        Task<List<SensorFieldData>> GetbyFieldAndDeviceIdAsync(string deviceId, string field, int limit);
        Task<SensorData> GetLatestByDeviceId(string deviceId);
        Task<bool> TestConnectionAsync();
        Task<List<SensorData>> GetDataBetweenAsync(DateTime startDate, DateTime endDate);
        Task<bool> HasAccelerometerDataAsync(string deviceId);

    }

    public class SensorDataRepository : ISensorDataRepository
    {
        private readonly IMongoCollection<SensorData> _sensorData;

        //Constructor
        public SensorDataRepository(IOptions<DatabaseSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.Connection);
            var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _sensorData = database.GetCollection<SensorData>("SensorData");
        }
        public async Task<string> InsertAsync(SensorData sensorData)
        {
            // Validate required fields
            if (sensorData.Data == null || !sensorData.Data.ContainsKey("Accelerometer"))
            {
                Console.WriteLine($"Warning: Missing accelerometer data in {sensorData.DeviceId}");
            }

            await _sensorData.InsertOneAsync(sensorData);
            Console.WriteLine($"Inserted data for {sensorData.DeviceId} with sensors: {string.Join(", ", sensorData.Data.Keys)}");
            return sensorData.Id;
        }

        public async Task<bool> HasAccelerometerDataAsync(string deviceId)
        {
            var filter = Builders<SensorData>.Filter.And(
                Builders<SensorData>.Filter.Eq(s => s.DeviceId, deviceId),
                Builders<SensorData>.Filter.Exists("Data.Accelerometer")
            );

            return await _sensorData.Find(filter).AnyAsync();
        }

        public async Task<List<SensorData>> GetAllAsync()
        {
            return await _sensorData.Find(Builders<SensorData>.Filter.Empty).ToListAsync();
        }

        public async Task<SensorData?> GetByIdAsync(string id)
        {
            return await _sensorData.Find(s => s.Id == id).FirstOrDefaultAsync();
        }

        public async Task DeleteAsync(string id)
        {
            await _sensorData.DeleteOneAsync(s => s.Id == id);
        }

        public async Task<List<SensorData>> GetByDeviceIdAsync(string deviceId)
        {
            return await _sensorData.Find(s => s.DeviceId == deviceId).ToListAsync();
        }
        public async Task<List<SensorFieldData>> GetbyFieldAndDeviceIdAsync(string deviceId, string field, int limit = 20)
        {
            // Build the aggregation pipeline
            var pipeline = new List<BsonDocument>
            {
                // Match documents with the specific deviceId
                new("$match", new BsonDocument("deviceId",  new ObjectId(deviceId))),

                // Sort by timestamp in descending order (newest first)
                new("$sort", new BsonDocument("timestamp", -1)),

                // Limit to the most recent 100 documents
                new("$limit", limit),


                // Project only the field from the 'Data' dictionary that corresponds to the specified field
                new("$project", new BsonDocument
                {
                    { "timestamp", 1 },
                    {
                        "fieldValue",
                        new BsonDocument("$getField", new BsonDocument
                        {
                            { "field", field }, // field should be passed as a string
                            { "input", "$data" }
                        })
                    }
                })
            };

            // Execute the aggregation query
            var cursor = await _sensorData.AggregateAsync<BsonDocument>(pipeline);
            var documents = await cursor.ToListAsync(); // Fix: Call `ToListAsync` on the cursor, not the task.

            var result = new List<SensorFieldData>();


            foreach (var doc in documents)
            {
                if (doc.TryGetValue("timestamp", out var timestampBson) &&
                    doc.TryGetValue("fieldValue", out var fieldBson) &&
                    fieldBson.IsDouble)
                {
                    result.Add(new SensorFieldData
                    {
                        Timestamp = timestampBson.ToUniversalTime(),
                        Value = fieldBson.AsDouble
                    });
                }
            }

            return result;
        }

        public async Task<SensorData> GetLatestByDeviceId(string deviceId)
        {
            var filter = Builders<SensorData>.Filter.Eq(s => s.DeviceId, deviceId);
            var sort = Builders<SensorData>.Sort.Descending(s => s.Timestamp);
            return await _sensorData.Find(filter).Sort(sort).FirstOrDefaultAsync();
        }
        public async Task<bool> TestConnectionAsync()
        {
            try
            {
                // Simple ping to verify connection
                await _sensorData.Database.ListCollectionNamesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
        public async Task<List<SensorData>> GetDataBetweenAsync(DateTime startDate, DateTime endDate)
        {
            var filter = Builders<SensorData>.Filter.And(
                Builders<SensorData>.Filter.Gte(d => d.Timestamp, startDate),
                Builders<SensorData>.Filter.Lte(d => d.Timestamp, endDate)
            );

            return await _sensorData.Find(filter).ToListAsync();
        }

    }
}

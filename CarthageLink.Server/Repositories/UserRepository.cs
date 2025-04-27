using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CarthageLink.Server.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using BCrypt.Net;
using CarthageLink.Server.Data;

namespace CarthageLink.Server.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(string id);
        Task<List<User>> GetUserByFactoryIdAsync(string factoryId);


        Task UpdateUserAsync(User user);
        Task<bool> DeleteUserAsync(string userId);
        Task<bool> ValidateUserCredentialsAsync(string email, string password);
        Task CreateUserAsync(User user);
        Task<IEnumerable<User>> GetAllFactoryUsersAsync(string factoryId);
    }

    // ✅ Moved OUTSIDE of interface
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _user;
        private readonly IMongoCollection<Models.License> _License;

        public UserRepository(IOptions<DatabaseSettings> settings)
        {
            var mongoClient = new MongoClient(settings.Value.Connection);
            var database = mongoClient.GetDatabase(settings.Value.DatabaseName);
            _user = database.GetCollection<User>("User");
            _License = database.GetCollection<License>("License");
        }

        public async Task<IEnumerable<User>> GetAllFactoryUsersAsync(string factoryId)
        {
            return await _user.Find(u => u.FactoryId == factoryId).ToListAsync();
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _user.Find(User => true).ToListAsync();
        }

        public async Task<User> GetUserByIdAsync(string id)
        {
            return await _user.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _user.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<List<User>> GetUserByFactoryIdAsync(string factoryId)
        {
            return await _user.Find(u => u.FactoryId == factoryId).ToListAsync();
        }

        public async Task CreateUserAsync(User user)
        {
            await _user.InsertOneAsync(user);
        }

        public async Task UpdateUserAsync(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user), "User cannot be null.");

            await _user.ReplaceOneAsync(u => u.Id == user.Id, user);
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            var result = await _user.DeleteOneAsync(u => u.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<bool> ValidateUserCredentialsAsync(string email, string password)
        {
            var user = await GetUserByEmailAsync(email);
            if (user == null)
                return false;

            return VerifyPassword(password, user.Password);
        }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}

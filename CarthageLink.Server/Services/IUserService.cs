using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Threading.Tasks;
using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using Microsoft.AspNetCore.Identity;

namespace CarthageLink.Server.Services
{
    public interface IUserService
    {
        Task RegisterUserAsync(RegisterModel model);
        Task<string> LoginUserAsync(LogInModel loginModel);
        Task CreateUserAsync(User user);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(string id);
        Task<User?> GetUserByEmailAsync(string Email);

        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(string id);
        bool VerifyPassword(string storedPassword, string enteredPassword);
    }

    public class UserService(
        IUserRepository userRepository,
        IFactoryService factoryService,
        ITokenService tokenService,
         ILicenseService licenseService,
        ILicenseRepository licenseRepository
            ) : IUserService
    {
        private readonly IUserRepository _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
        private readonly IFactoryService _factoryService = factoryService ?? throw new ArgumentNullException(nameof(factoryService));
        private readonly ITokenService _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        private readonly ILicenseService _licenseService = licenseService ?? throw new ArgumentNullException(nameof(licenseService));
        private readonly ILicenseRepository _licenseRepository = licenseRepository ?? throw new ArgumentNullException(nameof(licenseRepository));

        public async Task RegisterUserAsync(RegisterModel model)
        {
            if (await _userRepository.GetUserByEmailAsync(model.Email) != null)
                throw new Exception("User with this email already exists.");

            var license = await _licenseService.VerifyLicenseKeyAsync(model.LicenseKey)
                    ?? throw new Exception("Invalid License Key") ;

            string hashedPassword = HashPassword(model.Password);
            var user = new User
            {
                Name = model.Name,
                Email = model.Email,
                Phone = model.Phone,
                Password = hashedPassword,
                FactoryId = license.FactoryId,
                Role = UserRole.FactoryAdmin,
                AssignedDevices = license.Devices,
                 LicenseKey = model.LicenseKey
            };
            await _userRepository.CreateUserAsync(user);
            await _licenseService.UpdateLicenseStatusAsync(license.Id!, LicenseStatus.Active);
            if (!string.IsNullOrEmpty(user.FactoryId))
            {
                await _factoryService.UpdateFactoryAdminIdAsync(user.FactoryId, user.Id!);
            }


            // Update the license status
            await _licenseService.UpdateLicenseStatusAsync(license.Id!, LicenseStatus.Active);

        }
         
        public async Task<string> LoginUserAsync(LogInModel model)
        {
            if (model == null)
            {
                throw new ArgumentNullException(nameof(model), "LogInModel cannot be null");
            }

            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                throw new ArgumentException("Email and password cannot be null or empty.");
            }

            try
            {

                bool isValidCredentials = await _userRepository.ValidateUserCredentialsAsync(model.Email, model.Password);

                if (!isValidCredentials)
                {
                    throw new Exception("Invalid credentials");
                }

                // Retrieve user after validation
                var user = await _userRepository.GetUserByEmailAsync(model.Email);

                // Generate JWT token if credentials are valid
                return _tokenService.GenerateJwtToken(user);
              
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to log in user.", ex);
            }
        }
       /* public async Task<List<User>> GetUsersByFactoryAsync
        {
            return aa
        }*/


        public async Task  CreateUserAsync(User user)
        {
            try
            {
                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                if (await _userRepository.GetUserByEmailAsync(user.Email) != null)
                    throw new Exception("User with this email already exists.");
               // user.Role = role;

                user.Password = HashPassword(user.Password);
                /*var licenseKey = GenerateLicenseKey();
                user.LicenseKey = licenseKey;
                var license = new Models.License
                {
                    Key = licenseKey,
                    Status = LicenseStatus.Pending,
                    AssignedTo = user.Id,
                    FactoryId = factory.Id,
                    userRole = role
                };

                await _licenseRepository.CreateLicenseAsync(license);*/

                await _userRepository.CreateUserAsync(user);

                // If you need to generate a license key in the future, uncomment and implement this:

               // return licenseKey;

            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to register user.", ex);
            }
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _userRepository.GetAllUsersAsync();
           
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
                return await _userRepository.GetUserByIdAsync(id);
        }

        public async Task UpdateUserAsync(User user)
        {
            try
            {
                if (user == null)
                    throw new ArgumentNullException(nameof(user));

                await _userRepository.UpdateUserAsync(user);
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to update user.", ex);
            }
        }

        public async Task DeleteUserAsync(string id)
        {
            try
            {
                if (string.IsNullOrEmpty(id))
                    throw new ArgumentException("User ID cannot be null or empty", nameof(id));

                await _userRepository.DeleteUserAsync(id);
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to delete user.", ex);
            }
        }

        public bool VerifyPassword(string storedPassword, string enteredPassword)
        {
            try
            {
                if (string.IsNullOrEmpty(storedPassword) || string.IsNullOrEmpty(enteredPassword))
                    throw new ArgumentException("Passwords cannot be null or empty");

                var passwordHasher = new PasswordHasher<User>();
                var result = passwordHasher.VerifyHashedPassword(null, storedPassword, enteredPassword);

                return result == PasswordVerificationResult.Success;
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to verify password.", ex);
            }
        }

        private static string HashPassword(string password)
        {
            try
            {
                if (string.IsNullOrEmpty(password))
                    throw new ArgumentException("Password cannot be null or empty", nameof(password));

                return BCrypt.Net.BCrypt.HashPassword(password);
            }
            catch (Exception ex)
            {
                // Log the exception
                throw new Exception("Failed to hash password.", ex);
            }
        }

        public async Task<User?> GetUserByEmailAsync(string Email)
        {
            return await userRepository.GetUserByEmailAsync(Email);


        }
    }
    }
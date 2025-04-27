using CarthageLink.Server.Models;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace CarthageLink.Server.Controllers
{
    // Controllers/AuthController.cs
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IMongoCollection<PasswordResetRequest> _passwordResetCollection;
        private readonly IConfiguration _configuration;

        public AuthController(
            UserManager<User> userManager,
            IMongoDatabase database,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _passwordResetCollection = database.GetCollection<PasswordResetRequest>("PasswordResetRequests");
            _configuration = configuration;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                // Don't reveal that the user doesn't exist
                return Ok("If your email is registered, you'll receive a password reset link.");
            }

            // Generate token
            var token = Guid.NewGuid().ToString();
            var expiration = DateTime.UtcNow.AddHours(24);

            // Save to MongoDB
            var resetRequest = new PasswordResetRequest
            {
                Email = model.Email,
                Token = token,
                Expiration = expiration,
                IsUsed = false
            };
            await _passwordResetCollection.InsertOneAsync(resetRequest);

            // Create reset link
            var frontendUrl = _configuration["Frontend:BaseUrl"];
            var resetLink = $"{frontendUrl}/reset-password?email={model.Email}&token={token}";

            // Send email

            return Ok("If your email is registered, you'll receive a password reset link.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            // Validate model
            if (model.NewPassword != model.ConfirmPassword)
            {
                return BadRequest("Passwords don't match.");
            }

            // Find reset request
            var resetRequest = await _passwordResetCollection.Find(r =>
                r.Email == model.Email &&
                r.Token == model.Token &&
                !r.IsUsed &&
                r.Expiration > DateTime.UtcNow)
                .FirstOrDefaultAsync();

            if (resetRequest == null)
            {
                return BadRequest("Invalid or expired token.");
            }

            // Find user
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            // Reset password
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, model.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Mark token as used
            resetRequest.IsUsed = true;
            await _passwordResetCollection.ReplaceOneAsync(r => r.Id == resetRequest.Id, resetRequest);

            return Ok("Password has been reset successfully.");
        }
    }
}

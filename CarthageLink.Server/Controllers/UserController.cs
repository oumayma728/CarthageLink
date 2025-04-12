using Microsoft.AspNetCore.Mvc;
using CarthageLink.Server.Services;
using CarthageLink.Server.Models;
using Microsoft.Extensions.Configuration.UserSecrets;
using MongoDB.Bson;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using CarthageLink.Server.Repositories;
using System.Data;
using Microsoft.AspNetCore.Cors;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CarthageLink.Server.Controllers
{
    [EnableCors("AllowAll")] // Apply CORS policy to this controller

    [Route("api/[controller]")] //base route for the controller
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IFactoryService _factoryService;


        // Inject both services
        public UserController(IUserService userService, IUserRepository userRepository, IFactoryService factoryService , IFactoryRepository factoryRepository)
        {
            _userService = userService;
            _factoryService = factoryService;
        }

        //Get All users
        [HttpGet]
        public async Task<ActionResult<List<User>>> GetAllUsers() // return list of users
        {
            
                var users = await _userService.GetAllUsersAsync();
            return Ok(users);


        }
        //create user for super admin

        [HttpPost("Super-admin/create-user")]
        public async Task<IActionResult> Createuser([FromBody] User user)
        {
            if (user == null)
                return BadRequest(new { message = "User data is required." });

            var existingUser = await _userService.GetUserByEmailAsync(user.Email);
            if (existingUser != null)
                return BadRequest(new { message = "User with this email already exists." });
            await _userService.CreateUserAsync(user);
            return Ok(new { message = "User created successfully"});
        
        }

        // Create user for factory admin
        /*[HttpPost("factory-admin/create-user")]
        public async Task<IActionResult> PostOperator([FromBody] User user, [FromHeader] string factoryAdminFactoryId)
        {
            if (user == null)
                return BadRequest(new { message = "User data is required." });

            if (string.IsNullOrEmpty(factoryAdminFactoryId))
                return BadRequest(new { message = "Factory ID is required in the header." });

            var existingUser = await _userRepository.GetUserByEmailAsync(user.Email);
            if (existingUser != null)
                return BadRequest(new { message = "User with this email already exists." });

            var role = UserRole.Operator; // set role operator
            var licenseKey = await _userService.CreateUserAsync(user, role , user.TaxNumber);
       
            return Ok(new { message = "User created successfully", licenseKey });
        }
        */
       /* public async Task<IActionResult> GetUsersByFactory(int factoryId)
        {
            var loggedInFactoryId = User.FindFirst("FactoryId")?.Value; // Get FactoryId from the token

            if (loggedInFactoryId != factoryId.ToString())
            {
                return Forbid(); // Deny access if the FactoryId doesn't match
            }

            var users = await _userService.GetUsersByFactoryAsync(factoryId);
            return Ok(users);
        }*/

        // Get User by Id
        [HttpGet("{id:length(24)}")] 
        public async Task<ActionResult<User>> Get(string id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        // Update User
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(string id, User updateUser)
        {
            // Fetch the user from the service by id
            User user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound($"There is no user with this id: {id}");
            }
            //Ensures the ID of the updated user matches the existing user.
            updateUser.Id = user.Id;

            // Call the service to update the user with the modified user details
            await _userService.UpdateUserAsync(updateUser);

            return Ok("Updated Successfully");
        }


        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return Ok(new { message = "User has been successfully deleted" });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("User not found"))
                    return NotFound(new { message = ex.Message });

                return BadRequest(new { message = ex.Message });
            }

        }
        [HttpPost("register-user")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            try
            {
                var existingUser = await _userService.GetUserByEmailAsync(model.Email);
                if (existingUser != null)
                    return BadRequest(new { message = "User with this email already exists." });

                await _userService.RegisterUserAsync(model);
                return Ok(new { message = "Registration completed successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }
        //Log In User
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LogInModel model)
        {
            try
            {
                var token = await _userService.LoginUserAsync(model);

                var user = await _userService.GetUserByEmailAsync(model.Email); // get user details

                return Ok(new
                {
                    message = "User logged in successfully",
                    name = user.Name,

                    email = user.Email,
                    role = user.Role,
                    token = token,
                    factoryId = user.FactoryId

                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }
}

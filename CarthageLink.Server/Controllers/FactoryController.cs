using Microsoft.AspNetCore.Mvc;
using CarthageLink.Server.Services;
using CarthageLink.Server.Models;
using System.Security.Claims;

namespace CarthageLink.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FactoryController : ControllerBase
    {
        private readonly IFactoryService _factoryService;

        public FactoryController(IFactoryService factoryService)
        {
            _factoryService = factoryService;
        }
        // GET all factories for SuperAdmin 
        [HttpGet]
      // [Authorize(Roles = "SuperAdmin")]

        public async Task<ActionResult<List<Factory>>> GetAllFactories()
        {
            var factories = await _factoryService.GetAllFactoriesAsync();
            return Ok(factories);
        }

        // GET api/Factory/{id}
        [HttpGet("{id}")]
        //[Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<Factory>> GetFactoryById(string id)
        {
            var factory = await _factoryService.GetFactoryByIdAsync(id);
            if (factory == null)
            {
                return NotFound($"Factory with id {id} not found.");
            }
            return Ok(factory);
        }

        // POST api/Factory
        [HttpPost()]
        //[Authorize(Roles = "SuperAdmin")]

        public async Task<IActionResult> CreateFactory([FromBody] Factory factory)
        {
            if (factory == null)
            {
                return BadRequest("Factory data is required.");
            }

            // Call the service to create the factory and generate the license key
            string licenseKey = await _factoryService.CreateFactoryAsync(factory);

            // Return the generated license key and success message
            return Ok(new
            {
                message = "Factory created successfully.",
                licenseKey = licenseKey  // Return the generated license key
            });
        }
/* [HttpGet("factory/devices")]
         public async Task<IActionResult> GetFactoryDevices()
         {
             var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
             var user = await _userRepository.GetByIdAsync(userId);

             if (user == null || user.Role != "FactoryAdmin")
             {
                 return Unauthorized();
             }

             var devices = await _deviceRepository.GetByFactoryIdAsync(user.FactoryId);
             return Ok(devices);
         }
         */
        // PUT api/Factory/{id}
        [HttpPut("{id}")]
        //[Authorize(Roles = "SuperAdmin")]

        public async Task<IActionResult> UpdateFactory(string id, [FromBody] Factory updatedFactory)
        {
            var existingFactory = await _factoryService.GetFactoryByIdAsync(id);
            if (existingFactory == null)
            {
                return NotFound($"Factory with id {id} not found.");
            }

            updatedFactory.Id = id;
            await _factoryService.UpdateFactoryAsync(updatedFactory);
            return Ok("Factory updated successfully.");
        }

       
        // DELETE api/Factory/{id}
        [HttpDelete("{id}")]
        //[Authorize(Roles = "SuperAdmin")]

        public async Task<IActionResult> DeleteFactory(string id)
        {
            var result = await _factoryService.DeleteFactoryAsync(id);
            if (!result)
            {
                return NotFound($"Factory with id {id} not found.");
            }
            return Ok("Factory deleted successfully.");
        }
    [HttpGet("{id}/devices")]
        //[Authorize(Roles = "SuperAdmin,FactoryAdmin")]
        public async Task<ActionResult<List<Device>>> GetFactoryDevices(string id)
        {
            // Check if the factory exists
            var factory = await _factoryService.GetFactoryByIdAsync(id);
            if (factory == null)
            {
                return NotFound($"Factory with id {id} not found.");
            }
            try
            {
                var devices = await _factoryService.GetFactoryDevicesAsync(id);
                if (devices == null || !devices.Any())
                {
                    return NotFound($"No devices found for factory with id {id}.");
                }

                return Ok(devices);
            }
            catch
            {
                // Return a generic error message if an exception occurs
                return StatusCode(500, "An error occurred while fetching the devices.");
            }
        }
        [HttpGet("{id}/Users")]
        //[Authorize(Roles = "SuperAdmin,FactoryAdmin")]
        public async Task<ActionResult<List<User>>> GetFactoryUsers(string id)
        {
            // Check if the factory exists
            var factory = await _factoryService.GetFactoryByIdAsync(id);
            if (factory == null)
            {
                return NotFound($"Factory with id {id} not found.");
            }
            try
            {
                var users = await _factoryService.GetFactoryUsersAsync(id);
                if (users == null || !users.Any())
                {
                    return NotFound($"No users found for factory with id {id}.");
                }

                return Ok(users);
            }
            catch
            {
                // Return a generic error message if an exception occurs
                return StatusCode(500, "An error occurred while fetching the devices.");
            }
        }

    } }

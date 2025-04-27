using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using System;
using System.Threading.Tasks;

namespace CarthageLink.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private readonly IDeviceService _deviceService;
        private readonly IDeviceRepository _deviceRepository;

        public DeviceController(IDeviceService deviceService, IDeviceRepository deviceRepository)
        {
            _deviceService = deviceService;
            _deviceRepository = deviceRepository;
        }

        // GET: api/<DeviceController>
        [HttpGet]
        public async Task<IEnumerable<Device>> GetAllDevicesAsync()
        {
            return await _deviceRepository.GetAllDevicesAsync();
        }

        // GET api/<DeviceController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDeviceById(string id)
        {
            // Parse the ID as ObjectId
            if (!ObjectId.TryParse(id, out var objectId))
            {
                return BadRequest(new { message = $"'{id}' is not a valid 24 digit hex string." });
            }

            try
            {
                // Pass the valid id to the service
                var device = await _deviceService.GetDeviceByIdAsync(id);
                if (device == null)
                {
                    return NotFound(new { message = "Device not found" });
                }
                return Ok(device);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

        // POST api/<DeviceController>
        [HttpPost]
        public async Task<IActionResult> CreateDevice([FromBody] Device device)
        {
            if (device == null)
            {
                return BadRequest("Device data is required.");
            }
            await _deviceService.CreateDeviceAsync(device);
            return Ok(new { message = "Device created successfully." });
        }

        // PUT api/<DeviceController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDevice(string id, [FromBody] Device updatedFields)
        {
            var existingDevice = await _deviceService.GetDeviceByIdAsync(id);
            if (existingDevice == null)
            {
                return NotFound($"Device with id {id} not found.");
            }

            // Assuming updatedFields has a DeviceStatus property
            if (updatedFields.Status != null)  // For nullable enum
            {
                existingDevice.Status = updatedFields.Status;
            }

            if (!string.IsNullOrEmpty(updatedFields.MacAddress))
            {
                existingDevice.MacAddress = updatedFields.MacAddress;
            }

            if (!string.IsNullOrEmpty(updatedFields.Name))
            {
                existingDevice.Name = updatedFields.Name;
            }

            // Update any other fields as needed

            // Save the updated device
            await _deviceService.UpdateDeviceAsync(existingDevice);

            return Ok("Device updated successfully.");
        }



       /* [HttpGet("factory/{factoryId}")]
        public async Task<ActionResult<List<Device>>> GetDevicesByFactoryId(string FactoryId)
        {
            var devices = await _deviceService.GetDeviceByFactoryId(FactoryId);


            return Ok(devices);
        }*/
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDevice(string id)
        {
            var existingDevice = await _deviceService.GetDeviceByIdAsync(id);
            if (existingDevice == null)
            {
                return NotFound($"Device with id {id} not found.");
            }

            await _deviceService.DeleteDeviceAsync(id);
            return Ok("Device deleted successfully.");
        }
    }
}

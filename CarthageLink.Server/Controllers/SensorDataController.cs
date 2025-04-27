using CarthageLink.Server.Models;
using CarthageLink.Server.Repositories;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace CarthageLink.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorDataController(ISensorDataRepository sensorDataRepository ) : ControllerBase
    {
        private readonly ISensorDataRepository _sensorDataRepository = sensorDataRepository;
        //private readonly AlertService _alertService = alertService;

        // GET: api/<SensorDataController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var sensorData = await _sensorDataRepository.GetAllAsync();
                return Ok(sensorData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

        // POST api/<SensorDataController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] SensorData sensorData)
        {
            if (sensorData == null)
            {
                return BadRequest(new { message = "Sensor data cannot be null." });
            }
            try
            {
                await _sensorDataRepository.InsertAsync(sensorData);
                return Ok(new { message = "Data added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }
        
        // GET api/<SensorDataController>/<deviceId>
        [HttpGet("{deviceId}")]
        public async Task<IActionResult> Get(string deviceId)
        {
            if (!ObjectId.TryParse(deviceId, out _))
            {
                return BadRequest(new { message = $"'{deviceId}' is not a valid 24 digit hex string." });
            }

            try
            {
                //var sensorData = await _sensorDataRepository.GetByDeviceIdAsync(deviceId);
                var sensorData = await _sensorDataRepository.GetLatestByDeviceId(deviceId);
                if (sensorData == null) // || sensorData.Count == 0)
                {
                    return NotFound(new { message = "No sensor data found for the specified device ID." });
                }
                return Ok(sensorData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

        // GET api/<SensorDataController>/<deviceId>/<field>?limit=20
        [HttpGet("{deviceId}/{field}")]
        public async Task<IActionResult> Get(string deviceId, string field, [FromQuery] int limit = 20)
        {
            if (!ObjectId.TryParse(deviceId, out _))
            {
                return BadRequest(new { message = $"'{deviceId}' is not a valid 24 digit hex string." });
            }

            if (limit <= 0)
            {
                return BadRequest(new { message = "Limit must be a positive integer." });
            }

            try
            {
                var sensorData = await _sensorDataRepository.GetbyFieldAndDeviceIdAsync(deviceId, field, limit);
                if (sensorData == null || sensorData.Count == 0)
                {
                    return NotFound(new { message = "No sensor data found for the specified device ID and field." });
                }
                return Ok(sensorData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }
    }
}

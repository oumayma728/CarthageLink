using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;

namespace CarthageLink.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InsightsController(IInsightsService _insightsService) : ControllerBase
    {

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var data = await _insightsService.GetInsights();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

        [HttpGet("{factoryId}")]
        public async Task<IActionResult> Get(string factoryId)
        {
            if (!ObjectId.TryParse(factoryId, out _))
            {
                return BadRequest(new { message = $"'{factoryId}' is not a valid 24 digit hex string." });
            }
            try
            {
                var data = await _insightsService.GetFactoryInsight(factoryId);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

    }
}

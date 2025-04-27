using CarthageLink.Server.Models;
using CarthageLink.Server.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace CarthageLink.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlertsController : ControllerBase
    {
        private readonly IMongoCollection<Alert> _alertsCollection;

        public AlertsController(IMongoDatabase database)
        {
            _alertsCollection = database.GetCollection<Alert>("Alerts");
        }

        [HttpGet]
        public async Task<IActionResult> GetAlerts()
        {
            var alerts = await _alertsCollection
                .Find(_ => true)
                .SortByDescending(a => a.Timestamp)
                .Limit(100) // latest 100 alerts
                .ToListAsync();

            return Ok(alerts);
        }
    }
}

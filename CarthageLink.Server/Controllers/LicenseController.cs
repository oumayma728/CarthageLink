using Microsoft.AspNetCore.Mvc;
using CarthageLink.Server.Models;
using CarthageLink.Server.Services;
using MongoDB.Bson;
using CarthageLink.Server.Repositories;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CarthageLink.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LicenseController : ControllerBase
    {
        private readonly ILicenseService _licenseService;
        private readonly ILicenseRepository _licenseRepository;

        public LicenseController(ILicenseService licenseService, ILicenseRepository licenseRepository)
        {
            _licenseService = licenseService;
            _licenseRepository = licenseRepository;
        }
        // GET: api/<LicenseController>
        [HttpGet]
        public async Task<IActionResult> GetAllLicenses()
        {
            try
            {
                var licenses = await _licenseService.GetAllLicensesAsync();

                if (licenses == null || !licenses.Any())
                {
                    return NotFound(new { message = "No licenses found." });
                }

                return Ok(licenses);
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

        // GET api/<LicenseController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLicenseById(string id)
        {

            try
            {
                var license = await _licenseService.GetLicenseByIdAsync(id);
                return Ok(license);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("License not found."))
                    return NotFound(new { message = ex.Message });

                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }
        // Optional: Get all licenses by user if needed
        [HttpGet("Factory/{FactoryId}")]
        public async Task<IActionResult> GetLicensesFactoryId(string FactoryId)
        {
            var licenses = await _licenseService.GetLicensesByFactoryIdAsync(FactoryId);
            return Ok(licenses);
        }


        // POST api/<LicenseController>
        [HttpPost]
        public async Task<IActionResult> CreateLicense([FromBody] License license)
        {
            try
            {
                var licenseKey = await _licenseService.CreateLicenseAsync(license);

                return Ok(new { message = "License has been successfully generated", licenseKey });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }

        }

        // PUT api/<LicenseController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLicense(string id, [FromBody] License updatedLicense)
        {
            try
            {
                // Validate input
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest(new { message = "ID cannot be null or empty." });
                }

                if (updatedLicense == null)
                {
                    return BadRequest(new { message = "License data cannot be null." });
                }

                // Call the service to update the license
                var result = await _licenseService.UpdateLicenseAsync(id, updatedLicense);

                if (result == null)
                {
                    return NotFound(new { message = "License not found." });
                }

                return Ok(new { message = "License updated successfully.", updatedLicense = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", error = ex.Message });
            }
        }

        // DELETE api/<LicenseController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                await _licenseService.DeleteLicenseAsync(id);
                return Ok(new { message = "License has been successfully deleted" });
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("License not found."))
                    return NotFound(new { message = ex.Message });

                return BadRequest(new { message = ex.Message });
            }

        }
    }
}

using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TelecomProject.Backend.Services;
using TelecomProject.DTOs;

namespace TelecomProject.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomersController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        // ==========================================
        // 1. CRUD Endpoints
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> GetCustomers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? sortBy = "Id")
        {
            var result = await _customerService.GetCustomersAsync(page, pageSize, search, sortBy);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            var customer = await _customerService.GetCustomerByIdAsync(id);
            if (customer == null) 
                return NotFound("Customer not found");
                
            return Ok(customer);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CustomerCreateDto dto)
        {
            if (dto == null) 
                return BadRequest("Request body is required");
                
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);

            try
            {
                var customer = await _customerService.CreateCustomerAsync(dto);
                return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CustomerUpdateDto dto)
        {
            if (dto == null) 
                return BadRequest("Request body is required");
                
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);

            try
            {
                var updatedCustomer = await _customerService.UpdateCustomerAsync(id, dto);
                if (updatedCustomer == null) 
                    return NotFound("Customer not found or already deleted");
                    
                return Ok(updatedCustomer);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating customer: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var success = await _customerService.SoftDeleteCustomerAsync(id);
            if (!success) 
                return NotFound("Customer not found or already deleted");
                
            return Ok("Customer Deleted Successfully");
        }

        // ==========================================
        // 2. Authentication Endpoints
        // ==========================================

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            try
            {
                var customer = await _customerService.LoginAsync(dto);
                return Ok(customer);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpGet("verify")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string email, [FromQuery] string token)
        {
            var isVerified = await _customerService.VerifyEmailAsync(email, token);
            if (!isVerified) 
                return BadRequest("Invalid verification link or email.");

            return Ok("Account Verified Successfully. You can now login.");
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            if (string.IsNullOrEmpty(dto.Email))
                return BadRequest("Email is required.");

            await _customerService.ForgotPasswordAsync(dto.Email);
            // دايماً بنرجع Ok لأسباب أمنية عشان منأكدش إذا كان الإيميل موجود في الداتا بيز ولا لأ
            return Ok("If the email exists, a reset link has been sent.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _customerService.ResetPasswordAsync(dto);
            if (!result) 
                return BadRequest("Invalid or expired token.");
            
            return Ok("Password reset successfully.");
        }
    }
}
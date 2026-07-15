using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using TelecomProject.Backend.Services;
using TelecomProject.Data;
using TelecomProject.DTOs;

namespace TelecomProject.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;
        private readonly AppDbContext _context; // بنستخدمه مؤقتاً لدالة GetCustomer لحد ما تتنقل للـ Service

        public CustomersController(ICustomerService customerService, AppDbContext context)
        {
            _customerService = customerService;
            _context = context;
        }

        // GET: api/customers
        [HttpGet]
        public async Task<IActionResult> GetCustomers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? sortBy = "Id")
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10; 

            var result = await _customerService.GetCustomersAsync(page, pageSize, search, sortBy);
            return Ok(result);
        }

        // GET: api/customers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsDeleted) return NotFound("Customer not found");
            return Ok(customer);
        }

        // POST: api/customers
        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CustomerCreateDto dto)
        {
            if (dto == null) return BadRequest("Request body is required");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var customer = await _customerService.CreateCustomerAsync(dto);

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
        }

        // PUT: api/customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CustomerUpdateDto dto)
        {
            if (dto == null) return BadRequest("Request body is required");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                // ⚠️ التعديل الجذري: خلينا الكنترولر يكلم السيرفيس اللي صلحناها، بدل ما يعتمد على نفسه
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

        // DELETE: api/customers/5 (Soft Delete)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var success = await _customerService.SoftDeleteCustomerAsync(id);
            if (!success) return NotFound("Customer not found or already deleted");

            return Ok("Customer Deleted Successfully");
        }
    }
}
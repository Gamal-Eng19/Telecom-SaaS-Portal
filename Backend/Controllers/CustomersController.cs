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
        private readonly AppDbContext _context; // بنستخدمه مؤقتاً للدوال اللي لسه متعملهاش Service

        public CustomersController(ICustomerService customerService, AppDbContext context)
        {
            _customerService = customerService;
            _context = context;
        }

        // GET: api/customers (بيدعم البحث والصفحات)
        [HttpGet]
        public async Task<IActionResult> GetCustomers([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? sortBy = "Id")
        {
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10; // حماية بسيطة من قيم غير منطقية

            var result = await _customerService.GetCustomersAsync(page, pageSize, search, sortBy);
            return Ok(result);
        }

        // GET: api/customers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            // لو العميل ممسوح (Soft Delete) مش هنرجعه
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

            // 201 Created + Location header بدل ما نرجع 200 على إنشاء مورد جديد
            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
        }

        // PUT: api/customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CustomerUpdateDto dto)
        {
            if (dto == null) return BadRequest("Request body is required");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsDeleted) return NotFound("Customer not found");

            customer.FullName = dto.FullName;
            customer.PhoneNumber = dto.PhoneNumber;
            customer.Email = dto.Email;
            customer.Address = dto.Address;
            customer.Type = dto.Type;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return Conflict("Customer was modified or deleted by another request");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Error updating customer: {ex.Message}");
            }

            return Ok(customer);
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
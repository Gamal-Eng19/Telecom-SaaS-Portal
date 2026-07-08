using Microsoft.AspNetCore.Mvc;
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
            var customer = await _customerService.CreateCustomerAsync(dto);
            return Ok(customer);
        }

        // PUT: api/customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CustomerUpdateDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsDeleted) return NotFound("Customer not found");

            customer.FullName = dto.FullName;
            customer.PhoneNumber = dto.PhoneNumber;
            customer.Email = dto.Email;
            customer.Address = dto.Address;
            customer.Type = dto.Type;

            await _context.SaveChangesAsync();
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
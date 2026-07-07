using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TelecomProject.Data;
using TelecomProject.Models;
using TelecomProject.DTOs;

namespace TelecomProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CustomersController> _logger;

        public CustomersController(AppDbContext context, ILogger<CustomersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/customers?page=1&pageSize=10&search=ahmed&sortBy=name
        [HttpGet]
        public async Task<IActionResult> GetCustomers(
            int page = 1,
            int pageSize = 10,
            string? search = null,
            string? sortBy = "Id")
        {
            var query = _context.Customers.Where(c => !c.IsDeleted).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(c =>
                    c.FullName.Contains(search) ||
                    c.Email.Contains(search) ||
                    c.PhoneNumber.Contains(search));
            }

            query = sortBy?.ToLower() switch
            {
                "name" => query.OrderBy(c => c.FullName),
                "email" => query.OrderBy(c => c.Email),
                _ => query.OrderBy(c => c.Id)
            };

            var totalCount = await query.CountAsync();

            var customers = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                Data = customers
            });
        }

        // GET: api/customers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            var customer = await _context.Customers
                .Include(c => c.Subscriptions)
                .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

            if (customer == null)
                return NotFound(new { message = "العميل غير موجود" });

            return Ok(customer);
        }

        // POST: api/customers
        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CustomerCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool emailExists = await _context.Customers
                .AnyAsync(c => c.Email == dto.Email && !c.IsDeleted);

            if (emailExists)
                return Conflict(new { message = "البريد الإلكتروني مستخدم بالفعل" });

            var customer = new Customer
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                Address = dto.Address,
                Type = dto.Type,
                RegisteredDate = DateTime.UtcNow
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Customer created: {Id}", customer.Id);

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
        }

        // PUT: api/customers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] CustomerUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var customer = await _context.Customers
                .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

            if (customer == null)
                return NotFound(new { message = "العميل غير موجود" });

            customer.FullName = dto.FullName;
            customer.Email = dto.Email;
            customer.PhoneNumber = dto.PhoneNumber;
            customer.Address = dto.Address;
            customer.Type = dto.Type;

            await _context.SaveChangesAsync();

            return Ok(customer);
        }

        // PATCH: api/customers/5/phone
        [HttpPatch("{id}/phone")]
        public async Task<IActionResult> UpdatePhone(int id, [FromBody] string newPhone)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsDeleted)
                return NotFound(new { message = "العميل غير موجود" });

            customer.PhoneNumber = newPhone;
            await _context.SaveChangesAsync();

            return Ok(customer);
        }

        // PATCH: api/customers/5/type
        [HttpPatch("{id}/type")]
        public async Task<IActionResult> UpdateCustomerType(int id, [FromBody] CustomerType newType)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsDeleted)
                return NotFound(new { message = "العميل غير موجود" });

            customer.Type = newType;
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم تحديث نوع العميل", customer });
        }

        // GET: api/customers/vip
        [HttpGet("vip")]
        public async Task<IActionResult> GetVipCustomers()
        {
            var vipCustomers = await _context.Customers
                .Where(c => c.Type == CustomerType.VIP && !c.IsDeleted)
                .ToListAsync();

            return Ok(vipCustomers);
        }

        // GET: api/customers/5/subscriptions
        [HttpGet("{id}/subscriptions")]
        public async Task<IActionResult> GetCustomerSubscriptions(int id)
        {
            var customer = await _context.Customers
                .Include(c => c.Subscriptions)
                .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted);

            if (customer == null)
                return NotFound(new { message = "العميل غير موجود" });

            return Ok(customer.Subscriptions);
        }

        // POST: api/customers/5/subscriptions
        [HttpPost("{id}/subscriptions")]
        public async Task<IActionResult> AddSubscription(int id, [FromBody] SubscriptionCreateDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsDeleted)
                return NotFound(new { message = "العميل غير موجود" });

            var subscription = new Subscription
            {
                PlanName = dto.PlanName,
                MonthlyPrice = dto.MonthlyPrice,
                DataLimitGB = dto.DataLimitGB,
                CustomerId = id,
                StartDate = DateTime.UtcNow,
                Status = SubscriptionStatus.Active
            };

            _context.Subscriptions.Add(subscription);
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم إضافة الباقة بنجاح", subscription });
        }

        // PATCH: api/customers/subscriptions/5/status
        [HttpPatch("subscriptions/{subscriptionId}/status")]
        public async Task<IActionResult> UpdateSubscriptionStatus(int subscriptionId, [FromBody] SubscriptionStatus newStatus)
        {
            var subscription = await _context.Subscriptions.FindAsync(subscriptionId);
            if (subscription == null)
                return NotFound(new { message = "الباقة غير موجودة" });

            subscription.Status = newStatus;
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم تحديث حالة الباقة", subscription });
        }

        // DELETE: api/customers/5  (soft delete)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsDeleted)
                return NotFound(new { message = "العميل غير موجود" });

            customer.IsDeleted = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم مسح العميل" });
        }

        // POST: api/customers/5/restore
        [HttpPost("{id}/restore")]
        public async Task<IActionResult> RestoreCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || !customer.IsDeleted)
                return NotFound(new { message = "لا يوجد عميل محذوف بهذا الرقم" });

            customer.IsDeleted = false;
            await _context.SaveChangesAsync();

            return Ok(new { message = "تم استرجاع العميل", customer });
        }

        // GET: api/customers/5/exists
        [HttpGet("{id}/exists")]
        public async Task<IActionResult> CustomerExists(int id)
        {
            bool exists = await _context.Customers.AnyAsync(c => c.Id == id && !c.IsDeleted);
            return Ok(new { exists });
        }
    }
}
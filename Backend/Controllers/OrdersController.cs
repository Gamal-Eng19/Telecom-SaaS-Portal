using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TelecomProject.Data;
using TelecomProject.Models;

namespace TelecomProject.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET Read All also with getting the info of the customer/order
        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer) // getting customer info
                .Include(o => o.Product)  // getting product info
                .ToListAsync();

            return Ok(orders);
        }

        // Read by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound("order not found");
            return Ok(order);
        }

        // Create
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return Ok(order);
        }

        // Update for example changing the state of the order into active order
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order order)
        {
            if (id != order.Id) return BadRequest("incorrect information");

            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(order);
        }

        // Delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound("Order not Found");

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return Ok("Order Deleted");
        }
    }
}

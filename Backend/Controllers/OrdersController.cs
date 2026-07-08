using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using TelecomProject.Data;
using TelecomProject.Models;
using TelecomProject.DTOs; // تأكد من المسار ده

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

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer) 
                .Include(o => o.Product)  
                .ToListAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound("Order not found");
            return Ok(order);
        }

       [HttpPost]
public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
{
    // نتأكد إن العميل والمنتج موجودين قبل ما نعمل Order
    var customerExists = await _context.Customers.AnyAsync(c => c.Id == dto.CustomerId);
    var productExists = await _context.Products.AnyAsync(p => p.Id == dto.ProductId);

    if (!customerExists || !productExists) 
        return BadRequest("Customer or Product does not exist.");

    var order = new Order
    {
        CustomerId = dto.CustomerId,
        ProductId = dto.ProductId,
        OrderDate = DateTime.UtcNow,
        Status = "Pending"
    };

    _context.Orders.Add(order);
    await _context.SaveChangesAsync();
    
    return Ok(order);
}

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderUpdateDto dto)
        {
            var existingOrder = await _context.Orders.FindAsync(id);
            if (existingOrder == null) return NotFound("Order not found");

            existingOrder.Status = dto.Status;
            
            await _context.SaveChangesAsync();
            return Ok(existingOrder);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound("Order not found");

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return Ok("Order Deleted");
        }
    }
}
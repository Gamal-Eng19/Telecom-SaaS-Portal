using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TelecomProject.Backend.Services;
using TelecomProject.DTOs;

namespace TelecomProject.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _orderService.GetOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) return NotFound("Order not found");
            
            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDto dto)
        {
            try
            {
                var order = await _orderService.CreateOrderAsync(dto);
                return Ok(order); // هترجع الـ OrderResponseDto بالأسماء
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderUpdateDto dto)
        {
            var success = await _orderService.UpdateOrderStatusAsync(id, dto);
            if (!success) return NotFound("Order not found");

            return Ok(new { message = "Order status updated successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var success = await _orderService.DeleteOrderAsync(id);
            if (!success) return NotFound("Order not found");

            return Ok(new { message = "Order Deleted Successfully" });
        }
    }
}
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TelecomProject.Data;
using TelecomProject.Models;
using TelecomProject.DTOs;

namespace TelecomProject.Backend.Services
{
    // --- 1. الواجهة (Interface) ---
    public interface IOrderService
    {
        Task<IEnumerable<OrderResponseDto>> GetOrdersAsync();
        Task<OrderResponseDto?> GetOrderByIdAsync(int id);
        Task<OrderResponseDto> CreateOrderAsync(OrderCreateDto dto);
        Task<bool> UpdateOrderStatusAsync(int id, OrderUpdateDto dto);
        Task<bool> DeleteOrderAsync(int id);
    }

    // --- 2. تنفيذ المنطق البرمجي (Business Logic) ---
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderResponseDto>> GetOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Product)
                .Select(o => new OrderResponseDto
                {
                    Id = o.Id,
                    OrderDate = o.OrderDate,
                    Status = o.Status,
                    CustomerName = o.Customer != null ? o.Customer.FullName : "Unknown",
                    ProductName = o.Product != null ? o.Product.Name : "Unknown"
                })
                .OrderByDescending(o => o.Id) // ترتيب من الأحدث للأقدم
                .ToListAsync();
        }

        public async Task<OrderResponseDto?> GetOrderByIdAsync(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return null;

            return new OrderResponseDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                CustomerName = order.Customer != null ? order.Customer.FullName : "Unknown",
                ProductName = order.Product != null ? order.Product.Name : "Unknown"
            };
        }

        public async Task<OrderResponseDto> CreateOrderAsync(OrderCreateDto dto)
        {
            var customerExists = await _context.Customers.AnyAsync(c => c.Id == dto.CustomerId && !c.IsDeleted);
            var product = await _context.Products.FindAsync(dto.ProductId);

            if (!customerExists || product == null)
                throw new ArgumentException("Customer or Product does not exist.");

            var order = new Order
            {
                CustomerId = dto.CustomerId,
                ProductId = dto.ProductId,
                OrderDate = DateTime.UtcNow,
                Status = "Pending"
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // عشان نرجع الداتا كاملة بالأسماء بدل الأرقام بعد الإنشاء
            await _context.Entry(order).Reference(o => o.Customer).LoadAsync();

            return new OrderResponseDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                CustomerName = order.Customer != null ? order.Customer.FullName : "Unknown",
                ProductName = product.Name
            };
        }

        public async Task<bool> UpdateOrderStatusAsync(int id, OrderUpdateDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return false;

            order.Status = dto.Status;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return false;

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
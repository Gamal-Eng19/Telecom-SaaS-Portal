using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using TelecomProject.Data;
using TelecomProject.Models;
using TelecomProject.DTOs;

namespace TelecomProject.Backend.Services
{
    // --- 1. الواجهة (Interface) اللي بتحدد إمكانيات السيرفيس ---
    public interface ICustomerService
    {
        Task<object> GetCustomersAsync(int page, int pageSize, string? search, string? sortBy);
        Task<Customer> CreateCustomerAsync(CustomerCreateDto dto);
        Task<bool> SoftDeleteCustomerAsync(int id);
    }

    // --- 2. تنفيذ المنطق البرمجي (Business Logic) ---
    public class CustomerService : ICustomerService
    {
        private readonly AppDbContext _context;

        public CustomerService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<object> GetCustomersAsync(int page, int pageSize, string? search, string? sortBy)
        {
            // بنجيب العملاء اللي مش ممسوحين بس (Soft Delete)
            var query = _context.Customers.Where(c => !c.IsDeleted).AsQueryable();

            // تطبيق البحث (Search)
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.ToLower();
                query = query.Where(c => 
                    c.FullName.ToLower().Contains(searchLower) || 
                    c.Email.ToLower().Contains(searchLower) || 
                    c.PhoneNumber.Contains(searchLower));
            }

            // تطبيق الترتيب (Sorting)
            query = sortBy?.ToLower() switch
            {
                "name" => query.OrderBy(c => c.FullName),
                "email" => query.OrderBy(c => c.Email),
                _ => query.OrderBy(c => c.Id)
            };

            // حسابات الصفحات (Pagination)
            var totalCount = await query.CountAsync();
            var customers = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return new
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
                Data = customers
            };
        }

        public async Task<Customer> CreateCustomerAsync(CustomerCreateDto dto)
        {
            var customer = new Customer
            {
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                NationalId = dto.NationalId,
                Email = dto.Email,
                Address = dto.Address,
                Type = dto.Type,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<bool> SoftDeleteCustomerAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            // لو العميل مش موجود أو ممسوح قبل كده، رجع false
            if (customer == null || customer.IsDeleted) return false;

            customer.IsDeleted = true; // مسح وهمي يحافظ على الداتا
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
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
        Task<Customer> UpdateCustomerAsync(int id, CustomerUpdateDto dto); // 👈 السطر ده انضاف
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
            // حماية بسيطة: صفحة وحجم صفحة لازم يكونوا أرقام موجبة
            if (page < 1) page = 1;
            if (pageSize < 1) pageSize = 10;

            // بنجيب العملاء اللي مش ممسوحين بس (Soft Delete)
            var query = _context.Customers.Where(c => !c.IsDeleted).AsQueryable();

            // تطبيق البحث (Search) - مع حماية من الـ null
            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.Trim().ToLower();
                query = query.Where(c =>
                    (c.FullName != null && c.FullName.ToLower().Contains(searchLower)) ||
                    (c.Email != null && c.Email.ToLower().Contains(searchLower)) ||
                    (c.PhoneNumber != null && c.PhoneNumber.Contains(searchLower)));
            }

            // تطبيق الترتيب (Sorting)
            query = sortBy?.ToLower() switch
            {
                "name" => query.OrderBy(c => c.FullName),
                "email" => query.OrderBy(c => c.Email),
                _ => query.OrderByDescending(c => c.Id) // رتبنا من الأحدث للأقدم
            };

            // حسابات الصفحات (Pagination)
            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            if (page > totalPages)
            {
                page = totalPages == 0 ? 1 : totalPages;
            }

            var customers = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new
            {
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                Data = customers
            };
        }

        public async Task<Customer> CreateCustomerAsync(CustomerCreateDto dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            // تحقق من عدم تكرار العميل
            var duplicateExists = await _context.Customers.AnyAsync(c =>
                !c.IsDeleted &&
                ((dto.NationalId != null && c.NationalId == dto.NationalId) ||
                 (dto.Email != null && c.Email == dto.Email) ||
                 (dto.PhoneNumber != null && c.PhoneNumber == dto.PhoneNumber)));

            if (duplicateExists)
                throw new InvalidOperationException("A customer with the same National ID, Email, or Phone Number already exists.");

            var customer = new Customer
            {
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                NationalId = dto.NationalId,
                Email = dto.Email,
                Address = dto.Address,
                Type = dto.Type,
                Balance = dto.Balance, // 👈 ضفنا الرصيد في الإنشاء
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        // 👈 الدالة دي كانت ناقصة بالكامل، دي اللي بتعمل التعديل!
        public async Task<Customer> UpdateCustomerAsync(int id, CustomerUpdateDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsDeleted) return null;

            customer.FullName = dto.FullName;
            customer.PhoneNumber = dto.PhoneNumber;
            customer.Email = dto.Email;
            customer.Address = dto.Address;
            customer.Type = dto.Type;
            customer.Balance = dto.Balance; // 👈 سطر الرصيد السحري

            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<bool> SoftDeleteCustomerAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsDeleted) return false;

            customer.IsDeleted = true; 

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
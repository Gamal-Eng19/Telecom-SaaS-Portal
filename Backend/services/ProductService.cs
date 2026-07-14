using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TelecomProject.Data; // مسار الداتا بيز
using TelecomProject.Models;
using TelecomProject.DTOs; // مسار الـ DTOs

namespace TelecomProject.services // تأكد إن الاسم ده نفس اللي في مشروعك
{
    public class ProductService
    {
        private readonly AppDbContext _context;

        public ProductService(AppDbContext context)
        {
            _context = context;
        }

        // Search
        public async Task<List<Product>> SearchProductsAsync(string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                return await GetAllProductsAsync();

            return await _context.Products
                .Where(p => p.Name.ToLower().Contains(keyword.ToLower()))
                .ToListAsync();
        }

        // Get All
        public async Task<List<Product>> GetAllProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }

        // Get By ID
        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _context.Products.FindAsync(id);
        }

        // Create (بياخد DTO)
        public async Task<Product> CreateProductAsync(ProductCreateDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Category = dto.Category,
                IsActive = true
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product; // بنرجع الموديل عشان الفرونت إند يقراه
        }

        // Update (بياخد DTO)
        public async Task<Product> UpdateProductAsync(int id, ProductCreateDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return null;

            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.Category = dto.Category;

            await _context.SaveChangesAsync();
            return product;
        }

        // Delete
        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
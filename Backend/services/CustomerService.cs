using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using TelecomProject.Data;
using TelecomProject.Models;
using TelecomProject.DTOs;
using BCrypt.Net;

namespace TelecomProject.Backend.Services
{
    public interface ICustomerService
    {
        Task<object> GetCustomersAsync(int page, int pageSize, string? search, string? sortBy);
        Task<Customer> GetCustomerByIdAsync(int id);
        Task<Customer> CreateCustomerAsync(CustomerCreateDto dto);
        Task<Customer> UpdateCustomerAsync(int id, CustomerUpdateDto dto); 
        Task<bool> SoftDeleteCustomerAsync(int id);
        Task<bool> VerifyEmailAsync(string email, string token);
        
        Task<Customer> LoginAsync(LoginDto dto);
        Task<bool> ForgotPasswordAsync(string email);
        Task<bool> ResetPasswordAsync(ResetPasswordDto dto);
    }

    public class CustomerService : ICustomerService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public CustomerService(AppDbContext context, IEmailService emailService) 
        { 
            _context = context; 
            _emailService = emailService;
        }

        public async Task<object> GetCustomersAsync(int page, int pageSize, string? search, string? sortBy)
        {
            if (page < 1) page = 1; if (pageSize < 1) pageSize = 10;
            var query = _context.Customers.Where(c => !c.IsDeleted).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                var searchLower = search.Trim().ToLower();
                query = query.Where(c =>
                    (c.FullName != null && c.FullName.ToLower().Contains(searchLower)) ||
                    (c.Email != null && c.Email.ToLower().Contains(searchLower)) ||
                    (c.PhoneNumber != null && c.PhoneNumber.Contains(searchLower)));
            }

            query = sortBy?.ToLower() switch {
                "name" => query.OrderBy(c => c.FullName),
                "email" => query.OrderBy(c => c.Email),
                _ => query.OrderByDescending(c => c.Id) 
            };

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);
            if (page > totalPages) page = totalPages == 0 ? 1 : totalPages;

            var customers = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
            return new { TotalCount = totalCount, Page = page, PageSize = pageSize, TotalPages = totalPages, Data = customers };
        }

        public async Task<Customer> GetCustomerByIdAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsDeleted) return null;
            return customer;
        }

        public async Task<Customer> CreateCustomerAsync(CustomerCreateDto dto)
        {
            var duplicateExists = await _context.Customers.AnyAsync(c => !c.IsDeleted &&
                ((dto.NationalId != null && c.NationalId == dto.NationalId) ||
                 (dto.Email != null && c.Email == dto.Email) ||
                 (dto.PhoneNumber != null && c.PhoneNumber == dto.PhoneNumber)));

            if (duplicateExists) throw new InvalidOperationException("National ID, Email, or Phone Number already exists.");

            var customer = new Customer
            {
                FullName = dto.FullName, PhoneNumber = dto.PhoneNumber, NationalId = dto.NationalId,
                Email = dto.Email, Address = dto.Address, Type = dto.Type, Balance = dto.Balance,
                // بنشفر الباسورد عشان الداتا بيز
                Password = !string.IsNullOrWhiteSpace(dto.Password) ? BCrypt.Net.BCrypt.HashPassword(dto.Password) : null,
                IsEmailVerified = false,
                VerificationToken = Guid.NewGuid().ToString(),
                CreatedAt = DateTime.UtcNow, IsDeleted = false
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            // 📩 إرسال إيميل الترحيب بالبيانات
            try
            {
                // بناخد الباسورد العادي اللي الأدمن كتبه عشان نبعته للعميل
                string rawPassword = string.IsNullOrWhiteSpace(dto.Password) ? "Not Provided" : dto.Password;
                string verificationLink = $"http://localhost:5000/api/Customers/verify?email={customer.Email}&token={customer.VerificationToken}";
                
                // ⚠️ هنا ضفنا بوكس شيك بيعرض الإيميل والباسورد
                string body = $@"
                    <div style='font-family: Arial, sans-serif; color: #333; max-width: 500px; margin: auto; border: 1px solid #e5e7eb; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);'>
                        <h2 style='color: #4F46E5; text-align: center; margin-top: 0;'>Welcome to Masar Telecom!</h2>
                        <p style='font-size: 16px;'>Hi <b>{customer.FullName}</b>,</p>
                        <p style='font-size: 15px; color: #555;'>Your account has been successfully created. Below are your login credentials to access the portal:</p>
                        
                        <div style='background-color: #f9fafb; border-left: 4px solid #4F46E5; padding: 15px 20px; margin: 25px 0; border-radius: 4px;'>
                            <p style='margin: 0 0 10px 0; font-size: 15px;'><b>Email:</b> <span style='color: #4F46E5;'>{customer.Email}</span></p>
                            <p style='margin: 0; font-size: 15px;'><b>Password:</b> <span style='color: #111827; font-family: monospace; font-size: 16px;'>{rawPassword}</span></p>
                        </div>

                        <p style='text-align: center; font-size: 15px;'>Please verify your email address to activate your account.</p>
                        
                        <div style='text-align: center; margin-top: 25px;'>
                            <a href='{verificationLink}' style='background-color: #4F46E5; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;'>Verify My Account</a>
                        </div>
                        
                        <p style='font-size: 12px; color: #9ca3af; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;'>
                            For security reasons, we highly recommend changing your password after your first login.
                        </p>
                    </div>";

                await _emailService.SendEmailAsync(customer.Email, "Your Masar Telecom Account Credentials", body);
            }
            catch { /* لو الإيميل فشل، منوقعش السيستم */ }

            return customer;
        }

        public async Task<Customer> UpdateCustomerAsync(int id, CustomerUpdateDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsDeleted) return null;

            customer.FullName = dto.FullName; customer.PhoneNumber = dto.PhoneNumber;
            customer.Email = dto.Email; customer.Address = dto.Address; customer.Type = dto.Type; customer.Balance = dto.Balance; 

            if (!string.IsNullOrWhiteSpace(dto.Password))
                customer.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task<bool> SoftDeleteCustomerAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null || customer.IsDeleted) return false;
            customer.IsDeleted = true; await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> VerifyEmailAsync(string email, string token)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == email && c.VerificationToken == token);
            if (customer == null) return false;
            customer.IsEmailVerified = true; customer.VerificationToken = null; 
            await _context.SaveChangesAsync(); return true;
        }
        
        public async Task<Customer> LoginAsync(LoginDto dto)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email && !c.IsDeleted);
            if (customer == null) throw new UnauthorizedAccessException("Email not found.");
            
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, customer.Password))
                throw new UnauthorizedAccessException("Incorrect password.");

            if (!customer.IsEmailVerified)
                throw new UnauthorizedAccessException("Email is not verified.");

            return customer;
        }

        public async Task<bool> ForgotPasswordAsync(string email)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == email && !c.IsDeleted);
            if (customer == null) return false;

            customer.ResetPasswordToken = Guid.NewGuid().ToString();
            customer.ResetTokenExpiresAt = DateTime.UtcNow.AddHours(1);
            await _context.SaveChangesAsync();

            try
            {
                string resetLink = $"http://localhost:5173/?mode=reset&email={customer.Email}&token={customer.ResetPasswordToken}";
                string body = $@"
                    <div style='font-family: Arial, sans-serif; text-align: center; color: #333;'>
                        <h2 style='color: #4F46E5;'>Password Reset Request</h2>
                        <p>Hi <b>{customer.FullName}</b>,</p>
                        <p>You requested to reset your password. Click the button below to create a new one.</p>
                        <a href='{resetLink}' style='background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 15px;'>Reset Password</a>
                        <p style='font-size: 12px; color: #777; margin-top: 20px;'>If you didn't request this, you can safely ignore this email.</p>
                    </div>";

                await _emailService.SendEmailAsync(customer.Email, "Reset Your Masar Telecom Password", body);
            }
            catch { return false; }

            return true;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == dto.Email && c.ResetPasswordToken == dto.Token && !c.IsDeleted);
            if (customer == null || customer.ResetTokenExpiresAt < DateTime.UtcNow) return false;

            customer.Password = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            customer.ResetPasswordToken = null;
            customer.ResetTokenExpiresAt = null;
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
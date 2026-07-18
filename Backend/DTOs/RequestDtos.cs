using TelecomProject.Models;

namespace TelecomProject.DTOs
{
    // ===================== العملاء =====================
    public class CustomerCreateDto
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string NationalId { get; set; }
        public string Email { get; set; }
        public string? Address { get; set; } 
        public CustomerType Type { get; set; } 
        public decimal Balance { get; set; }
        public string? Password { get; set; } // ⚠️ إضافة الباسورد
    }

    public class CustomerUpdateDto
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string? Address { get; set; }
        public CustomerType Type { get; set; }
        public decimal Balance { get; set; }
        public string? Password { get; set; } // ⚠️ إضافة الباسورد للتعديل
    }

    // ===================== المنتجات (الباقات القديمة) =====================
    public class ProductCreateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
    }

    // ===================== الطلبات =====================
    public class OrderCreateDto
    {
        public int CustomerId { get; set; }
        public int ProductId { get; set; }
    }

    public class OrderUpdateDto
    {
        public string Status { get; set; }
    }

    // ===================== الاشتراكات (الجديدة) =====================
    public class SubscriptionCreateDto
    {
        public string PlanName { get; set; }
        public decimal MonthlyPrice { get; set; }
        public int DataLimitGB { get; set; }
    }

    public class AuditLogCreateDto
    {
        public string User { get; set; }
        public string Role { get; set; }
        public string Action { get; set; }
        public string Details { get; set; }
    }
    
    // ===================== الـ Auth =====================
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ForgotPasswordDto
    {
        public string Email { get; set; }
    }

    public class ResetPasswordDto
    {
        public string Email { get; set; }
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
}
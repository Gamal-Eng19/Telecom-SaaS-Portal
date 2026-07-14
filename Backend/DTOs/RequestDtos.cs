using TelecomProject.Models; // دي مهمة عشان الـ CustomerType

namespace TelecomProject.DTOs
{
    // ===================== العملاء =====================
    public class CustomerCreateDto
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string NationalId { get; set; }
        public string Email { get; set; }
        public string? Address { get; set; } // إضافة جديدة
        public CustomerType Type { get; set; } // إضافة جديدة
    }

    public class CustomerUpdateDto
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string? Address { get; set; }
        public CustomerType Type { get; set; }
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
}


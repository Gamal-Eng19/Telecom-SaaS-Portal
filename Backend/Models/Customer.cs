using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations; // ⚠️ ضفنا دي عشان الـ Constraints

namespace TelecomProject.Models
{
    // --- Enums ---
    public enum CustomerType { Regular, VIP, Corporate }
    public enum SubscriptionStatus { Active, Suspended, Cancelled }

    // --- Models ---
    public class Customer
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }

        // ⚠️ تقييد الرقم القومي لـ 14 رقم وأرقام فقط
        [MaxLength(14, ErrorMessage = "National ID cannot exceed 14 digits.")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Only numbers are allowed.")]
        public string NationalId { get; set; }

        public string Email { get; set; }
        public string? Address { get; set; } 
        public CustomerType Type { get; set; } = CustomerType.Regular; 
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false; 
       
        [System.ComponentModel.DataAnnotations.Schema.Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; } = 0;

        // === ⚠️ الحقول الجديدة الخاصة بالباسوورد والتأكيد ===
        public string? Password { get; set; }
        public bool IsEmailVerified { get; set; } = false;
        public string? VerificationToken { get; set; }
        public string? ResetPasswordToken { get; set; }
        public DateTime? ResetTokenExpiresAt { get; set; }
        public ICollection<Subscription> Subscriptions { get; set; } = new List<Subscription>();
    }

    public class Subscription
    {
        public int Id { get; set; }
        public string PlanName { get; set; }
        public decimal MonthlyPrice { get; set; }
        public int DataLimitGB { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public SubscriptionStatus Status { get; set; } = SubscriptionStatus.Active;

        public int CustomerId { get; set; }
        public Customer Customer { get; set; }
    }
}
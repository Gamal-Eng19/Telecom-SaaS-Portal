using System;
using System.Collections.Generic;

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
        public string NationalId { get; set; }
        public string Email { get; set; }
        public string? Address { get; set; } 
        public CustomerType Type { get; set; } = CustomerType.Regular; 
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false; 

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
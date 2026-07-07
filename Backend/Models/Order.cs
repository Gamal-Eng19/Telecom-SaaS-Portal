using System;

namespace TelecomProject.Models
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public string Status { get; set; } // Pending, Active, Cancelled


        public int CustomerId { get; set; }
        public Customer Customer { get; set; }

        
        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}
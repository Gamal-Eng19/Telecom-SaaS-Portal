using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema; // ضفنا السطر ده

namespace TelecomProject.Models
    namespace Backend.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        
        [Column(TypeName = "decimal(18,2)")] // ضفنا السطر ده عشان نظبط الفلوس
        public decimal Price { get; set; }
        
        public string Category { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<Order> Orders { get; set; }
    }
}
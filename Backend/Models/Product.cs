using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema; // مهم جداً عشان نظبط الفلوس في الداتا بيز

namespace TelecomProject.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        
        [Column(TypeName = "decimal(18,2)")] // السطر ده بيمنع إيرور الكسور العشرية
        public decimal Price { get; set; }
        
        public string Category { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<Order> Orders { get; set; }
    }
}
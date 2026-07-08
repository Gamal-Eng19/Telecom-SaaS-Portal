namespace TelecomProject.DTOs
{
    public class OrderResponseDto 
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
        public string CustomerName { get; set; } // اسم العميل بس
        public string ProductName { get; set; }  // اسم الباقة بس
    }
}
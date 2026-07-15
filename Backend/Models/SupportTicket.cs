namespace TelecomProject.Models
{
    public class SupportTicket
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerEmail { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Resolved
        public string? Response { get; set; }
        public string? CreatedAt { get; set; }
    }
}
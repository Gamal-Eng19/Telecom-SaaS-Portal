namespace TelecomProject.Models
{
    public class AuditLog
    {
        public int Id { get; set; }
        public string Timestamp { get; set; } 
        public string User { get; set; }
        public string Role { get; set; }
        public string Action { get; set; }
        public string Details { get; set; }
    }
}
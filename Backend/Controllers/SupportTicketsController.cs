using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using TelecomProject.Data;
using TelecomProject.Models;

namespace TelecomProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportTicketsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SupportTicketsController(AppDbContext context)
        {
            _context = context;
        }

        // جلب كل التذاكر للأدمن
        [HttpGet]
        public async Task<IActionResult> GetTickets()
        {
            return Ok(await _context.SupportTickets.OrderByDescending(t => t.Id).ToListAsync());
        }

        // إنشاء تذكرة جديدة من العميل
        [HttpPost]
        public async Task<IActionResult> CreateTicket([FromBody] SupportTicket ticket)
        {
            ticket.CreatedAt = DateTime.Now.ToString("MM/dd/yyyy, hh:mm tt");
            ticket.Status = "Pending";
            
            _context.SupportTickets.Add(ticket);
            await _context.SaveChangesAsync();
            return Ok(ticket);
        }

        // رد الأدمن وإرسال الإيميل
        [HttpPost("{id}/respond")]
        public async Task<IActionResult> RespondToTicket(int id, [FromBody] TicketRespondDto dto)
        {
            var ticket = await _context.SupportTickets.FindAsync(id);
            if (ticket == null) return NotFound("Ticket not found");

            ticket.Response = dto.Response;
            ticket.Status = "Resolved";
            await _context.SaveChangesAsync();

            // === 📧 كود إرسال الإيميل الحقيقي للعميل ===
            try
            {
                var mailMessage = new MailMessage
                {
                    // حط إيميلك هنا (ده اللي هيظهر للعميل كمرسل)
                    From = new MailAddress("YOUR_EMAIL@gmail.com", "Masar Telecom Support"),
                    Subject = "Support Ticket Update: " + ticket.Subject,
                    Body = $"Dear {ticket.CustomerName},\n\nRegarding your issue:\n\"{ticket.Message}\"\n\nOur Support Team Response:\n{dto.Response}\n\nBest Regards,\nMasar Telecom CRM",
                    IsBodyHtml = false,
                };
                mailMessage.To.Add(ticket.CustomerEmail);

                using var smtpClient = new SmtpClient("smtp.gmail.com", 587)
                {
                    // حط إيميلك تاني هنا، والباسورد بتاعه (يفضل App Password من إعدادات جوجل)
                    Credentials = new NetworkCredential("YOUR_EMAIL@gmail.com", "YOUR_GMAIL_APP_PASSWORD"),
                    EnableSsl = true
                };
                
                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                // لو الإيميل فشل (عشان محطيتش الباسورد لسه)، التذكرة هتتقفل عادي في السيستم 
                Console.WriteLine("Email failed to send: " + ex.Message);
            }

            return Ok(ticket);
        }
    }

    // DTO بسيط لاستقبال رد الأدمن
    public class TicketRespondDto
    {
        public string Response { get; set; }
    }
}
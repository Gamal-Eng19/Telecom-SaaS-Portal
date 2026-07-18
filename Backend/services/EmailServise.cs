using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;
using System.Threading.Tasks;

namespace TelecomProject.Backend.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var email = new MimeMessage();
            // بياخد الإيميل بتاع الشركة من الـ appsettings
            email.From.Add(MailboxAddress.Parse(_config["EmailSettings:Email"]));
            // الإيميل بتاع العميل اللي هتوصله الرسالة
            email.To.Add(MailboxAddress.Parse(toEmail));
            
            email.Subject = subject;
            email.Body = new TextPart(TextFormat.Html) { Text = body };

            using var smtp = new SmtpClient();
            
            // الاتصال بسيرفر جوجل
            await smtp.ConnectAsync(_config["EmailSettings:Host"], int.Parse(_config["EmailSettings:Port"]), SecureSocketOptions.StartTls);
            
            // تسجيل الدخول بإيميل الشركة والـ App Password
            await smtp.AuthenticateAsync(_config["EmailSettings:Email"], _config["EmailSettings:Password"]);
            
            // إرسال الإيميل
            await smtp.SendAsync(email);
            
            // قفل الاتصال
            await smtp.DisconnectAsync(true);
        }
    }
}
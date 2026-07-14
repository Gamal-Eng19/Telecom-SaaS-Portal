using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using TelecomProject.services;
using TelecomProject.DTOs;

namespace TelecomProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuditLogsController : ControllerBase
    {
        private readonly AuditLogService _auditLogService;

        public AuditLogsController(AuditLogService auditLogService)
        {
            _auditLogService = auditLogService;
        }

        [HttpGet]
        public async Task<IActionResult> GetLogs()
        {
            return Ok(await _auditLogService.GetLogsAsync());
        }

        [HttpPost]
        public async Task<IActionResult> CreateLog([FromBody] AuditLogCreateDto dto)
        {
            return Ok(await _auditLogService.CreateLogAsync(dto));
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearLogs()
        {
            await _auditLogService.ClearLogsAsync();
            return Ok(new { message = "Logs Cleared" });
        }
    }
}
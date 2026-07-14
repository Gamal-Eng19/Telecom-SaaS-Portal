using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TelecomProject.Data;
using TelecomProject.Models;
using TelecomProject.DTOs;

namespace TelecomProject.services 
{
    public class AuditLogService
    {
        private readonly AppDbContext _context;

        public AuditLogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<AuditLog>> GetLogsAsync()
        {
            // بنجيبهم مترتبين من الأحدث للأقدم عشان يظهروا صح في الداش بورد
            return await _context.AuditLogs.OrderByDescending(a => a.Id).ToListAsync();
        }

        public async Task<AuditLog> CreateLogAsync(AuditLogCreateDto dto)
        {
            var log = new AuditLog
            {
                // السيرفر هو اللي بيكتب الوقت بنفسه عشان نضمن إن الوقت صح
                Timestamp = DateTime.Now.ToString("MM/dd/yyyy, hh:mm:ss tt"), 
                User = dto.User,
                Role = dto.Role,
                Action = dto.Action,
                Details = dto.Details
            };

            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
            return log;
        }

        public async Task ClearLogsAsync()
        {
            var logs = await _context.AuditLogs.ToListAsync();
            _context.AuditLogs.RemoveRange(logs);
            await _context.SaveChangesAsync();
        }
    }
}
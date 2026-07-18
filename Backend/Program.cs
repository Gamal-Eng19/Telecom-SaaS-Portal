using Microsoft.EntityFrameworkCore;
using TelecomProject.Data;
using TelecomProject.services; 
using TelecomProject.Backend.Services; 

var builder = WebApplication.CreateBuilder(args);

// 1. تفعيل الـ Controllers ومنع مشكلة الـ Circular Reference
builder.Services.AddControllers()
    .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);
    
// تسجيل الـ ProductService
builder.Services.AddScoped<ProductService>();

// 2. ربط الـ AppDbContext بقاعدة بيانات PostgreSQL (Supabase)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. إعداد الـ CORS عشان الفرونت إند (React) يقدر يكلم الباك إند
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. تفعيل Swagger 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ⚠️ تسجيل السيرفيسز الأساسية + الإيميل سيرفيس الجديدة
builder.Services.AddScoped<IEmailService, EmailService>(); // ضفنا سطر الإيميل
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<AuditLogService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

// هنشغل الـ HTTPS Redirection في الـ Production بس
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseRouting();

// تفعيل استخدام الـ CORS 
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
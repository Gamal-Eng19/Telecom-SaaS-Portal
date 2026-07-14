using Microsoft.EntityFrameworkCore;
using TelecomProject.Data;
using TelecomProject.services; // عشان يقرأ الـ ProductService
using TelecomProject.Backend.Services; // عشان يقرأ الـ CustomerService والـ OrderService

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
        // حطينا بورت 3000 و 5173 عشان دول أشهر بورتات لـ React و Vite
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 4. تفعيل Swagger (واجهة ممتازة عشان نجرب منها الـ APIs بتاعتنا)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// تسجيل الـ CustomerService
builder.Services.AddScoped<ICustomerService, CustomerService>();

// تسجيل الـ OrderService
builder.Services.AddScoped<IOrderService, OrderService>();


builder.Services.AddScoped<AuditLogService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

// تفعيل استخدام الـ CORS اللي عملناه فوق
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
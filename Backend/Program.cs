using Microsoft.EntityFrameworkCore;
using TelecomProject.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. تفعيل الـ Controllers
builder.Services.AddControllers();

// 2. ربط الـ AppDbContext بقاعدة بيانات SQL Server
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

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// تفعيل استخدام الـ CORS اللي عملناه فوق
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.Run();
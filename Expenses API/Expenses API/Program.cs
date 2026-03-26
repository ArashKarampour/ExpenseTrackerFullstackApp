using Expenses_API.Data;
using Expenses_API.Data.Services;
using Expenses_API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
// adding the connection string to the database and configuring the DbContext to use MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(opt => opt.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddScoped<ITransactionService, TransactionsService>(); // Registering the TransactionsService with the DI container
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

// Adding CORS setting for angular front end app
builder.Services.AddCors(opt => opt.AddPolicy("AllowAngularDev", policy => policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200")));

// Adding authentication using JWT Bearer tokens
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
}); 

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// setting to use the cors setting
app.UseCors("AllowAngularDev");
app.UseHttpsRedirection();

app.UseAuthentication(); // Adding authentication middleware to the pipeline
app.UseAuthorization();

app.MapControllers();

app.Run();

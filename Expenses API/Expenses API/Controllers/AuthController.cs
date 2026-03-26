using Expenses_API.Data;
using Expenses_API.Dtos;
using Expenses_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Expenses_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(AppDbContext context, IPasswordHasher<User> passwordHasher) : ControllerBase
    {
        [HttpPost("Register")]
        public IActionResult RegisterUser([FromBody] RegisterUserDto payload)
        {
            // Check if the email is already registered
            if (context.Users.Any(u => u.Email == payload.Email)) 
                return BadRequest("This Email is already taken!"); // User with the Email already exists

            var hashedPassword = passwordHasher.HashPassword(null, payload.Password); // hash the password before storing it in the database

            var newUser = new User() 
            {
                Email = payload.Email,
                Password = hashedPassword,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.Add(newUser);
            context.SaveChanges();

            var token = GenerateJwtToken(newUser);

            return Ok(new {Token = token});
        }

        private string GenerateJwtToken(User user)
        {
            var builder = WebApplication.CreateBuilder();

            //new Claim(ClaimTypes.Role, user.Role) // You can add roles or other claims as needed, but we need to add the Role property to the User model and migrate the database with it and set it during registration for this to work. You can also skip this claim if you don't need role-based authorization.
            var claims = new Claim[] 
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()), 
                new Claim(ClaimTypes.Email, user.Email)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: builder.Configuration["Jwt:Issuer"],
                audience: builder.Configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
                );

                       
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("Login")]
        public IActionResult LoginUser([FromBody] LoginUserDto payload)
        {
            var user = context.Users.FirstOrDefault(u => u.Email == payload.Email);
            if (user == null)
                return Unauthorized("Invalid email or password!");

            var passwordVerificationResult =  passwordHasher.VerifyHashedPassword(user, user.Password, payload.Password); // verify the password using the password hasher
            if(passwordVerificationResult == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid email or password!");

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });
        }

    }
}

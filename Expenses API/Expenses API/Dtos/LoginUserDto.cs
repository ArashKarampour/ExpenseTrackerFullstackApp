using System.ComponentModel.DataAnnotations;

namespace Expenses_API.Dtos
{
    public class LoginUserDto
    {
        [Required]
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

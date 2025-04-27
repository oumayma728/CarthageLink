using System.ComponentModel.DataAnnotations;

namespace CarthageLink.Server.Models
{
    public class ResetPasswordModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        [MinLength(8)]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword", ErrorMessage = "Passwords don't match.")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}

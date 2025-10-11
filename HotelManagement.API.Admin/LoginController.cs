using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using HotelManagement.Module;
using BLL;
using System.Data;

namespace HotelManagement.API.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly NguoiDungBLL _bll;

        public LoginController()
        {
            _bll = new NguoiDungBLL();
        }

        [HttpPost]
        public IActionResult Login([FromBody] NguoiDung login)
        {
            try
            {
                if (login == null || string.IsNullOrEmpty(login.TenDangNhap) || string.IsNullOrEmpty(login.MatKhau))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Tên đăng nhập hoặc mật khẩu không được để trống"
                    });
                }

                DataTable dt = _bll.GetAll();
                var user = dt.AsEnumerable()
                    .FirstOrDefault(r => r["TenDangNhap"].ToString() == login.TenDangNhap && r["MatKhau"].ToString() == login.MatKhau);

                if (user == null)
                {
                    return Unauthorized(new
                    {
                        success = false,
                        message = "Tên đăng nhập hoặc mật khẩu sai"
                    });
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes("your-256-bit-secret"); // Thay secret
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new System.Security.Claims.ClaimsIdentity(new[]
                    {
                        new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, user["VaiTro"].ToString())
                    }),
                    Expires = DateTime.UtcNow.AddHours(1), // Token hết hạn sau 1 giờ
                    Issuer = "yourIssuer",
                    Audience = "yourAudience",
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var tokenString = tokenHandler.WriteToken(token);

                return Ok(new
                {
                    success = true,
                    message = "Đăng nhập thành công",
                    token = tokenString
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi: " + ex.Message
                });
            }
        }
    }
}
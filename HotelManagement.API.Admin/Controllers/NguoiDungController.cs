using Microsoft.AspNetCore.Mvc;
using BLL;  
using HotelManagement.Module;  
using System.Data;

namespace HotelManagement.API.Admin.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NguoiDungController : ControllerBase
    {
        private readonly NguoiDungBLL _bll = new NguoiDungBLL();

        [HttpGet]
        public IActionResult GetAll()
        {
            try { DataTable dt = _bll.GetAll(); return Ok(dt); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpGet("{maND}")]
        public IActionResult GetById(int maND)
        {
            try { DataTable dt = _bll.GetById(maND); return dt.Rows.Count > 0 ? Ok(dt) : NotFound(); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpPost]
        public IActionResult Them([FromBody] NguoiDung obj)  // Class từ Module
        {
            if (obj == null) return BadRequest("Dữ liệu rỗng");
            try { string result = _bll.Them(obj); return Ok(result); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpPut("{maND}")]
        public IActionResult Sua(int maND, [FromBody] NguoiDung obj)
        {
            if (obj == null) return BadRequest("Dữ liệu rỗng");
            obj.MaND = maND;
            try { string result = _bll.Sua(obj); return Ok(result); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpDelete("{maND}")]
        public IActionResult Xoa(int maND)
        {
            try { string result = _bll.Xoa(maND); return Ok(result); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using BLL;  // GiaBLL
using HotelManagement.Module;  // Class Gia
using System.Data;

namespace HotelManagement.API.Common.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GiaController : ControllerBase
    {
        private readonly GiaBLL _bll = new GiaBLL();

        [HttpGet]
        public IActionResult GetAll()
        {
            try { DataTable dt = _bll.GetAll(); return Ok(dt); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpGet("{maGia}")]
        public IActionResult GetById(int maGia)
        {
            try { DataTable dt = _bll.GetById(maGia); return dt.Rows.Count > 0 ? Ok(dt) : NotFound(); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpPost]
        public IActionResult Them([FromBody] Gia obj)
        {
            if (obj == null) return BadRequest("Dữ liệu rỗng");
            try { string result = _bll.Them(obj); return Ok(result); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpPut("{maGia}")]
        public IActionResult Sua(int maGia, [FromBody] Gia obj)
        {
            if (obj == null) return BadRequest("Dữ liệu rỗng");
            obj.MaGia = maGia;
            try { string result = _bll.Sua(obj); return Ok(result); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpDelete("{maGia}")]
        public IActionResult Xoa(int maGia)
        {
            try { string result = _bll.Xoa(maGia); return Ok(result); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }
    }
}
using Microsoft.AspNetCore.Mvc;
using BLL;  
using HotelManagement.Module;  
using System.Data;

namespace HotelManagement.API.Common.Controllers  // Giả sử namespace Common
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoaiPhongController : ControllerBase
    {
        private readonly LoaiPhongBLL _bll = new LoaiPhongBLL();

        [HttpGet] public IActionResult GetAll() { try { DataTable dt = _bll.GetAll(); return Ok(dt); } catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); } }

        [HttpGet("{maLoaiPhong}")]
        public IActionResult GetById(int maLoaiPhong)
        {
            try { DataTable dt = _bll.GetById(maLoaiPhong); return dt.Rows.Count > 0 ? Ok(dt) : NotFound(); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpPost]
        public IActionResult Them([FromBody] LoaiPhong obj)  // Class từ Module
        {
            if (obj == null) return BadRequest("Dữ liệu rỗng");
            try { string result = _bll.Them(obj); return Ok(result); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpPut("{maLoaiPhong}")]
        public IActionResult Sua(int maLoaiPhong, [FromBody] LoaiPhong obj)
        {
            if (obj == null) return BadRequest("Dữ liệu rỗng");
            obj.MaLoaiPhong = maLoaiPhong;
            try { string result = _bll.Sua(obj); return Ok(result); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpDelete("{maLoaiPhong}")]
        public IActionResult Xoa(int maLoaiPhong)
        {
            try { string result = _bll.Xoa(maLoaiPhong); return Ok(result); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }
    }
}
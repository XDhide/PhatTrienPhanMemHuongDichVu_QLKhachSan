using Microsoft.AspNetCore.Mvc;
using BLL;  // DichVuBLL
using HotelManagement.Module;  // Class DichVu
using System.Data;

namespace HotelManagement.API.Common.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DichVuController : ControllerBase
    {
        private readonly DichVuBLL _bll = new DichVuBLL();

        [HttpGet]
        public IActionResult GetAll()
        {
            try { DataTable dt = _bll.GetAll(); return Ok(dt); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpGet("{maDV}")]
        public IActionResult GetById(int maDV)
        {
            try { DataTable dt = _bll.GetById(maDV); return dt.Rows.Count > 0 ? Ok(dt) : NotFound(); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpPost]
        public IActionResult Them([FromBody] DichVu obj)
        {
            if (obj == null) return BadRequest("Dữ liệu rỗng");
            try { string result = _bll.Them(obj); return Ok(result); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpPut("{maDV}")]
        public IActionResult Sua(int maDV, [FromBody] DichVu obj)
        {
            if (obj == null) return BadRequest("Dữ liệu rỗng");
            obj.MaDV = maDV;
            try { string result = _bll.Sua(obj); return Ok(result); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }

        [HttpDelete("{maDV}")]
        public IActionResult Xoa(int maDV)
        {
            try { string result = _bll.Xoa(maDV); return Ok(result); }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }
    }
}
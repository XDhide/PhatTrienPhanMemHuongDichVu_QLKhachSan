using Microsoft.AspNetCore.Mvc;
using System.Data;
using BLL;
using HotelManagement.Module;

namespace HotelManagement.API.Customer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoaiPhongController : ControllerBase
    {
        private readonly LoaiPhongBLL _bll = new LoaiPhongBLL();

        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                DataTable dt = _bll.GetAll();
                var list = new List<object>();
                foreach (DataRow r in dt.Rows)
                {
                    list.Add(new
                    {
                        MaLoaiPhong = r["MaLoaiPhong"],
                        Ma = r["Ma"],
                        Ten = r["Ten"],
                        MoTa = r["MoTa"],
                        SoKhachToiDa = r["SoKhachToiDa"]
                    });
                }
                return Ok(new { success = true, message = "OK", data = list });
            }
            catch (Exception ex) { return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message }); }
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                DataTable dt = _bll.GetById(id);
                if (dt.Rows.Count == 0)
                    return NotFound(new { success = false, message = "Không tìm thấy loại phòng" });

                var r = dt.Rows[0];
                var obj = new
                {
                    MaLoaiPhong = r["MaLoaiPhong"],
                    Ma = r["Ma"],
                    Ten = r["Ten"],
                    MoTa = r["MoTa"],
                    SoKhachToiDa = r["SoKhachToiDa"]
                };
                return Ok(new { success = true, message = "OK", data = obj });
            }
            catch (Exception ex) { return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message }); }
        }

        [HttpPost]
        public IActionResult Create([FromBody] LoaiPhong obj)
        {
            try
            {
                if (obj == null) return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ" });
                string result = _bll.Them(obj);
                if (result.Contains("Lỗi")) return BadRequest(new { success = false, message = result });
                return Ok(new { success = true, message = result });
            }
            catch (Exception ex) { return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message }); }
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] LoaiPhong obj)
        {
            try
            {
                if (obj == null) return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ" });
                obj.MaLoaiPhong = id;
                string result = _bll.Sua(obj);
                if (result.Contains("Lỗi")) return BadRequest(new { success = false, message = result });
                return Ok(new { success = true, message = result });
            }
            catch (Exception ex) { return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message }); }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                string result = _bll.Xoa(id);
                if (result.Contains("Lỗi")) return BadRequest(new { success = false, message = result });
                return Ok(new { success = true, message = result });
            }
            catch (Exception ex) { return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message }); }
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using BLL;
using HotelManagement.Module;

namespace HotelManagement.API.Customer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DatPhongController : ControllerBase
    {
        private readonly DatPhongBLL _bll;

        public DatPhongController()
        {
            _bll = new DatPhongBLL();
        }

        // GET: api/datphong
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
                        MaDatPhong = r["MaDatPhong"],
                        MaDat = r["MaDat"],
                        MaKhach = r["MaKhach"],
                        MaPhong = r["MaPhong"],        // có thể null
                        MaLoaiPhong = r["MaLoaiPhong"],
                        NgayNhan = r["NgayNhan"],
                        NgayTra = r["NgayTra"],
                        SoKhach = r["SoKhach"],
                        TrangThai = r["TrangThai"],
                        NguoiTao = r["NguoiTao"],       // có thể null
                        NgayTao = r["NgayTao"],
                        GhiChu = r["GhiChu"]
                    });
                }
                return Ok(new { success = true, message = "OK", data = list });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message });
            }
        }

        // GET: api/datphong/{id}
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                DataTable dt = _bll.GetById(id);
                if (dt.Rows.Count == 0)
                    return NotFound(new { success = false, message = "Không tìm thấy đơn đặt phòng" });

                var r = dt.Rows[0];
                var obj = new
                {
                    MaDatPhong = r["MaDatPhong"],
                    MaDat = r["MaDat"],
                    MaKhach = r["MaKhach"],
                    MaPhong = r["MaPhong"],
                    MaLoaiPhong = r["MaLoaiPhong"],
                    NgayNhan = r["NgayNhan"],
                    NgayTra = r["NgayTra"],
                    SoKhach = r["SoKhach"],
                    TrangThai = r["TrangThai"],
                    NguoiTao = r["NguoiTao"],
                    NgayTao = r["NgayTao"],
                    GhiChu = r["GhiChu"]
                };
                return Ok(new { success = true, message = "OK", data = obj });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message });
            }
        }

        // POST: api/datphong
        [HttpPost]
        public IActionResult Create([FromBody] DatPhong don)
        {
            try
            {
                if (don == null)
                    return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ" });

                string result = _bll.Them(don);  // BLL cần tự kiểm tra trùng phòng
                if (result.Contains("Lỗi"))
                    return BadRequest(new { success = false, message = result });

                return Ok(new { success = true, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message });
            }
        }

        // PUT: api/datphong/{id}
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] DatPhong don)
        {
            try
            {
                if (don == null)
                    return BadRequest(new { success = false, message = "Dữ liệu không hợp lệ" });

                // SỬA Ở ĐÂY:
                don.MaDatPhong = id;

                string result = _bll.Sua(don);
                if (result.Contains("Lỗi"))
                    return BadRequest(new { success = false, message = result });

                return Ok(new { success = true, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message });
            }
        }

        // DELETE: api/datphong/{id}
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                string result = _bll.Xoa(id);
                if (result.Contains("Lỗi"))
                    return BadRequest(new { success = false, message = result });

                return Ok(new { success = true, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message });
            }
        }
    }
}

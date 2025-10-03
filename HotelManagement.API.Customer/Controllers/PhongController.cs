using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using BLL;

namespace HotelManagement.API.Customer.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhongController : ControllerBase
    {
        private readonly LoaiPhongBLL _loaiBll;
        private readonly PhongBLL _phongBll;
        private readonly GiaBLL _giaBll;

        public PhongController()
        {
            _loaiBll = new LoaiPhongBLL();
            _phongBll = new PhongBLL();
            _giaBll = new GiaBLL();
        }

        // GET: api/phong/loai  (danh mục loại phòng)
        [HttpGet("loai")]
        public IActionResult GetLoai()
        {
            try
            {
                DataTable dt = _loaiBll.GetAll();
                var list = new List<object>();
                foreach (DataRow r in dt.Rows)
                {
                    list.Add(new
                    {
                        MaLoai = r["MaLoai"],
                        TenLoai = r["TenLoai"],
                        SucChua = r["SucChua"],
                        Giuong = r["LoaiGiuong"],
                        GiaGoc = r["GiaGoc"]
                    });
                }
                return Ok(new { success = true, message = "OK", data = list });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message });
            }
        }

        // GET: api/phong  (danh sách phòng cụ thể)
        [HttpGet]
        public IActionResult GetPhong()
        {
            try
            {
                DataTable dt = _phongBll.GetAll();
                var list = new List<object>();
                foreach (DataRow r in dt.Rows)
                {
                    list.Add(new
                    {
                        MaPhong = r["MaPhong"],
                        TenPhong = r["TenPhong"],
                        MaLoai = r["MaLoai"],
                        Tang = r["Tang"],
                        TrangThai = r["TrangThai"]
                    });
                }
                return Ok(new { success = true, message = "OK", data = list });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message });
            }
        }

        // GET: api/phong/lich?roomTypeId=1&from=...&to=...
        // Hiện chưa có hàm trong BLL → trả 501 để thống nhất API, sau này nối DAL/BLL.
        [HttpGet("lich")]
        public IActionResult GetLich([FromQuery] int roomTypeId, [FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            return StatusCode(501, new { success = false, message = "Chưa cài đặt: cần bổ sung hàm kiểm tra phòng trống trong PhongDAL/BLL." });
        }

        // GET: api/phong/baogia?roomTypeId=1&from=...&to=...&channel=web
        [HttpGet("baogia")]
        public IActionResult BaoGia([FromQuery] int roomTypeId, [FromQuery] DateTime from, [FromQuery] DateTime to, [FromQuery] string channel = "web")
        {
            return StatusCode(501, new { success = false, message = "Chưa cài đặt: cần bổ sung hàm báo giá theo ngày/mùa trong GiaDAL/BLL." });
        }
    }
}

using BLL;
using HotelManagement.Module;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text.Json;


namespace HotelManagement.API.Accounting.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class HoaDonController : ControllerBase
    {
        private readonly HoaDonBLL _bll;

        public HoaDonController()
        {
            _bll = new HoaDonBLL();
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            try
            {
                DataTable dt = _bll.GetAll();
                var result = new List<object>();

                foreach (DataRow row in dt.Rows)
                {
                    result.Add(new
                    {
                        MaHD = row["MaHD"],
                        SoHD = row["SoHD"],
                        MaKhach = row["MaKhach"],
                        MaND = row["MaND"],
                        NgayLap = row["NgayLap"],
                        TongTien = row["TongTien"],
                        HinhThucThanhToan = row["HinhThucThanhToan"],
                        SoTienDaTra = row["SoTienDaTra"],
                        SoTienConNo = row["SoTienConNo"]
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách hóa đơn thành công",
                    data = result
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

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                DataTable dt = _bll.GetById(id);

                if (dt.Rows.Count == 0)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Không tìm thấy hóa đơn"
                    });
                }

                DataRow row = dt.Rows[0];
                var result = new
                {
                    MaHD = row["MaHD"],
                    SoHD = row["SoHD"],
                    MaKhach = row["MaKhach"],
                    MaND = row["MaND"],
                    NgayLap = row["NgayLap"],
                    TongTien = row["TongTien"],
                    HinhThucThanhToan = row["HinhThucThanhToan"],
                    SoTienDaTra = row["SoTienDaTra"],
                    SoTienConNo = row["SoTienConNo"]
                };

                return Ok(new
                {
                    success = true,
                    message = "Lấy chi tiết hóa đơn thành công",
                    data = result
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

        [HttpPost]
        public IActionResult Create([FromBody] HoaDon hoaDon)
        {
            try
            {
                if (hoaDon == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Dữ liệu không hợp lệ"
                    });
                }

                string result = _bll.Them(hoaDon);

                if (result.Contains("Lỗi"))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = result
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = result
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

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] HoaDon hoaDon)
        {
            try
            {
                if (hoaDon == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Dữ liệu không hợp lệ"
                    });
                }

                hoaDon.MaHD = id;
                string result = _bll.Sua(hoaDon);

                if (result.Contains("Lỗi"))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = result
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = result
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



        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                string result = _bll.Xoa(id);

                if (result.Contains("Lỗi"))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = result
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = result
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



            [HttpGet("Getpayment/{id}")]
            public IActionResult GetPayment(int id)
            {
                try
                {
                    var hoaDonChiTiet = _bll.GetPayment(id);

                    if (hoaDonChiTiet == null || hoaDonChiTiet.Rows.Count == 0)
                    {
                        return NotFound(new
                        {
                            success = false,
                            message = "Không tìm thấy hóa đơn hoặc hóa đơn không có chi tiết."
                        });
                    }

                    var chiTietList = hoaDonChiTiet.AsEnumerable().Select(row => new
                    {
                        MaCTHD = row["MaCTHD"],
                        MaHD = row["MaHD"],
                        MaDatPhong = row["MaDatPhong"] == DBNull.Value ? null : row["MaDatPhong"],
                        MaDV = row["MaDV"] == DBNull.Value ? null : row["MaDV"],
                        SoLuong = row["SoLuong"],
                        DonGia = row["DonGia"],
                        ThanhTien = row["ThanhTien"],
                        SoHD = row["SoHD"],
                        NgayLap = row["NgayLap"],
                        TongTien = row["TongTien"],
                        HinhThucThanhToan = row["HinhThucThanhToan"],
                        SoTienDaTra = row["SoTienDaTra"],
                        SoTienConNo = row["SoTienConNo"]
                    }).ToList();

                    decimal tongTien = chiTietList.Sum(x => Convert.ToDecimal(x.ThanhTien));

                return Ok(new
                {
                    success = true,
                    message = "Lấy thông tin hóa đơn thành công.",
                    data = new
                    {
                        MaHD = id,
                        TongTien = tongTien,
                        ChiTiet = chiTietList
                    }
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

        [HttpPut("payment/{maHD}")]
        public IActionResult Payment(int maHD, [FromBody] JsonElement request)
        {
            try
            {
                decimal soTienTra = request.GetProperty("soTienTra").GetDecimal();
                string hinhThucThanhToan = request.GetProperty("hinhThucThanhToan").GetString();
                string tinhTrang = request.TryGetProperty("tinhTrang", out JsonElement tt) ? tt.GetString() : "SanSang";

                string result = _bll.Payment(
                    maHD,
                    tinhTrang,
                    soTienTra,
                    hinhThucThanhToan
                );

                if (result.Contains("Lỗi"))
                {
                    return BadRequest(new { success = false, message = result });
                }

                return Ok(new { success = true, message = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Lỗi: " + ex.Message });
            }
        }





    }
}
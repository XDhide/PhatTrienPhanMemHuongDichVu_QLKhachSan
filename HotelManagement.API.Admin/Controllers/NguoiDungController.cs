using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using BLL;
using HotelManagement.Module;

namespace HotelManagement.API.Admin.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NguoiDungController : ControllerBase
    {
        private readonly NguoiDungBLL _bll;

        public NguoiDungController()
        {
            _bll = new NguoiDungBLL();
        }

        // GET: api/nguoidung
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
                        MaND = row["MaND"],
                        TenDangNhap = row["TenDangNhap"],
                        MatKhau = row["MatKhau"],
                        HoTen = row["HoTen"],
                        VaiTro = row["VaiTro"]
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy danh sách người dùng thành công",
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

        //get api của người dùng
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
                        message = "Không tìm thấy người dùng"
                    });
                }

                DataRow row = dt.Rows[0];
                var result = new
                {
                    MaND = row["MaND"],
                    TenDangNhap = row["TenDangNhap"],
                    MatKhau = row["MatKhau"],
                    HoTen = row["HoTen"],
                    VaiTro = row["VaiTro"]
                };

                return Ok(new
                {
                    success = true,
                    message = "Lấy chi tiết người dùng thành công",
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

        //post api nguoi dugn
        [HttpPost]
        public IActionResult Create([FromBody] NguoiDung nguoiDung)
        {
            try
            {
                if (nguoiDung == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Dữ liệu không hợp lệ"
                    });
                }

                string result = _bll.Them(nguoiDung);

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

       //put api nguoi dùng
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] NguoiDung nguoiDung)
        {
            try
            {
                if (nguoiDung == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Dữ liệu không hợp lệ"
                    });
                }

                nguoiDung.MaND = id;
                string result = _bll.Sua(nguoiDung);

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

       //xóa người dùng api
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
    }
}

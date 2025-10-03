using System;
using System.Data;
using System.Data.SqlClient;
using HotelManagement.Module;
using DAL;

namespace DAL
{
    public class DatPhongDAL
    {
        public DataTable GetAll()
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_DatPhong_DanhSach", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                DataTable dt = new DataTable();
                dt.Load(cmd.ExecuteReader());
                DatabaseConnect.CloseDatabase();
                return dt;
            }
            catch (Exception ex)
            {
                DatabaseConnect.CloseDatabase();
                throw new Exception("Lỗi khi lấy danh sách: " + ex.Message);
            }
        }

        public DataTable GetById(int maDatPhong)
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_DatPhong_ChiTiet", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaDatPhong", maDatPhong);
                DataTable dt = new DataTable();
                dt.Load(cmd.ExecuteReader());
                DatabaseConnect.CloseDatabase();
                return dt;
            }
            catch (Exception ex)
            {
                DatabaseConnect.CloseDatabase();
                throw new Exception("Lỗi khi lấy chi tiết: " + ex.Message);
            }
        }

        public string Them(DatPhong obj)
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_DatPhong_Them", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaDat", obj.MaDat);
                cmd.Parameters.AddWithValue("@MaKhach", obj.MaKhach);
                cmd.Parameters.AddWithValue("@MaPhong", obj.MaPhong);
                cmd.Parameters.AddWithValue("@MaLoaiPhong", obj.MaLoaiPhong);
                cmd.Parameters.AddWithValue("@NgayNhan", obj.NgayNhan);
                cmd.Parameters.AddWithValue("@NgayTra", obj.NgayTra);
                cmd.Parameters.AddWithValue("@SoKhach", obj.SoKhach);
                cmd.Parameters.AddWithValue("@TrangThai", obj.TrangThai);
                cmd.Parameters.AddWithValue("@NguoiTao", obj.NguoiTao);
                cmd.Parameters.AddWithValue("@NgayTao", obj.NgayTao);
                cmd.Parameters.AddWithValue("@GhiChu", obj.GhiChu);
                cmd.ExecuteNonQuery();
                DatabaseConnect.CloseDatabase();
                return "Thêm DatPhong thành công";
            }
            catch (Exception ex)
            {
                DatabaseConnect.CloseDatabase();
                return "Lỗi: " + ex.Message;
            }
        }

        public string Sua(DatPhong obj)
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_DatPhong_Sua", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaDatPhong", obj.MaDatPhong);
                cmd.Parameters.AddWithValue("@MaDat", obj.MaDat);
                cmd.Parameters.AddWithValue("@MaKhach", obj.MaKhach);
                cmd.Parameters.AddWithValue("@MaPhong", obj.MaPhong);
                cmd.Parameters.AddWithValue("@MaLoaiPhong", obj.MaLoaiPhong);
                cmd.Parameters.AddWithValue("@NgayNhan", obj.NgayNhan);
                cmd.Parameters.AddWithValue("@NgayTra", obj.NgayTra);
                cmd.Parameters.AddWithValue("@SoKhach", obj.SoKhach);
                cmd.Parameters.AddWithValue("@TrangThai", obj.TrangThai);
                cmd.Parameters.AddWithValue("@NguoiTao", obj.NguoiTao);
                cmd.Parameters.AddWithValue("@NgayTao", obj.NgayTao);
                cmd.Parameters.AddWithValue("@GhiChu", obj.GhiChu);
                cmd.ExecuteNonQuery();
                DatabaseConnect.CloseDatabase();
                return "Sửa DatPhong thành công";
            }
            catch (Exception ex)
            {
                DatabaseConnect.CloseDatabase();
                return "Lỗi: " + ex.Message;
            }
        }

        public string Xoa(int maDatPhong)
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_DatPhong_Xoa", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaDatPhong", maDatPhong);
                cmd.ExecuteNonQuery();
                DatabaseConnect.CloseDatabase();
                return "Xóa DatPhong thành công";
            }
            catch (Exception ex)
            {
                DatabaseConnect.CloseDatabase();
                return "Lỗi: " + ex.Message;
            }
        }
    }
}

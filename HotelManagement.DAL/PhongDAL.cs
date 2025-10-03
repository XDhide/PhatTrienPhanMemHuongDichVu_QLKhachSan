using System;
using System.Data;
using System.Data.SqlClient;
using DTO;
using DAL;

namespace DAL
{
    public class PhongDAL
    {
        public DataTable GetAll()
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_Phong_DanhSach", DatabaseConnect.Conn);
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

        public DataTable GetById(int maPhong)
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_Phong_ChiTiet", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaPhong", maPhong);
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

        public string Them(Phong obj)
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_Phong_Them", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@SoPhong", obj.SoPhong);
                cmd.Parameters.AddWithValue("@MaLoaiPhong", obj.MaLoaiPhong);
                cmd.Parameters.AddWithValue("@TinhTrang", obj.TinhTrang);
                cmd.ExecuteNonQuery();
                DatabaseConnect.CloseDatabase();
                return "Thêm Phong thành công";
            }
            catch (Exception ex)
            {
                DatabaseConnect.CloseDatabase();
                return "Lỗi: " + ex.Message;
            }
        }

        public string Sua(Phong obj)
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_Phong_Sua", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaPhong", obj.MaPhong);
                cmd.Parameters.AddWithValue("@SoPhong", obj.SoPhong);
                cmd.Parameters.AddWithValue("@MaLoaiPhong", obj.MaLoaiPhong);
                cmd.Parameters.AddWithValue("@TinhTrang", obj.TinhTrang);
                cmd.ExecuteNonQuery();
                DatabaseConnect.CloseDatabase();
                return "Sửa Phong thành công";
            }
            catch (Exception ex)
            {
                DatabaseConnect.CloseDatabase();
                return "Lỗi: " + ex.Message;
            }
        }

        public string Xoa(int maPhong)
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_Phong_Xoa", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaPhong", maPhong);
                cmd.ExecuteNonQuery();
                DatabaseConnect.CloseDatabase();
                return "Xóa Phong thành công";
            }
            catch (Exception ex)
            {
                DatabaseConnect.CloseDatabase();
                return "Lỗi: " + ex.Message;
            }
        }
    }
}

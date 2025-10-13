﻿using System;
using System.Data;
using System.Data.SqlClient;
using DAL;
using HotelManagement.Module;

namespace DAL
{
    public class HoaDonDAL
    {
        public DataTable GetAll()
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_HoaDon_DanhSach", DatabaseConnect.Conn);
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

        public DataTable GetById(int maHD)
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_HoaDon_ChiTiet", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaHD", maHD);
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

        public string Them(HoaDon obj)
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_HoaDon_Them", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@SoHD", obj.SoHD);
                cmd.Parameters.AddWithValue("@MaKhach", obj.MaKhach);
                cmd.Parameters.AddWithValue("@MaND", obj.MaND);
                cmd.Parameters.AddWithValue("@NgayLap", obj.NgayLap);
                cmd.Parameters.AddWithValue("@TongTien", obj.TongTien);
                cmd.Parameters.AddWithValue("@HinhThucThanhToan", obj.HinhThucThanhToan);
                cmd.Parameters.AddWithValue("@SoTienDaTra", obj.SoTienDaTra);
                cmd.Parameters.AddWithValue("@SoTienConNo", obj.SoTienConNo);
                cmd.ExecuteNonQuery();
                DatabaseConnect.CloseDatabase();
                return "Thêm HoaDon thành công";
            }
            catch (Exception ex)
            {
                DatabaseConnect.CloseDatabase();
                return "Lỗi: " + ex.Message;
            }
        }

        public string Sua(HoaDon obj)
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_HoaDon_Sua", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaHD", obj.MaHD);
                cmd.Parameters.AddWithValue("@SoHD", obj.SoHD);
                cmd.Parameters.AddWithValue("@MaKhach", obj.MaKhach);
                cmd.Parameters.AddWithValue("@MaND", obj.MaND);
                cmd.Parameters.AddWithValue("@NgayLap", obj.NgayLap);
                cmd.Parameters.AddWithValue("@TongTien", obj.TongTien);
                cmd.Parameters.AddWithValue("@HinhThucThanhToan", obj.HinhThucThanhToan);
                cmd.Parameters.AddWithValue("@SoTienDaTra", obj.SoTienDaTra);
                cmd.Parameters.AddWithValue("@SoTienConNo", obj.SoTienConNo);
                cmd.ExecuteNonQuery();
                DatabaseConnect.CloseDatabase();
                return "Sửa HoaDon thành công";
            }
            catch (Exception ex)
            {
                DatabaseConnect.CloseDatabase();
                return "Lỗi: " + ex.Message;
            }
        }

        public string Xoa(int maHD)
        {
            try
            {
                DatabaseConnect.OpenDatabase();
                SqlCommand cmd = new SqlCommand("sp_HoaDon_Xoa", DatabaseConnect.Conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@MaHD", maHD);
                cmd.ExecuteNonQuery();
                DatabaseConnect.CloseDatabase();
                return "Xóa HoaDon thành công";
            }
            catch (Exception ex)
            {
                DatabaseConnect.CloseDatabase();
                return "Lỗi: " + ex.Message;
            }
        }
    }
}

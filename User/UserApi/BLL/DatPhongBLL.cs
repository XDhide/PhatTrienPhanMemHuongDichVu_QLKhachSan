using System;
using System.Data;
using HotelManagement.Module;
using DAL;

namespace BLL
{
    public class DatPhongBLL
    {
        private DatPhongDAL _dal;

        public DatPhongBLL()
        {
            _dal = new DatPhongDAL();
        }

        public DataTable GetAll()
        {
            return _dal.GetAll();
        }

        public DataTable GetById(int maDatPhong)
        {
            return _dal.GetById(maDatPhong);
        }

        public string Them(DatPhong obj)
        {
            if (obj == null)
                return "Thông tin DatPhong không hợp lệ";
            return _dal.Them(obj);
        }

        public string Sua(DatPhong obj)
        {
            if (obj == null)
                return "Thông tin DatPhong không hợp lệ";
            return _dal.Sua(obj);
        }

        public string Xoa(int maDatPhong)
        {
            return _dal.Xoa(maDatPhong);
        }

        public string CheckIn(int maDatPhong, int? maPhong)
        {
            return _dal.CheckIn(maDatPhong, maPhong);
        }

        public string CheckOut(int maDatPhong)
        {
            return _dal.CheckOut(maDatPhong);
        }
    }
}

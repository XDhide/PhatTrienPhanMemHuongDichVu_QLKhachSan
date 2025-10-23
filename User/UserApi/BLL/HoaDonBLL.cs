using System;
using System.Data;
using HotelManagement.Module;
using DAL;

namespace BLL
{
    public class HoaDonBLL
    {
        private HoaDonDAL _dal;

        public HoaDonBLL()
        {
            _dal = new HoaDonDAL();
        }

        public DataTable GetAll()
        {
            return _dal.GetAll();
        }

        public DataTable GetById(int maHD)
        {
            return _dal.GetById(maHD);
        }
        public DataTable GetPayment(int maHD)
        {
            return _dal.GetPayment(maHD);
        }
        public string Payment(int maHD,string Text)
        {
            return _dal.Payment(maHD, Text);
        }
        public string Them(HoaDon obj)
        {
            if (obj == null)
                return "Thông tin HoaDon không hợp lệ";
            return _dal.Them(obj);
        }

        public string Sua(HoaDon obj)
        {
            if (obj == null)
                return "Thông tin HoaDon không hợp lệ";
            return _dal.Sua(obj);
        }

        public string Xoa(int maHD)
        {
            return _dal.Xoa(maHD);
        }
    }
}

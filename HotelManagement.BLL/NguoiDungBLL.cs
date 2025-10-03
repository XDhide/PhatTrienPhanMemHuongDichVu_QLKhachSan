using System;
using System.Data;
using HotelManagement.Module;
using DAL;

namespace BLL
{
    public class NguoiDungBLL
    {
        private NguoiDungDAL _dal;

        public NguoiDungBLL()
        {
            _dal = new NguoiDungDAL();
        }

        public DataTable GetAll()
        {
            return _dal.GetAll();
        }

        public DataTable GetById(int maND)
        {
            return _dal.GetById(maND);
        }

        public string Them(NguoiDung obj)
        {
            if (obj == null)
                return "Thông tin NguoiDung không hợp lệ";
            return _dal.Them(obj);
        }

        public string Sua(NguoiDung obj)
        {
            if (obj == null)
                return "Thông tin NguoiDung không hợp lệ";
            return _dal.Sua(obj);
        }

        public string Xoa(int maND)
        {
            return _dal.Xoa(maND);
        }
    }
}

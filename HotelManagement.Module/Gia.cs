using System;

namespace DTO
{
    public class Gia
    {
        public int MaGia { get; set; }
        public int MaLoaiPhong { get; set; }
        public string TuNgay { get; set; }
        public string DenNgay { get; set; }
        public decimal GiaMoiDem { get; set; }
        public decimal? GiaMoiGio { get; set; }
        public string GhiChu { get; set; }

        // Constructor mặc định
        public Gia()
        {
            MaGia = 0;
            MaLoaiPhong = 0;
            TuNgay = string.Empty;
            DenNgay = string.Empty;
            GiaMoiDem = 0;
            GiaMoiGio = 0;
            GhiChu = string.Empty;
        }

        // Constructor có tham số
        public Gia(string tuNgay, string denNgay, decimal giaMoiDem, decimal? giaMoiGio, string ghiChu)
        {
            TuNgay = tuNgay;
            DenNgay = denNgay;
            GiaMoiDem = giaMoiDem;
            GiaMoiGio = giaMoiGio;
            GhiChu = ghiChu;
        }
    }
}

CREATE DATABASE QLKhachSan
GO
USE QLKhachSan
GO

-- Nguoi dung / tai khoan
CREATE TABLE NguoiDung (
    MaND INT IDENTITY(1,1) PRIMARY KEY,
    TenDangNhap NVARCHAR(100) NOT NULL UNIQUE,
    MatKhau NVARCHAR(500) NOT NULL,
    HoTen NVARCHAR(200),
    VaiTro NVARCHAR(50) NOT NULL -- Admin, LeTan, KeToan, Khach
);

-- Loai phong
CREATE TABLE LoaiPhong (
    MaLoaiPhong INT IDENTITY(1,1) PRIMARY KEY,
    Ma NVARCHAR(50) NOT NULL UNIQUE,
    Ten NVARCHAR(200) NOT NULL,
    MoTa NVARCHAR(500),
    SoKhachToiDa INT NOT NULL DEFAULT 2
);

-- Phong
CREATE TABLE Phong (
    MaPhong INT IDENTITY(1,1) PRIMARY KEY,
    SoPhong NVARCHAR(20) NOT NULL UNIQUE,
    MaLoaiPhong INT NOT NULL,
    TinhTrang NVARCHAR(50) NOT NULL DEFAULT 'SanSang', -- SanSang, BaoTri, DonDep
    FOREIGN KEY (MaLoaiPhong) REFERENCES LoaiPhong(MaLoaiPhong)
);

-- Bang gia
CREATE TABLE Gia (
    MaGia INT IDENTITY(1,1) PRIMARY KEY,
    MaLoaiPhong INT NOT NULL,
    TuNgay DATE NOT NULL,
    DenNgay DATE NOT NULL,
    GiaMoiDem DECIMAL(18,2) NOT NULL,
    GiaMoiGio DECIMAL(18,2) NULL,
    GhiChu NVARCHAR(300),
    FOREIGN KEY (MaLoaiPhong) REFERENCES LoaiPhong(MaLoaiPhong),
    CONSTRAINT UQ_Gia UNIQUE (MaLoaiPhong, TuNgay, DenNgay)
);

-- Khach
CREATE TABLE Khach (
    MaKhach INT IDENTITY(1,1) PRIMARY KEY,
    HoTen NVARCHAR(200) NOT NULL,
    DienThoai NVARCHAR(50),
    Email NVARCHAR(150),
    CMND NVARCHAR(100),
    DiaChi NVARCHAR(300)
);

-- Dat phong
CREATE TABLE DatPhong (
    MaDatPhong INT IDENTITY(1,1) PRIMARY KEY,
    MaDat NVARCHAR(50) NOT NULL UNIQUE,
    MaKhach INT NOT NULL,
    MaPhong INT NULL, -- neu NULL thi dat theo loai phong
    MaLoaiPhong INT NOT NULL,
    NgayNhan DATETIME NOT NULL,
    NgayTra DATETIME NOT NULL,
    SoKhach INT NOT NULL DEFAULT 1,
    TrangThai NVARCHAR(50) NOT NULL DEFAULT 'DaDat', -- DaDat, DaNhan, DaTra, Huy
    NguoiTao INT NULL, -- MaND
    NgayTao DATETIME NOT NULL DEFAULT GETDATE(),
    GhiChu NVARCHAR(500),
    FOREIGN KEY (MaKhach) REFERENCES Khach(MaKhach),
    FOREIGN KEY (MaPhong) REFERENCES Phong(MaPhong),
    FOREIGN KEY (MaLoaiPhong) REFERENCES LoaiPhong(MaLoaiPhong)
);

-- Dich vu
CREATE TABLE DichVu (
    MaDV INT IDENTITY(1,1) PRIMARY KEY,
    Ma NVARCHAR(50) NOT NULL UNIQUE,
    Ten NVARCHAR(200) NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    Thue DECIMAL(5,2) NOT NULL DEFAULT 0
);

-- Chi tiet hoa don (cac muc phi)
CREATE TABLE HoaDonChiTiet (
    MaCT INT IDENTITY(1,1) PRIMARY KEY,
    MaDatPhong INT NOT NULL,
    LoaiMuc NVARCHAR(50) NOT NULL, -- Phong, DichVu, Phat
    MoTa NVARCHAR(300),
    SoTien DECIMAL(18,2) NOT NULL,
    Thue DECIMAL(5,2) NOT NULL DEFAULT 0,
    NgayTao DATETIME NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (MaDatPhong) REFERENCES DatPhong(MaDatPhong)
);

-- Hoa don
CREATE TABLE HoaDon (
    MaHD INT IDENTITY(1,1) PRIMARY KEY,
    SoHD NVARCHAR(50) NOT NULL UNIQUE,
    MaDatPhong INT NOT NULL,
    NgayLap DATETIME NOT NULL DEFAULT GETDATE(),
    TongTruocThue DECIMAL(18,2) NOT NULL,
    TongThue DECIMAL(18,2) NOT NULL,
    TongTien DECIMAL(18,2) NOT NULL,
    DaThanhToan BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (MaDatPhong) REFERENCES DatPhong(MaDatPhong)
);

-- Thanh toan
CREATE TABLE ThanhToan (
    MaTT INT IDENTITY(1,1) PRIMARY KEY,
    MaHD INT NOT NULL,
    NgayTT DATETIME NOT NULL DEFAULT GETDATE(),
    SoTien DECIMAL(18,2) NOT NULL,
    PhuongThuc NVARCHAR(50), -- TienMat, The, ChuyenKhoan
    GhiChu NVARCHAR(300),
    FOREIGN KEY (MaHD) REFERENCES HoaDon(MaHD)
);

-- Index goi y
--CREATE INDEX IX_DatPhong_MaPhong ON DatPhong(MaPhong);
--CREATE INDEX IX_DatPhong_NgayNhan_NgayTra ON DatPhong(NgayNhan, NgayTra);

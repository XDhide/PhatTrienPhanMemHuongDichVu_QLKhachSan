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
    MaLoaiPhong INT NOT NULL REFERENCES LoaiPhong(MaLoaiPhong),
    TuNgay DATE NOT NULL,
    DenNgay DATE NOT NULL,
    GiaMoiDem DECIMAL(18,2) NOT NULL,
    GiaMoiGio DECIMAL(18,2) NULL,
    GhiChu NVARCHAR(300),
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
    MaKhach INT NOT NULL FOREIGN KEY REFERENCES Khach(MaKhach),
    MaPhong INT NULL FOREIGN KEY REFERENCES Phong(MaPhong), -- neu NULL thi dat theo loai phong
    MaLoaiPhong INT NOT NULL FOREIGN KEY REFERENCES LoaiPhong(MaLoaiPhong),
    NgayNhan DATETIME NOT NULL,
    NgayTra DATETIME NOT NULL,
    SoKhach INT NOT NULL DEFAULT 1,
    TrangThai NVARCHAR(50) NOT NULL DEFAULT 'DaDat', -- DaDat, DaNhan, DaTra, Huy
    NguoiTao INT NULL, -- MaND
    NgayTao DATETIME NOT NULL DEFAULT GETDATE(),
    GhiChu NVARCHAR(500)
);

-- Dich vu
CREATE TABLE DichVu (
    MaDV INT IDENTITY(1,1) PRIMARY KEY,
    Ma NVARCHAR(50) NOT NULL UNIQUE,
    Ten NVARCHAR(200) NOT NULL,
    DonGia DECIMAL(18,2) NOT NULL,
    Thue DECIMAL(5,2) NOT NULL DEFAULT 0
);

-- Hoa don
CREATE TABLE HoaDon (
    MaHD INT IDENTITY(1,1) PRIMARY KEY,
    SoHD NVARCHAR(50) NOT NULL UNIQUE,
    MaKhach INT NOT NULL REFERENCES Khach(MaKhach),
    MaND INT NOT NULL REFERENCES NguoiDung(MaND),
    NgayLap DATETIME NOT NULL DEFAULT GETDATE(),
    TongTien DECIMAL(18,2) DEFAULT 0,
    HinhThucThanhToan NVARCHAR(50), -- TienMat, The, ChuyenKhoan
    SoTienDaTra DECIMAL(18,2) DEFAULT 0,
    SoTienConNo AS (TongTien - SoTienDaTra) -- cột tính toán
);

-- Hoa don chi tiet
CREATE TABLE HoaDonChiTiet (
    MaCTHD INT IDENTITY(1,1) PRIMARY KEY,
    MaHD INT NOT NULL REFERENCES HoaDon(MaHD),

    -- Một trong 2 cái này: hoặc đặt phòng, hoặc dịch vụ
    MaDatPhong INT NULL REFERENCES DatPhong(MaDatPhong),
    MaDV INT NULL REFERENCES DichVu(MaDV),

    SoLuong INT NOT NULL DEFAULT 1,
    DonGia DECIMAL(18,2) NOT NULL,
    ThanhTien AS (SoLuong * DonGia),

    -- Ràng buộc: bắt buộc chọn 1 trong 2
    CONSTRAINT CK_HoaDonChiTiet CHECK (
        (MaDatPhong IS NOT NULL AND MaDV IS NULL)
        OR (MaDatPhong IS NULL AND MaDV IS NOT NULL)
    )
);

-- Thêm dữ liệu
INSERT INTO NguoiDung (TenDangNhap, MatKhau, HoTen, VaiTro) VALUES
('dxdung', 'dung123', N'Đỗ Xuân Dũng', N'Admin'),
('tmlan', 'lan123', N'Trần Mai Lan', N'LeTan'),
('ldquangminh', 'minh123', N'Lưu Đình Quang Minh', N'KeToan');

INSERT INTO LoaiPhong (Ma, Ten, MoTa, SoKhachToiDa) VALUES
('STD', N'Standard', N'Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản', 2),
('SUP', N'Superior', N'Phòng cao cấp với view đẹp và diện tích rộng rãi', 2),
('DEL', N'Deluxe', N'Phòng sang trọng với nội thất cao cấp', 3),
('JR-SUI', N'Junior Suite', N'Suite nhỏ với khu vực tiếp khách riêng', 4),
('EXE-SUI', N'Executive Suite', N'Suite cao cấp dành cho khách VIP', 4),
('FAM', N'Family Room', N'Phòng gia đình rộng rãi', 6),
('PRES', N'Presidential Suite', N'Suite tổng thống siêu sang trọng', 8);

INSERT INTO Phong (SoPhong, MaLoaiPhong, TinhTrang) VALUES
('101', 1, N'SanSang'), ('102', 1, N'SanSang'), ('103', 1, N'DonDep'), ('104', 1, N'SanSang'), ('105', 1, N'SanSang'),
('106', 1, N'SanSang'), ('107', 1, N'BaoTri'), ('108', 1, N'SanSang'), ('109', 1, N'SanSang'), ('110', 1, N'SanSang'),
('201', 2, N'SanSang'), ('202', 2, N'SanSang'), ('203', 2, N'SanSang'), ('204', 2, N'DonDep'), ('205', 2, N'SanSang'),
('206', 2, N'SanSang'), ('207', 2, N'SanSang'), ('208', 2, N'BaoTri'), ('209', 2, N'SanSang'), ('210', 2, N'SanSang'),
('301', 3, N'SanSang'), ('302', 3, N'SanSang'), ('303', 3, N'SanSang'), ('304', 3, N'SanSang'), ('305', 3, N'DonDep'),
('306', 3, N'SanSang'), ('307', 3, N'SanSang'), ('308', 3, N'SanSang'), ('309', 3, N'SanSang'), ('310', 3, N'SanSang'),
('401', 4, N'SanSang'), ('402', 4, N'SanSang'), ('403', 4, N'DonDep'), ('404', 4, N'SanSang'), ('405', 4, N'SanSang'),
('501', 5, N'SanSang'), ('502', 5, N'SanSang'), ('503', 5, N'SanSang'), ('504', 5, N'BaoTri'), ('505', 5, N'SanSang'),
('601', 6, N'SanSang'), ('602', 6, N'SanSang'), ('603', 6, N'SanSang'), ('604', 6, N'DonDep'), ('605', 6, N'SanSang'),
('701', 7, N'SanSang'), ('702', 7, N'SanSang');

INSERT INTO Gia (MaLoaiPhong, TuNgay, DenNgay, GiaMoiDem, GiaMoiGio, GhiChu) VALUES
(1, '2024-01-01', '2024-12-31', 800000, 150000, N'Giá phòng Standard năm 2024'),
(2, '2024-01-01', '2024-12-31', 1200000, 200000, N'Giá phòng Superior năm 2024'),
(3, '2024-01-01', '2024-12-31', 1800000, 300000, N'Giá phòng Deluxe năm 2024'),
(4, '2024-01-01', '2024-12-31', 2500000, 400000, N'Giá Junior Suite năm 2024'),
(5, '2024-01-01', '2024-12-31', 3500000, 600000, N'Giá Executive Suite năm 2024'),
(6, '2024-01-01', '2024-12-31', 2800000, 450000, N'Giá Family Room năm 2024'),
(7, '2024-01-01', '2024-12-31', 8000000, 1200000, N'Giá Presidential Suite năm 2024'),
(1, '2025-01-01', '2025-12-31', 850000, 160000, N'Giá phòng Standard năm 2025'),
(2, '2025-01-01', '2025-12-31', 1300000, 220000, N'Giá phòng Superior năm 2025'),
(3, '2025-01-01', '2025-12-31', 1950000, 320000, N'Giá phòng Deluxe năm 2025'),
(4, '2025-01-01', '2025-12-31', 2700000, 430000, N'Giá Junior Suite năm 2025'),
(5, '2025-01-01', '2025-12-31', 3800000, 650000, N'Giá Executive Suite năm 2025'),
(6, '2025-01-01', '2025-12-31', 3000000, 480000, N'Giá Family Room năm 2025'),
(7, '2025-01-01', '2025-12-31', 8500000, 1300000, N'Giá Presidential Suite năm 2025');

INSERT INTO Khach (HoTen, DienThoai, Email, CMND, DiaChi) VALUES
(N'Phan Văn Khánh', '0901234567', 'pvkhanh@gmail.com', '123456789012', N'123 Đường ABC, Quận 1, TP.HCM'),
(N'Vũ Minh Hào', '0902345678', 'vmhao@gmail.com', '234567890123', N'456 Đường DEF, Quận 2, TP.HCM'),
(N'Lưu Thị Thanh Mai', '0903456789', 'ltthanhmai@gmail.com', '345678901234', N'789 Đường GHI, Quận 3, TP.HCM'),
(N'Lê Tiến Linh', '0904567890', 'ltlinh@gmail.com', '456789012345', N'321 Đường JKL, Quận 4, TP.HCM'),
(N'Phạm Huy Anh', '0905678901', 'phanh@gmail.com', '567890123456', N'654 Đường MNO, Quận 5, TP.HCM'),
(N'Nguyễn Văn Phúc', '0906789012', 'nvphuc@gmail.com', '678901234567', N'987 Đường PQR, Quận 6, TP.HCM'),
(N'Lê Huy Hoàng', '0907890123', 'lhhoang@gmail.com', '789012345678', N'147 Đường STU, Quận 7, TP.HCM'),
(N'Đinh Ngọc Đại', '0908901234', 'dndai@gmail.com', '890123456789', N'258 Đường VWX, Quận 8, TP.HCM'),
(N'Ngô Minh Nguyệt', '0909012345', 'nmnguyet@gmail.com', '901234567890', N'369 Đường YZ, Quận 9, TP.HCM'),
(N'Nguyễn Văn Dũng', '0910123456', 'nvdung@gmail.com', '012345678901', N'159 Đường AB, Quận 10, TP.HCM'),
(N'Đỗ Hữu Quốc Ánh', '0911234567', 'dhquocanh@gmail.com', '123450987654', N'753 Đường CD, Quận 11, TP.HCM'),
(N'Đỗ Tiến Đạt', '0912345678', 'dtdat@gmail.com', '234561098765', N'864 Đường EF, Quận 12, TP.HCM'),
(N'Trần Đức Lương', '0913456789', 'tdluong@gmail.com', '345672109876', N'951 Đường GH, Tân Bình, TP.HCM'),
(N'Đào Minh Quang', '0914567890', 'dmquang@gmail.com', '456783210987', N'168 Đường IJ, Bình Thạnh, TP.HCM'),
(N'Bùi Trí Dũng', '0915678901', 'btdung@gmail.com', '567894321098', N'279 Đường KL, Phú Nhuận, TP.HCM'),
(N'Nguyễn Mạnh Dũng', '0916789012', 'nmdung@gmail.com', '678905432109', N'380 Đường MN, Gò Vấp, TP.HCM'),
(N'Trần Thế Thiên', '0917890123', 'ttanh@gmail.com', '789016543210', N'491 Đường OP, Tân Phú, TP.HCM'),
(N'Nguyễn Thị Hòa', '0918901234', 'lvminh@gmail.com', '890127654321', N'502 Đường QR, Thủ Đức, TP.HCM'),
(N'Địch Lệ Nhiệt Ba', '0919012345', 'htthu@gmail.com', '901238765432', N'613 Đường ST, Bình Tân, TP.HCM'),
(N'Phạm Thùy Linh', '0920123456', 'ndhai@gmail.com', '012349876543', N'724 Đường UV, Củ Chi, TP.HCM'),
(N'Cao Văn Lộc', '0921234567', 'ptson@gmail.com', '123450123456', N'835 Đường WX, Hóc Môn, TP.HCM'),
(N'Vũ Thị Lan', '0922345678', 'vtlan@gmail.com', '234561234567', N'946 Đường YZ, Nhà Bè, TP.HCM'),
(N'Chu Hoàng Minh Hải', '0923456789', 'dvhung@gmail.com', '345672345678', N'157 Đường ABC, Cần Giờ, TP.HCM'),
(N'Đỗ Phi Trường', '0924567890', 'mthoa@gmail.com', '456783456789', N'268 Đường DEF, Bình Chánh, TP.HCM'),
(N'Hoàng Quốc Việt', '0925678901', 'lqvinh@gmail.com', '567894567890', N'379 Đường GHI, Quận 1, Hà Nội'),
(N'Triệu Tuấn Đạt', '0926789012', 'ctmai@gmail.com', '678905678901', N'480 Đường JKL, Quận 2, Hà Nội'),
(N'Chu Anh Tuấn', '0927890123', 'bvtai@gmail.com', '789016789012', N'591 Đường MNO, Quận 3, Hà Nội'),
(N'Nguyễn Hà Thu', '0928901234', 'dtnga@gmail.com', '890127890123', N'602 Đường PQR, Quận 4, Hà Nội'),
(N'Giang Thị Huệ', '0929012345', 'pqhuy@gmail.com', '901238901234', N'713 Đường STU, Quận 5, Hà Nội'),
(N'Dương Mịch', '0930123456', 'ttlinh@gmail.com', '012349012345', N'824 Đường VWX, Đống Đa, Hà Nội');

INSERT INTO DichVu (Ma, Ten, DonGia, Thue) VALUES
('BREAKFAST', N'Bữa sáng buffet', 250000, 10),
('LUNCH', N'Bữa trưa set menu', 350000, 10),
('DINNER', N'Bữa tối cao cấp', 500000, 10),
('MASSAGE', N'Massage thư giãn 60 phút', 800000, 10),
('SPA', N'Gói spa toàn thân', 1200000, 10),
('LAUNDRY', N'Giặt là nhanh', 150000, 10),
('AIRPORT', N'Đưa đón sân bay', 300000, 10),
('TOUR-CITY', N'Tour tham quan thành phố', 800000, 10),
('TOUR-BEACH', N'Tour biển cả ngày', 1200000, 10),
('MINIBAR', N'Mini bar phòng', 200000, 10),
('WIFI', N'WiFi cao tốc 24h', 100000, 0),
('GYM', N'Phòng gym 1 ngày', 200000, 10),
('POOL', N'Hồ bơi và jacuzzi', 150000, 10),
('KARAOKE', N'Phòng karaoke 2 tiếng', 600000, 10),
('MEETING', N'Thuê phòng họp 4 tiếng', 2000000, 10),
('EXTRA-BED', N'Giường phụ', 300000, 10),
('BABY-COT', N'Nôi em bé', 100000, 0),
('PARKING', N'Gửi xe ô tô 24h', 200000, 10),
('FLOWERS', N'Hoa trang trí phòng', 500000, 10),
('CHAMPAGNE', N'Champagne chào mừng', 800000, 10);

INSERT INTO DatPhong (MaDat, MaKhach, MaPhong, MaLoaiPhong, NgayNhan, NgayTra, SoKhach, TrangThai, NguoiTao, NgayTao, GhiChu) VALUES
('DP001', 1, 1, 1, '2024-09-01 14:00:00', '2024-09-03 12:00:00', 2, N'DaTra', 1, '2024-08-25 10:30:00', N'Khách VIP'),
('DP002', 2, 11, 2, '2024-09-02 15:00:00', '2024-09-04 11:00:00', 2, N'DaTra', 2, '2024-08-26 09:15:00', N'Khách doanh nhân'),
('DP003', 3, 21, 3, '2024-09-03 16:00:00', '2024-09-05 12:00:00', 3, N'DaTra', 1, '2024-08-27 14:20:00', N'Gia đình có trẻ em'),
('DP004', 4, 31, 4, '2024-09-05 14:00:00', '2024-09-07 11:00:00', 4, N'DaTra', 2, '2024-08-28 16:45:00', N'Honeymoon suite'),
('DP005', 5, 36, 5, '2024-09-06 15:00:00', '2024-09-08 12:00:00', 2, N'DaTra', 1, '2024-08-29 11:30:00', N'Khách corporate'),
('DP006', 6, 41, 6, '2024-09-07 14:00:00', '2024-09-09 11:00:00', 6, N'DaTra', 2, '2024-08-30 13:25:00', N'Gia đình lớn'),
('DP007', 7, 46, 7, '2024-09-08 16:00:00', '2024-09-10 12:00:00', 4, N'DaTra', 1, '2024-08-31 15:40:00', N'VIP Suite'),
('DP008', 8, 2, 1, '2024-09-10 14:00:00', '2024-09-12 12:00:00', 1, N'DaTra', 2, '2024-09-01 10:20:00', N'Khách đơn'),
('DP009', 9, 12, 2, '2024-09-11 15:00:00', '2024-09-13 11:00:00', 2, N'DaTra', 1, '2024-09-02 14:35:00', N'Cặp đôi trẻ'),
('DP010', 10, 22, 3, '2024-09-12 14:00:00', '2024-09-15 12:00:00', 3, N'DaTra', 2, '2024-09-03 16:50:00', N'Nghỉ dưỡng'),
('DP011', 11, 32, 4, '2024-09-15 15:00:00', '2024-09-17 11:00:00', 4, N'DaTra', 1, '2024-09-05 09:45:00', N'Business trip'),
('DP012', 12, 37, 5, '2024-09-16 14:00:00', '2024-09-18 12:00:00', 2, N'DaTra', 2, '2024-09-06 12:20:00', N'Anniversary'),
('DP013', 13, 42, 6, '2024-09-17 16:00:00', '2024-09-19 11:00:00', 5, N'DaTra', 1, '2024-09-07 17:15:00', N'Family vacation'),
('DP014', 14, 47, 7, '2024-09-18 15:00:00', '2024-09-20 12:00:00', 8, N'DaTra', 2, '2024-09-08 11:40:00', N'Corporate event'),
('DP015', 15, 3, 1, '2024-09-20 14:00:00', '2024-09-22 12:00:00', 2, N'DaTra', 1, '2024-09-10 13:25:00', N'Weekend getaway'),
('DP016', 16, 13, 2, '2024-09-21 15:00:00', '2024-09-23 11:00:00', 2, N'DaTra', 2, '2024-09-11 15:30:00', N'Romantic trip'),
('DP017', 17, 23, 3, '2024-09-22 14:00:00', '2024-09-24 12:00:00', 3, N'DaTra', 1, '2024-09-12 10:45:00', N'Mini vacation'),
('DP018', 18, 33, 4, '2024-09-23 16:00:00', '2024-09-25 11:00:00', 4, N'DaNhan', 2, '2024-09-13 14:20:00', N'Currently staying'),
('DP019', 19, 4, 1, '2024-09-25 14:00:00', '2024-09-27 12:00:00', 1, N'DaDat', 1, '2024-09-15 16:35:00', N'Solo traveler'),
('DP020', 20, 14, 2, '2024-09-26 15:00:00', '2024-09-28 11:00:00', 2, N'DaDat', 2, '2024-09-16 12:50:00', N'City break'),
('DP021', 21, 24, 3, '2024-09-27 14:00:00', '2024-09-29 12:00:00', 3, N'DaDat', 1, '2024-09-17 09:25:00', N'Family time'),
('DP022', 22, 34, 4, '2024-09-28 16:00:00', '2024-09-30 11:00:00', 4, N'DaDat', 2, '2024-09-18 11:40:00', N'Group booking'),
('DP023', 23, 5, 1, '2024-09-29 14:00:00', '2024-10-01 12:00:00', 2, N'DaDat', 1, '2024-09-19 14:15:00', N'Long weekend'),
('DP024', 24, 15, 2, '2024-09-30 15:00:00', '2024-10-02 11:00:00', 2, N'DaDat', 2, '2024-09-20 16:30:00', N'Business meeting'),
('DP025', 25, 25, 3, '2024-10-01 14:00:00', '2024-10-03 12:00:00', 3, N'DaDat', 1, '2024-09-21 13:45:00', N'Holiday trip'),
('DP026', 26, 6, 1, '2024-10-02 15:00:00', '2024-10-04 11:00:00', 1, N'DaDat', 2, '2024-09-22 10:20:00', N'Quick stay'),
('DP027', 27, 16, 2, '2024-10-03 14:00:00', '2024-10-05 12:00:00', 2, N'DaDat', 1, '2024-09-23 15:55:00', N'Couple retreat'),
('DP028', 28, 26, 3, '2024-10-04 16:00:00', '2024-10-06 11:00:00', 3, N'DaDat', 2, '2024-09-24 12:10:00', N'Extended stay'),
('DP029', 29, 35, 4, '2024-10-05 15:00:00', '2024-10-07 12:00:00', 4, N'DaDat', 1, '2024-09-25 17:25:00', N'Premium experience'),
('DP030', 30, 43, 6, '2024-10-06 14:00:00', '2024-10-08 11:00:00', 6, N'DaDat', 2, '2024-09-26 14:40:00', N'Large family');

INSERT INTO HoaDon (SoHD, MaKhach, MaND, NgayLap, TongTien, HinhThucThanhToan, SoTienDaTra) VALUES
('HD001', 1, 1, '2024-09-03 12:30:00', 1950000, N'TienMat', 1950000),
('HD002', 2, 2, '2024-09-04 11:15:00', 2850000, N'The', 2850000),
('HD003', 3, 1, '2024-09-05 12:45:00', 4200000, N'ChuyenKhoan', 4200000),
('HD004', 4, 2, '2024-09-07 11:30:00', 5800000, N'The', 5800000),
('HD005', 5, 1, '2024-09-08 12:20:00', 8100000, N'ChuyenKhoan', 8100000),
('HD006', 6, 2, '2024-09-09 11:45:00', 6400000, N'TienMat', 6400000),
('HD007', 7, 1, '2024-09-10 12:15:00', 17600000, N'ChuyenKhoan', 17600000),
('HD008', 8, 2, '2024-09-12 12:30:00', 1850000, N'The', 1850000),
('HD009', 9, 1, '2024-09-13 11:20:00', 2950000, N'TienMat', 2950000),
('HD010', 10, 2, '2024-09-15 12:40:00', 6300000, N'ChuyenKhoan', 6300000),
('HD011', 11, 1, '2024-09-17 11:25:00', 5900000, N'The', 5900000),
('HD012', 12, 2, '2024-09-18 12:35:00', 8300000, N'ChuyenKhoan', 8300000),
('HD013', 13, 1, '2024-09-19 11:40:00', 6100000, N'TienMat', 6100000),
('HD014', 14, 2, '2024-09-20 12:25:00', 18400000, N'ChuyenKhoan', 18400000),
('HD015', 15, 1, '2024-09-22 12:50:00', 2100000, N'The', 2100000),
('HD016', 16, 2, '2024-09-23 11:35:00', 3200000, N'TienMat', 3200000),
('HD017', 17, 1, '2024-09-24 12:20:00', 4400000, N'ChuyenKhoan', 4400000),
('HD018', 18, 2, '2024-09-25 11:45:00', 0, N'TienMat', 0),
('HD019', 19, 1, '2024-09-27 12:30:00', 0, N'The', 0),
('HD020', 20, 2, '2024-09-28 11:50:00', 0, N'ChuyenKhoan', 0),
('HD021', 21, 1, '2024-09-29 12:15:00', 0, N'TienMat', 0),
('HD022', 22, 2, '2024-09-30 11:25:00', 0, N'The', 0),
('HD023', 23, 1, '2024-10-01 12:40:00', 0, N'ChuyenKhoan', 0),
('HD024', 24, 2, '2024-10-02 11:30:00', 0, N'TienMat', 0),
('HD025', 25, 1, '2024-10-03 12:55:00', 0, N'The', 0),
('HD026', 26, 2, '2024-10-04 11:20:00', 0, N'ChuyenKhoan', 0),
('HD027', 27, 1, '2024-10-05 12:35:00', 0, N'TienMat', 0),
('HD028', 28, 2, '2024-10-06 11:40:00', 0, N'The', 0),
('HD029', 29, 1, '2024-10-07 12:25:00', 0, N'ChuyenKhoan', 0),
('HD030', 30, 2, '2024-10-08 11:15:00', 0, N'TienMat', 0);

INSERT INTO HoaDonChiTiet (MaHD, MaDatPhong, MaDV, SoLuong, DonGia) VALUES
-- Hóa đơn 1 (DP001 - Phan Văn Khánh)
(1, 1, NULL, 2, 800000), -- 2 đêm phòng Standard
(1, NULL, 1, 2, 250000), -- Bữa sáng cho 2 người
(1, NULL, 7, 1, 300000), -- Đưa đón sân bay
(1, NULL, 11, 2, 100000), -- WiFi

-- Hóa đơn 2 (DP002 - Vũ Minh Hào)
(2, 2, NULL, 2, 1200000), -- 2 đêm phòng Superior
(2, NULL, 1, 4, 250000), -- Bữa sáng 2 ngày
(2, NULL, 4, 1, 800000), -- Massage
(2, NULL, 12, 2, 200000), -- Gym

-- Hóa đơn 3 (DP003 - Lưu Thị Thanh Mai)
(3, 3, NULL, 2, 1800000), -- 2 đêm phòng Deluxe
(3, NULL, 1, 6, 250000), -- Bữa sáng gia đình
(3, NULL, 16, 1, 300000), -- Giường phụ
(3, NULL, 17, 1, 100000), -- Nôi em bé
(3, NULL, 8, 3, 800000), -- Tour city cho 3 người

-- Hóa đơn 4 (DP004 - Lê Tiến Linh)
(4, 4, NULL, 2, 2500000), -- 2 đêm Junior Suite
(4, NULL, 1, 4, 250000), -- Bữa sáng
(4, NULL, 19, 1, 500000), -- Hoa trang trí
(4, NULL, 20, 1, 800000), -- Champagne
(4, NULL, 5, 2, 1200000), -- Spa cho cặp đôi

-- Hóa đơn 5 (DP005 - Phạm Huy Anh)
(5, 5, NULL, 2, 3500000), -- 2 đêm Executive Suite
(5, NULL, 3, 2, 500000), -- Bữa tối cao cấp
(5, NULL, 15, 1, 2000000), -- Thuê phòng họp
(5, NULL, 6, 3, 150000), -- Giặt là
(5, NULL, 18, 2, 200000), -- Gửi xe

-- Hóa đơn 6 (DP006 - Nguyễn Văn Phúc)
(6, 6, NULL, 2, 2800000), -- 2 đêm Family Room
(6, NULL, 1, 12, 250000), -- Bữa sáng gia đình lớn
(6, NULL, 13, 6, 150000), -- Hồ bơi
(6, NULL, 17, 2, 100000), -- 2 nôi em bé
(6, NULL, 9, 6, 1200000), -- Tour biển cả gia đình

-- Hóa đơn 7 (DP007 - Lê Huy Hoàng)
(7, 7, NULL, 2, 8000000), -- 2 đêm Presidential Suite
(7, NULL, 3, 4, 500000), -- Bữa tối VIP
(7, NULL, 5, 4, 1200000), -- Spa toàn gia đình
(7, NULL, 14, 2, 600000), -- Karaoke 2 buổi
(7, NULL, 20, 2, 800000), -- Champagne
(7, NULL, 7, 2, 300000), -- Đưa đón sân bay

-- Hóa đơn 8 (DP008 - Đinh Ngọc Đại)
(8, 8, NULL, 2, 800000), -- 2 đêm Standard
(8, NULL, 1, 2, 250000), -- Bữa sáng
(8, NULL, 12, 2, 200000), -- Gym
(8, NULL, 10, 3, 200000), -- Mini bar

-- Hóa đơn 9 (DP009 - Ngô Minh Nguyệt)
(9, 9, NULL, 2, 1200000), -- 2 đêm Superior
(9, NULL, 1, 4, 250000), -- Bữa sáng
(9, NULL, 4, 2, 800000), -- Massage cặp đôi
(9, NULL, 19, 1, 500000), -- Hoa trang trí

-- Hóa đơn 10 (DP010 - Nguyễn Văn Dũng)
(10, 10, NULL, 3, 1800000), -- 3 đêm Deluxe
(10, NULL, 1, 9, 250000), -- Bữa sáng 3 ngày
(10, NULL, 5, 3, 1200000), -- Spa
(10, NULL, 8, 3, 800000), -- Tour city

-- Hóa đơn 11 (DP011 - Đỗ Hữu Quốc Ánh)
(11, 11, NULL, 2, 2500000), -- 2 đêm Junior Suite
(11, NULL, 2, 4, 350000), -- Bữa trưa business
(11, NULL, 15, 1, 2000000), -- Phòng họp
(11, NULL, 6, 2, 150000), -- Giặt là

-- Hóa đơn 12 (DP012 - Đỗ Tiến Đạt)
(12, 12, NULL, 2, 3500000), -- 2 đêm Executive Suite
(12, NULL, 3, 4, 500000), -- Bữa tối anniversary
(12, NULL, 20, 1, 800000), -- Champagne
(12, NULL, 19, 1, 500000), -- Hoa trang trí
(12, NULL, 5, 2, 1200000), -- Spa cặp đôi

-- Hóa đơn 13 (DP013 - Trần Đức Lượng)
(13, 13, NULL, 2, 2800000), -- 2 đêm Family Room
(13, NULL, 1, 10, 250000), -- Bữa sáng gia đình
(13, NULL, 13, 5, 150000), -- Hồ bơi
(13, NULL, 9, 5, 1200000), -- Tour biển

-- Hóa đơn 14 (DP014 - Đào Minh Quang)
(14, 14, NULL, 2, 8000000), -- 2 đêm Presidential Suite
(14, NULL, 3, 16, 500000), -- Bữa tối corporate
(14, NULL, 15, 2, 2000000), -- Phòng họp 2 buổi
(14, NULL, 14, 1, 600000), -- Karaoke
(14, NULL, 20, 2, 800000), -- Champagne

-- Hóa đơn 15 (DP015 - Bùi Trí Dũng)
(15, 15, NULL, 2, 800000), -- 2 đêm Standard weekend
(15, NULL, 1, 4, 250000), -- Bữa sáng
(15, NULL, 13, 2, 150000), -- Hồ bơi
(15, NULL, 10, 2, 200000), -- Mini bar
(15, NULL, 12, 2, 200000), -- Gym

-- Hóa đơn 16 (DP016 - Nguyễn Mạnh Dũng)
(16, 16, NULL, 2, 1200000), -- 2 đêm Superior romantic
(16, NULL, 3, 2, 500000), -- Bữa tối romantic
(16, NULL, 19, 1, 500000), -- Hoa trang trí
(16, NULL, 4, 2, 800000), -- Massage cặp đôi
(16, NULL, 20, 1, 800000), -- Champagne

-- Hóa đơn 17 (DP017 - Trần Thế Anh)
(17, 17, NULL, 2, 1800000), -- 2 đêm Deluxe mini vacation
(17, NULL, 1, 6, 250000), -- Bữa sáng
(17, NULL, 8, 3, 800000), -- Tour city
(17, NULL, 13, 3, 150000), -- Hồ bơi
(17, NULL, 16, 1, 300000), -- Giường phụ

-- Hóa đơn 18-30 sẽ có TongTien = 0 vì là đặt phòng tương lai hoặc đang ở
(18, 18, NULL, 0, 0), -- Placeholder cho booking hiện tại
(19, 19, NULL, 0, 0), -- Placeholder cho booking tương lai
(20, 20, NULL, 0, 0),
(21, 21, NULL, 0, 0),
(22, 22, NULL, 0, 0),
(23, 23, NULL, 0, 0),
(24, 24, NULL, 0, 0),
(25, 25, NULL, 0, 0),
(26, 26, NULL, 0, 0),
(27, 27, NULL, 0, 0),
(28, 28, NULL, 0, 0),
(29, 29, NULL, 0, 0),
(30, 30, NULL, 0, 0),

-- Thêm nhiều dịch vụ bổ sung cho các hóa đơn đã có
(1, NULL, 18, 2, 200000), -- Gửi xe cho HD001
(2, NULL, 13, 2, 150000), -- Hồ bơi cho HD002
(3, NULL, 18, 3, 200000), -- Gửi xe gia đình HD003
(4, NULL, 7, 2, 300000), -- Đưa đón sân bay HD004
(5, NULL, 10, 5, 200000), -- Mini bar HD005
(6, NULL, 16, 2, 300000), -- Giường phụ HD006
(7, NULL, 18, 4, 200000), -- Gửi xe VIP HD007
(8, NULL, 7, 1, 300000), -- Đưa đón sân bay HD008
(9, NULL, 13, 2, 150000), -- Hồ bơi HD009
(10, NULL, 18, 3, 200000), -- Gửi xe HD010
(11, NULL, 7, 1, 300000), -- Đưa đón sân bay HD011
(12, NULL, 4, 1, 800000), -- Massage thêm HD012
(13, NULL, 16, 1, 300000), -- Giường phụ HD013
(14, NULL, 7, 2, 300000), -- Đưa đón sân bay HD014
(15, NULL, 7, 1, 300000), -- Đưa đón sân bay HD015
(16, NULL, 13, 2, 150000), -- Hồ bơi HD016
(17, NULL, 18, 3, 200000); -- Gửi xe HD017

-- Update tổng tiền cho các hóa đơn (tính lại)
UPDATE HoaDon SET TongTien = 2350000, SoTienDaTra = 2350000 WHERE MaHD = 1;
UPDATE HoaDon SET TongTien = 3000000, SoTienDaTra = 3000000 WHERE MaHD = 2;
UPDATE HoaDon SET TongTien = 4800000, SoTienDaTra = 4800000 WHERE MaHD = 3;
UPDATE HoaDon SET TongTien = 6400000, SoTienDaTra = 6400000 WHERE MaHD = 4;
UPDATE HoaDon SET TongTien = 9550000, SoTienDaTra = 9550000 WHERE MaHD = 5;
UPDATE HoaDon SET TongTien = 7500000, SoTienDaTra = 7500000 WHERE MaHD = 6;
UPDATE HoaDon SET TongTien = 21400000, SoTienDaTra = 21400000 WHERE MaHD = 7;
UPDATE HoaDon SET TongTien = 2150000, SoTienDaTra = 2150000 WHERE MaHD = 8;
UPDATE HoaDon SET TongTien = 3250000, SoTienDaTra = 3250000 WHERE MaHD = 9;
UPDATE HoaDon SET TongTien = 6800000, SoTienDaTra = 6800000 WHERE MaHD = 10;
UPDATE HoaDon SET TongTien = 6700000, SoTienDaTra = 6700000 WHERE MaHD = 11;
UPDATE HoaDon SET TongTien = 10500000, SoTienDaTra = 10500000 WHERE MaHD = 12;
UPDATE HoaDon SET TongTien = 8850000, SoTienDaTra = 8850000 WHERE MaHD = 13;
UPDATE HoaDon SET TongTien = 21200000, SoTienDaTra = 21200000 WHERE MaHD = 14;
UPDATE HoaDon SET TongTien = 2350000, SoTienDaTra = 2350000 WHERE MaHD = 15;
UPDATE HoaDon SET TongTien = 3550000, SoTienDaTra = 3550000 WHERE MaHD = 16;
UPDATE HoaDon SET TongTien = 4800000, SoTienDaTra = 4800000 WHERE MaHD = 17;

-----------------------------------------------------------------------------------------------------
--Stored Procedure
-- Tạo hóa đơn
CREATE PROCEDURE sp_TaoHoaDon
(
    @SoHD NVARCHAR(50),
    @MaKhach INT,
    @MaND INT,
    @HinhThucThanhToan NVARCHAR(50) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Kiểm tra khách hàng tồn tại
        IF NOT EXISTS(SELECT 1 FROM Khach WHERE MaKhach = @MaKhach)
            THROW 50001, N'Khách hàng không tồn tại', 1;
            
        -- Kiểm tra người dùng tồn tại  
        IF NOT EXISTS(SELECT 1 FROM NguoiDung WHERE MaND = @MaND)
            THROW 50002, N'Người dùng không tồn tại', 1;
            
        INSERT INTO HoaDon(SoHD, MaKhach, MaND, HinhThucThanhToan)
        VALUES (@SoHD, @MaKhach, @MaND, @HinhThucThanhToan);
        
        SELECT SCOPE_IDENTITY() AS MaHD; -- Trả về ID mới tạo
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;

--Thêm chi tiết hóa đơn
CREATE PROCEDURE sp_ThemHoaDonChiTiet
(
    @MaHD INT,
    @MaDatPhong INT = NULL,
    @MaDV INT = NULL,
    @SoLuong INT = 1,
    @DonGia DECIMAL(18,2)
)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Kiểm tra hóa đơn
        IF NOT EXISTS (SELECT 1 FROM HoaDon WHERE MaHD = @MaHD)
            THROW 50003, N'Hóa đơn không tồn tại', 1;

        -- Kiểm tra đặt phòng hoặc dịch vụ
        IF @MaDatPhong IS NOT NULL AND NOT EXISTS (SELECT 1 FROM DatPhong WHERE MaDatPhong = @MaDatPhong)
            THROW 50004, N'Đặt phòng không tồn tại', 1;

        IF @MaDV IS NOT NULL AND NOT EXISTS (SELECT 1 FROM DichVu WHERE MaDV = @MaDV)
            THROW 50005, N'Dịch vụ không tồn tại', 1;

        -- Kiểm tra số lượng và đơn giá
        IF @SoLuong <= 0
            THROW 50006, N'Số lượng phải lớn hơn 0', 1;

        IF @DonGia < 0
            THROW 50007, N'Đơn giá không được âm', 1;

        -- Kiểm tra ràng buộc: chỉ một trong hai MaDatPhong hoặc MaDV được cung cấp
        IF (@MaDatPhong IS NULL AND @MaDV IS NULL) OR (@MaDatPhong IS NOT NULL AND @MaDV IS NOT NULL)
            THROW 50008, N'Phải chọn một và chỉ một trong hai: Đặt phòng hoặc Dịch vụ', 1;

        INSERT INTO HoaDonChiTiet (MaHD, MaDatPhong, MaDV, SoLuong, DonGia)
        VALUES (@MaHD, @MaDatPhong, @MaDV, @SoLuong, @DonGia);

        -- Gọi SP cập nhật tổng tiền (đảm bảo SP này tồn tại)
        EXEC sp_HoaDon_UpdateTongTien @MaHD;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;

-- Cập nhật tổng tiền trong chi tiết hóa đơn
CREATE PROCEDURE sp_HoaDon_CapNhatTongTien
(
    @MaHD INT
)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Kiểm tra hóa đơn
        IF NOT EXISTS (SELECT 1 FROM HoaDon WHERE MaHD = @MaHD)
            THROW 50009, N'Hóa đơn không tồn tại', 1;

        -- Cập nhật tổng tiền dựa trên chi tiết hóa đơn
        UPDATE HoaDon
		SET TongTien = ISNULL((
		SELECT SUM(ThanhTien)
			FROM HoaDonChiTiet
			WHERE MaHD = @MaHD
			), 0)
		WHERE MaHD = @MaHD;


        SELECT MaHD, TongTien, SoTienDaTra, SoTienConNo
        FROM HoaDon
        WHERE MaHD = @MaHD;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;

--Cập nhật tổng tiền (hóa đơn)
CREATE PROCEDURE sp_HoaDon_ThanhToan
(
    @MaHD INT,
    @SoTienTra DECIMAL(18,2)
)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Kiểm tra hóa đơn
        IF NOT EXISTS (SELECT 1 FROM HoaDon WHERE MaHD = @MaHD)
            THROW 50004, N'Hóa đơn không tồn tại', 1;

        -- Kiểm tra số tiền thanh toán
        IF @SoTienTra <= 0
            THROW 50003, N'Số tiền thanh toán phải lớn hơn 0', 1;

        DECLARE @TongTien DECIMAL(18,2), @DaTra DECIMAL(18,2);
        SELECT @TongTien = TongTien, @DaTra = ISNULL(SoTienDaTra, 0)
        FROM HoaDon
        WHERE MaHD = @MaHD;

        -- Kiểm tra thanh toán vượt quá tổng hóa đơn
        IF (@DaTra + @SoTienTra) > @TongTien
            THROW 50005, N'Số tiền thanh toán vượt quá tổng hóa đơn', 1;

        -- Cập nhật số tiền đã trả
        UPDATE HoaDon
        SET SoTienDaTra = @DaTra + @SoTienTra
        WHERE MaHD = @MaHD;

        -- Trả về thông tin hóa đơn
        SELECT MaHD, TongTien, SoTienDaTra, SoTienConNo
        FROM HoaDon
        WHERE MaHD = @MaHD;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;

-- Thêm sp tìm kiếm và báo cáo, lấy ds hóa đơn
CREATE OR ALTER PROCEDURE sp_HoaDon_TimKiem
(
    @TuNgay DATE = NULL,
    @DenNgay DATE = NULL,
    @MaKhach INT = NULL,
    @PageIndex INT = 1,
    @PageSize INT = 20
)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Kiểm tra tham số phân trang
        IF @PageIndex <= 0
            THROW 50010, N'PageIndex phải lớn hơn 0', 1;

        IF @PageSize <= 0
            THROW 50011, N'PageSize phải lớn hơn 0', 1;

        ;WITH CTE AS (
            SELECT 
                h.MaHD, 
                h.SoHD, 
                k.HoTen AS TenKhach, 
                h.NgayLap,
                h.TongTien, 
                h.SoTienDaTra, 
                h.SoTienConNo,
                h.HinhThucThanhToan,
                CASE WHEN h.SoTienConNo = 0 
                     THEN N'Đã thanh toán' 
                     ELSE N'Còn nợ' END AS TrangThaiTT,
                ROW_NUMBER() OVER (ORDER BY h.NgayLap DESC) AS rn
            FROM HoaDon h
            INNER JOIN Khach k ON h.MaKhach = k.MaKhach
            WHERE (@TuNgay IS NULL OR h.NgayLap >= @TuNgay)
              AND (@DenNgay IS NULL OR h.NgayLap <= @DenNgay)  
              AND (@MaKhach IS NULL OR h.MaKhach = @MaKhach)
        )
        -- Lấy dữ liệu phân trang
        SELECT *
        FROM CTE
        WHERE rn BETWEEN (@PageIndex - 1) * @PageSize + 1
                     AND @PageIndex * @PageSize;

        -- Lấy tổng số bản ghi
        SELECT COUNT(*) AS TotalRecords
        FROM HoaDon h
        WHERE (@TuNgay IS NULL OR h.NgayLap >= @TuNgay)
          AND (@DenNgay IS NULL OR h.NgayLap <= @DenNgay)  
          AND (@MaKhach IS NULL OR h.MaKhach = @MaKhach);
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;
GO

--Tự động tạo số hóa đơn
CREATE TRIGGER tr_HoaDon_TaoSoHD
ON HoaDon 
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        DECLARE @NewSoHD NVARCHAR(50);
        
        -- Tạo SoHD mới
        UPDATE h 
        SET SoHD = 'HD' + FORMAT(GETDATE(), 'yyyyMMdd') + 
                  RIGHT('000' + CAST(h.MaHD AS VARCHAR), 3)
        FROM HoaDon h
        INNER JOIN inserted i ON h.MaHD = i.MaHD
        WHERE h.SoHD IS NULL OR h.SoHD = '';

        -- Kiểm tra trùng lặp (tùy chọn)
        IF EXISTS (
            SELECT 1 
            FROM HoaDon h
            INNER JOIN inserted i ON h.SoHD = (
                'HD' + FORMAT(GETDATE(), 'yyyyMMdd') + 
                RIGHT('000' + CAST(i.MaHD AS VARCHAR), 3)
            )
            WHERE h.MaHD != i.MaHD
        )
        BEGIN
            THROW 50012, N'Số hóa đơn đã tồn tại', 1;
        END;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END;

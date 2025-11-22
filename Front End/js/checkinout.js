let allBookings = [];
let customers = [];
let rooms = [];
let roomTypes = [];

let currentTab = 'checkin';     // 'checkin' | 'staying' | 'checkout'
let currentBooking = null;      // booking đang xử lý checkin/checkout

const BS = CONFIG.BOOKING_STATUS;

// khởi tạo
document.addEventListener('DOMContentLoaded', () => {
  // Sidebar
  if (typeof initSidebar === 'function') {
    initSidebar();
  }

  // Event form
  initForms();

  // Load dữ liệu ban đầu
  loadInitialData();
});

//load dl
async function loadInitialData() {
  showLoading('bookingsList');

  try {
    const [bookingsRes, customersRes, roomsRes, typesRes] = await Promise.all([
      API.get(CONFIG.ENDPOINTS.BOOKINGS),
      API.get(CONFIG.ENDPOINTS.CUSTOMERS),
      API.get(CONFIG.ENDPOINTS.ROOMS),
      API.get(CONFIG.ENDPOINTS.ROOM_TYPES)
    ]);

    const rawBookings  = bookingsRes.data  || bookingsRes  || [];
    const rawCustomers = customersRes.data || customersRes || [];
    const rawRooms     = roomsRes.data     || roomsRes     || [];
    const rawTypes     = typesRes.data     || typesRes     || [];

    allBookings = rawBookings.map(normalizeBookingFromAPI);
    customers   = rawCustomers.map(normalizeCustomerFromAPI);
    rooms       = rawRooms.map(normalizeRoomFromAPI);
    roomTypes   = rawTypes.map(normalizeRoomTypeFromAPI);
  } catch (err) {
    console.error('Lỗi loadInitialData (CheckInOut):', err);
    showError('Không lấy được dữ liệu từ API, đang dùng dữ liệu demo (nếu có).');

    // Fallback demo
    if (window.DEMO_DATA) {
      allBookings = (DEMO_DATA.bookings || []).map(normalizeBookingFromAPI);
      customers   = (DEMO_DATA.customers || []).map(normalizeCustomerFromAPI);
      rooms       = (DEMO_DATA.rooms || []).map(normalizeRoomFromAPI);
      roomTypes   = (DEMO_DATA.roomTypes || []).map(normalizeRoomTypeFromAPI);
    } else {
      allBookings = [];
      customers   = [];
      rooms       = [];
      roomTypes   = [];
    }
  }

  enrichBookings();
  switchTab('checkin');
}

//
function normalizeBookingFromAPI(b) {
  const maDatPhong  = b.maDatPhong ?? b.MaDatPhong;
  const maDat       = b.maDat ?? b.MaDat ?? (maDatPhong ? `DP${String(maDatPhong).padStart(3, '0')}` : '');
  const maKhach     = b.maKhach ?? b.MaKhach;
  const maPhong     = b.maPhong ?? b.MaPhong;
  const maLoaiPhong = b.maLoaiPhong ?? b.MaLoaiPhong;
  const ngayNhan    = b.ngayNhan ?? b.NgayNhan;
  const ngayTra     = b.ngayTra ?? b.NgayTra;
  const soKhach     = b.soKhach ?? b.SoKhach ?? 1;
  const trangThai   = b.trangThai ?? b.TrangThai ?? BS.RESERVED;
  const nguoiTao    = b.nguoiTao ?? b.NguoiTao ?? null;
  const ghiChu      = b.ghiChu ?? b.GhiChu ?? '';

  return {
    maDatPhong,
    maDat,
    maKhach,
    maPhong,
    maLoaiPhong,
    ngayNhan,
    ngayTra,
    soKhach,
    trangThai,
    nguoiTao,
    ghiChu
  };
}

function normalizeCustomerFromAPI(c) {
  return {
    maKhach: c.maKhach ?? c.MaKhach,
    hoTen: c.hoTen ?? c.HoTen ?? '',
    dienThoai: c.dienThoai ?? c.DienThoai ?? '',
    email: c.email ?? c.Email ?? '',
    diaChi: c.diaChi ?? c.DiaChi ?? ''
  };
}

function normalizeRoomFromAPI(r) {
  return {
    maPhong: r.maPhong ?? r.MaPhong,
    soPhong: r.soPhong ?? r.SoPhong ?? r.tenPhong ?? r.TenPhong ?? '',
    maLoaiPhong: r.maLoaiPhong ?? r.MaLoaiPhong ?? r.maLoai ?? r.MaLoai ?? null,
    tang: r.tang ?? r.Tang ?? null,
    trangThai: r.trangThai ?? r.TrangThai ?? ''
  };
}

function normalizeRoomTypeFromAPI(t) {
  return {
    maLoaiPhong: t.maLoaiPhong ?? t.MaLoaiPhong ?? t.maLoai ?? t.MaLoai,
    tenLoaiPhong: t.tenLoaiPhong ?? t.ten ?? t.TenLoai ?? t.Ten ?? '',
    soKhachToiDa: t.soKhachToiDa ?? t.SoKhachToiDa ?? null,
    moTa: t.moTa ?? t.MoTa ?? ''
  };
}

// Ghép thêm tên khách, số phòng, tên loại phòng vào booking
function enrichBookings() {
  allBookings.forEach(b => {
    const kh = customers.find(c => String(c.maKhach) === String(b.maKhach));
    if (kh) {
      b.tenKhach = kh.hoTen;
      b.dienThoai = kh.dienThoai;
    } else {
      b.tenKhach = `Khách #${b.maKhach || '?'}`;
      b.dienThoai = '';
    }

    const room = rooms.find(r => String(r.maPhong) === String(b.maPhong));
    if (room) {
      b.soPhong = room.soPhong;
      if (!b.maLoaiPhong && room.maLoaiPhong) {
        b.maLoaiPhong = room.maLoaiPhong;
      }
    }

    const rt = roomTypes.find(t => String(t.maLoaiPhong) === String(b.maLoaiPhong));
    if (rt) {
      b.tenLoaiPhong = rt.tenLoaiPhong;
    } else {
      b.tenLoaiPhong = b.maLoaiPhong || '';
    }
  });
}

// hiển thị ds
function switchTab(tab) {
  currentTab = tab;

  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => btn.classList.remove('active'));
  // Theo thứ tự trong HTML: 0-checkin, 1-staying, 2-checkout
  if (tab === 'checkin' && tabButtons[0]) tabButtons[0].classList.add('active');
  if (tab === 'staying' && tabButtons[1]) tabButtons[1].classList.add('active');
  if (tab === 'checkout' && tabButtons[2]) tabButtons[2].classList.add('active');

  loadBookings(tab);
}

function loadBookings(tab) {
  let filtered = [];

  if (tab === 'checkin') {
    filtered = allBookings.filter(b => b.trangThai === BS.RESERVED);
  } else if (tab === 'staying') {
    filtered = allBookings.filter(b => b.trangThai === BS.CHECKED_IN);
  } else if (tab === 'checkout') {
    filtered = allBookings.filter(b => b.trangThai === BS.CHECKED_OUT);
  }

  displayBookings(filtered);
}

function displayBookings(bookings) {
  const container = document.getElementById('bookingsList');
  if (!container) return;

  if (!bookings || bookings.length === 0) {
    container.innerHTML = `
      <p style="text-align: center; color: #999; padding: 40px;">
        Không có đặt phòng nào
      </p>
    `;
    return;
  }

  let html = '<table><thead><tr>';
  html += '<th>Mã đặt</th>';
  html += '<th>Khách hàng</th>';
  html += '<th>Phòng</th>';
  html += '<th>Loại phòng</th>';
  html += '<th>Ngày nhận</th>';
  html += '<th>Ngày trả</th>';
  html += '<th>Trạng thái</th>';
  html += '<th>Thao tác</th>';
  html += '</tr></thead><tbody>';

  bookings.forEach(b => {
    const statusInfo = getStatusInfo(b.trangThai);

    html += '<tr>';
    html += `<td>${b.maDat}</td>`;
    html += `<td>${b.tenKhach || ''}<br><small>${b.dienThoai || ''}</small></td>`;
    html += `<td><strong>${b.soPhong || ''}</strong></td>`;
    html += `<td>${b.tenLoaiPhong || ''}</td>`;
    html += `<td>${formatDateTimeDisplay(b.ngayNhan)}</td>`;
    html += `<td>${formatDateTimeDisplay(b.ngayTra)}</td>`;
    html += `<td><span class="status-badge ${statusInfo.cssClass}">${statusInfo.text}</span></td>`;
    html += '<td>';

    if (b.trangThai === BS.RESERVED) {
      html += `<button class="btn btn-success" onclick="openCheckInModal(${b.maDatPhong})">Check In</button>`;
    } else if (b.trangThai === BS.CHECKED_IN) {
      html += `<button class="btn btn-danger" onclick="openCheckOutModal(${b.maDatPhong})">Check Out</button>`;
      html += ` <button class="btn btn-warning" onclick="changeRoom(${b.maDatPhong})">Chuyển phòng</button>`;
    }

    html += '</td>';
    html += '</tr>';
  });

  html += '</tbody></table>';

  container.innerHTML = html;
}

function getStatusInfo(status) {
  switch (status) {
    case BS.RESERVED:
      return { cssClass: 'status-checkin', text: 'Chờ nhận' };
    case BS.CHECKED_IN:
      return { cssClass: 'status-staying', text: 'Đang ở' };
    case BS.CHECKED_OUT:
      return { cssClass: 'status-checkout', text: 'Đã trả' };
    case BS.CANCELLED:
      return { cssClass: 'status-checkout', text: 'Đã hủy' };
    default:
      return { cssClass: 'status-checkin', text: status || 'Không rõ' };
  }
}

// Format hiển thị ngày giờ
function formatDateTimeDisplay(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN') + ' ' +
         d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

// tìm
function searchBookings() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  const q = input.value.trim().toLowerCase();
  if (!q) {
    // Nếu không có query, load lại theo tab hiện tại
    loadBookings(currentTab);
    return;
  }

  const matched = allBookings.filter(b => {
    const inCurrentTab =
      (currentTab === 'checkin'  && b.trangThai === BS.RESERVED)  ||
      (currentTab === 'staying'  && b.trangThai === BS.CHECKED_IN) ||
      (currentTab === 'checkout' && b.trangThai === BS.CHECKED_OUT);

    if (!inCurrentTab) return false;

    return (
      String(b.maDat || '').toLowerCase().includes(q) ||
      String(b.tenKhach || '').toLowerCase().includes(q) ||
      String(b.soPhong || '').toLowerCase().includes(q)
    );
  });

  displayBookings(matched);
}

// ================== CHECK IN ==================
function openCheckInModal(maDatPhong) {
  const booking = allBookings.find(b => String(b.maDatPhong) === String(maDatPhong));
  if (!booking) return;

  currentBooking = booking;

  const modal = document.getElementById('checkinModal');
  const info = document.getElementById('checkinBookingInfo');
  if (!modal || !info) return;

  info.innerHTML = `
    <h3>Thông tin đặt phòng</h3>
    <p><strong>Mã đặt:</strong> ${booking.maDat}</p>
    <p><strong>Khách hàng:</strong> ${booking.tenKhach}</p>
    <p><strong>Phòng:</strong> ${booking.soPhong || ''} - ${booking.tenLoaiPhong || ''}</p>
    <p><strong>Thời gian:</strong> ${formatDateTimeDisplay(booking.ngayNhan)} → ${formatDateTimeDisplay(booking.ngayTra)}</p>
  `;

  // reset form
  const form = document.getElementById('checkinForm');
  if (form) form.reset();

  modal.classList.add('show');
}

function initForms() {
  const checkinForm = document.getElementById('checkinForm');
  const checkoutForm = document.getElementById('checkoutForm');

  if (checkinForm) {
    checkinForm.addEventListener('submit', onCheckinSubmit);
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', onCheckoutSubmit);
  }
}

async function onCheckinSubmit(e) {
  e.preventDefault();
  if (!currentBooking) return;

  const cmndInput = document.getElementById('checkinCMND');
  const adultsInput = document.getElementById('checkinAdults');
  const childrenInput = document.getElementById('checkinChildren');
  const depositInput = document.getElementById('checkinDeposit');
  const noteInput = document.getElementById('checkinNote');

  const cmnd = cmndInput?.value.trim();
  const adults = Number(adultsInput?.value || 1);
  const children = Number(childrenInput?.value || 0);
  const deposit = Number(depositInput?.value || 0);
  const note = noteInput?.value || '';

  if (!cmnd) {
    showError('Vui lòng nhập CMND/CCCD.');
    return;
  }

  if (deposit < 0) {
    showError('Tiền đặt cọc không hợp lệ.');
    return;
  }

  const body = {
    maDatPhong: currentBooking.maDatPhong,
    soNguoiLon: adults,
    soTreEm: children,
    cmnd: cmnd,
    tienCoc: deposit,
    ghiChu: note
  };

  try {
    const res = await API.post(CONFIG.ENDPOINTS.CHECKIN, body);
    if (res && res.success) {
      showSuccess(CONFIG.MESSAGES.SUCCESS.CHECKIN || 'Check in thành công!');
      // cập nhật trạng thái local
      currentBooking.trangThai = BS.CHECKED_IN;
      closeModal('checkinModal');
      loadBookings(currentTab);
    } else {
      showError((res && res.message) || CONFIG.MESSAGES.ERROR.UNKNOWN);
    }
  } catch (err) {
    console.error('Lỗi CHECKIN:', err);
    showError('Lỗi khi gọi API CheckIn.');
  }
}

// ================== CHECK OUT ==================
function openCheckOutModal(maDatPhong) {
  const booking = allBookings.find(b => String(b.maDatPhong) === String(maDatPhong));
  if (!booking) return;
  currentBooking = booking;

  const modal = document.getElementById('checkoutModal');
  const info = document.getElementById('checkoutBookingInfo');
  if (!modal || !info) return;

  // Tính số đêm & phí phòng (giả sử 800k/đêm như demo cũ)
  const nights = calculateNights(booking.ngayNhan, booking.ngayTra);
  const roomFee = nights * 800000;  // bạn có thể sửa lại sau cho đúng giá DB
  const serviceFee = 0;
  const total = roomFee + serviceFee;

  info.innerHTML = `
    <h3>Thông tin đặt phòng</h3>
    <p><strong>Mã đặt:</strong> ${booking.maDat}</p>
    <p><strong>Khách hàng:</strong> ${booking.tenKhach}</p>
    <p><strong>Phòng:</strong> ${booking.soPhong || ''} - ${booking.tenLoaiPhong || ''}</p>
    <p><strong>Số đêm:</strong> ${nights} đêm</p>
  `;

  const roomFeeInput = document.getElementById('checkoutRoomFee');
  const serviceFeeInput = document.getElementById('checkoutServiceFee');
  const totalInput = document.getElementById('checkoutTotal');
  const amountInput = document.getElementById('checkoutAmount');
  const paymentSelect = document.getElementById('checkoutPayment');
  const noteInput = document.getElementById('checkoutNote');

  if (roomFeeInput) roomFeeInput.value = roomFee;
  if (serviceFeeInput) serviceFeeInput.value = serviceFee;
  if (totalInput) totalInput.value = total;
  if (amountInput) amountInput.value = total;
  if (paymentSelect) paymentSelect.value = '';
  if (noteInput) noteInput.value = '';

  modal.classList.add('show');
}

async function onCheckoutSubmit(e) {
  e.preventDefault();
  if (!currentBooking) return;

  const roomFee = Number(document.getElementById('checkoutRoomFee')?.value || 0);
  const serviceFee = Number(document.getElementById('checkoutServiceFee')?.value || 0);
  const total = Number(document.getElementById('checkoutTotal')?.value || 0);
  const payment = document.getElementById('checkoutPayment')?.value || '';
  const amount = Number(document.getElementById('checkoutAmount')?.value || 0);
  const note = document.getElementById('checkoutNote')?.value || '';

  if (!payment) {
    showError('Vui lòng chọn phương thức thanh toán.');
    return;
  }

  if (amount <= 0) {
    showError('Số tiền thanh toán không hợp lệ.');
    return;
  }

  const body = {
    maDatPhong: currentBooking.maDatPhong,
    tienPhong: roomFee,
    tienDichVu: serviceFee,
    tongTien: total,
    soTienThanhToan: amount,
    phuongThucThanhToan: payment,
    ghiChu: note
  };

  try {
    const res = await API.post(CONFIG.ENDPOINTS.CHECKOUT, body);
    if (res && res.success) {
      showSuccess(CONFIG.MESSAGES.SUCCESS.CHECKOUT || 'Check out thành công!');
      closeModal('checkoutModal');
      currentBooking.trangThai = BS.CHECKED_OUT;
      loadBookings(currentTab);
    } else {
      showError((res && res.message) || CONFIG.MESSAGES.ERROR.UNKNOWN);
    }
  } catch (err) {
    console.error('Lỗi CHECKOUT:', err);
    showError('Lỗi khi gọi API CheckOut.');
  }
}

// ================== CHUYỂN PHÒNG (DEMO) ==================
async function changeRoom(maDatPhong) {
  const booking = allBookings.find(b => String(b.maDatPhong) === String(maDatPhong));
  if (!booking) return;

  const newRoom = prompt('Nhập mã phòng mới muốn chuyển tới (MaPhong):', booking.maPhong || '');
  if (!newRoom) return;

  const body = {
    maDatPhong: booking.maDatPhong,
    maPhongMoi: Number(newRoom)
  };

  try {
    const res = await API.post(CONFIG.ENDPOINTS.CHANGE_ROOM, body);
    if (res && res.success) {
      showSuccess('Chuyển phòng thành công!');
      // cập nhật tạm ở client
      booking.maPhong = Number(newRoom);
      enrichBookings();
      loadBookings(currentTab);
    } else {
      showError((res && res.message) || CONFIG.MESSAGES.ERROR.UNKNOWN);
    }
  } catch (err) {
    console.error('Lỗi CHUYỂN PHÒNG:', err);
    showError('Lỗi khi gọi API ChuyenPhong.');
  }
}

// ================== MODAL & EXPORT GLOBAL ==================
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('show');
}

// Đưa các hàm ra global để HTML gọi được
window.switchTab = switchTab;
window.searchBookings = searchBookings;
window.openCheckInModal = openCheckInModal;
window.openCheckOutModal = openCheckOutModal;
window.closeModal = closeModal;
window.changeRoom = changeRoom;

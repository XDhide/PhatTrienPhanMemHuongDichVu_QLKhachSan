// booking.js - Kết nối trang Đặt phòng với API backend
// Cần: config.js, utils.js đã được load trước

document.addEventListener('DOMContentLoaded', () => {

  // === STATE TOÀN CỤC ===
  let allRooms = [];        // tất cả phòng
  let filteredRooms = [];   // phòng sau khi lọc
  let customers = [];       // danh sách khách
  let selectedRoom = null;  // phòng đang được chọn trong modal

  // === 1. SET NGÀY MẶC ĐỊNH TRÊN Ô LỌC ===
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const checkInDateInput = document.getElementById('checkInDate');
  const checkOutDateInput = document.getElementById('checkOutDate');
  if (checkInDateInput && checkOutDateInput) {
    checkInDateInput.value = today.toISOString().split('T')[0];
    checkOutDateInput.value = tomorrow.toISOString().split('T')[0];
  }

  // Gắn submit cho form
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }

  // Load dữ liệu lần đầu
  loadInitialData();

  // =====================================================
  // 2. HÀM GỌI API
  // =====================================================

  async function loadInitialData() {
    try {
      // Hiện loading cho khung phòng
      if (typeof showLoading === 'function') {
        showLoading('roomsContainer');
      }

      // Gọi song song 2 API: Rooms + Customers
      const [roomRes, customerRes] = await Promise.all([
        API.get(CONFIG.ENDPOINTS.ROOMS),
        API.get(CONFIG.ENDPOINTS.CUSTOMERS)
      ]);

      const roomData = roomRes.data || roomRes;           // tuỳ backend trả {data:...} hay [] luôn
      const customerData = customerRes.data || customerRes;

      // Map dữ liệu API sang format mà UI đang dùng
      allRooms = roomData.map(normalizeRoomFromAPI);
      filteredRooms = [...allRooms];

      customers = customerData.map(normalizeCustomerFromAPI);

      // Đổ dữ liệu lên UI
      populateCustomers(customers);

      // Chưa có API dịch vụ thì tạm dùng demo nếu bạn có trong demo-data.js
      if (window.demoServices) {
        populateServices(window.demoServices);
      }

      updateStats();
      displayRooms(filteredRooms);
    } catch (err) {
      console.error('Lỗi loadInitialData:', err);
      alert('Không tải được dữ liệu từ API, tạm dùng dữ liệu demo (nếu có).');

      // Fallback: nếu bạn vẫn giữ demoRooms, demoCustomers, demoServices thì dùng
      if (window.demoRooms && window.demoCustomers && window.demoServices) {
        allRooms = [...window.demoRooms];
        filteredRooms = [...allRooms];
        customers = [...window.demoCustomers];
        populateCustomers(customers);
        populateServices(window.demoServices);
        updateStats();
        displayRooms(filteredRooms);
      }
    }
  }

  // Chuyển 1 record phòng từ API về dạng mà UI cần
  function normalizeRoomFromAPI(p) {
    // TODO: chỗ này chỉnh tên field cho đúng với API / DB của bạn
    const maPhong = p.maPhong ?? p.MaPhong;
    const soPhong = p.soPhong ?? p.SoPhong ?? p.tenPhong ?? p.TenPhong ?? '';
    const maLoaiPhong = p.maLoaiPhong ?? p.MaLoaiPhong ?? p.tenLoaiPhong ?? p.TenLoaiPhong ?? '';
    const gia = p.gia ?? p.Gia ?? p.donGia ?? p.DonGia ?? 0;
    const tinhTrang = p.tinhTrang ?? p.TinhTrang ?? p.trangThai ?? p.TrangThai ?? '';

    return {
      maPhong,
      soPhong,
      maLoaiPhong,
      gia,
      trangThai: mapRoomStatus(tinhTrang)  // convert về 'available' / 'occupied' / 'maintenance'
    };
  }

  // Convert trạng thái trong DB → class sử dụng trong UI
  function mapRoomStatus(apiStatus) {
    if (apiStatus === null || apiStatus === undefined) return 'available';
    const s = String(apiStatus).toLowerCase();

    // Dựa vào config.js: ROOM_STATUS: SanSang, DaThue, BaoTri,...
    if (s.includes('sansang') || s.includes('trong') || s === '0') return 'available';
    if (s.includes('dathue') || s.includes('dadat') || s === '1') return 'occupied';
    if (s.includes('baotri') || s.includes('dong') || s === '2') return 'maintenance';

    return 'available';
  }

  // Chuyển record khách từ API về dạng UI dùng
  function normalizeCustomerFromAPI(k) {
    // TODO: chỉnh tên field cho đúng: HoTen / TenKhach / SDT / DienThoai / Email, ...
    return {
      maKhach: k.maKhach ?? k.MaKhach,
      hoTen: k.hoTen ?? k.HoTen ?? k.tenKhach ?? k.TenKhach,
      sdt: k.sdt ?? k.SDT ?? k.dienThoai ?? k.DienThoai,
      email: k.email ?? k.Email
    };
  }

  // =====================================================
  // 3. ĐỔ DỮ LIỆU LÊN UI
  // =====================================================

  function populateCustomers(customers) {
    const select = document.getElementById('customerId');
    if (!select) return;

    select.innerHTML = '<option value="">-- Chọn khách hàng --</option>';

    customers.forEach(customer => {
      const option = document.createElement('option');
      option.value = customer.maKhach;
      option.textContent = `${customer.hoTen} - ${customer.sdt || customer.email || ''}`;
      select.appendChild(option);
    });
  }

  function populateServices(services) {
    const select = document.getElementById('serviceId');
    if (!select) return;

    select.innerHTML = '<option value="">-- Không chọn --</option>';

    services.forEach(service => {
      const option = document.createElement('option');
      option.value = service.maDV;
      option.textContent = `${service.ten} - ${formatPrice(service.donGia)}`;
      select.appendChild(option);
    });
  }

  function updateStats() {
    const available = allRooms.filter(r => r.trangThai === 'available').length;
    const occupied = allRooms.filter(r => r.trangThai === 'occupied').length;
    const maintenance = allRooms.filter(r => r.trangThai === 'maintenance').length;

    const totalRoomsEl = document.getElementById('totalRooms');
    const availableRoomsEl = document.getElementById('availableRooms');
    const occupiedRoomsEl = document.getElementById('occupiedRooms');
    const maintenanceRoomsEl = document.getElementById('maintenanceRooms');

    if (totalRoomsEl) totalRoomsEl.textContent = allRooms.length;
    if (availableRoomsEl) availableRoomsEl.textContent = available;
    if (occupiedRoomsEl) occupiedRoomsEl.textContent = occupied;
    if (maintenanceRoomsEl) maintenanceRoomsEl.textContent = maintenance;
  }

  function displayRooms(rooms) {
    const container = document.getElementById('roomsContainer');
    if (!container) return;

    if (!rooms || rooms.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:#999;">Không tìm thấy phòng nào.</p>';
      return;
    }

    container.innerHTML = '';

    rooms.forEach(room => {
      const card = document.createElement('div');
      card.className = `room-card ${room.trangThai}`;

      card.addEventListener('click', () => openBookingModal(room));

      const statusText =
        room.trangThai === 'available'
          ? 'Trống'
          : room.trangThai === 'occupied'
          ? 'Đã đặt / đang ở'
          : 'Bảo trì';

      card.innerHTML = `
        <div class="room-number">Phòng ${room.soPhong}</div>
        <div class="room-type">${room.maLoaiPhong || ''}</div>
        <div class="room-price">${formatPrice(room.gia || 0)}</div>
        <span class="room-status status-${room.trangThai}">${statusText}</span>
      `;

      container.appendChild(card);
    });
  }

  // =====================================================
  // 4. LỌC PHÒNG (được gọi từ onchange trên select)
  // =====================================================

  window.filterRooms = function () {
    const typeFilter = document.getElementById('roomTypeFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';

    filteredRooms = [...allRooms];

    if (typeFilter) {
      filteredRooms = filteredRooms.filter(r => r.maLoaiPhong === typeFilter);
    }

    if (statusFilter) {
      filteredRooms = filteredRooms.filter(r => r.trangThai === statusFilter);
    }

    // TODO: nếu muốn lọc theo khoảng ngày checkInDate/checkOutDate thì có thể call API /Phong/lich
    displayRooms(filteredRooms);
  };

  // =====================================================
  // 5. MỞ / ĐÓNG MODAL ĐẶT PHÒNG
  // =====================================================

  function openBookingModal(room) {
    selectedRoom = room;

    if (room.trangThai === 'occupied') {
      alert('Phòng này đã được đặt!');
      return;
    }
    if (room.trangThai === 'maintenance') {
      alert('Phòng này đang bảo trì!');
      return;
    }

    const modal = document.getElementById('bookingModal');
    const details = document.getElementById('selectedRoomDetails');
    const msg = document.getElementById('modalMessage');

    if (details) {
      details.innerHTML = `
        <h3>Phòng ${room.soPhong}</h3>
        <p>Loại phòng: <strong>${room.maLoaiPhong || ''}</strong></p>
        <p>Giá: <strong>${formatPrice(room.gia || 0)}</strong> / đêm</p>
      `;
    }

    if (msg) {
      msg.textContent = '';
      msg.style.color = '';
    }

    if (modal) {
      modal.classList.add('show');
    }
  }

  window.closeModal = function () {
    const modal = document.getElementById('bookingModal');
    if (modal) {
      modal.classList.remove('show');
    }
    selectedRoom = null;
  };

  // =====================================================
  // 6. GỬI FORM ĐẶT PHÒNG → API BOOKINGS
  // =====================================================

  async function handleBookingSubmit(e) {
    e.preventDefault();

    const msg = document.getElementById('modalMessage');

    if (!selectedRoom) {
      if (msg) {
        msg.style.color = '#dc3545';
        msg.textContent = 'Bạn chưa chọn phòng.';
      }
      return;
    }

    const customerId = document.getElementById('customerId')?.value;
    if (!customerId) {
      if (msg) {
        msg.style.color = '#dc3545';
        msg.textContent = 'Bạn chưa chọn khách hàng.';
      }
      return;
    }

    const checkInDateTime = document.getElementById('checkInDateTime')?.value;
    const checkOutDateTime = document.getElementById('checkOutDateTime')?.value;

    if (!checkInDateTime || !checkOutDateTime) {
      if (msg) {
        msg.style.color = '#dc3545';
        msg.textContent = 'Vui lòng chọn đầy đủ thời gian nhận / trả phòng.';
      }
      return;
    }

    const adults = Number(document.getElementById('adults')?.value || 1);
    const children = Number(document.getElementById('children')?.value || 0);
    const notes = document.getElementById('notes')?.value || '';

    const body = {
      // TODO: chỉnh field cho khớp DTO DatPhong bên backend
      maPhong: selectedRoom.maPhong,
      maKhach: Number(customerId),
      ngayNhan: checkInDateTime,
      ngayTra: checkOutDateTime,
      soKhach: adults + children,
      ghiChu: notes
      // Có thể cần thêm: KenhDat, NguoiTao, MaLoaiPhong, ...
    };

    try {
      const res = await API.post(CONFIG.ENDPOINTS.BOOKINGS, body);

      if (res && res.success) {
        if (msg) {
          msg.style.color = '#28a745';
          msg.textContent = res.message || 'Đặt phòng thành công!';
        }

        // Reload lại danh sách phòng sau khi đặt
        await loadInitialData();

        // Đóng modal sau 1 chút
        setTimeout(() => {
          closeModal();
        }, 1000);
      } else {
        if (msg) {
          msg.style.color = '#dc3545';
          msg.textContent = (res && res.message) || 'Đặt phòng thất bại!';
        }
      }
    } catch (err) {
      console.error('Lỗi khi gọi API BOOKINGS:', err);
      if (msg) {
        msg.style.color = '#dc3545';
        msg.textContent = 'Lỗi kết nối API khi đặt phòng.';
      }
    }
  }
});

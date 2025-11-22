let allRooms = [];        // danh sách phòng
let filteredRooms = [];   // danh sách phòng sau lọc
let roomTypes = [];       // loại phòng
let roomPrices = [];      // bảng giá

let editingRoom = null;       // phòng đang sửa (null = đang thêm mới)
let editingRoomType = null;   // loại phòng đang sửa (null = đang thêm mới)

// khởi tạo trang
document.addEventListener('DOMContentLoaded', () => {
    // Khởi tạo sidebar (tô active menu, xử lý thu gọn)
    if (typeof initSidebar === 'function') {
        initSidebar();
    }

    // Hiển thị tên user hiện tại (nếu có token)
    const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (currentUser) {
        const nameSpan = document.getElementById('currentUserName');
        if (nameSpan) {
            nameSpan.textContent = currentUser.name || currentUser.username;
        }
    }

    // Dùng DEMO_DATA (từ demo-data.js)
    loadDemoData();

    // Gắn submit cho form
    const roomForm = document.getElementById('roomForm');
    if (roomForm) {
        roomForm.addEventListener('submit', handleRoomFormSubmit);
    }

    const roomTypeForm = document.getElementById('roomTypeForm');
    if (roomTypeForm) {
        roomTypeForm.addEventListener('submit', handleRoomTypeFormSubmit);
    }

    // Lọc lần đầu để hiển thị sơ đồ
    filterRooms();
    renderRoomTypes();
    updateStats();
});

// load demo
function loadDemoData() {
    // DEMO_DATA lấy từ demo-data.js
    allRooms = (DEMO_DATA && DEMO_DATA.rooms) ? DEMO_DATA.rooms.map(r => ({
        maPhong: r.maPhong,
        soPhong: r.soPhong,
        maLoaiPhong: r.maLoaiPhong,
        tinhTrang: r.tinhTrang
    })) : [];

    roomTypes = (DEMO_DATA && DEMO_DATA.roomTypes) ? DEMO_DATA.roomTypes.map(t => ({
        maLoaiPhong: t.maLoaiPhong,
        tenLoaiPhong: t.tenLoaiPhong,
        moTa: t.moTa,
        soKhachToiDa: t.soKhachToiDa
    })) : [];

    roomPrices = (DEMO_DATA && DEMO_DATA.prices) ? DEMO_DATA.prices.map(p => ({
        maGia: p.maGia,
        maLoaiPhong: p.maLoaiPhong,
        tuNgay: p.tuNgay,
        denNgay: p.denNgay,
        giaMoiDem: p.giaMoiDem,
        giaMoiGio: p.giaMoiGio
    })) : [];

    filteredRooms = [...allRooms];
    fillRoomTypeSelect();
}

// sơ đồ/loại phòng
function switchTab(tab) {
    const roomsTab = document.getElementById('roomsTab');
    const typesTab = document.getElementById('typesTab');
    const tabBtns = document.querySelectorAll('.tab-btn');

    if (!roomsTab || !typesTab || tabBtns.length < 2) return;

    if (tab === 'rooms') {
        roomsTab.classList.add('active');
        typesTab.classList.remove('active');
        tabBtns[0].classList.add('active');
        tabBtns[1].classList.remove('active');
    } else {
        roomsTab.classList.remove('active');
        typesTab.classList.add('active');
        tabBtns[0].classList.remove('active');
        tabBtns[1].classList.add('active');
    }
}

// lọc và hiển thị
function filterRooms() {
    if (!allRooms || allRooms.length === 0) {
        renderRooms([]);
        updateStats();
        return;
    }

    const searchInput = document.getElementById('searchRoom');
    const floorFilter = document.getElementById('floorFilter');
    const statusFilter = document.getElementById('statusFilter');

    const searchText = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const floorValue = floorFilter ? floorFilter.value : '';
    const statusValue = statusFilter ? statusFilter.value : '';

    filteredRooms = allRooms.filter(room => {
        let ok = true;

        if (searchText) {
            ok = ok && String(room.soPhong).toLowerCase().includes(searchText);
        }

        if (floorValue) {
            ok = ok && String(room.soPhong).startsWith(floorValue);
        }

        if (statusValue) {
            ok = ok && room.tinhTrang === statusValue;
        }

        return ok;
    });

    renderRooms(filteredRooms);
    updateStats();
}

function renderRooms(rooms) {
    const container = document.getElementById('roomsContainer');
    if (!container) return;

    if (!rooms || rooms.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🛏️</div>
                <h3>Không có phòng phù hợp</h3>
                <p>Hãy thử đổi điều kiện lọc.</p>
            </div>
        `;
        return;
    }

    // Nhóm phòng theo tầng (lấy chữ số đầu của số phòng)
    const floors = {};
    rooms.forEach(r => {
        const soPhongStr = String(r.soPhong || '');
        const floor = soPhongStr[0] || '0';
        if (!floors[floor]) floors[floor] = [];
        floors[floor].push(r);
    });

    const floorKeys = Object.keys(floors).sort((a, b) => Number(a) - Number(b));

    const html = floorKeys.map(floor => {
        const roomsOfFloor = floors[floor].sort((a, b) => a.soPhong - b.soPhong);

        const roomCards = roomsOfFloor.map(room => {
            const type = roomTypes.find(t => t.maLoaiPhong === room.maLoaiPhong);
            const price = roomPrices.find(p => p.maLoaiPhong === room.maLoaiPhong);
            const typeName = type ? type.tenLoaiPhong : 'Không rõ';
            const priceText = price ? `${formatPrice(price.giaMoiDem)} / đêm` : 'Chưa cấu hình giá';

            const statusClass = getRoomStatusClass(room.tinhTrang);
            const statusText = getRoomStatusText(room.tinhTrang);

            return `
                <div class="room-card ${statusClass}" onclick="openRoomDetail(${room.maPhong})">
                    <div class="room-number">Phòng ${room.soPhong}</div>
                    <div class="room-type">${typeName}</div>
                    <div class="room-status status-${statusClass}">${statusText}</div>
                    <div style="font-size:13px;color:#555;margin-top:4px;">${priceText}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="floor-section">
                <div class="floor-header">Tầng ${floor}</div>
                <div class="rooms-grid">
                    ${roomCards}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

function getRoomStatusClass(status) {
    const s = status || '';
    if (s === 'SanSang') return 'available';
    if (s === 'DaThue') return 'occupied';
    if (s === 'BaoTri') return 'maintenance';
    if (s === 'DonDep') return 'cleaning';
    return 'unknown';
}

function getRoomStatusText(status) {
    const s = status || '';
    if (s === 'SanSang') return 'Sẵn sàng';
    if (s === 'DaThue') return 'Đã thuê';
    if (s === 'BaoTri') return 'Bảo trì';
    if (s === 'DonDep') return 'Đang dọn';
    return 'Không rõ';
}

// thống kê
function updateStats() {
    const total = allRooms.length;
    const available = allRooms.filter(r => r.tinhTrang === 'SanSang').length;
    const occupied = allRooms.filter(r => r.tinhTrang === 'DaThue').length;
    const maintenance = allRooms.filter(r => r.tinhTrang === 'BaoTri').length;

    const occRate = total === 0 ? 0 : Math.round((occupied / total) * 100);

    const totalRoomsEl = document.getElementById('totalRooms');
    const availableRoomsEl = document.getElementById('availableRooms');
    const occupiedRoomsEl = document.getElementById('occupiedRooms');
    const maintenanceRoomsEl = document.getElementById('maintenanceRooms');
    const occupancyRateEl = document.getElementById('occupancyRate');

    if (totalRoomsEl) totalRoomsEl.textContent = total;
    if (availableRoomsEl) availableRoomsEl.textContent = available;
    if (occupiedRoomsEl) occupiedRoomsEl.textContent = occupied;
    if (maintenanceRoomsEl) maintenanceRoomsEl.textContent = maintenance;
    if (occupancyRateEl) occupancyRateEl.textContent = occRate + '%';
}

// giá đi kèm loại phòng
function renderRoomTypes() {
    const container = document.getElementById('roomTypesList');
    if (!container) return;

    if (!roomTypes || roomTypes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>Chưa có loại phòng</h3>
                <p>Hãy nhấn "Thêm loại phòng" để tạo.</p>
            </div>
        `;
        return;
    }

    const html = roomTypes.map(type => {
        const price = roomPrices.find(p => p.maLoaiPhong === type.maLoaiPhong);
        const priceText = price
            ? `${formatPrice(price.giaMoiDem)} / đêm`
            : 'Chưa cấu hình giá';

        return `
            <div class="room-type-card">
                <div class="room-type-name">${type.tenLoaiPhong}</div>
                <div class="room-type-info">
                    <span>Mã loại: <strong>${type.maLoaiPhong}</strong></span>
                    <span>Số khách tối đa: <strong>${type.soKhachToiDa}</strong></span>
                </div>
                <div class="room-type-info">
                    <span>Giá mỗi đêm:</span>
                    <strong>${priceText}</strong>
                </div>
                <p style="margin-top:8px;font-size:13px;color:#666;">
                    ${type.moTa || 'Chưa có mô tả.'}
                </p>
                <div class="room-type-actions">
                    <button class="btn btn-secondary" onclick="openEditTypeModal('${type.maLoaiPhong}')">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteRoomType('${type.maLoaiPhong}')">Xóa</button>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

// Điền select loại phòng trong form phòng
function fillRoomTypeSelect() {
    const select = document.getElementById('roomTypeId');
    if (!select) return;

    select.innerHTML = roomTypes.map(t => `
        <option value="${t.maLoaiPhong}">${t.tenLoaiPhong}</option>
    `).join('');
}

// ======================= MODAL CHI TIẾT PHÒNG =======================
function openRoomDetail(maPhong) {
    const room = allRooms.find(r => r.maPhong === maPhong);
    if (!room) return;

    const type = roomTypes.find(t => t.maLoaiPhong === room.maLoaiPhong);
    const price = roomPrices.find(p => p.maLoaiPhong === room.maLoaiPhong);

    const typeName = type ? type.tenLoaiPhong : 'Không rõ';
    const priceText = price ? formatPrice(price.giaMoiDem) + ' / đêm' : 'Chưa cấu hình giá';
    const statusText = getRoomStatusText(room.tinhTrang);

    const content = document.getElementById('roomDetailContent');
    const modal = document.getElementById('roomModal');
    if (!content || !modal) return;

    content.innerHTML = `
        <h3>Phòng ${room.soPhong} - ${typeName}</h3>
        <p><strong>Trạng thái:</strong> ${statusText}</p>
        <p><strong>Giá:</strong> ${priceText}</p>
        <hr/>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
            <button class="btn btn-secondary" onclick="openEditRoom(${room.maPhong})">Sửa phòng</button>
            <button class="btn btn-warning" onclick="markRoomCleaning(${room.maPhong})">Đánh dấu đang dọn</button>
            <button class="btn btn-warning" onclick="markRoomMaintenance(${room.maPhong})">Đánh dấu bảo trì</button>
            <button class="btn btn-danger" onclick="deleteRoom(${room.maPhong})">Xóa phòng</button>
        </div>
    `;

    modal.classList.add('show');
}

// ======================= MODAL THÊM / SỬA PHÒNG =======================
function openAddRoomModal() {
    editingRoom = null;

    const title = document.getElementById('roomFormTitle');
    if (title) title.textContent = 'Thêm Phòng';

    const numberInput = document.getElementById('roomNumber');
    const typeSelect = document.getElementById('roomTypeId');
    const statusSelect = document.getElementById('roomStatus');

    if (numberInput) numberInput.value = '';
    if (typeSelect && roomTypes.length > 0) {
        typeSelect.value = roomTypes[0].maLoaiPhong;
    }
    if (statusSelect) {
        statusSelect.value = 'SanSang';
    }

    const modal = document.getElementById('roomFormModal');
    if (modal) modal.classList.add('show');
}

function openEditRoom(maPhong) {
    const room = allRooms.find(r => r.maPhong === maPhong);
    if (!room) return;
    editingRoom = room;

    const title = document.getElementById('roomFormTitle');
    if (title) title.textContent = 'Cập nhật Phòng';

    const numberInput = document.getElementById('roomNumber');
    const typeSelect = document.getElementById('roomTypeId');
    const statusSelect = document.getElementById('roomStatus');

    if (numberInput) numberInput.value = room.soPhong;
    if (typeSelect) typeSelect.value = room.maLoaiPhong;
    if (statusSelect) statusSelect.value = room.tinhTrang || 'SanSang';

    const modal = document.getElementById('roomFormModal');
    const detailModal = document.getElementById('roomModal');
    if (detailModal) detailModal.classList.remove('show');
    if (modal) modal.classList.add('show');
}

function handleRoomFormSubmit(e) {
    e.preventDefault();

    const numberInput = document.getElementById('roomNumber');
    const typeSelect = document.getElementById('roomTypeId');
    const statusSelect = document.getElementById('roomStatus');

    const soPhong = numberInput ? numberInput.value.trim() : '';
    const maLoaiPhong = typeSelect ? typeSelect.value : '';
    const tinhTrang = statusSelect ? statusSelect.value : 'SanSang';

    if (!soPhong || !maLoaiPhong) {
        showError('Vui lòng nhập đầy đủ thông tin phòng!');
        return;
    }

    // Kiểm tra trùng số phòng khi thêm mới
    if (!editingRoom) {
        const existed = allRooms.some(r => String(r.soPhong) === soPhong);
        if (existed) {
            showError('Số phòng đã tồn tại!');
            return;
        }
    }

    if (editingRoom) {
        // Cập nhật phòng
        editingRoom.soPhong = soPhong;
        editingRoom.maLoaiPhong = maLoaiPhong;
        editingRoom.tinhTrang = tinhTrang;

        showSuccess('Cập nhật phòng thành công!');
    } else {
        // Thêm phòng mới (demo)
        const newId = allRooms.length
            ? Math.max(...allRooms.map(r => Number(r.maPhong) || 0)) + 1
            : 1;

        const newRoom = {
            maPhong: newId,
            soPhong,
            maLoaiPhong,
            tinhTrang
        };

        allRooms.push(newRoom);
        showSuccess('Thêm phòng mới thành công!');
    }

    editingRoom = null;
    closeModal('roomFormModal');
    filterRooms();
    updateStats();
}

function deleteRoom(maPhong) {
    if (!confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
        return;
    }

    allRooms = allRooms.filter(r => r.maPhong !== maPhong);
    filteredRooms = filteredRooms.filter(r => r.maPhong !== maPhong);

    showSuccess('Xóa phòng thành công!');
    filterRooms();
    updateStats();

    const detailModal = document.getElementById('roomModal');
    if (detailModal) detailModal.classList.remove('show');
}

// Đánh dấu trạng thái
function markRoomCleaning(maPhong) {
    const room = allRooms.find(r => r.maPhong === maPhong);
    if (!room) return;
    room.tinhTrang = 'DonDep';
    showSuccess('Đã đánh dấu phòng đang dọn.');
    filterRooms();
}

function markRoomMaintenance(maPhong) {
    const room = allRooms.find(r => r.maPhong === maPhong);
    if (!room) return;
    room.tinhTrang = 'BaoTri';
    showSuccess('Đã đánh dấu phòng bảo trì.');
    filterRooms();
}

// ======================= MODAL THÊM / SỬA LOẠI PHÒNG =======================
function openAddTypeModal() {
    editingRoomType = null;

    const title = document.getElementById('roomTypeFormTitle');
    if (title) title.textContent = 'Thêm Loại Phòng';

    const codeInput = document.getElementById('typeCode');
    const nameInput = document.getElementById('typeName');
    const capacityInput = document.getElementById('typeCapacity');
    const priceInput = document.getElementById('typePrice');
    const descInput = document.getElementById('typeDescription');

    if (codeInput) codeInput.value = '';
    if (nameInput) nameInput.value = '';
    if (capacityInput) capacityInput.value = '2';
    if (priceInput) priceInput.value = '500000';
    if (descInput) descInput.value = '';

    const modal = document.getElementById('roomTypeFormModal');
    if (modal) modal.classList.add('show');
}

function openEditTypeModal(maLoaiPhong) {
    const type = roomTypes.find(t => t.maLoaiPhong === maLoaiPhong);
    if (!type) return;
    editingRoomType = type;

    const title = document.getElementById('roomTypeFormTitle');
    if (title) title.textContent = 'Cập nhật Loại Phòng';

    const codeInput = document.getElementById('typeCode');
    const nameInput = document.getElementById('typeName');
    const capacityInput = document.getElementById('typeCapacity');
    const priceInput = document.getElementById('typePrice');
    const descInput = document.getElementById('typeDescription');

    const price = roomPrices.find(p => p.maLoaiPhong === maLoaiPhong);

    if (codeInput) {
        codeInput.value = type.maLoaiPhong;
        codeInput.disabled = true; // không cho sửa mã
    }
    if (nameInput) nameInput.value = type.tenLoaiPhong;
    if (capacityInput) capacityInput.value = type.soKhachToiDa;
    if (priceInput) priceInput.value = price ? price.giaMoiDem : '';
    if (descInput) descInput.value = type.moTa || '';

    const modal = document.getElementById('roomTypeFormModal');
    if (modal) modal.classList.add('show');
}

function handleRoomTypeFormSubmit(e) {
    e.preventDefault();

    const codeInput = document.getElementById('typeCode');
    const nameInput = document.getElementById('typeName');
    const capacityInput = document.getElementById('typeCapacity');
    const priceInput = document.getElementById('typePrice');
    const descInput = document.getElementById('typeDescription');

    const maLoaiPhong = codeInput ? codeInput.value.trim() : '';
    const tenLoaiPhong = nameInput ? nameInput.value.trim() : '';
    const soKhachToiDa = capacityInput ? Number(capacityInput.value || 0) : 0;
    const giaMoiDem = priceInput ? Number(priceInput.value || 0) : 0;
    const moTa = descInput ? descInput.value.trim() : '';

    if (!maLoaiPhong || !tenLoaiPhong || !soKhachToiDa || !giaMoiDem) {
        showError('Vui lòng nhập đầy đủ thông tin loại phòng và giá!');
        return;
    }

    if (!editingRoomType) {
        // Thêm mới
        const existed = roomTypes.some(t => t.maLoaiPhong === maLoaiPhong);
        if (existed) {
            showError('Mã loại phòng đã tồn tại!');
            return;
        }

        roomTypes.push({
            maLoaiPhong,
            tenLoaiPhong,
            moTa,
            soKhachToiDa
        });

        roomPrices.push({
            maGia: Date.now(),
            maLoaiPhong,
            tuNgay: new Date().toISOString(),
            denNgay: null,
            giaMoiDem,
            giaMoiGio: 0
        });

        showSuccess('Thêm loại phòng thành công!');
    } else {
        // Cập nhật
        editingRoomType.tenLoaiPhong = tenLoaiPhong;
        editingRoomType.moTa = moTa;
        editingRoomType.soKhachToiDa = soKhachToiDa;

        let price = roomPrices.find(p => p.maLoaiPhong === editingRoomType.maLoaiPhong);
        if (price) {
            price.giaMoiDem = giaMoiDem;
        } else {
            roomPrices.push({
                maGia: Date.now(),
                maLoaiPhong: editingRoomType.maLoaiPhong,
                tuNgay: new Date().toISOString(),
                denNgay: null,
                giaMoiDem,
                giaMoiGio: 0
            });
        }

        showSuccess('Cập nhật loại phòng thành công!');
    }

    editingRoomType = null;
    if (codeInput) codeInput.disabled = false;

    closeModal('roomTypeFormModal');
    renderRoomTypes();
    fillRoomTypeSelect();
}

function deleteRoomType(maLoaiPhong) {
    // Không cho xóa nếu còn phòng đang dùng loại này
    const used = allRooms.some(r => r.maLoaiPhong === maLoaiPhong);
    if (used) {
        showError('Không thể xóa loại phòng vì vẫn còn phòng đang sử dụng loại này!');
        return;
    }

    if (!confirm('Bạn có chắc chắn muốn xóa loại phòng này?')) {
        return;
    }

    roomTypes = roomTypes.filter(t => t.maLoaiPhong !== maLoaiPhong);
    roomPrices = roomPrices.filter(p => p.maLoaiPhong !== maLoaiPhong);

    showSuccess('Xóa loại phòng thành công!');
    renderRoomTypes();
    fillRoomTypeSelect();
}

// ======================= ĐÓNG MODAL =======================
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');

    // reset disabled cho mã loại phòng nếu cần
    if (id === 'roomTypeFormModal') {
        const codeInput = document.getElementById('typeCode');
        if (codeInput) codeInput.disabled = false;
    }
}

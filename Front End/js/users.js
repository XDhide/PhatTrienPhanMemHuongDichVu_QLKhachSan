// users.js - Logic quản lý người dùng

// Demo data
const demoUsers = [
    { maND: 1, tenDangNhap: 'admin', hoTen: 'Nguyễn Văn Admin', vaiTro: 'Admin', email: 'admin@hotel.com', sdt: '0901234567', trangThai: 'active' },
    { maND: 2, tenDangNhap: 'letan01', hoTen: 'Trần Thị Lan', vaiTro: 'LeTan', email: 'lan@hotel.com', sdt: '0902345678', trangThai: 'active' },
    { maND: 3, tenDangNhap: 'ketoan01', hoTen: 'Lê Văn Minh', vaiTro: 'KeToan', email: 'minh@hotel.com', sdt: '0903456789', trangThai: 'active' },
    { maND: 4, tenDangNhap: 'letan02', hoTen: 'Phạm Thị Hoa', vaiTro: 'LeTan', email: 'hoa@hotel.com', sdt: '0904567890', trangThai: 'active' },
    { maND: 5, tenDangNhap: 'admin2', hoTen: 'Hoàng Văn Quân', vaiTro: 'Admin', email: 'quan@hotel.com', sdt: '0905678901', trangThai: 'inactive' },
];

let allUsers = [...demoUsers];
let editingUser = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    updateStats();
    initSidebar();
    
    // Set current user name
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('currentUserName').textContent = currentUser.name || currentUser.username;
    }
});

/**
 * Load và hiển thị danh sách người dùng
 */
function loadUsers() {
    // API Call (đã comment)
    /*
    fetch('https://localhost:7105/api-admin/NguoiDung', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        allUsers = data.data || data;
        displayUsers(allUsers);
        updateStats();
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Không thể tải danh sách người dùng!');
    });
    */
    
    displayUsers(allUsers);
}

/**
 * Hiển thị danh sách người dùng
 */
function displayUsers(users) {
    const container = document.getElementById('usersTableContainer');
    
    if (users.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <h3>Không có người dùng nào</h3>
            </div>
        `;
        return;
    }

    const table = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tên đăng nhập</th>
                    <th>Họ và tên</th>
                    <th>Vai trò</th>
                    <th>Email</th>
                    <th>SĐT</th>
                    <th>Trạng thái</th>
                    <th style="text-align: center;">Thao tác</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td><strong>${user.maND}</strong></td>
                        <td>${user.tenDangNhap}</td>
                        <td>${user.hoTen}</td>
                        <td>${getRoleBadge(user.vaiTro)}</td>
                        <td>${user.email || '-'}</td>
                        <td>${user.sdt || '-'}</td>
                        <td>${getStatusBadge(user.trangThai)}</td>
                        <td style="text-align: center;">
                            <button class="btn btn-warning" onclick='editUser(${JSON.stringify(user).replace(/'/g, "&#39;")})' 
                                    style="padding: 6px 12px; margin-right: 5px;">
                                ✏️
                            </button>
                            <button class="btn btn-danger" onclick="deleteUser(${user.maND})" 
                                    style="padding: 6px 12px;">
                                🗑️
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    
    container.innerHTML = table;
}

/**
 * Lọc người dùng
 */
function filterUsers() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const role = document.getElementById('roleFilter').value;
    
    let filtered = [...allUsers];
    
    if (search) {
        filtered = filtered.filter(user => 
            user.tenDangNhap.toLowerCase().includes(search) ||
            user.hoTen.toLowerCase().includes(search) ||
            (user.email && user.email.toLowerCase().includes(search))
        );
    }
    
    if (role) {
        filtered = filtered.filter(user => user.vaiTro === role);
    }
    
    displayUsers(filtered);
}

/**
 * Cập nhật thống kê
 */
function updateStats() {
    const total = allUsers.length;
    const adminCount = allUsers.filter(u => u.vaiTro === 'Admin').length;
    const staffCount = allUsers.filter(u => u.vaiTro === 'LeTan' || u.vaiTro === 'KeToan').length;
    const activeCount = allUsers.filter(u => u.trangThai === 'active').length;
    
    document.getElementById('totalUsers').textContent = total;
    document.getElementById('adminCount').textContent = adminCount;
    document.getElementById('staffCount').textContent = staffCount;
    document.getElementById('activeCount').textContent = activeCount;
}

/**
 * Mở modal thêm người dùng
 */
function openAddModal() {
    editingUser = null;
    document.getElementById('modalTitle').textContent = 'Thêm Người Dùng';
    document.getElementById('userForm').reset();
    document.getElementById('password').required = true;
    document.getElementById('userModal').classList.add('show');
}

/**
 * Mở modal sửa người dùng
 */
function editUser(user) {
    editingUser = user;
    document.getElementById('modalTitle').textContent = 'Sửa Người Dùng';
    
    document.getElementById('username').value = user.tenDangNhap;
    document.getElementById('fullName').value = user.hoTen;
    document.getElementById('role').value = user.vaiTro;
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.sdt || '';
    document.getElementById('password').required = false;
    document.getElementById('password').value = '';
    
    document.getElementById('userModal').classList.add('show');
}

/**
 * Đóng modal
 */
function closeModal() {
    document.getElementById('userModal').classList.remove('show');
}

/**
 * Xóa người dùng
 */
function deleteUser(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        return;
    }
    
    // API Call (đã comment)
    /*
    fetch(`https://localhost:7105/api-admin/NguoiDung/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (response.ok) {
            showSuccess('Xóa người dùng thành công!');
            loadUsers();
        } else {
            throw new Error('Xóa thất bại');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showError('Không thể xóa người dùng!');
    });
    */
    
    // Demo: Remove from array
    allUsers = allUsers.filter(u => u.maND !== id);
    displayUsers(allUsers);
    updateStats();
    showSuccess('Xóa người dùng thành công!');
    console.log('API: DELETE /api-admin/NguoiDung/' + id);
}

/**
 * Get role badge HTML
 */
function getRoleBadge(role) {
    const badges = {
        'Admin': '<span class="badge badge-danger">Admin</span>',
        'LeTan': '<span class="badge badge-info">Lễ Tân</span>',
        'KeToan': '<span class="badge badge-success">Kế Toán</span>',
        'Khach': '<span class="badge badge-secondary">Khách</span>'
    };
    return badges[role] || '<span class="badge badge-secondary">' + role + '</span>';
}

/**
 * Get status badge HTML
 */
function getStatusBadge(status) {
    return status === 'active' 
        ? '<span class="badge badge-success">Hoạt động</span>'
        : '<span class="badge badge-secondary">Tạm khóa</span>';
}

/**
 * Handle form submission
 */
document.getElementById('userForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const fullName = document.getElementById('fullName').value.trim();
    const role = document.getElementById('role').value;
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // Validation
    if (!username || !fullName || !role) {
        showError('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (!editingUser && (!password || password.length < 6)) {
        showError('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    if (email && !validateEmail(email)) {
        showError('Email không hợp lệ!');
        return;
    }
    
    if (phone && !validatePhone(phone)) {
        showError('Số điện thoại không hợp lệ!');
        return;
    }
    
    const userData = {
        tenDangNhap: username,
        hoTen: fullName,
        vaiTro: role,
        email: email,
        sdt: phone,
        trangThai: 'active'
    };
    
    if (!editingUser || password) {
        userData.matKhau = password;
    }
    
    if (editingUser) {
        // Update
        /*
        fetch(`https://localhost:7105/api-admin/NguoiDung/${editingUser.maND}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...userData, maND: editingUser.maND })
        })
        .then(response => {
            if (response.ok) {
                showSuccess('Cập nhật người dùng thành công!');
                closeModal();
                loadUsers();
            } else {
                throw new Error('Cập nhật thất bại');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Không thể cập nhật người dùng!');
        });
        */
        
        // Demo: Update in array
        const index = allUsers.findIndex(u => u.maND === editingUser.maND);
        if (index !== -1) {
            allUsers[index] = { ...allUsers[index], ...userData };
        }
        
        showSuccess('Cập nhật người dùng thành công!');
        console.log('API: PUT /api-admin/NguoiDung/' + editingUser.maND, userData);
    } else {
        // Create
        /*
        fetch('https://localhost:7105/api-admin/NguoiDung', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            showSuccess('Thêm người dùng thành công!');
            closeModal();
            loadUsers();
        })
        .catch(error => {
            console.error('Error:', error);
            showError('Không thể thêm người dùng!');
        });
        */
        
        // Demo: Add to array
        const newUser = {
            maND: Math.max(...allUsers.map(u => u.maND)) + 1,
            ...userData
        };
        allUsers.push(newUser);
        
        showSuccess('Thêm người dùng thành công!');
        console.log('API: POST /api-admin/NguoiDung', userData);
    }
    
    closeModal();
    displayUsers(allUsers);
    updateStats();
});
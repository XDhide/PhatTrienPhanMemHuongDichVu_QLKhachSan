
        // Kiểm tra đăng nhập
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = 'login.html';
        }

        // Hiển thị thông tin người dùng
        document.getElementById('userName').textContent = user.fullName;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('infoName').textContent = user.fullName;
        document.getElementById('infoEmail').textContent = user.email;
        document.getElementById('infoPhone').textContent = user.phone;
        document.getElementById('infoJoinDate').textContent = user.joinDate;

        // Dữ liệu lịch sử đặt phòng mẫu
        const bookings = [
            {
                id: 'BK001',
                room: 'Phòng Deluxe',
                checkIn: '15/10/2024',
                checkOut: '18/10/2024',
                total: '4.500.000đ',
                status: 'completed'
            },
            {
                id: 'BK002',
                room: 'Phòng Suite',
                checkIn: '20/11/2024',
                checkOut: '23/11/2024',
                total: '8.400.000đ',
                status: 'upcoming'
            }
        ];

        // Hiển thị lịch sử đặt phòng
        const bookingHistoryDiv = document.getElementById('bookingHistory');
        bookings.forEach(booking => {
            const statusClass = booking.status === 'completed' ? 'status-completed' : 'status-upcoming';
            const statusText = booking.status === 'completed' ? 'Đã hoàn thành' : 'Sắp tới';
            
            const bookingHTML = `
                <div class="booking-item">
                    <div class="booking-header">
                        <div>
                            <div class="booking-title">🏨 ${booking.room}</div>
                            <div class="booking-id">Mã đặt phòng: ${booking.id}</div>
                        </div>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                    <div class="booking-details">
                        <div class="booking-detail-item">
                            <div class="detail-label">Ngày nhận phòng</div>
                            <div class="detail-value">📅 ${booking.checkIn}</div>
                        </div>
                        <div class="booking-detail-item">
                            <div class="detail-label">Ngày trả phòng</div>
                            <div class="detail-value">📅 ${booking.checkOut}</div>
                        </div>
                        <div class="booking-detail-item">
                            <div class="detail-label">Tổng tiền</div>
                            <div class="detail-value price">💰 ${booking.total}</div>
                        </div>
                    </div>
                    ${booking.status === 'upcoming' ? '<button class="btn btn-view">👁️ Xem Chi Tiết</button>' : ''}
                </div>
            `;
            bookingHistoryDiv.innerHTML += bookingHTML;
        });

        function goToPayment() {
            window.location.href = 'payment.html';
        }

        function handleLogout() {
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }
        }
    
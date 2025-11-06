// Kiểm tra đăng nhập
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = 'login.html';
        }

        // Điền thông tin người dùng
        document.getElementById('fullName').value = user.fullName;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone;

        // Đặt ngày mặc định
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        document.getElementById('checkIn').valueAsDate = today;
        document.getElementById('checkOut').valueAsDate = tomorrow;

        function updatePrice() {
            const roomSelect = document.getElementById('roomType');
            const selectedOption = roomSelect.options[roomSelect.selectedIndex];
            const roomName = selectedOption.text.split(' - ')[0];
            const price = roomSelect.value;
            
            document.getElementById('summaryRoom').textContent = roomName;
            document.getElementById('summaryPrice').textContent = formatPrice(price);
            calculateTotal();
        }

        function calculateTotal() {
            const checkIn = new Date(document.getElementById('checkIn').value);
            const checkOut = new Date(document.getElementById('checkOut').value);
            const roomPrice = parseInt(document.getElementById('roomType').value);
            
            if (checkIn && checkOut && checkOut > checkIn) {
                const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
                const serviceFee = 200000;
                const total = (roomPrice * nights) + serviceFee;
                
                document.getElementById('summaryNights').textContent = '×' + nights;
                document.getElementById('summaryTotal').textContent = formatPrice(total);
            }
        }

        function formatPrice(price) {
            return parseInt(price).toLocaleString('vi-VN') + 'đ';
        }

        function handleConfirm() {
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const checkIn = document.getElementById('checkIn').value;
            const checkOut = document.getElementById('checkOut').value;

            if (!fullName || !email || !phone || !checkIn || !checkOut) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            
            if (checkOutDate <= checkInDate) {
                alert('Ngày trả phòng phải sau ngày nhận phòng!');
                return;
            }

            alert('🎉 Đặt phòng thành công!\n\nThông tin đặt phòng đã được gửi đến email của bạn.\n\nCảm ơn bạn đã chọn Golden Pearl Hotel!');
            window.location.href = 'profile.html';
        }

        // Tính toán ban đầu
        calculateTotal();
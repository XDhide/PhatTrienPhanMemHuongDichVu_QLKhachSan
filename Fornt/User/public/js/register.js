function handleRegister() {
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (!fullName || !email || !phone || !password || !confirmPassword) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }

            if (password !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }

            // Lưu thông tin người dùng
            const user = {
                fullName: fullName,
                email: email,
                phone: phone,
                joinDate: new Date().toLocaleDateString('vi-VN')
            };
            localStorage.setItem('user', JSON.stringify(user));
            
            alert('Đăng ký thành công!');
            // Chuyển đến trang cá nhân
            window.location.href = 'profile.html';
        }

        // Enter để đăng ký
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleRegister();
            }
        });
function handleLogin() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email && password) {
                // Lưu thông tin người dùng
                const user = {
                    fullName: 'Nguyễn Văn A',
                    email: email,
                    phone: '0901234567',
                    joinDate: '01/01/2024'
                };
                localStorage.setItem('user', JSON.stringify(user));
                
                // Chuyển đến trang cá nhân
                window.location.href = 'profile.html';
            } else {
                alert('Vui lòng nhập đầy đủ email và mật khẩu!');
            }
        }

        // Enter để đăng nhập
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
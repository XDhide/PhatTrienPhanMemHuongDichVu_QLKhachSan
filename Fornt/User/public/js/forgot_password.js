function handleResetPassword() {
            const email = document.getElementById('email').value;

            if (!email) {
                alert('Vui lòng nhập email!');
                return;
            }

            // Giả lập gửi email
            alert('Link đặt lại mật khẩu đã được gửi đến email của bạn!\n\nVui lòng kiểm tra hộp thư để tiếp tục.');
            
            // Chuyển về trang đăng nhập
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }

        // Enter để gửi
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleResetPassword();
            }
        });
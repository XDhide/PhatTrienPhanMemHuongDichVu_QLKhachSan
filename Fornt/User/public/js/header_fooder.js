        function checkLoginStatus() {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const authButtons = document.getElementById('authButtons');
            const userMenu = document.getElementById('userMenu');
            const userName = document.getElementById('userName');
            
            if (isLoggedIn) {
                authButtons.style.display = 'none';
                userMenu.style.display = 'block';
                
                const user = JSON.parse(localStorage.getItem('userData') || '{}');
                userName.textContent = user.name || 'Người dùng';
                
                const avatarText = document.getElementById('avatarText');
                avatarText.textContent = user.avatar || '👤';
            } else {
                authButtons.style.display = 'flex';
                userMenu.style.display = 'none';
            }
        }

        function handleLogin() {
            alert('Chuyển đến trang đăng nhập...');
        }

        function handleRegister() {
            alert('Chuyển đến trang đăng ký...');
        }

        function handleLogout(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userData');
            document.getElementById('dropdownMenu').classList.remove('active');
            checkLoginStatus();
            alert('Đã đăng xuất thành công!');
        }

        document.addEventListener('DOMContentLoaded', function() {
            const avatarBtn = document.getElementById('avatarBtn');
            const dropdownMenu = document.getElementById('dropdownMenu');

            if (avatarBtn) {
                avatarBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    dropdownMenu.classList.toggle('active');
                });
            }

            document.addEventListener('click', function(e) {
                if (!e.target.closest('.user-menu')) {
                    dropdownMenu.classList.remove('active');
                }
            });

            checkLoginStatus();

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify({name: 'Nguyễn Văn A', avatar: '👨'}));
            checkLoginStatus();
        });
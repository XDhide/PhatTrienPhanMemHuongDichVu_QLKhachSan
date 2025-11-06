// Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Book button handlers
        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const roomName = this.closest('.room-card').querySelector('h3').textContent;
                alert(`Bạn đã chọn ${roomName}. Chức năng đặt phòng sẽ được phát triển tiếp!`);
            });
        });
    
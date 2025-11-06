
        const rooms = [
            {
                id: 1,
                name: 'Phòng Deluxe',
                price: 1500000,
                guests: 2,
                description: 'Phòng tiêu chuẩn cao với đầy đủ tiện nghi hiện đại, phù hợp cho cặp đôi hoặc khách công tác.',
                features: ['25m²', '2 Người', 'WiFi Free', 'View Thành Phố'],
                icon: '🏨'
            },
            {
                id: 2,
                name: 'Phòng Suite',
                price: 2800000,
                guests: 3,
                description: 'Phòng rộng rãi với phòng ngủ riêng biệt, ban công và khu vực làm việc độc lập.',
                features: ['45m²', '3 Người', 'Ban Tắm', 'Minibar'],
                icon: '🏨'
            },
            {
                id: 3,
                name: 'Phòng Penthouse',
                price: 8500000,
                guests: 4,
                description: 'Đỉnh cao của sự sang trọng với không gian gần 2 tầng, bể bơi riêng và dịch vụ butler 24/7.',
                features: ['120m²', '6 Người', 'Bể Bơi Riêng', 'Butler 24/7'],
                icon: '🏨'
            },
            {
                id: 4,
                name: 'Phòng Family',
                price: 3500000,
                guests: 4,
                description: 'Thiết kế dành cho gia đình với 2 phòng ngủ, phòng khách rộng và khu vui chơi cho trẻ em.',
                features: ['60m²', '5 Người', '2 Phòng Ngủ', 'Khu Vui Chơi'],
                icon: '🏨'
            },
            {
                id: 5,
                name: 'Phòng Honeymoon',
                price: 3200000,
                guests: 2,
                description: 'Phòng lãng mạn với trang trí đặc biệt, bồn tắm jacuzzi và dịch vụ champagne miễn phí.',
                features: ['37m²', '2 Người', 'Jacuzzi', 'Champagne'],
                icon: '🏨'
            },
            {
                id: 6,
                name: 'Phòng Executive',
                price: 2200000,
                guests: 2,
                description: 'Dành cho doanh nhân với bàn làm việc rộng, dịch vụ giặt là nhanh và massage tại phòng hàng ngày.',
                features: ['32m²', '2 Người', 'Bàn Làm Việc', 'Chế Massage'],
                icon: '🏨'
            }
        ];

        let filteredRooms = [...rooms];

        function renderRooms(roomsToRender) {
            const grid = document.getElementById('roomsGrid');
            const noResults = document.getElementById('noResults');
            const resultsCount = document.getElementById('resultsCount');

            if (roomsToRender.length === 0) {
                grid.style.display = 'none';
                noResults.style.display = 'block';
                resultsCount.textContent = 'Không tìm thấy phòng';
                return;
            }

            grid.style.display = 'grid';
            noResults.style.display = 'none';
            resultsCount.textContent = `Hiển thị ${roomsToRender.length} phòng`;

            grid.innerHTML = roomsToRender.map(room => `
                <div class="room-card" onclick="viewRoom(${room.id})">
                    <div class="room-image">${room.icon}</div>
                    <div class="room-content">
                        <h3 class="room-title">${room.name}</h3>
                        <p class="room-description">${room.description}</p>
                        <div class="room-features">
                            ${room.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                        </div>
                        <div class="room-footer">
                            <div class="room-price">
                                ${room.price.toLocaleString('vi-VN')}đ
                                <span>/ đêm</span>
                            </div>
                            <button class="view-btn">Xem Ngay</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        function applyFilters() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const priceFilter = document.getElementById('priceFilter').value;
            const guestFilter = document.getElementById('guestFilter').value;
            const featureFilter = document.getElementById('featureFilter').value;

            filteredRooms = rooms.filter(room => {
                const matchesSearch = room.name.toLowerCase().includes(searchTerm) || 
                                    room.description.toLowerCase().includes(searchTerm);
                
                let matchesPrice = true;
                if (priceFilter === 'low') matchesPrice = room.price < 2000000;
                if (priceFilter === 'mid') matchesPrice = room.price >= 2000000 && room.price <= 5000000;
                if (priceFilter === 'high') matchesPrice = room.price > 5000000;

                const matchesGuests = !guestFilter || room.guests >= parseInt(guestFilter);

                let matchesFeature = true;
                if (featureFilter) {
                    const featureMap = {
                        'view': 'View Thành Phố',
                        'wifi': 'WiFi Free',
                        'minibar': 'Minibar',
                        'butler': 'Butler 24/7'
                    };
                    matchesFeature = room.features.some(f => f.includes(featureMap[featureFilter]));
                }

                return matchesSearch && matchesPrice && matchesGuests && matchesFeature;
            });

            renderRooms(filteredRooms);
        }

        function viewRoom(id) {
            alert(`Đang xem chi tiết phòng #${id}. Tính năng sẽ được phát triển!`);
        }

        document.getElementById('searchInput').addEventListener('input', applyFilters);
        document.getElementById('priceFilter').addEventListener('change', applyFilters);
        document.getElementById('guestFilter').addEventListener('change', applyFilters);
        document.getElementById('featureFilter').addEventListener('change', applyFilters);

        renderRooms(rooms);
    
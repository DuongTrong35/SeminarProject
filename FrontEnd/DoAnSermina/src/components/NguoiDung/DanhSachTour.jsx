import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DanhSachTour = () => {
    const [tours, setTours] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // API public cho User xem
        const fetchTours = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/tours');
                const data = await response.json();
                setTours(data);
            } catch (error) {
                console.error('Lỗi khi tải danh sách tour:', error);
            }
        };
        fetchTours();
    }, []);

    const handleStartTour = async (tourId) => {
        try {
            // Gọi chi tiết Tour để lấy đầy đủ mảng tọa độ (lat/lng) của các cửa hàng
            const response = await fetch(`http://localhost:8080/api/admin/tours/${tourId}`);
            const tourDetail = await response.json();

            // Chuyển hướng sang trang Map và quăng luôn cục data qua state
            navigate('/map', { state: { tourData: tourDetail } });
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết tour:', error);
        }
    };

    return (
        <div className="danh-sach-tour">
            <h2>Khám Phá Các Lộ Trình Hấp Dẫn</h2>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {tours.map((tour) => (
                    <div key={tour.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', width: '300px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                        <h3>{tour.tenTour}</h3>
                        <p style={{ color: '#555' }}>{tour.moTa}</p>
                        <p><strong>Giá:</strong> {tour.gia.toLocaleString()} VNĐ</p>
                        <p><strong>Số lượng trạm dừng:</strong> {tour.soLuongTram} trạm</p>

                        <button
                            onClick={() => handleStartTour(tour.id)}
                            style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            🚀 Bắt đầu Tour
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DanhSachTour;
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../QuanTri/TrangChuQT.css'; // Chỉnh lại đường dẫn CSS này nếu cần thiết

// Mảng navItems phải có đủ 3 menu
const navItems = [
    { to: "/admin", label: "Trang chủ", icon: "🏠" },
        { to: "/mhad", label: "Thêm POI", icon: "🔍" },

    { to: "/admin/qlch", label: "Quản lý cửa hàng", icon: "🏪" },
    { to: "/admin/tours", label: "Quản lý Tour", icon: "📍" },
    { to: "/admin/hopdong", label: "Duyệt cửa hàng", icon: "📝" },
];

const QuanLyTour = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [user, setUser] = useState(null);
    const [tours, setTours] = useState([]);

    // ===== CHECK LOGIN =====
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("user"));
        if (!data || !data.id) {
            alert("Chưa đăng nhập!");
            navigate("/login");
            return;
        }
        setUser(data);
    }, [navigate]);

    // ===== LẤY DANH SÁCH TOUR =====
    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/admin/tours');
                const data = await response.json();
                setTours(data);
            } catch (error) {
                console.error('Lỗi khi tải danh sách tour:', error);
            }
        };
        fetchTours();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bro có chắc muốn xóa tour này không?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/admin/tours/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('Xóa thành công!');
                    setTours(tours.filter(tour => tour.id !== id));
                }
            } catch (error) {
                console.error('Lỗi khi xóa:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div className="cuahang-container">

            {/* SIDEBAR BÊN TRÁI */}
            <aside className="cuahang-sidebar">
                <div className="cuahang-user">
                    <div className="cuahang-avatar">
                        {user?.username?.[0]?.toUpperCase() || "A"}
                    </div>
                    <div>{user?.username}</div>
                </div>

                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={pathname === item.to ? "cuahang-link active" : "cuahang-link"}
                    >
                        {item.icon} {item.label}
                    </Link>
                ))}

                <button className="quantri-btn red" onClick={handleLogout}>
                    Đăng xuất
                </button>
            </aside>

            {/* PHẦN NỘI DUNG CHÍNH BÊN PHẢI */}
            <div className="cuahang-main" style={{ padding: '30px', backgroundColor: '#f4f4f9', width: '100%', overflowY: 'auto' }}>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>Quản Lý Tour Du Lịch</h2>

                <button
                    onClick={() => navigate('/admin/tours/add')}
                    style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}
                >
                    + Thêm Tour Mới
                </button>

                <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                    <thead style={{ backgroundColor: '#ddd' }}>
                        <tr>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th style={{ padding: '10px' }}>Tên Tour</th>
                            <th style={{ padding: '10px' }}>Mô tả ngắn</th>
                            {/* <th style={{ padding: '10px' }}>Giá (VNĐ)</th> */}
                            <th style={{ padding: '10px' }}>Số trạm</th>
                            <th style={{ padding: '10px' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tours.map((tour) => (
                            <tr key={tour.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{tour.id}</td>
                                <td style={{ padding: '10px' }}><strong>{tour.tenTour}</strong></td>
                                <td style={{ padding: '10px' }}>{tour.moTa}</td>
                                {/* <td style={{ padding: '10px', color: '#28a745', fontWeight: 'bold' }}>{tour.gia.toLocaleString()} đ</td> */}
                                <td style={{ padding: '10px' }}>{tour.lichTrinhTours ? tour.lichTrinhTours.length : 0}</td>
                                <td style={{ padding: '10px' }}>
                                    <button onClick={() => navigate(`/admin/tours/edit/${tour.id}`)} style={{ padding: '5px 10px', marginRight: '5px', cursor: 'pointer' }}>Sửa</button>
                                    <button onClick={() => handleDelete(tour.id)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default QuanLyTour;
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../QuanTri/TrangChuQT.css'; // Sửa đường dẫn CSS nếu cần

const navItems = [
  { to: "/admin", label: "Trang chủ", icon: "🏠" },
  { to: "/admin/qlch", label: "Quản lý cửa hàng", icon: "🏪" },
  { to: "/admin/tours", label: "Quản lý Tour", icon: "📍" },
  { to: "/admin/hopdong", label: "Duyệt cửa hàng", icon: "📝" },
];

const EditTour = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        tenTour: '',
        moTa: '',
        gia: 0,
    });
    const [availableStores, setAvailableStores] = useState([]);
    const [selectedStores, setSelectedStores] = useState([]);

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

    // ===== LẤY DỮ LIỆU CỬA HÀNG VÀ TOUR CŨ =====
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storeRes = await fetch('http://localhost:8080/api/cuahang');
                const storeData = await storeRes.json();
                setAvailableStores(storeData);

                const tourRes = await fetch(`http://localhost:8080/api/admin/tours/${id}`);
                const tourData = await tourRes.json();

                setFormData({
                    tenTour: tourData.tenTour,
                    moTa: tourData.moTa,
                    gia: tourData.gia
                });

                if (tourData.lichTrinhTours) {
                    const sortedLichTrinh = tourData.lichTrinhTours.sort((a, b) => a.thuTuTram - b.thuTuTram);
                    const storesFromBE = sortedLichTrinh.map(item => item.cuahang);
                    setSelectedStores(storesFromBE);
                }
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'gia' ? Number(value) : value });
    };

    const handleAddStore = (storeId) => {
        const store = availableStores.find(s => s.id === storeId || s.id === Number(storeId));
        if (store && !selectedStores.find(s => s.id === store.id)) {
            setSelectedStores([...selectedStores, store]);
        }
    };

    const moveStore = (index, direction) => {
        const newStores = [...selectedStores];
        if (direction === 'up' && index > 0) {
            [newStores[index - 1], newStores[index]] = [newStores[index], newStores[index - 1]];
        } else if (direction === 'down' && index < newStores.length - 1) {
            [newStores[index + 1], newStores[index]] = [newStores[index], newStores[index + 1]];
        }
        setSelectedStores(newStores);
    };

    const removeStore = (index) => {
        const newStores = [...selectedStores];
        newStores.splice(index, 1);
        setSelectedStores(newStores);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            danhSachTram: selectedStores.map((store, index) => ({
                idCuahang: store.id,
                thuTuTram: index + 1
            }))
        };

        try {
            const response = await fetch(`http://localhost:8080/api/admin/tours/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                alert('Cập nhật Tour thành công!');
                navigate('/admin/tours');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật Tour:', error);
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
                        className={pathname.includes("/admin/tours") && item.to === "/admin/tours" ? "cuahang-link active" : "cuahang-link"}
                    >
                        {item.icon} {item.label}
                    </Link>
                ))}
                <button className="cuahang-btn red" onClick={handleLogout} style={{ marginTop: '20px' }}>Đăng xuất</button>
            </aside>

            {/* FORM NỘI DUNG BÊN PHẢI */}
            <div className="cuahang-main" style={{ padding: '30px', backgroundColor: '#f4f4f9', width: '100%', overflowY: 'auto' }}>
                <h2 style={{ marginBottom: '20px' }}>Cập Nhật Tour</h2>
                <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <fieldset style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px' }}>
                        <legend style={{ fontWeight: 'bold' }}>Thông tin chung</legend>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Tên Tour: </label>
                            <input type="text" name="tenTour" value={formData.tenTour} required onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Mô tả: </label>
                            <textarea name="moTa" value={formData.moTa} required onChange={handleInputChange} style={{ width: '100%', padding: '8px', minHeight: '80px' }} />
                        </div>
                        {/* <div>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Giá tiền (VNĐ): </label>
                            <input type="number" name="gia" value={formData.gia} required onChange={handleInputChange} style={{ width: '100%', padding: '8px' }} />
                        </div> */}
                    </fieldset>

                    <fieldset style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px' }}>
                        <legend style={{ fontWeight: 'bold' }}>Xây dựng lộ trình (Thứ tự trạm)</legend>
                        <select onChange={(e) => handleAddStore(e.target.value)} value="" style={{ width: '100%', padding: '8px', marginBottom: '15px' }}>
                            <option value="" disabled>-- Chọn cửa hàng thêm vào Tour --</option>
                            {availableStores.map(store => (
                                <option key={store.id} value={store.id}>{store.ten || store.tenCuaHang}</option>
                            ))}
                        </select>

                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {selectedStores.map((store, index) => (
                                <li key={store.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ccc' }}>
                                    <span style={{ fontWeight: 'bold', marginRight: '10px', color: '#ff8c00' }}>Trạm {index + 1}:</span>
                                    <span style={{ flex: 1 }}>{store.ten || store.tenCuaHang}</span>
                                    <button type="button" onClick={() => moveStore(index, 'up')} disabled={index === 0} style={{ padding: '5px', cursor: 'pointer' }}>⬆️</button>
                                    <button type="button" onClick={() => moveStore(index, 'down')} disabled={index === selectedStores.length - 1} style={{ margin: '0 5px', padding: '5px', cursor: 'pointer' }}>⬇️</button>
                                    <button type="button" onClick={() => removeStore(index)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>X</button>
                                </li>
                            ))}
                        </ul>
                    </fieldset>

                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#ff8c00', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
                        💾 Cập nhật Tour
                    </button>
                    <button type="button" onClick={() => navigate('/admin/tours')} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', marginLeft: '10px' }}>
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTour;
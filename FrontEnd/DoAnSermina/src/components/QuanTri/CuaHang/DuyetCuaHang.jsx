import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import './QuanLyCH.css'; 
import '../TrangChuQT.css';

// === THƯ VIỆN BẢN ĐỒ ===
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const navItems = [
  { to: "/admin", label: "Trang chủ", icon: "🏠" },
  { to: "/admin/qlch", label: "Quản lý cửa hàng", icon: "🏪" },
  { to: "/admin/tours", label: "Quản lý Tour", icon: "📍" },
  { to: "/admin/hopdong", label: "Duyệt thông tin", icon: "📝" }, // Đổi tên cho hợp ngữ cảnh
];

function DuyetCuaHang() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [user, setUser] = useState(null);
    const [danhSachCho, setDanhSachCho] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showMap, setShowMap] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("user"));
        if (!data || !data.id) {
            navigate("/login"); return;
        }
        setUser(data);
        fetchPendingStores();
    }, [navigate]);

    const fetchPendingStores = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/admin/cuahang/pending");
            if (!response.ok) throw new Error("Lỗi API");
            const data = await response.json();
            setDanhSachCho(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi lấy danh sách:", error);
            setDanhSachCho([]); 
        } finally {
            setLoading(false);
        }
    };

    const handleDuyet = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn duyệt? Cửa hàng sẽ lập tức hiển thị trên hệ thống.")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/admin/cuahang/duyet/${id}`, { method: 'PUT' });
            if (response.ok) {
                alert("Đã duyệt thành công!");
                fetchPendingStores(); 
            } else {
                alert("Lỗi khi duyệt!");
            }
        } catch (error) { console.error("Lỗi:", error); }
    };

    const handleViewMap = (store) => {
        setSelectedStore(store);
        setShowMap(true);
    };

    if (loading) return <div className="center">Đang tải dữ liệu...</div>;

    return (
        <div className="cuahang-container">
            {/* SIDEBAR */}
            <aside className="cuahang-sidebar">
                <div className="cuahang-user">
                    <div className="cuahang-avatar">{user?.username?.[0]?.toUpperCase() || "A"}</div>
                    <div>{user?.username}</div>
                </div>
                {navItems.map((item) => (
                    <Link key={item.to} to={item.to} className={pathname === item.to ? "cuahang-link active" : "cuahang-link"}>
                        {item.icon} {item.label}
                    </Link>
                ))}
                <button className="cuahang-btn red" onClick={() => { localStorage.removeItem("user"); navigate("/login"); }} style={{marginTop: 'auto'}}>Đăng xuất</button>
            </aside>

            {/* MAIN CONTENT */}
            <div className="cuahang-main" style={{ padding: '30px', backgroundColor: '#f4f7f6', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "25px" }}>
                    <h2 style={{ color: '#2c3e50', fontWeight: 'bold', margin: 0 }}>Duyệt Cửa Hàng Chờ</h2>
                    <span className="badge bg-danger p-2">{danhSachCho.length} cửa hàng đang chờ</span>
                </div>
                
                {danhSachCho.length === 0 ? (
                    <div className="alert alert-success">Hiện không có cửa hàng nào chờ duyệt. Hệ thống đang sạch sẽ! ✨</div>
                ) : (
                    <div className="table-responsive" style={{ background: '#fff', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <table className="table table-hover align-middle">
                            <thead className="table-dark text-center">
                                <tr>
                                    <th>Thông tin Quán</th>
                                    <th>Danh Mục & Ngôn Ngữ</th>
                                    <th>Địa Chỉ</th>
                                    <th>Bản đồ</th>
                                    <th>Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {danhSachCho.map((ch) => (
                                    <tr key={ch.id}>
                                        {/* Cột 1: Ảnh + Tên quán */}
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <img 
                                                    src={ch.imageThumbnail ? (ch.imageThumbnail.startsWith("http") ? ch.imageThumbnail : `http://localhost:8080/uploads/${ch.imageThumbnail}`) : "https://placehold.co/50"} 
                                                    alt="thumb" 
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ccc' }} 
                                                />
                                                <div>
                                                    <strong style={{fontSize: '15px'}}>{ch.ten}</strong><br/>
                                                    <small className="text-muted">Mã Chủ Quán: #{ch.iduser}</small>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Cột 2: Danh mục & Ngôn ngữ */}
                                        <td className="text-center">
                                            <span className="badge bg-secondary mb-1">{ch.danhmuc}</span><br/>
                                            <small className="text-info fw-bold">{ch.ngonngu ? ch.ngonngu.replace(/,/g, ', ') : 'Chưa có NN'}</small>
                                        </td>

                                        {/* Cột 3: Địa chỉ */}
                                        <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ch.diaChi}>
                                            {ch.diaChi}
                                        </td>

                                        {/* Cột 4 & 5: Nút bấm */}
                                        <td className="text-center">
                                            <button className="btn btn-outline-info btn-sm" onClick={() => handleViewMap(ch)}>
                                                <i className="fa fa-map-marker me-1"></i> Xem Map
                                            </button>
                                        </td>
                                        <td className="text-center">
                                            <button className="btn btn-success btn-sm" onClick={() => handleDuyet(ch.id)}>
                                                <i className="fa fa-check-circle me-1"></i> Duyệt
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL BẢN ĐỒ CHI TIẾT (Review trước khi duyệt) */}
            {showMap && selectedStore && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{
                        background: '#fff', padding: '20px', borderRadius: '15px',
                        width: '600px', maxWidth: '90%', boxShadow: '0 5px 20px rgba(0,0,0,0.3)'
                    }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="m-0 text-primary"><i className="fa fa-map-marker me-2"></i>Vị trí: {selectedStore.ten}</h5>
                            <button className="btn btn-danger btn-sm" onClick={() => setShowMap(false)}>
                                <i className="fa fa-times"></i> Đóng
                            </button>
                        </div>

                        {/* Review Banner nếu có */}
                        <div className="mb-2">
                            <img 
                                src={selectedStore.imageBanner ? (selectedStore.imageBanner.startsWith("http") ? selectedStore.imageBanner : `http://localhost:8080/uploads/${selectedStore.imageBanner}`) : "https://placehold.co/600x150"} 
                                alt="banner" 
                                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }} 
                            />
                        </div>
                        
                        <div style={{ height: '300px', width: '100%', borderRadius: '10px', overflow: 'hidden', border: '2px solid #ddd' }}>
                            <MapContainer 
                                center={[selectedStore.lat || 10.7588, selectedStore.lng || 106.7025]} 
                                zoom={17} 
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <Marker position={[selectedStore.lat || 10.7588, selectedStore.lng || 106.7025]}>
                                    <Popup>
                                        <strong>{selectedStore.ten}</strong><br />
                                        {selectedStore.diaChi}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                        <div className="mt-2 text-muted text-center" style={{ fontSize: '13px' }}>
                            Kinh độ: {selectedStore.lng} | Vĩ độ: {selectedStore.lat}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DuyetCuaHang;
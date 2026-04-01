import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import './QuanLyCH.css'; 
import '../TrangChuQT.css';

// === THƯ VIỆN BẢN ĐỒ ===
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix lỗi mất icon mặc định của Leaflet
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
  { to: "/admin/hopdong", label: "Duyệt hợp đồng", icon: "📝" },
];

function DuyetCuaHang() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [user, setUser] = useState(null);
    const [danhSachCho, setDanhSachCho] = useState([]);
    const [loading, setLoading] = useState(true);

    // State cho Modal Bản Đồ
    const [showMap, setShowMap] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("user"));
        if (!data || !data.id) {
            navigate("/login");
            return;
        }
        setUser(data);
        fetchPendingStores();
    }, [navigate]);

    const fetchPendingStores = async () => {
        try {
            // Đã đổi API sang lấy danh sách cửa hàng
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
        if (!window.confirm("Bạn có chắc chắn muốn duyệt cửa hàng này? Cửa hàng sẽ lập tức hiển thị trên bản đồ Khách hàng.")) return;

        try {
            const response = await fetch(`http://localhost:8080/api/admin/cuahang/duyet/${id}`, {
                method: 'PUT'
            });

            if (response.ok) {
                alert("Đã duyệt thành công!");
                fetchPendingStores(); 
            } else {
                alert("Lỗi khi duyệt!");
            }
        } catch (error) {
            console.error("Lỗi:", error);
        }
    };

    // Hàm mở bản đồ
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
                <button className="cuahang-btn red" onClick={() => { localStorage.removeItem("user"); navigate("/login"); }}>Đăng xuất</button>
            </aside>

            {/* MAIN CONTENT */}
            <div className="cuahang-main" style={{ padding: '30px', backgroundColor: '#f4f7f6', overflowY: 'auto' }}>
                <h2 className="mb-4" style={{ color: '#2c3e50', fontWeight: 'bold' }}>Duyệt Đăng Ký Cửa Hàng Mới</h2>
                
                {danhSachCho.length === 0 ? (
                    <div className="alert alert-success">Hiện không có cửa hàng nào chờ duyệt.</div>
                ) : (
                    <div className="table-responsive" style={{ background: '#fff', borderRadius: '15px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <table className="table table-hover align-middle text-center">
                            <thead className="table-dark">
                                <tr>
                                    <th>Tên Quán</th>
                                    <th>Danh Mục</th>
                                    <th>Địa Chỉ</th>
                                    <th>Tọa Độ</th>
                                    <th>Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {danhSachCho.map((ch) => (
                                    <tr key={ch.id}>
                                        <td><strong>{ch.ten}</strong><br/><small className="text-muted">Chủ: {ch.taikhoan ? ch.taikhoan.username : "Ẩn danh"}</small></td>
                                        <td><span className="badge bg-secondary">{ch.danhmuc}</span></td>
                                        <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ch.diaChi}>
                                            {ch.diaChi}
                                        </td>
                                        <td>
                                            <button className="btn btn-outline-info btn-sm" onClick={() => handleViewMap(ch)}>
                                                <i className="fa fa-map-marker me-1"></i> Xem Map
                                            </button>
                                        </td>
                                        <td>
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

            {/* MODAL BẢN ĐỒ (Hiển thị khi showMap = true) */}
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
                        
                        <div style={{ height: '350px', width: '100%', borderRadius: '10px', overflow: 'hidden', border: '2px solid #ddd' }}>
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
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// Nhớ check lại đường dẫn import api cho đúng với vị trí file của bạn nhé (../ hoặc ../../)
import { api } from "../ApiFunctions";
import "./CuaHang.css"; // Dùng chung CSS với file CuaHang.jsx để lấy giao diện Sidebar

const navItems = [
  { to: "/store/home", label: "Trang chủ", icon: "🏠" },
  { to: "/store", label: "Thông tin cửa hàng", icon: "🏪" },
  { to: "/store/bandich", label: "Danh sách bản dịch", icon: "👨‍💻" },
  { to: "/voice", label: "Danh sách giọng đọc", icon: "🎤" },
  { to: "/thongke", label: "Thống kê", icon: "📊" },
];

function TrangChuCH() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);

  // 1. Kiểm tra đăng nhập
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data || !data.id) {
      navigate("/login");
      return;
    }
    setUser(data);
  }, [navigate]);

  // 2. Lấy thông tin cửa hàng
  useEffect(() => {
    if (!user) return;

    api.get(`/api/cuahang/user/${user.id}`)
      .then((res) => {
        const data = res.data[0];
        setStore(data);
      })
      .catch((err) => console.error("Lỗi load cửa hàng:", err));
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 3. Màn hình chờ (Tránh lỗi undefined như ban nãy)
  if (!store) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <h2>Đang tải dữ liệu trang chủ... ⏳</h2>
        </div>
      );
  }

  // 4. GIAO DIỆN CHÍNH (Đã khôi phục Sidebar)
  return (
    <div className="cuahang-container">

      {/* SIDEBAR DÙNG CHUNG */}
      <aside className="cuahang-sidebar">
        <div className="cuahang-user">
          <div className="cuahang-avatar">
            {user?.taikhoan?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>{user?.taikhoan}</div>
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

        <button className="cuahang-btn red" onClick={handleLogout} style={{marginTop: 'auto'}}>
          Đăng xuất
        </button>
      </aside>

      {/* KHUNG NỘI DUNG BÊN PHẢI (MAIN) */}
      <div className="cuahang-main">
        <div style={{ width: "100%", maxWidth: "1100px", marginBottom: "25px" }}>
          <h2 className="page-title" style={{ textAlign: "left", width: "100%", margin: 0 }}>
            Trang chủ Quản lý POI
          </h2>
        </div>

        <div className="card-container" style={{ textAlign: "center", padding: "60px 20px" }}>
          <h1 style={{ color: "#0056b3", fontSize: "32px", marginBottom: "20px" }}>
            Chào mừng trở lại, {store.ten}! 🎉
          </h1>

          <p style={{ fontSize: "18px", color: "#555", marginBottom: "40px" }}>
            Hôm nay bạn muốn quản lý thông tin gì? Hãy chọn các chức năng ở menu bên trái nhé.
          </p>

          {/* Hiển thị ảnh cửa hàng cho đẹp */}
          <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={store.imageUrl && store.imageUrl.startsWith("http") ? store.imageUrl : "https://placehold.co/600x300?text=Welcome+to+Store"}
                alt="Welcome"
                style={{ width: "100%", maxWidth: "600px", borderRadius: "12px", objectFit: "cover", height: "300px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
              />
          </div>
        </div>
      </div>

    </div>
  );
}

export default TrangChuCH;
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../ApiFunctions";
import "./CuaHang.css";

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
  const [loading, setLoading] = useState(true);

  // ===== CHECK LOGIN =====
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));

    if (!data || !data.id) {
      navigate("/login");
      return;
    }

    setUser(data);
  }, [navigate]);

  // ===== LOAD STORE =====
  useEffect(() => {
    if (!user) return;

    api.get(`/api/cuahang/user/${user.id}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setStore(res.data[0]);
        } else {
          setStore(null);
        }
      })
      .catch((err) => console.error("Lỗi load cửa hàng:", err))
      .finally(() => setLoading(false));
  }, [user]);

  // ===== LOGOUT =====
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="center">
        <h2>Đang tải dữ liệu... ⏳</h2>
      </div>
    );
  }

  // ===== NO STORE =====
  if (!store) {
    return (
      <div className="center">
        <h2>Bạn chưa có cửa hàng nào 😢</h2>
      </div>
    );
  }

  return (
    <div className="cuahang-container">

      {/* ===== SIDEBAR ===== */}
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

        <button className="cuahang-btn red" onClick={handleLogout}>
          Đăng xuất
        </button>
      </aside>

      {/* ===== MAIN ===== */}
      <div className="cuahang-main">

        <h2 className="page-title">Trang chủ Quản lý POI</h2>

        <div className="card-container">

          <h1 className="welcome-title">
            👋 Chào mừng, {store.ten}
          </h1>

          <p className="welcome-desc">
            Hôm nay bạn muốn quản lý gì? Chọn menu bên trái nhé.
          </p>

          {/* ===== ROW ẢNH + INFO ===== */}
          <div className="content-row">

            {/* ẢNH */}
            <img
              src={store.imageThumbnail ? (store.imageThumbnail.startsWith("http") ? store.imageThumbnail : `http://localhost:8080/uploads/${store.imageThumbnail}`) : "https://placehold.co/400x300?text=Chua+Co+Anh"}
              alt="Ảnh cửa hàng"
              className="store-image"
            />

            {/* THÔNG TIN */}
            <div className="info-box" style={{textAlign:"center"}} >
              <p>📍 <b>Địa chỉ:</b> {store.diaChi}</p>
              <p>📂 <b>Danh mục:</b> {store.danhmuc}</p>
              <p>🌐 <b>Ngôn ngữ:</b> {store.ngonngu}</p>
              <p>📏 <b>Bán kính:</b> {store.bankinh} m</p>
              <p>📌 <b>Tọa độ:</b> {store.lat}, {store.lng}</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default TrangChuCH;
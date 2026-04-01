import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TrangChuQT.css";

const API_URL = "http://localhost:8080/api/cuahang";

const navItems = [
  { to: "/admin", label: "Trang chủ", icon: "🏠" },
  { to: "/admin/qlch", label: "Quản lý cửa hàng", icon: "🏪" },
  { to: "/admin/tours", label: "Quản lý Tour", icon: "📍" },
];

function TrangChuQT() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // ===== LOAD STORE =====
  useEffect(() => {
    if (!user) return;

    axios
      .get(API_URL) // admin lấy tất cả
      .then((res) => {
        if (res.data.length > 0) {
          setStore(res.data[0]); // lấy đại cái đầu
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Không load được dữ liệu!");
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) return <div className="center">Đang tải...</div>;
  if (!store) return <div className="center">Không có dữ liệu</div>;

  return (
    <div className="cuahang-container">

      {/* SIDEBAR */}
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
            className={
              pathname === item.to
                ? "cuahang-link active"
                : "cuahang-link"
            }
          >
            {item.icon} {item.label}
          </Link>
        ))}

        <button className="quantri-btn red" onClick={handleLogout}>
          Đăng xuất
        </button>
      </aside>

      {/* MAIN */}
      <div className="cuahang-main home-banner">

        {/* ẢNH BACKGROUND */}
        <img
          src={`/images/Store/${store.imageBanner || store.imageThumbnail}`}
          alt="banner"
        />

        {/* OVERLAY */}
        <div className="home-overlay">
          <h1>{store.ten}</h1>
          <p>📍 {store.diaChi}</p>
          <p>{store.moTa}</p>

          {/* THÊM INFO NHỎ */}
          <div className="extra-info">
            <span>📂 {store.danhmuc}</span>
            <span>🌐 {store.ngonngu}</span>
            <span>📏 {store.bankinh} m</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TrangChuQT;
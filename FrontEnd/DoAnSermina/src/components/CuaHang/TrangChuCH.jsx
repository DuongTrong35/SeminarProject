import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./TrangChuCH.css";

const API_URL = "http://localhost:8080/api/cuahang";

const navItems = [
  { to: "/store/home", label: "Trang chủ", icon: "🏠" },
  { to: "/store", label: "Thông tin cửa hàng", icon: "🏪" },
  { to: "/employee", label: "Danh sách bản dịch", icon: "👨‍💻" },
  { to: "/voice", label: "Danh sách giọng đọc", icon: "🎤" },
  { to: "/thongke", label: "Thống kê", icon: "📊" },
];

function TrangChuCH() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);

  // ===== LOAD USER =====
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));

    if (!data || !data.id) {
      alert("Chưa đăng nhập!");
      navigate("/login");
      return;
    }

    setUser(data);
  }, []);

  // ===== LOAD STORE =====
  useEffect(() => {
    if (!user) return;

    axios
      .get(`${API_URL}/user/${user.id}`)
      .then((res) => {
        const data = res.data[0];

        setStore({
          ten: data.ten,
          diaChi: data.diaChi,
          moTa: data.moTa,
          hinhAnh: data.imageUrl
            ? `/src/assets/images/Store/${data.imageUrl}`
            : "https://placehold.co/1200x600",
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Không load được dữ liệu!");
      });
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!store) return <p>Đang tải...</p>;

  return (
    <div className="cuahang-container">
      {/* ===== SIDEBAR ===== */}
      <aside className="cuahang-sidebar">
        <div className="cuahang-user">
          <div className="cuahang-avatar">
            {user?.taikhoan?.[0] || "A"}
          </div>
          <div>{user?.taikhoan}</div>
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

        <button className="cuahang-btn red" onClick={handleLogout}>
          Đăng xuất
        </button>
      </aside>

      {/* ===== MAIN (TRANG CHỦ) ===== */}
      <div className="cuahang-main home-banner">
        <img src={store.hinhAnh} alt="banner" />

        <div className="home-overlay">
          <h1>{store.ten}</h1>
          <p>{store.diaChi}</p>
          <p>{store.moTa}</p>
        </div>
      </div>
    </div>
  );
}

export default TrangChuCH;
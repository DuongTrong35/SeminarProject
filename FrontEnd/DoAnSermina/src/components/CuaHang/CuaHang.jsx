import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CuaHang.css";

const API_URL = "http://localhost:8080/api/cuahang";

const navItems = [
   { to: "/store/home", label: "Trang chủ", icon: "🏠" },
  { to: "/store", label: "Thông tin cửa hàng", icon: "🏪" },
  { to: "/employee", label: "Danh sách bản dịch", icon: "👨‍💻" },
  { to: "/voice", label: "Danh sách giọng đọc", icon: "🎤" },
  { to: "/thongke", label: "Thống kê", icon: "📊" },
];

function CuaHang() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // ================= LOAD USER =================
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));

    console.log("USER:", data);

    if (!data || !data.id) {
      alert("Chưa đăng nhập!");
      navigate("/login");
      return;
    }

    setUser(data);
  }, []);

  // ================= LOAD STORE =================
  useEffect(() => {
    if (!user) return;

    console.log("CALL API:", `${API_URL}/user/${user.id}`);

    axios
      .get(`${API_URL}/user/${user.id}`)
      .then((res) => {
  console.log("DATA BACK:", res.data);

  const data = res.data[0]; // 🔥 lấy phần tử đầu tiên trong mảng

  setStore({
    id: data.id,
    ten: data.ten,
    diaChi: data.diaChi,
    moTa: data.moTa,
hinhAnh: data.imageUrl
  ? `/src/assets/images/Store/${data.imageUrl}`
  : "https://placehold.co/150",  });
})
      .catch((err) => {
        console.error("Lỗi load:", err);
        alert("Không load được cửa hàng!");
      });
  }, [user]);

  // ================= HANDLE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);

      // 🔥 chỉ dùng hinhAnh
      setStore({ ...store, hinhAnh: url });
    }
  };

  // ================= UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/${store.id}`, {
        id: store.id,
        ten: store.ten,
        diaChi: store.diaChi,
        moTa: store.moTa,

        // 🔥 FIX LỖI CHÍNH (quan trọng nhất)
        imageUrl: store.hinhAnh,
      });

      alert("Cập nhật thành công!");
      setIsEditing(false);
    } catch (err) {
      console.error("Lỗi update:", err);
      alert("Update lỗi!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ================= LOADING =================
  if (!store) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="cuahang-container">

      {/* SIDEBAR */}
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

      {/* MAIN */}
      <div className="cuahang-main">
        <h2>Thông tin cửa hàng</h2>

        {!isEditing ? (
          // ===== VIEW =====
          <div className="profile-view">
            <div className="profile-left">
              <img src={store.hinhAnh} alt="store" />
            </div>

            <div className="profile-right">
              <p><b>Tên:</b> {store.ten}</p>
              <p><b>Địa chỉ:</b> {store.diaChi}</p>
              <p><b>Mô tả:</b> {store.moTa}</p>

              <button
                className="cuahang-btn blue"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Chỉnh sửa
              </button>
            </div>
          </div>
        ) : (
          // ===== EDIT =====
          <form className="profile-card" onSubmit={handleSubmit}>
            <div className="profile-left">
              <img src={store.hinhAnh} alt="store" />
              <input type="file" onChange={handleImageChange} />
            </div>

            <div className="profile-right">
              <label>Tên cửa hàng</label>
              <input
                type="text"
                name="ten"
                value={store.ten}
                onChange={handleChange}
              />

              <label>Địa chỉ</label>
              <input
                type="text"
                name="diaChi"
                value={store.diaChi}
                onChange={handleChange}
              />

              <label>Mô tả</label>
              <textarea
                name="moTa"
                value={store.moTa}
                onChange={handleChange}
              />

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn-save">
                  💾 Lưu
                </button>

                <button
                  type="button"
                  className="cuahang-btn red"
                  onClick={() => setIsEditing(false)}
                >
                  ❌ Hủy
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CuaHang;
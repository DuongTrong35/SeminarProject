import "./QuanLyCH.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

// FIX QUAN TRỌNG: dùng đúng port backend
const API_URL = "http://localhost:8080/api/cuahang";

const navItems = [
    { to: "/admin", label: "Trang chủ", icon: "🏠" },
  { to: "/admin/qlch", label: "Quản lý cửa hàng", icon: "🏪" },
//   { to: "/", label: "Trang chủ", icon: "🏠" },
//   { to: "/trips", label: "Tìm chuyến", icon: "🚌" },
//   { to: "/employee", label: "Nhân viên", icon: "👨‍💻" },
//   { to: "/operators", label: "Nhà xe", icon: "🚐" },
];

function QuanLyCH() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [dsCuaHang, setDsCuaHang] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= INIT =================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== "ADMIN") {
      navigate("/homeuse");
      return;
    }

    setUser(parsedUser);
    loadData();
  }, []);

  // ================= LOAD =================
  const loadData = async () => {
    try {
      setLoading(true);

      console.log("CALL API:", API_URL); // 🔥 debug

      const res = await axios.get(API_URL);

      console.log("DATA:", res.data); // 🔥 debug

      setDsCuaHang(res.data);
    } catch (err) {
      console.error("LỖI API:", err);
      alert("Không kết nối được backend!");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Chọn ít nhất 1 cửa hàng!");
      return;
    }

    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      await Promise.all(
        selectedIds.map((id) =>
          axios.delete(`${API_URL}/${id}`)
        )
      );

      alert("Xóa thành công!");
      setSelectedIds([]);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại!");
    }
  };

  // ================= SEARCH =================
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      loadData();
      return;
    }

    try {
      const res = await axios.get(
        `${API_URL}/search?keyword=${searchTerm}`
      );
      setDsCuaHang(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi tìm kiếm!");
    }
  };

  // ================= CHECKBOX =================
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(dsCuaHang.map((ch) => ch.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
setSelectedIds(selectedIds.filter((x) => x !== id));
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

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
        <h2>Quản lý cửa hàng</h2>

        {/* ACTION */}
        <div className="cuahang-actions">
          <button
            className="cuahang-btn blue"
            onClick={() => navigate("/cuahang/add")}
          >
            ➕ Thêm
          </button>

          <button className="cuahang-btn green" onClick={loadData}>
            🔄 Làm mới
          </button>

          <button className="cuahang-btn red" onClick={handleDelete}>
            🗑 Xóa
          </button>

          <form onSubmit={handleSearch}>
            <input
              className="cuahang-input"
              type="text"
              placeholder="Tìm cửa hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        {/* TABLE */}
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="cuahang-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleSelectAll(e.target.checked)
                    }
                  />
                </th>
                <th>ID</th>
                <th>Tên</th>
                <th>Địa chỉ</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {dsCuaHang.length === 0 ? (
                <tr>
                  <td colSpan="7">Không có dữ liệu</td>
                </tr>
              ) : (
                dsCuaHang.map((ch) => (
                  <tr key={ch.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(ch.id)}
                        onChange={(e) =>
handleSelectOne(ch.id, e.target.checked)
                        }
                      />
                    </td>

                    <td>{ch.id}</td>
                    <td>{ch.ten}</td>
                    <td>{ch.diaChi}</td>
                    <td>{ch.moTa}</td>
                    <td>
                      {ch.trangThai === 1
                        ? "Hoạt động"
                        : "Ngừng"}
                    </td>

                    <td>
                      <button
                        className="cuahang-btn small"
                        onClick={() =>
                          navigate("/cuahang/update", {
                            state: { id: ch.id },
                          })
                        }
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default QuanLyCH;
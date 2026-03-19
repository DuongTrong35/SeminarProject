import "./CuaHang.css";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const navItems = [
  { to: "/", label: "Trang chủ", icon: "🏠" },
  { to: "/trips", label: "Tìm chuyến", icon: "🚌" },
  { to: "/employee", label: "Nhân viên", icon: "👨‍💻" },
  { to: "/operators", label: "Nhà xe", icon: "🚐" },
];

function CuaHang() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [dsnhanvien, setDsNhanVien] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    // CHẶN KHÔNG PHẢI ADMIN
    if (parsedUser.role !== "ADMIN") {
      navigate("/homeuse");
      return;
    }

    setUser(parsedUser);

    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8083/api/employees");
      setDsNhanVien(res.data);
    } catch {
      alert("Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert("Chọn nhân viên!");
      return;
    }

    if (!window.confirm("Xóa các mục đã chọn?")) return;

    await Promise.all(
      selectedIds.map((id) =>
        axios.delete(`http://localhost:8083/api/employees/${id}`)
      )
    );

    loadData();
    setSelectedIds([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      loadData();
      return;
    }

    const res = await axios.get(
      `http://localhost:8083/api/employees/search?keyword=${searchTerm}`
    );
    setDsNhanVien(res.data);
  };

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
        <h2>Quản lý nhân viên</h2>

        {/* ACTION */}
        <div className="cuahang-actions">
          <button
            className="cuahang-btn blue"
            onClick={() => navigate("/employee/addemployee")}
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
              placeholder="Tìm kiếm..."
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
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(dsnhanvien.map((nv) => nv.id));
                      } else setSelectedIds([]);
                    }}
                  />
                </th>
                <th>ID</th>
                <th>Họ</th>
                <th>Tên</th>
                <th>SĐT</th>
                <th>Email</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {dsnhanvien.map((nv) => (
                <tr key={nv.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(nv.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds([...selectedIds, nv.id]);
                        } else {
                          setSelectedIds(
                            selectedIds.filter((id) => id !== nv.id)
                          );
                        }
                      }}
                    />
                  </td>

                  <td>{nv.id}</td>
                  <td>{nv.honv}</td>
                  <td>{nv.tennv}</td>
                  <td>{nv.sdt}</td>
                  <td>{nv.email}</td>

                  <td>
                    <button
                      className="cuahang-btn small"
                      onClick={() =>
                        navigate("/employee/updateemployee", {
                          state: { id: nv.id },
                        })
                      }
                    >
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CuaHang;
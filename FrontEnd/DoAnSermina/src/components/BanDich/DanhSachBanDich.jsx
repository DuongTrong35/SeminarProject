import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../ApiFunctions"; // Đảm bảo đường dẫn này đúng
import "../CuaHang/CuaHang.css"; // Tái sử dụng CSS của CuaHang

const navItems = [
  { to: "/store/home", label: "Trang chủ", icon: "🏠" },
  { to: "/store", label: "Thông tin cửa hàng", icon: "🏪" },
  { to: "/store/bandich", label: "Danh sách bản dịch", icon: "👨‍💻" },
  { to: "/voice", label: "Danh sách giọng đọc", icon: "🎤" },
  { to: "/thongke", label: "Thống kê", icon: "📊" },
];

function DanhSachBanDich() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [danhSach, setDanhSach] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isSimulatingAI, setIsSimulatingAI] = useState(false);

  const [editingId, setEditingId] = useState(null); // NULL = Thêm mới, ID cụ thể = Đang sửa

  const [formData, setFormData] = useState({
    ngonNguDich: "English",
    noiDung: "",
    taoBoiAI: false
  });

  // 1. Kiểm tra User & Lấy Store ID
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data || !data.id) {
      navigate("/login");
      return;
    }
    setUser(data);

    // Gọi API lấy thông tin cửa hàng của User này
    api.get(`/api/cuahang/user/${data.id}`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const id = res.data[0].id;
          setStoreId(id);
          fetchBanDich(id); // Có Store ID rồi thì đi lấy bản dịch
        }
      })
      .catch((err) => console.error("Lỗi lấy thông tin cửa hàng:", err));
  }, [navigate]);

  // 2. Hàm gọi API lấy danh sách bản dịch
  const fetchBanDich = (id) => {
    api.get(`/api/bandich/cuahang/${id}`)
      .then(res => setDanhSach(res.data))
      .catch(err => console.error("Lỗi lấy danh sách bản dịch:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: newValue });

    if (name === "taoBoiAI" && checked) {
      simulateAITranslation(formData.ngonNguDich);
    } else if (name === "taoBoiAI" && !checked) {
      setFormData(prev => ({ ...prev, noiDung: "" }));
    }
  };

  const simulateAITranslation = (lang) => {
    setIsSimulatingAI(true);
    setFormData(prev => ({ ...prev, noiDung: "Đang gọi AI Backend để dịch..." }));

    setTimeout(() => {
      const mockResult = lang === "English"
        ? "[AI Generated] This is a highly recommended POI, famous for its local vibe."
        : `[AI Generated] Bản dịch tự động sang ${lang} bằng hệ thống AI tích hợp.`;

      setFormData(prev => ({ ...prev, noiDung: mockResult, taoBoiAI: true }));
      setIsSimulatingAI(false);
    }, 1500);
  };

  // --- HÀM XÓA ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bản dịch này?")) {
      try {
        await api.delete(`/api/bandich/${id}`);
        alert("Xóa thành công!");
        fetchBanDich(storeId);
      } catch (error) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  // --- HÀM CHUẨN BỊ SỬA ---
  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      ngonNguDich: item.ngonNguDich,
      noiDung: item.noiDung,
      taoBoiAI: item.taoBoiAI
    });
    setShowForm(true); // Mở form ra để sửa
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang cho dễ thấy form
  };

  // 3. Hàm gọi API Lưu bản dịch
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storeId) return alert("Không tìm thấy cửa hàng!");

    try {
      if (editingId) {
        // 📝 CHẾ ĐỘ SỬA: Gọi API PUT
        await api.put(`/api/bandich/${editingId}`, formData);
        alert("Cập nhật bản dịch thành công!");
      } else {
        // ✨ CHẾ ĐỘ THÊM MỚI: Gọi API POST
        const dataToSave = { ...formData, idCuaHang: storeId };
        await api.post("/api/bandich", dataToSave);
        alert("Lưu bản dịch thành công!");
      }

      // Sau khi xong thì reset mọi thứ
      handleCancel();
      fetchBanDich(storeId);
    } catch (error) {
      console.error("Lỗi lưu dữ liệu:", error);
      alert("Thao tác thất bại!");
    }
  };

    // Thêm hàm Hủy để reset form
    const handleCancel = () => {
      setShowForm(false);
      setEditingId(null);
      setFormData({ ngonNguDich: "English", noiDung: "", taoBoiAI: false });
    };

  if (!user) return <p>Đang tải...</p>;

  // 4. GIAO DIỆN CHÍNH (Đã có Sidebar)
  return (
    <div className="cuahang-container">
      {/* SIDEBAR */}
      <aside className="cuahang-sidebar">
        <div className="cuahang-user">
          <div className="cuahang-avatar">
            {user?.username?.charAt(0).toUpperCase() || "A"}
          </div>
          <div>{user?.username}</div>
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
        <button className="cuahang-btn red" onClick={handleLogout} style={{marginTop: 'auto'}}>Đăng xuất</button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="cuahang-main">
        <div style={{ width: "100%", maxWidth: "1100px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 className="page-title" >Quản lý Bản dịch (Localization)</h2>
          <button className="btn-save" onClick={() => setShowForm(!showForm)}>
            {showForm ? "❌ Đóng Form" : "➕ Thêm Bản Dịch Mới"}
          </button>
        </div>

        {/* FORM THÊM MỚI / SỬA */}
        {showForm && (
          <div className="card-container" style={{
            marginBottom: "24px",
            borderLeft: `4px solid ${editingId ? "#ffc107" : "#0056b3"}` // Màu vàng khi sửa, xanh khi thêm
          }}>
            {/* Tiêu đề động */}
            <h3 style={{ marginBottom: "15px" }}>
              {editingId ? "📝 Chỉnh sửa bản dịch" : "✨ Thêm bản dịch mới"}
            </h3>

            <form onSubmit={handleSubmit} className="profile-edit-form" style={{ display: "block" }}>
              <div className="form-group">
                <label>Ngôn ngữ mục tiêu</label>
                <select name="ngonNguDich" className="form-control" value={formData.ngonNguDich} onChange={handleInputChange} style={{ width: "200px" }}>
                  <option value="English">English</option>
                  <option value="日本語">Japanese (日本語)</option>
                  <option value="中文">Chinese (中文)</option>
                  <option value="한국어">Korean (한국어)</option>
                </select>
              </div>

              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "15px" }}>
                <input type="checkbox" id="ai-toggle" name="taoBoiAI" checked={formData.taoBoiAI} onChange={handleInputChange} style={{ width: "18px", height: "18px" }} />
                <label htmlFor="ai-toggle" style={{ margin: 0, color: "#e83e8c", cursor: "pointer", fontWeight: "bold" }}>
                  ✨ Sử dụng AI hệ thống để tự động dịch mô tả gốc
                </label>
              </div>

              <div className="form-group" style={{ marginTop: "15px" }}>
                <label>Nội dung bản dịch</label>
                <textarea name="noiDung" value={formData.noiDung} onChange={handleInputChange} className="form-control textarea-large" disabled={isSimulatingAI} required />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button type="submit" className="btn-save" disabled={isSimulatingAI}>
                  {isSimulatingAI ? "⏳ AI đang dịch..." : (editingId ? "💾 Cập nhật" : "💾 Lưu Bản Dịch")}
                </button>

                {/* Nút Hủy để thoát chế độ sửa */}
                <button type="button" className="cuahang-btn red" onClick={handleCancel}>
                  ❌ Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* BẢNG DANH SÁCH */}
        <div className="card-container">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6" }}>Ngôn ngữ</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6" }}>Nội dung</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6" }}>Loại</th>
                <th style={{ padding: "12px", borderBottom: "2px solid #dee2e6" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {danhSach.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>Chưa có bản dịch nào.</td></tr>
              ) : (
                danhSach.map((item) => (
                  <tr key={item.id}>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee", fontWeight: "bold", width: "15%" }}>{item.ngonNguDich}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee", width: "65%" }}>{item.noiDung}</td>
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee", width: "20%" }}>
                      {item.taoBoiAI
                        ? <span style={{ background: "#e83e8c", color: "white", padding: "4px 8px", borderRadius: "12px", fontSize: "12px" }}>AI Generated</span>
                        : <span style={{ background: "#6c757d", color: "white", padding: "4px 8px", borderRadius: "12px", fontSize: "12px" }}>Manual</span>
                      }
                    </td>
                    {/* THÊM CÁC NÚT BẤM VÀO ĐÂY */}
                    <td style={{ padding: "12px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => startEdit(item)}
                        style={{ marginRight: "10px", color: "#0056b3", background: "none", border: "none", cursor: "pointer" }}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{ color: "#dc3545", background: "none", border: "none", cursor: "pointer" }}
                      >
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DanhSachBanDich;
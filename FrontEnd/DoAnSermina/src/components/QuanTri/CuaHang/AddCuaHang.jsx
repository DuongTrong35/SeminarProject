import "./QuanLyCH.css";
import "./AddCuaHang.css";

import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/cuahang";
const UPLOAD_URL = "http://localhost:8080/api/upload"; // 🔥 API upload ảnh

const navItems = [
  { to: "/admin", label: "Trang chủ", icon: "🏠" },
  { to: "/admin/qlch", label: "Quản lý cửa hàng", icon: "🏪" },
  { to: "/admin/tours", label: "Quản lý Tour", icon: "📍" },
  { to: "/admin/hopdong", label: "Duyệt hợp đồng", icon: "📝" },
];

function AddCuaHang() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);

  // 🔥 FORM DATA FULL
  const [formData, setFormData] = useState({
    id: "",
    iduser: "",
    ten: "",
    diaChi: "",
    moTa: "",
    trangThai: 0,
    imageUrl: "", // 🔥 URL ảnh
  });

  const [file, setFile] = useState(null); // 🔥 file ảnh

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
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "trangThai" ? Number(value) : value,
    });
  };

  // 🔥 HANDLE FILE
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.id || !formData.iduser || !formData.ten || !formData.diaChi) {
    alert("Nhập thiếu thông tin!");
    return;
  }

  try {
    let imageUrl = "";

    // 🔥 upload ảnh
    if (file) {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const resUpload = await axios.post(UPLOAD_URL, formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // 🔥 CHỈ LẤY TÊN FILE
      const fullUrl = resUpload.data;
      imageUrl = fullUrl.split("/").pop();
    }

    // 🔥 save DB
    await axios.post(API_URL, {
      ...formData,
      imageUrl: imageUrl,
    });

    alert("Thêm thành công!");
    navigate("/admin/qlch");

  } catch (err) {
    console.error(err);
    alert("Thêm thất bại!");
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
        <h2>Thêm cửa hàng</h2>

        <div className="add-card">
          <form onSubmit={handleSubmit} className="form-grid">

            {/* ID */}
            <div className="form-group">
              <label>ID cửa hàng</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
              />
            </div>

            {/* USER */}
            <div className="form-group">
              <label>Tài khoản cửa hàng</label>
              <input
                type="text"
                name="iduser"
                value={formData.iduser}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Tên cửa hàng</label>
              <input
                type="text"
                name="ten"
                value={formData.ten}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleChange}
              />
            </div>

            {/* 🔥 UPLOAD ẢNH */}
            <div className="form-group full">
              <label>Ảnh cửa hàng</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* 🔥 PREVIEW */}
            {file && (
              <div className="form-group full">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  style={{ width: "200px", borderRadius: "10px" }}
                />
              </div>
            )}

            <div className="form-group full">
              <label>Mô tả</label>
              <textarea
                name="moTa"
                value={formData.moTa}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Trạng thái</label>
              <select
                name="trangThai"
                value={formData.trangThai}
                onChange={handleChange}
              >
                <option value={0}>Hoạt động</option>
                <option value={1}>Ngừng</option>
              </select>
            </div>

            <div className="form-actions full">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/admin/qlch")}
              >
                ← Quay lại
              </button>

              <button type="submit" className="btn-submit">
                Lưu
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCuaHang;
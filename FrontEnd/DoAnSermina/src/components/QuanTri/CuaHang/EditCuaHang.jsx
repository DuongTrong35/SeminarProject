import "./QuanLyCH.css";
import "./AddCuaHang.css";

import { useNavigate, Link, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/cuahang";
const UPLOAD_URL = "http://localhost:8080/api/upload"; // 🔥 thêm upload

const navItems = [
  { to: "/admin", label: "Trang chủ", icon: "🏠" },
  { to: "/admin/qlch", label: "Quản lý cửa hàng", icon: "🏪" },
  { to: "/admin/tours", label: "Quản lý Tour", icon: "📍" },
  { to: "/admin/hopdong", label: "Duyệt cửa hàng", icon: "📝" },
];

function EditCuaHang() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    iduser: "",
    ten: "",
    diaChi: "",
    moTa: "",
    trangThai: 0,
    imageUrl: "", // 🔥 thêm image
  });

  const [file, setFile] = useState(null); // 🔥 file mới

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
    fetchCuaHang();
  }, []);

  // ================= FETCH =================
  const fetchCuaHang = async () => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setFormData(res.data);
    } catch (err) {
      console.error(err);
      alert("Không tải được dữ liệu!");
    }
  };

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "trangThai" ? Number(value) : value,
    });
  };

  // 🔥 chọn ảnh mới
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.iduser || !formData.ten || !formData.diaChi) {
      alert("Nhập thiếu thông tin!");
      return;
    }

    try {
      let imageUrl = formData.imageUrl; // 🔥 giữ ảnh cũ

      // 🔥 nếu có chọn ảnh mới → upload
      if (file) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const resUpload = await axios.post(UPLOAD_URL, formDataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const fullUrl = resUpload.data;

        // 🔥 chỉ lấy filename
        imageUrl = fullUrl.split("/").pop();
      }

      // 🔥 update
      await axios.put(`${API_URL}/${id}`, {
        ...formData,
        imageUrl: imageUrl,
      });

      alert("Cập nhật thành công!");
      navigate("/admin/qlch");

    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
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
        <h2>Sửa cửa hàng</h2>

        <div className="add-card">
          <form onSubmit={handleSubmit} className="form-grid">

            <div className="form-group">
              <label>ID cửa hàng</label>
              <input type="text" value={formData.id} readOnly />
            </div>

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

            {/* 🔥 IMAGE */}
            <div className="form-group full">
              <label>Ảnh cửa hàng</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>

            {/* 🔥 preview */}
            <div className="form-group full">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : formData.imageUrl
                    ? `http://localhost:8080/images/AdminStore/${formData.imageUrl}`
                    : "https://placehold.co/150"
                }
                alt="preview"
                style={{ width: "200px", borderRadius: "10px" }}
              />
            </div>

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
                Cập nhật
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCuaHang;
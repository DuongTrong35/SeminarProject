import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./XemChiTietCH.css";

const API_URL = "http://localhost:8080/api/cuahang";
const UPLOAD_URL = "http://localhost:8080/api/upload";

const navItems = [
  { to: "/store/home", label: "Trang chủ", icon: "🏠" },
  { to: "/store", label: "Thông tin cửa hàng", icon: "🏪" },
  { to: "/employee", label: "Danh sách bản dịch", icon: "👨‍💻" },
  { to: "/voice", label: "Danh sách giọng đọc", icon: "🎤" },
  { to: "/thongke", label: "Thống kê", icon: "📊" },
];

function XemChiTietCH() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null); // 🔥 file upload

  // ================= LOAD USER =================
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));

    if (!data || !data.id) {
      alert("Chưa đăng nhập!");
      navigate("/login");
      return;
    }

    setUser(data);
  }, []);

  // ================= LOAD STORE =================
  useEffect(() => {
    if (!id) return;

    axios
      .get(`${API_URL}/${id}`)
      .then((res) => {
        const data = res.data;

        setStore({
          id: data.id,
          ten: data.ten,
          diaChi: data.diaChi,
          moTa: data.moTa,
          imageUrl: data.imageUrl || "",
        });
      })
      .catch((err) => {
        console.error("Lỗi load:", err);
        alert("Không load được cửa hàng!");
      });
  }, [id]);

  // ================= HANDLE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);

      // preview
      const previewUrl = URL.createObjectURL(selectedFile);
      setStore({ ...store, preview: previewUrl });
    }
  };

  // ================= UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = store.imageUrl; // giữ ảnh cũ

      // 🔥 nếu có ảnh mới → upload
      if (file) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const resUpload = await axios.post(UPLOAD_URL, formDataUpload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        imageUrl = resUpload.data; // 🔥 chỉ filename
      }

      // 🔥 update store
      await axios.put(`${API_URL}/${store.id}`, {
        id: store.id,
        ten: store.ten,
        diaChi: store.diaChi,
        moTa: store.moTa,
        imageUrl: imageUrl,
      });

      alert("Cập nhật thành công!");
      setIsEditing(false);
      setFile(null);

      // reload lại data
      window.location.reload();

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

  // 🔥 xử lý đường dẫn ảnh
  const imageSrc = store.preview
    ? store.preview
    : store.imageUrl
    ? `/src/assets/images/AdminStore/${store.imageUrl}`
    : "https://placehold.co/150";

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
              pathname === item.to ? "cuahang-link active" : "cuahang-link"
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
            <div className="store-image">
              <img src={imageSrc} alt="store" />
            </div>

            <div className="store-info">
              <h1>{store.ten}</h1>

              <div className="store-item">
                <span>📍</span>
                <p>{store.diaChi}</p>
              </div>

              <div className="store-item">
                <span>📝</span>
                <p>{store.moTa}</p>
              </div>

              <div className="store-actions">
                <button className="btn back" onClick={() => navigate(-1)}>
                  ⬅ Quay lại
                </button>

                {/* <button
                  className="btn edit"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Chỉnh sửa
                </button> */}
              </div>
            </div>
          </div>
        ) : (
          // ===== EDIT =====
          <form className="profile-card" onSubmit={handleSubmit}>
            <div className="profile-left">
              <img src={imageSrc} alt="store" />
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

export default XemChiTietCH;
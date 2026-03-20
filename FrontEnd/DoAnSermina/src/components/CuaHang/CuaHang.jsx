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

function CuaHang() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // 1. KHAI BÁO STATE (Chỉ khai báo 1 lần duy nhất)
  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // 2. LOAD USER
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data || !data.id) {
      navigate("/login");
      return;
    }
    setUser(data);
  }, [navigate]);

  // 3. LOAD THÔNG TIN CỬA HÀNG TỪ DATABASE
  useEffect(() => {
    if (!user) return;

    api.get(`/api/cuahang/user/${user.id}`)
      .then((res) => {
        const data = res.data[0];
        setStore({
          id: data.id,
          ten: data.ten,
          diaChi: data.diaChi,
          moTa: data.moTa,
          imageUrl: data.imageUrl,
          // Hiển thị ảnh (nếu là link web thì dùng luôn, nếu không thì dùng ảnh mặc định)
          hinhAnhHienThi: data.imageUrl && data.imageUrl.startsWith("http")
            ? data.imageUrl
            : "https://placehold.co/400x300?text=Chua+Co+Anh",
          kinhDo: data.kinhDo || "",
          viDo: data.viDo || ""
        });
      })
      .catch((err) => console.error("Lỗi load cửa hàng:", err));
  }, [user]);

  // 4. XỬ LÝ THAY ĐỔI FORM
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  const handleAutoGetLocation = async () => {
    if (!store.diaChi) {
      return alert("Vui lòng nhập địa chỉ trước khi tìm tọa độ!");
    }

    // Hiển thị trạng thái đang tìm
    setStore(prev => ({ ...prev, viDo: "Đang tìm...", kinhDo: "Đang tìm..." }));

    try {
      // Gọi API OpenStreetMap (Miễn phí, không cần Key)
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(store.diaChi)}`);
      const data = await res.json();

      if (data && data.length > 0) {
        // Lấy kết quả đầu tiên (chính xác nhất)
        setStore(prev => ({
          ...prev,
          viDo: data[0].lat,
          kinhDo: data[0].lon
        }));
        alert("📍 Đã lấy được tọa độ thành công!");
      } else {
        setStore(prev => ({ ...prev, viDo: "", kinhDo: "" }));
        alert("❌ Không tìm thấy tọa độ. Vui lòng nhập địa chỉ chi tiết hơn (VD: Thêm tên Thành phố).");
      }
    } catch (err) {
      console.error("Lỗi lấy tọa độ:", err);
      alert("Lỗi kết nối khi tìm tọa độ.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setStore({ ...store, hinhAnhHienThi: url });
    }
  };

  // 5. HÀM MÔ PHỎNG UPLOAD CLOUD
  const simulateCloudUpload = async (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockCloudUrl = `https://mock-cloud-storage.com/poi-images/${Date.now()}_${file.name}`;
        resolve(mockCloudUrl);
      }, 2000); // Trễ 2s để giống thật
    });
  };

  // 6. XỬ LÝ LƯU (Chỉ có 1 hàm handleSubmit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Chúng ta giữ lại link preview tạm thời (Blob) để Demo không bị lỗi vỡ ảnh.
      const tempPreviewUrl = store.hinhAnhHienThi;

      let finalImageUrl = store.imageUrl;

      if (selectedFile) {
        console.log("Đang upload lên Cloud...");
        finalImageUrl = await simulateCloudUpload(selectedFile);
        console.log("Upload Cloud thành công, Link:", finalImageUrl);
      }

      await api.put(`/api/cuahang/${store.id}`, {
        id: store.id,
        ten: store.ten,
        diaChi: store.diaChi,
        moTa: store.moTa,
        imageUrl: finalImageUrl,
        iduser: user.id,
        // 🔥 Gửi thêm tọa độ xuống Backend
        kinhDo: store.kinhDo ? parseFloat(store.kinhDo) : null,
        viDo: store.viDo ? parseFloat(store.viDo) : null
      });

      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
      setSelectedFile(null);
      //setStore({ ...store, hinhAnhHienThi: finalImageUrl, imageUrl: finalImageUrl });
      // Chúng ta cập nhật state để UI hiển thị: link thật trong DB là finalImageUrl,
      // NHƯNG ảnh hiển thị trên màn hình vẫn dùng cái Blob tạm thời để Demo không bị lỗi vỡ ảnh.
      setStore({
          ...store,
          imageUrl: finalImageUrl,
          hinhAnhHienThi: tempPreviewUrl // Giữ nguyên link preview, không dùng finalImageUrl ở đây
      });
    } catch (err) {
      console.error("Lỗi update:", err);
      alert("Cập nhật thất bại!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!store) return <p>Đang tải dữ liệu...</p>;

  // 7. GIAO DIỆN HIỂN THỊ
  return (
    <div className="cuahang-container">
      {/* SIDEBAR */}
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

        <button className="cuahang-btn red" onClick={handleLogout} style={{marginTop: 'auto'}}>
          Đăng xuất
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="cuahang-main">
        <div style={{ width: "100%", maxWidth: "1100px", marginBottom: "25px" }}>
          <h2 className="page-title" style={{ textAlign: "left", width: "100%", margin: 0 }}>
            Thông tin cửa hàng
          </h2>
        </div>

        <div className="card-container">
          {!isEditing ? (
            <div className="profile-view">
              <div className="image-section">
                <img src={store.hinhAnhHienThi} alt="Store" className="store-img" />
              </div>
              <div className="info-section">
                <div className="info-group">
                  <label>Tên cửa hàng</label>
                  <p>{store.ten}</p>
                </div>
                <div className="info-group">
                  <label>Địa chỉ</label>
                  <p>{store.diaChi}</p>
                </div>
                <div className="info-group">
                  <label>Mô tả</label>
                  <p className="description-text">{store.moTa}</p>
                </div>
                <button className="btn-edit" onClick={() => setIsEditing(true)}>
                  ✏️ Chỉnh sửa thông tin
                </button>
              </div>
            </div>
          ) : (
            <form className="profile-edit-form" onSubmit={handleSubmit}>
              <div className="image-section">
                <img src={store.hinhAnhHienThi} alt="Store Preview" className="store-img" />
                <input type="file" id="file-upload" className="custom-file-input" onChange={handleImageChange} />
              </div>

              <div className="info-section">
                <div className="form-group">
                  <label>Tên cửa hàng</label>
                  <input type="text" name="ten" value={store.ten} onChange={handleChange} className="form-control" />
                </div>
                <div className="form-group">
                  <label>Địa chỉ</label>
                  <input type="text" name="diaChi" value={store.diaChi} onChange={handleChange} className="form-control" />
                </div>
                {/* 🔥 KHU VỰC TỌA ĐỘ MỚI */}
                <div className="form-group" style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <label style={{ margin: 0, color: "#d63384" }}>📍 Tọa độ GPS (Dùng cho Tracking)</label>
                    <button type="button" onClick={handleAutoGetLocation} className="cuahang-btn blue" style={{ padding: "5px 10px", fontSize: "13px" }}>
                       Tự động lấy từ Địa chỉ
                    </button>
                  </div>

                  <div style={{ display: "flex", gap: "15px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "12px" }}>Vĩ độ (Latitude)</label>
                      <input type="text" name="viDo" value={store.viDo} onChange={handleChange} className="form-control" placeholder="VD: 10.762622" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "12px" }}>Kinh độ (Longitude)</label>
                      <input type="text" name="kinhDo" value={store.kinhDo} onChange={handleChange} className="form-control" placeholder="VD: 106.660172" />
                    </div>
                  </div>
                </div>
                {/* KẾT THÚC KHU VỰC TỌA ĐỘ */}
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea name="moTa" value={store.moTa} onChange={handleChange} className="form-control textarea-large" />
                </div>

                <div className="action-buttons">
                  <button type="submit" className="btn-save" disabled={isUploading}>
                    {isUploading ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                      // Bổ sung đoạn gọi API này để reset dữ liệu về nguyên bản
                      api.get(`/api/cuahang/user/${user.id}`).then((res) => {
                          const data = res.data[0];
                          setStore({
                            id: data.id,
                            ten: data.ten,
                            diaChi: data.diaChi,
                            moTa: data.moTa,
                            imageUrl: data.imageUrl,
                            hinhAnhHienThi: data.imageUrl && data.imageUrl.startsWith("http") ? data.imageUrl : "https://placehold.co/400x300",
                          });
                      });
                    }}
                  >
                    ❌ Hủy
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default CuaHang;
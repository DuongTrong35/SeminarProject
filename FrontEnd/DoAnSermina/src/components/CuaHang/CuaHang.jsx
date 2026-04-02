import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../ApiFunctions";
import axios from "axios";
import "./CuaHang.css";

// === THƯ VIỆN BẢN ĐỒ ===
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationMarker({ viDo, kinhDo, setViDo, setKinhDo }) {
  useMapEvents({
    click(e) {
      setViDo(e.latlng.lat);
      setKinhDo(e.latlng.lng);
    },
  });
  return viDo && kinhDo ? <Marker position={[viDo, kinhDo]} /> : null;
}

function MapUpdater({ viDo, kinhDo }) {
  const map = useMap();
  useEffect(() => {
    if (viDo && kinhDo && !isNaN(viDo) && !isNaN(kinhDo)) {
      map.flyTo([viDo, kinhDo], 16);
    }
  }, [viDo, kinhDo, map]);
  return null;
}

const navItems = [
  { to: "/store/home", label: "Trang chủ", icon: "🏠" },
  { to: "/store", label: "Thông tin cửa hàng", icon: "🏪" },
  { to: "/store/bandich", label: "Danh sách bản dịch", icon: "👨‍💻" },
  { to: "/voice", label: "Danh sách giọng đọc", icon: "🎤" },
  { to: "/thongke", label: "Thống kê", icon: "📊" },
];

const languageOptions = [
  "Vietnamese", "English", "Spanish", "French", "German", "Italian",
  "Portuguese", "Russian", "Chinese (Simplified)", "Japanese", "Korean", "Thai"
];

function CuaHang() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [user, setUser] = useState(null);
  const [store, setStore] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // File states
  const [thumbFile, setThumbFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data || !data.id) {
      navigate("/login"); return;
    }
    setUser(data);
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    api.get(`/api/cuahang/user/${user.id}`)
      .then((res) => {
        const data = res.data[0];

        let dbNgonNgu = data.ngonngu || "";
        let cleanNgonNgu = dbNgonNgu.split(",").filter(lang => lang !== "vi" && lang.trim() !== "").join(",");

        setStore({
          id: data.id,
          ten: data.ten || "",
          diaChi: data.diaChi || "",
          moTa: data.moTa || "",
          danhmuc: data.danhmuc || "Khác",
          ngonngu: cleanNgonNgu, // Chứa chuỗi VD: "Vietnamese,English"
          
          imageThumbnail: data.imageThumbnail || "",
          imageBanner: data.imageBanner || "",
          
          previewThumb: data.imageThumbnail ? (data.imageThumbnail.startsWith("http") ? data.imageThumbnail : `http://localhost:8080/uploads/${data.imageThumbnail}`) : "https://placehold.co/150",
          previewBanner: data.imageBanner ? (data.imageBanner.startsWith("http") ? data.imageBanner : `http://localhost:8080/uploads/${data.imageBanner}`) : "https://placehold.co/400x150",
          
          kinhDo: data.lng || 106.7025,
          viDo: data.lat || 10.7588
        });
      })
      .catch((err) => console.error("Lỗi load cửa hàng:", err));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  // Xử lý Checkbox Ngôn Ngữ
  const handleLanguageChange = (lang) => {
    let currentLangs = store.ngonngu ? store.ngonngu.split(",") : [];
    if (currentLangs.includes(lang)) {
      currentLangs = currentLangs.filter(l => l !== lang);
    } else {
      currentLangs.push(lang);
    }
    setStore({ ...store, ngonngu: currentLangs.join(",") });
  };

  const handleAutoGetLocation = async () => {
    if (!store.diaChi) return alert("Vui lòng nhập địa chỉ trước!");
    setStore(prev => ({ ...prev, viDo: "Đang tìm...", kinhDo: "Đang tìm..." }));
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(store.diaChi)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setStore(prev => ({ ...prev, viDo: parseFloat(data[0].lat), kinhDo: parseFloat(data[0].lon) }));
      } else {
        setStore(prev => ({ ...prev, viDo: 10.7588, kinhDo: 106.7025 }));
        alert("Không tìm thấy tọa độ. Vui lòng chọt lên bản đồ.");
      }
    } catch (err) { alert("Lỗi lấy tọa độ."); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalThumb = store.imageThumbnail;
      let finalBanner = store.imageBanner;

      // Upload Thumbnail qua API Backend
      if (thumbFile) {
        const formData = new FormData(); formData.append("file", thumbFile);
        const res = await axios.post("http://localhost:8080/api/cuahang/upload-image", formData);
        finalThumb = res.data;
      }

      // Upload Banner qua API Backend
      if (bannerFile) {
        const formData = new FormData(); formData.append("file", bannerFile);
        const res = await axios.post("http://localhost:8080/api/cuahang/upload-image", formData);
        finalBanner = res.data;
      }

      // Lưu thông tin
      await api.put(`/api/cuahang/${store.id}`, {
        ...store,
        imageThumbnail: finalThumb,
        imageBanner: finalBanner,
        lat: parseFloat(store.viDo),
        lng: parseFloat(store.kinhDo),
        iduser: user.id
      });

      alert("Cập nhật thành công! Đã gửi yêu cầu xét duyệt đến Admin.");
      setIsEditing(false);
      window.location.reload();

    } catch (err) {
      alert("Cập nhật thất bại!");
    } finally {
      setIsUploading(false);
    }
  };

  if (!store) return <p>Đang tải dữ liệu...</p>;

  const safeLat = !isNaN(parseFloat(store.viDo)) ? parseFloat(store.viDo) : 10.7588;
  const safeLng = !isNaN(parseFloat(store.kinhDo)) ? parseFloat(store.kinhDo) : 106.7025;

  return (
    <div className="cuahang-container">
      <aside className="cuahang-sidebar">
        <div className="cuahang-user">
          <div className="cuahang-avatar">{user?.username?.charAt(0).toUpperCase() || "A"}</div>
          <div>{user?.username}</div>
        </div>
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} className={pathname === item.to ? "cuahang-link active" : "cuahang-link"}>
            {item.icon} {item.label}
          </Link>
        ))}
        <button className="cuahang-btn red" onClick={() => {localStorage.removeItem("user"); navigate("/login");}} style={{marginTop: 'auto'}}>Đăng xuất</button>
      </aside>

      <div className="cuahang-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "25px" }}>
          <h2 className="page-title" style={{ margin: 0 }}>Thông tin cửa hàng</h2>
          {isEditing && <span className="badge bg-warning text-dark p-2">Mọi thay đổi sẽ cần Admin duyệt lại</span>}
        </div>

        <div className="card-container">
          {!isEditing ? (
            // ===== VIEW MODE =====
            <div className="profile-view">
              <div className="image-section" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                <div>
                    <strong>Thumbnail:</strong>
                    <img src={store.previewThumb} alt="Thumb" className="store-img" style={{width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px'}} />
                </div>
                <div>
                    <strong>Banner:</strong>
                    <img src={store.previewBanner} alt="Banner" className="store-img" style={{width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px'}} />
                </div>
              </div>
              <div className="info-section">
                <div className="info-group"><label>Tên cửa hàng</label><p>{store.ten || "Chưa cập nhật"}</p></div>
                <div className="info-group"><label>Danh mục</label><p>{store.danhmuc}</p></div>
                <div className="info-group"><label>Ngôn ngữ hỗ trợ</label><p>{store.ngonngu || "Chưa chọn ngôn ngữ"}</p></div>
                <div className="info-group"><label>Địa chỉ</label><p>{store.diaChi || "Chưa cập nhật"}</p></div>
                <div className="info-group"><label>Mô tả</label><p className="description-text">{store.moTa || "Chưa cập nhật"}</p></div>
                <button className="btn-edit" onClick={() => setIsEditing(true)}>✏️ Chỉnh sửa thông tin</button>
              </div>
            </div>
          ) : (
            // ===== EDIT MODE =====
            <form className="profile-edit-form" onSubmit={handleSubmit}>
              <div className="image-section" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                <div>
                    <label className="fw-bold">Ảnh Thumbnail</label>
                    <img src={store.previewThumb} alt="Thumb Preview" className="store-img" style={{width: '100%', height: '150px', objectFit: 'cover'}} />
                    <input type="file" className="form-control mt-2" onChange={(e) => {
                        if(e.target.files[0]) { setThumbFile(e.target.files[0]); setStore({...store, previewThumb: URL.createObjectURL(e.target.files[0])}); }
                    }} />
                </div>
                <div>
                    <label className="fw-bold">Ảnh Banner</label>
                    <img src={store.previewBanner} alt="Banner Preview" className="store-img" style={{width: '100%', height: '100px', objectFit: 'cover'}} />
                    <input type="file" className="form-control mt-2" onChange={(e) => {
                        if(e.target.files[0]) { setBannerFile(e.target.files[0]); setStore({...store, previewBanner: URL.createObjectURL(e.target.files[0])}); }
                    }} />
                </div>
              </div>

              <div className="info-section">
                <div className="form-group">
                  <label>Tên cửa hàng</label>
                  <input type="text" name="ten" value={store.ten} onChange={handleChange} className="form-control" required/>
                </div>
                
                <div className="form-group">
                  <label>Danh mục</label>
                  <select name="danhmuc" value={store.danhmuc} onChange={handleChange} className="form-control">
                    <option value="Ốc">Quán Ốc</option><option value="Hải Sản">Hải Sản</option><option value="Ăn Vặt">Ăn Vặt</option><option value="Nước Uống">Nước Uống</option><option value="Khác">Khác</option>
                  </select>
                </div>

                {/* KHU VỰC CHECKBOX NGÔN NGỮ */}
                <div className="form-group" style={{border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fafafa'}}>
                  <label style={{color: '#28a745', fontWeight: 'bold', marginBottom: '10px'}}>🟢 NGÔN NGỮ HỖ TRỢ</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {languageOptions.map(lang => (
                      <label key={lang} style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', margin: 0}}>
                        <input 
                          type="checkbox" 
                          checked={(store.ngonngu || "").includes(lang)}
                          onChange={() => handleLanguageChange(lang)}
                        /> {lang}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label>Địa chỉ</label>
                  <input type="text" name="diaChi" value={store.diaChi} onChange={handleChange} className="form-control" required/>
                </div>

                <div className="form-group" style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <label style={{ margin: 0, color: "#d63384", fontWeight: 'bold' }}>📍 Tọa độ GPS & Bản đồ</label>
                    <button type="button" onClick={handleAutoGetLocation} className="cuahang-btn blue" style={{ padding: "5px 10px", fontSize: "13px", borderRadius: '5px' }}>
                       🔍 Tự động lấy từ Địa chỉ
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "15px", marginBottom: "10px" }}>
                    <div style={{ flex: 1 }}><label style={{ fontSize: "12px", color: "#666" }}>Vĩ độ</label><input type="text" name="viDo" value={store.viDo} onChange={handleChange} className="form-control"/></div>
                    <div style={{ flex: 1 }}><label style={{ fontSize: "12px", color: "#666" }}>Kinh độ</label><input type="text" name="kinhDo" value={store.kinhDo} onChange={handleChange} className="form-control"/></div>
                  </div>
                  
                  <div style={{ height: "250px", width: "100%", borderRadius: "8px", overflow: "hidden", border: "2px solid #ccc" }}>
                    <MapContainer center={[safeLat, safeLng]} zoom={15} style={{ height: "100%", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker viDo={safeLat} kinhDo={safeLng} setViDo={(val) => setStore({...store, viDo: val})} setKinhDo={(val) => setStore({...store, kinhDo: val})} />
                        <MapUpdater viDo={safeLat} kinhDo={safeLng} />
                    </MapContainer>
                  </div>
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea name="moTa" value={store.moTa} onChange={handleChange} className="form-control textarea-large" />
                </div>

                <div className="action-buttons mt-3">
                  <button type="submit" className="btn-save" disabled={isUploading}>{isUploading ? "⏳ Đang lưu..." : "💾 Cập nhật & Gửi duyệt"}</button>
                  <button type="button" className="btn-cancel" onClick={() => { setIsEditing(false); window.location.reload(); }}>❌ Hủy</button>
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
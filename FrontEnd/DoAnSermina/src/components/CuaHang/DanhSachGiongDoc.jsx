import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CuaHang/CuaHang.css";

const API_URL = "http://localhost:8080/api/giongdoc";

const navItems = [
  { to: "/store/home", label: "Trang chủ", icon: "🏠" },
  { to: "/store", label: "Thông tin cửa hàng", icon: "🏪" },
  { to: "/store/bandich", label: "Danh sách bản dịch", icon: "👨‍💻" },
  { to: "/voice", label: "Danh sách giọng đọc", icon: "🎤" },
  { to: "/thongke", label: "Thống kê", icon: "📊" },
];

function DanhSachGiongDoc() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  
  // State dữ liệu
  const [voices, setVoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [playingId, setPlayingId] = useState(null);
  
  // State form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [selectedFile, setSelectedFile] = useState(null);

  // 1. LOAD DỮ LIỆU TỪ BACKEND
  useEffect(() => {
    // Tạm ẩn check user để test cho lẹ, ông có thể mở ra sau
    // const data = JSON.parse(localStorage.getItem("user"));
    // if (!data) navigate("/login");
    // setUser(data);

    axios.get(API_URL)
      .then(res => setVoices(res.data))
      .catch(err => console.error("Lỗi lấy danh sách:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 2. XỬ LÝ PHÁT NHẠC
  const handleTogglePlay = (id) => {
    const audioElement = document.getElementById(`audio-${id}`);
    if (playingId === id) {
      audioElement.pause();
      setPlayingId(null);
    } else {
      if (playingId) document.getElementById(`audio-${playingId}`)?.pause();
      audioElement.play();
      setPlayingId(id);
    }
  };

  const filteredVoices = voices.filter(voice => 
    voice.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. XỬ LÝ XÓA (GỌI API)
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bản ghi âm này?")) {
      axios.delete(`${API_URL}/${id}`)
        .then(() => {
          setVoices(voices.filter(voice => voice.id !== id));
          if (playingId === id) setPlayingId(null);
        })
        .catch(err => alert("Lỗi khi xóa!"));
    }
  };

  const openForm = (voice = null) => {
    if (voice) {
      setEditingId(voice.id);
      setFormData({ name: voice.name, description: voice.description });
    } else {
      setEditingId(null);
      setFormData({ name: "", description: "" });
    }
    setSelectedFile(null); // Reset file input
    setIsFormOpen(true);
  };

  // 4. XỬ LÝ LƯU (GỌI API THÊM / SỬA)
  const handleSave = (e) => {
    e.preventDefault();

    if (editingId) {
      // Logic SỬA (Chỉ update text, không update file để tránh rườm rà)
      const voiceToUpdate = voices.find(v => v.id === editingId);
      axios.put(`${API_URL}/${editingId}`, {
        name: formData.name,
        description: formData.description,
        src: voiceToUpdate.src // Giữ nguyên link file cũ
      })
      .then(res => {
        setVoices(voices.map(v => v.id === editingId ? res.data : v));
        setIsFormOpen(false);
        alert("Cập nhật thành công!");
      })
      .catch(err => alert("Lỗi cập nhật!"));

    } else {
      // Logic THÊM MỚI (Có gửi kèm file)
      if (!selectedFile) {
        alert("Vui lòng chọn file âm thanh!");
        return;
      }

      // Dùng FormData để gửi file lên Spring Boot
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("file", selectedFile);

      axios.post(API_URL, data, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(res => {
        setVoices([...voices, res.data]);
        setIsFormOpen(false);
        alert("Tải lên thành công!");
      })
      .catch(err => {
        console.error(err);
        alert("Lỗi tải lên! Hãy kiểm tra xem Backend đã chạy chưa.");
      });
    }
  };

  return (
    <div className="cuahang-container">
      {/* SIDEBAR */}
      <aside className="cuahang-sidebar">
        <div className="cuahang-user">
          <div className="cuahang-avatar">C</div>
          <div>Chủ Cửa Hàng</div>
        </div>
        {navItems.map((item) => (
          <Link key={item.to} to={item.to} className={pathname === item.to ? "cuahang-link active" : "cuahang-link"}>
            {item.icon} {item.label}
          </Link>
        ))}
        <button className="cuahang-btn red" onClick={handleLogout}>Đăng xuất</button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="cuahang-main" style={{ position: "relative" }}>
        <h2>Quản lý Giọng đọc / Ghi âm</h2>
        
        {/* KHUNG TÌM KIẾM & THÊM MỚI */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", gap: "10px", height: "45px" }}>
          <input 
            type="text" 
            placeholder="🔍 Tìm kiếm file ghi âm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, padding: "0 15px", borderRadius: "8px", border: "1px solid #ccc", height: "100%", boxSizing: "border-box" }}
          />
          <button 
            className="cuahang-btn blue" 
            onClick={() => openForm()} 
            style={{ height: "100%", margin: 0, padding: "0 20px", fontWeight: "bold", display: "flex", alignItems: "center", boxSizing: "border-box" }}
          >
            + Tải lên giọng đọc
          </button>
        </div>

        {/* DANH SÁCH FILE */}
        <div className="voice-list">
          {filteredVoices.map((voice) => (
            <div key={voice.id} style={{ border: "1px solid #e0e0e0", borderRadius: "10px", padding: "16px", marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff" }}>
              <div className="voice-info" style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 6px 0", color: "#333" }}>{voice.name}</h3>
                <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>{voice.description}</p>
                {voice.src && <audio id={`audio-${voice.id}`} src={voice.src} onEnded={() => setPlayingId(null)} />}
              </div>

              {/* ACTION BUTTONS */}
              <div className="voice-actions" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button 
                  className={`cuahang-btn ${playingId === voice.id ? 'red' : 'blue'}`} 
                  onClick={() => handleTogglePlay(voice.id)} 
                  style={{ width: "120px", height: "38px", margin: 0, display: "flex", alignItems: "center", justifyContent: "center" }} 
                  disabled={!voice.src}
                >
                  {playingId === voice.id ? "⏸ Đang phát" : "▶️ Nghe"}
                </button>
                <button 
                  onClick={() => openForm(voice)} 
                  style={{ height: "38px", padding: "0 15px", border: "1px solid #007bff", backgroundColor: "white", color: "#007bff", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(voice.id)} 
                  style={{ height: "38px", padding: "0 15px", border: "1px solid #dc3545", backgroundColor: "white", color: "#dc3545", borderRadius: "5px", cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
          {filteredVoices.length === 0 && <p style={{textAlign: "center", color: "#999", marginTop: "20px"}}>Chưa có giọng đọc nào. Hãy tải lên!</p>}
        </div>

        {/* MODAL FORM TẢI FILE */}
        {isFormOpen && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
            <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "12px", width: "450px" }}>
              <h3 style={{ marginTop: 0, marginBottom: "20px" }}>{editingId ? "Sửa Thông Tin" : "Tải Lên File Ghi Âm"}</h3>
              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Tên file/Tiêu đề *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "5px", border: "1px solid #ccc" }} />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Mô tả chi tiết</label>
                  <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ width: "100%", padding: "8px", boxSizing: "border-box", borderRadius: "5px", border: "1px solid #ccc" }} />
                </div>
                
                {/* Chỉ hiện input chọn file khi THÊM MỚI */}
                {!editingId && (
                  <div>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Chọn file âm thanh (.mp3, .wav)</label>
                    <input type="file" accept="audio/*" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ width: "100%" }} />
                  </div>
                )}
                
                {/* MODAL BUTTONS */}
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", marginTop: "15px" }}>
                  <button 
                    type="button" 
                    onClick={() => setIsFormOpen(false)} 
                    style={{ height: "40px", padding: "0 20px", border: "none", backgroundColor: "#e0e0e0", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", margin: 0, display: "flex", alignItems: "center" }}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="cuahang-btn blue" 
                    style={{ height: "40px", padding: "0 20px", border: "none", margin: 0, display: "flex", alignItems: "center" }}
                  >
                    💾 {editingId ? "Lưu thay đổi" : "Upload và Lưu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DanhSachGiongDoc;
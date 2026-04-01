import "./Login.css";
import logo from "../../assets/images/logodn.png";
import mhdn from "../../assets/images/mhđn.jpg";
import Navbar from "../Navbar";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// === THƯ VIỆN BẢN ĐỒ ===
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix lỗi mất icon marker mặc định của Leaflet trong React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component bắt sự kiện Click trên bản đồ
function LocationMarker({ viDo, kinhDo, setViDo, setKinhDo }) {
  useMapEvents({
    click(e) {
      setViDo(e.latlng.lat);
      setKinhDo(e.latlng.lng);
    },
  });
  return viDo && kinhDo ? <Marker position={[viDo, kinhDo]} /> : null;
}

function Login() {
  const navigate = useNavigate();
  
  // State cho Đăng nhập
  const [taikhoan, setTaikhoan] = useState("");
  const [matkhau, setMatkhau] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // State cho Đăng ký cơ bản
  const [regTaikhoan, setRegTaikhoan] = useState("");
  const [regMatkhau, setRegMatkhau] = useState("");
  const [regRole, setRegRole] = useState("USER"); 

  // State thông tin Cửa Hàng
  const [tenCuaHang, setTenCuaHang] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [danhMuc, setDanhMuc] = useState("Ốc"); 
  const [moTa, setMoTa] = useState("");
  
  // Tọa độ mặc định (Tui để ngay đường Vĩnh Khánh, Quận 4 cho chuẩn bài)
  const [viDo, setViDo] = useState(10.7588);
  const [kinhDo, setKinhDo] = useState(106.7025);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/login/xulydn", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ taikhoan, matkhau }),
      });

      const text = await response.text();
      if (response.status === 401) return alert("Sai tài khoản hoặc mật khẩu");
      if (!response.ok) return alert("Đăng nhập thất bại");

      const data = JSON.parse(text);
      localStorage.setItem("user", JSON.stringify({
        id: data.id, 
        username: data.username,
        role: data.role,
        goiDichVu: data.goiDichVu
      }));

      if (data.role === "STORE") navigate("/store/home");
      else if (data.role === "ADMIN") navigate("/admin");
      else navigate("/homeuse");

    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const requestData = { taikhoan: regTaikhoan, matkhau: regMatkhau, role: regRole };

    if (regRole === "STORE") {
        requestData.tenCuaHang = tenCuaHang;
        requestData.diaChi = diaChi;
        requestData.danhMuc = danhMuc;
        requestData.moTa = moTa;
        requestData.viDo = viDo;
        requestData.kinhDo = kinhDo;
        // ĐÃ BỎ LẤY LINK ẢNH
    }

    try {
      const response = await fetch("http://localhost:8080/login/dangky", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(requestData),
      });

      if (response.ok) {
        alert(regRole === "STORE" ? "Đăng ký thành công! Vui lòng chờ Admin duyệt cửa hàng." : "Đăng ký thành công! Bạn có thể đăng nhập ngay.");
        setIsRegister(false);
        // Reset form
        setRegTaikhoan(""); setRegMatkhau(""); setTenCuaHang(""); setDiaChi(""); setMoTa("");
      } else {
        alert("Đăng ký thất bại, tài khoản đã tồn tại hoặc lỗi dữ liệu!");
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="Container" style={{ backgroundImage: `url(${mhdn})` }}>
        <div className="login-wrapper">
          <div className="custom-card p-4">
            <div className="text-center mb-3">
              <img src={logo} alt="logo" width="70" />
            </div>

            {!isRegister ? (
              /* ================= FORM ĐĂNG NHẬP ================= */
              <>
                <div className="text-center mb-4"><h4>Đăng nhập Konoha Market</h4></div>
                <form onSubmit={handleLogin}>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="fa fa-user"></i></span>
                    <input type="text" className="form-control" placeholder="Username" value={taikhoan} onChange={(e) => setTaikhoan(e.target.value)} required/>
                  </div>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="fa fa-key"></i></span>
                    <input type="password" className="form-control" placeholder="Password" value={matkhau} onChange={(e) => setMatkhau(e.target.value)} required/>
                  </div>
                  <div className="btn-login-group">
                    <button type="submit" className="btn btn-primary w-100 mb-2">Sign In</button>
                    <button type="button" className="btn btn-second w-100" onClick={() => setIsRegister(true)}>Register</button>
                  </div>
                </form>
              </>
            ) : (
              /* ================= FORM ĐĂNG KÝ ================= */
              <>
                <div className="text-center mb-4"><h4>Đăng ký Konoha Market</h4></div>
                <form onSubmit={handleRegister}>
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="fa fa-id-badge"></i></span>
                    <select className="select-role" value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                      <option value="USER">Người dùng (Khách hàng)</option>
                      <option value="STORE">Quán ăn (Cửa hàng)</option>
                    </select>
                  </div>

                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="fa fa-user"></i></span>
                    <input type="text" className="form-control" placeholder="Username" value={regTaikhoan} onChange={(e) => setRegTaikhoan(e.target.value)} required />
                  </div>
                  
                  <div className="mb-3 input-group">
                    <span className="input-group-text"><i className="fa fa-key"></i></span>
                    <input type="password" className="form-control" placeholder="Password" value={regMatkhau} onChange={(e) => setRegMatkhau(e.target.value)} required />
                  </div>

                  {/* FORM CỬA HÀNG VỚI BẢN ĐỒ */}
                  {regRole === "STORE" && (
                      <div style={{ maxHeight: '350px', overflowX: 'hidden', overflowY: 'auto', paddingRight: '10px', marginBottom: '15px' }}>
                        <h6 style={{color: '#6c757d', borderBottom: '1px solid #ccc', paddingBottom: '5px'}}>Thông tin chi tiết Cửa hàng</h6>
                        
                        <input type="text" className="form-control mb-2" placeholder="Tên quán (VD: Ốc Oanh)" value={tenCuaHang} onChange={(e) => setTenCuaHang(e.target.value)} required />
                        <input type="text" className="form-control mb-2" placeholder="Địa chỉ (VD: 534 Vĩnh Khánh)" value={diaChi} onChange={(e) => setDiaChi(e.target.value)} required />
                        
                        <select className="form-control mb-2" value={danhMuc} onChange={(e) => setDanhMuc(e.target.value)}>
                            <option value="Ốc">Quán Ốc</option>
                            <option value="Hải Sản">Hải Sản</option>
                            <option value="Ăn Vặt">Ăn Vặt</option>
                            <option value="Nước Uống">Nước Uống</option>
                        </select>

                        <textarea className="form-control mb-2" placeholder="Mô tả ngắn gọn về quán..." rows="2" value={moTa} onChange={(e) => setMoTa(e.target.value)} required />

                        {/* KHU VỰC BẢN ĐỒ MIN MAP */}
                        <div className="mb-2">
                          <label style={{ fontSize: '14px', color: '#555', fontWeight: 'bold' }}>📍 Chạm vào bản đồ để ghim vị trí quán:</label>
                          <div style={{ height: "200px", width: "100%", borderRadius: "10px", overflow: "hidden", border: "2px solid #3b82f6" }}>
                            <MapContainer center={[10.7588, 106.7025]} zoom={15} style={{ height: "100%", width: "100%" }}>
                              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                              <LocationMarker viDo={viDo} kinhDo={kinhDo} setViDo={setViDo} setKinhDo={setKinhDo} />
                            </MapContainer>
                          </div>
                          <small style={{ color: '#888' }}>Tọa độ hiện tại: {viDo.toFixed(4)}, {kinhDo.toFixed(4)}</small>
                        </div>
                      </div>
                  )}

                  <div className="btn-login-group">
                    <button type="submit" className="btn btn-primary w-100 mb-2">Confirm</button>
                    <button type="button" className="btn btn-second w-100" onClick={() => setIsRegister(false)}>Back</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
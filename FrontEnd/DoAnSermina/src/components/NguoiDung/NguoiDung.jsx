import "./NguoiDung.css";
import React, { useState, useEffect } from "react";
import { AiFillHome } from 'react-icons/ai';
import { GiKnifeFork } from 'react-icons/gi';
import { FiVolume2 } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

function NguoiDung() {
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Thêm biến state này để điều khiển việc phóng to khung
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleDirections = () => {
    navigate('/map');
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <div className="logo">Vinh Khanh Food Tour</div>
          <ul className="menu">
            <li><a href="/tcnd"><AiFillHome /> Home</a></li>
            <li><a href="#food-directory"><GiKnifeFork /> Food</a></li>
            <li><a href="#"><FiVolume2 /> Audio Guide</a></li>
            {user ? (
              <>
                <li><a href="#">👋 Xin chào, {user.taikhoan}</a></li>
                <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                  <a href="#">Đăng xuất</a>
                </li>
              </>
            ) : (
              <li onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
                <a href="#"><AiFillHome /> Đăng nhập</a>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <div className="usercontainer">
        {!isRegistering ? (
          // 1. GIAO DIỆN GỐC (KHUNG NHỎ)
          <div className="card" style={{ transition: "all 0.4s ease" }}>
            <h1>Bạn chưa đăng ký dịch vụ của chúng tôi</h1>
            <p>Hãy bắt đầu trải nghiệm ngay hôm nay 🚀</p>

            <div className="button-group">
              <button className="btn trial" onClick={handleDirections}>
                Dùng thử miễn phí
              </button>
              <button className="btn register" onClick={() => setIsRegistering(true)}>
                Đăng ký dịch vụ
              </button>
            </div>
          </div>
        ) : (
          // 2. GIAO DIỆN KHI BẤM NÚT ĐĂNG KÝ (KHUNG NỬA MÀN HÌNH - 50vw)
          <div className="card" style={{ width: "50vw", minWidth: "500px", padding: "50px", transition: "all 0.4s ease" }}>
            <h1>Đăng ký dịch vụ Cao cấp</h1>
            <p style={{ fontSize: "1.2rem", lineHeight: "1.8", color: "#555", marginTop: "20px", marginBottom: "40px" }}>
              Chỉ với <strong>50k</strong> quý khách có thể trải nghiệm hết dịch vụ của chúng tôi. <br/>
              Mở khóa toàn bộ hệ thống thuyết minh tự động và các tiện ích độc quyền khác ngay hôm nay!
            </p>

            <div className="button-group">
              {/* Nút quay lại */}
              <button className="btn trial" onClick={() => setIsRegistering(false)} style={{ backgroundColor: "#e0e0e0", color: "#333", padding: "12px 30px" }}>
                Quay lại
              </button>
              {/* Nút chốt đơn */}
              <button className="btn register" style={{ backgroundColor: "#4CAF50", color: "white", padding: "12px 30px" }} onClick={() => alert("Đang chuyển hướng sang cổng thanh toán...")}>
                Thanh toán 50k
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default NguoiDung;
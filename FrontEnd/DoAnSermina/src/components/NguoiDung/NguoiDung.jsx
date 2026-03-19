import "./NguoiDung.css";
import React, { useState, useEffect } from "react";
import { AiFillHome } from 'react-icons/ai';
import { GiKnifeFork } from 'react-icons/gi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FiVolume2 } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
function NguoiDung() {
  const [user, setUser] = useState(null);
useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);
const handleLogout = () => {
  localStorage.removeItem("user");
  setUser(null);
  navigate("/login");
};

    const navigate = useNavigate();
  const handleDirections = () => {
    navigate('/map');
  };
  const [scrolled, setScrolled] = useState(false);

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
              
              <li>
                <a href="#">
                  <AiFillHome /> Home
                </a>
              </li>
              <li>
                <a href="#food-directory">
                  <GiKnifeFork /> Food
                </a>
              </li>
              {/* <li>
                <a href="#">
                  <FaMapMarkerAlt /> Map
                </a>
              </li> */}
              <li>
                <a href="#">
                  <FiVolume2 /> Audio Guide
                </a>
              </li>
            {user ? (
  <>
    <li>
      <a href="#">
        👋 Xin chào, {user.taikhoan}
      </a>
    </li>
    <li onClick={handleLogout} style={{ cursor: "pointer" }}>
      <a href="#">Đăng xuất</a>
    </li>
  </>
) : (
  <li onClick={() => navigate("/login")}
      style={{ cursor: "pointer" }}>
    <a href="#">
      <AiFillHome /> Đăng nhập
    </a>
  </li>
)}
            </ul>
          </div>
        </nav>
    <div className="usercontainer">
      <div className="card">
        <h1>Bạn chưa đăng ký dịch vụ của chúng tôi</h1>
        <p>Hãy bắt đầu trải nghiệm ngay hôm nay để khám phá các tính năng tuyệt vời 🚀</p>

        <div className="button-group">
          <button className="btn trial" onClick={handleDirections}>Dùng thử miễn phí</button>
          <button className="btn register">Đăng ký dịch vụ</button>
        </div>
      </div>
    </div>
    </>
  );
}

export default NguoiDung;
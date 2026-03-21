import Hero from "../Hero";
import FoodDirectory from "../FoodDirectory";
import FeaturedFoods from "../FeaturedFoods";
import MapSection from "../MapSection";
import Footer from "../Footer";
import React, { useState, useEffect } from "react";
import { AiFillHome } from 'react-icons/ai';
import { GiKnifeFork } from 'react-icons/gi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FiVolume2 } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
function TCGiuDung() {
      const navigate = useNavigate(); 
const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };
      const [scrolled, setScrolled] = useState(false);
      const [user, setUser] = useState(null);
useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);
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
                  <li>
                    <a href="/homeuse">
                      <FiVolume2 /> Dùng Thử
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
         <Hero />
      <FoodDirectory />
      <FeaturedFoods />
      <MapSection />
      <Footer />
      </>
     );
}

export default TCGiuDung;
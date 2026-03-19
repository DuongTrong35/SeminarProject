import React, { useState, useEffect } from "react";
import { AiFillHome } from 'react-icons/ai';
import { GiKnifeFork } from 'react-icons/gi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FiVolume2 } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
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
          <li  onClick={() => navigate("/login")}
        style={{ cursor: "pointer" }}>
            <a href="#">
              <AiFillHome /> Đăng nhập
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

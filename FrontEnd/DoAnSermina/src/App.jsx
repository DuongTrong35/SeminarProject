import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FoodDirectory from "./components/FoodDirectory";
import FeaturedFoods from "./components/FeaturedFoods";
import MapSection from "./components/MapSection";
import Footer from "./components/Footer";
import MapPage from "./components/MapPage";
import DirectionsPage from "./components/DirectionsPage";
import DangNhap from "./components/DangNhap/Login";
import Tcnd from "./components/NguoiDung/NguoiDung";
import CuaHang from "./components/CuaHang/CuaHang";
import TCCuaHang from "./components/CuaHang/TrangChuCH";
import QLCuaHang from "./components/QuanTri/QuanLyCH";
import TCadmin from "./components/QuanTri/TrangChuQT";
import DanhSachBanDich from "./components/BanDich/DanhSachBanDich";

import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
function Home() {
  return (
    <>
          <Navbar />

      <Hero />
      <FoodDirectory />
      <FeaturedFoods />
      <MapSection />
      <Footer />
    </>
  );
}

function AppRouter() {
  const navigate = useNavigate();

  // Intercept the "Map" link in the existing Navbar (unchanged) and route within the app.
  useEffect(() => {
    const menuLinks = document.querySelectorAll('nav .menu li a');
    const mapLink = Array.from(menuLinks).find((link) =>
      link.textContent.trim().toLowerCase().includes('map')
    );

    if (!mapLink) return;
    const handleClick = (e) => {
      e.preventDefault();
      navigate('/map');
    };

    mapLink.addEventListener('click', handleClick);
    return () => mapLink.removeEventListener('click', handleClick);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/directions" element={<DirectionsPage />} />
      <Route path="/login" element={<DangNhap />} />
      <Route path="/homeuse" element={<Tcnd />} />
      <Route path="/store" element={<CuaHang />} />
      <Route path="/store/home" element={<TCCuaHang />} />
      <Route path="/store/bandich" element={<DanhSachBanDich />} />
      <Route path="/admin" element={<TCadmin />} />
      <Route path="/admin/qlch" element={<QLCuaHang />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <AppRouter />
    </Router>
  );
}
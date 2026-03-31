import React, { useState } from "react";
import "./Dashboard.css";
import POIForm from "../QuanTri/POIForm";
import POIFix from "../QuanTri/POIFix";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const [pois, setPois] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPOI, setEditingPOI] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const getAvatarColor = (name) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#A29BFE",
      "#FD79A8",
    ];
    if (!name) return colors[0];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  const handleSave = (data) => {
  const newPOI = {
    id: data.id,
    name: data.ten,
    category: data.danhmuc,
    desc: data.moTa,
    banner: data.imageBanner
      ? `http://localhost:8080/uploads/${data.imageBanner}`
      : null,
    lat: data.lat,
    lng: data.lng,
  };

  setPois((prev) => [newPOI, ...prev]);
};
  const handleUpdate = (data) => {
    setPois((prev) =>
      prev.map((p) =>
        p.id === editingPOI.id
          ? {
              ...p,
              name: data.name,
              category: data.category,
              desc: data.description,
              lat: data.lat,
              lng: data.lng,
              banner: data.banner,
            }
          : p
      )
    );

    setIsEditOpen(false);
    setEditingPOI(null);
  };
  return (
    <div className="poi-layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon">VK</div>
          <div>
            <h4>Vĩnh Khánh GPS</h4>
            <span>Admin Dashboard</span>
          </div>
        </div>

        <div className="menu">
          <div className="menu-item">Dashboard</div>
          <div className="menu-item active">POIs Management</div>
          <div className="menu-item">Tours Management</div>
        </div>

        <div className="sidebar-user">
          <div
            className="avatar"
            style={{
              backgroundColor: getAvatarColor(user?.taikhoan),
            }}
          >
            {user?.taikhoan?.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <span className="username">{user?.taikhoan}</span>
            <small className="role">{user?.role}</small>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            ⏻
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="header">
          <div>
            <h1>Points of Interest</h1>
            <p>Quản lý các địa điểm ẩm thực</p>
          </div>

          <button className="btn-add" onClick={() => setIsOpen(true)}>
            + Thêm POI mới
          </button>
        </div>
        {/* GRID */}
        <div className="grid">
          {pois.map((poi) => (
            <div key={poi.id} className="card">
              {/* IMAGE giả */}
              <div className="card-img">
                {poi.banner ? (
  <img src={poi.banner} className="card-image" />
) : (
  <div className="img-placeholder" />
)}
                <span className="badge">{poi.category}</span>{" "}
              </div>

              {/* CONTENT */}
              <div className="card-body">
                <h3>{poi.name}</h3>
                <p className="desc">{poi.desc}</p>

                <p className="latlng-text">
                  📍 {poi.lat}, {poi.lng}
                </p>

                {/* ✅ ACTION BUTTONS */}
                <div className="card-actions">
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => {
                      setEditingPOI(poi);
                      setIsEditOpen(true);
                    }}
                  >
                    ✏️
                  </button>{" "}
                  <button className="icon-btn delete-btn">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM */}
      <POIForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
      />
      <POIFix
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleUpdate}
        poi={editingPOI}
      />
    </div>
  );
}

export default Dashboard;

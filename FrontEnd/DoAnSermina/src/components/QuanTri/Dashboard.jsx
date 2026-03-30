import React, { useState } from "react";
import "./Dashboard.css";
import POIForm from "../QuanTri/POIForm";
import POIFix from "../QuanTri/POIFix";
function Dashboard() {
  const [pois, setPois] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
const [isEditOpen, setIsEditOpen] = useState(false);
const [editingPOI, setEditingPOI] = useState(null);
  // ✅ HANDLE SAVE (CHỈ LẤY 3 FIELD)
  const handleSave = (data) => {
    const newPOI = {
      id: Date.now(),
      name: data.name,
      category: data.category,
      desc: data.description,
      banner: data.banner,
      lat: data.lat, // ✅ thêm
      lng: data.lng, // ✅ thêm
    };

    setPois((prev) => [newPOI, ...prev]);
    setIsOpen(false);
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
          <div className="avatar">A</div>
          <span>Admin</span>
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
                  <img src={poi.banner} alt="" className="card-image" />
                ) : (
                  <div className="img-placeholder" />
                )}

                <span className="badge">Điểm chính</span>
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
</button>    <button className="icon-btn delete-btn">🗑️</button>
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

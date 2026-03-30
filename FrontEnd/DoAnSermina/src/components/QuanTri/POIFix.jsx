import React, { useState, useEffect } from "react";
import "../QuanTri/POIForm.css"; // dùng lại css cũ

function POIFix({ isOpen, onClose, onSave, poi }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    lat: "",
    lng: "",
    banner: "",
  });

  // 👉 đổ dữ liệu khi mở edit
  useEffect(() => {
    if (poi) {
      setForm({
        name: poi.name || "",
        category: poi.category || "",
        description: poi.desc || "",
        lat: poi.lat || "",
        lng: poi.lng || "",
        banner: poi.banner || "",
      });
    }
  }, [poi]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Chỉnh sửa POI</h2>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="form-step">

          {/* LEFT */}
          <div className="left">
            <label>Tên POI</label>
            <input name="name" value={form.name} onChange={handleChange} />

            <label>Danh mục</label>
            <input name="category" value={form.category} onChange={handleChange} />

            <label>Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
          </div>

          {/* RIGHT */}
          <div className="right">
            <label>Lat</label>
            <input name="lat" value={form.lat} onChange={handleChange} />

            <label>Lng</label>
            <input name="lng" value={form.lng} onChange={handleChange} />

            {/* Preview ảnh */}
            {form.banner && (
              <img src={form.banner} className="preview-banner" />
            )}
          </div>

        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Hủy
          </button>

          <button className="generate-btn" onClick={handleSubmit}>
            💾 Lưu chỉnh sửa
          </button>
        </div>

      </div>
    </div>
  );
}

export default POIFix;
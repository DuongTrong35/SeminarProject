import React, { useState, useEffect, useRef } from "react";
import "../QuanTri/POIForm.css";

// Leaflet
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// FULL languages (giống hình)
const ALL_LANGUAGES = [
  "Vietnamese", "English", "Spanish", "French",
  "German", "Italian", "Portuguese", "Russian",
  "Chinese (Simplified)", "Japanese", "Korean", "Thai",
  "Indonesian", "Filipino", "Malay", "Burmese",
  "Khmer", "Lao", "Turkish", "Polish"
];

// Map click
function MapClick({ setForm }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setForm((prev) => ({
        ...prev,
        lat: lat.toFixed(6),
        lng: lng.toFixed(6),
      }));
    },
  });
  return null;
}

const initialForm = {
  name: "",
  category: "",
  description: "",
  address: "",
  radius: 10,
  lat: "10.7612",
  lng: "106.7012",
  languages: [],
  thumbnail: null,
  banner: null,
  thumbnailPreview: null,
  bannerPreview: null,
};
function POIForm({ isOpen, onClose, onSave }) {
  
  const mapRef = useRef(null);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (mapRef.current && isOpen) {
      setTimeout(() => mapRef.current.invalidateSize(), 300);
    }
  }, [isOpen]);
useEffect(() => {
  if (isOpen) {
    setForm(initialForm);
  }
}, [isOpen]);
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckbox = (lang) => {
    setForm((prev) => {
      const exists = prev.languages.includes(lang);
      return {
        ...prev,
        languages: exists
          ? prev.languages.filter((l) => l !== lang)
          : [...prev.languages, lang],
      };
    });
  };

const handleSubmit = () => {
  onSave({
    name: form.name,
    category: form.category,
    description: form.description,
    banner: form.bannerPreview,
    lat: form.lat,   // ✅ thêm
    lng: form.lng,   // ✅ thêm
  });
};

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Thêm POI mới</h2>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="form-step">

          {/* LEFT */}
          <div className="left">
            <label>Tên POI</label>
            <input name="name" onChange={handleChange} />

            <label>Danh mục</label>
            <input name="category" onChange={handleChange} />

            <label>Mô tả</label>
            <textarea name="description" onChange={handleChange} />

            <label>Địa chỉ</label>
            <input name="address" onChange={handleChange} />

            <label>Bán kính</label>
            <input name="radius" onChange={handleChange} />
          </div>

          {/* RIGHT */}
          <div className="right">

            {/* MAP */}
            <div className="map-container">
              <MapContainer
                center={[parseFloat(form.lat), parseFloat(form.lng)]}
                zoom={16}
                whenReady={(map) => (mapRef.current = map.target)}
                style={{height:'284px'}}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[form.lat, form.lng]} />
                <MapClick setForm={setForm} />
              </MapContainer>
            </div>

            {/* LAT LNG */}
            <div className="latlng">
              <input name="lat" value={form.lat} onChange={handleChange} />
              <input name="lng" value={form.lng} onChange={handleChange} />
            </div>

            {/* THUMB */}
            <label>Ảnh Thumbnail</label>
            <div className="upload-row">
              {form.thumbnailPreview && (
                <img src={form.thumbnailPreview} className="preview-thumb" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setForm((prev) => ({
                    ...prev,
                    thumbnail: file,
                    thumbnailPreview: URL.createObjectURL(file),
                  }));
                }}
              />
            </div>

            {/* BANNER */}
            <label>Ảnh Banner</label>
            <div className="upload-row">
              {form.bannerPreview && (
                <img src={form.bannerPreview} className="preview-banner" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setForm((prev) => ({
                    ...prev,
                    banner: file,
                    bannerPreview: URL.createObjectURL(file),
                  }));
                }}
              />
            </div>

            {/* LANGUAGES */}
            <div className="language-box">
              <div className="language-header">
                <span>🟢 NGÔN NGỮ</span>
                <div>
                  <button onClick={() => setForm(prev => ({
                    ...prev,
                    languages: ALL_LANGUAGES
                  }))}
                  style={{ marginRight: "36px" }}
                  >
                    Chọn tất cả
                  </button>

                  <button onClick={() => setForm(prev => ({
                    ...prev,
                    languages: []
                  }))}>
                    Bỏ chọn
                  </button>
                </div>
              </div>

              <div className="languages-grid">
                {ALL_LANGUAGES.map((lang) => (
                  <label key={lang}>
                    <input
                      type="checkbox"
                      checked={form.languages.includes(lang)}
                      onChange={() => handleCheckbox(lang)}
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Hủy
          </button>

          <button className="generate-btn" onClick={handleSubmit}>
            ✨ Sinh nội dung đa ngôn ngữ
          </button>
        </div>

      </div>
    </div>
  );
}

export default POIForm;
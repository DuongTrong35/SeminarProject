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

// Languages
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

// Initial form
const initialForm = {
  id: "", // ✅ MÃ CỬA HÀNG
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
    if (isOpen) setForm(initialForm);
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

  const handleSubmit = async () => {
    try {
      let thumbnailName = "";
      let bannerName = "";

      // upload thumbnail
      if (form.thumbnail) {
        const fd = new FormData();
        fd.append("file", form.thumbnail);

        const res = await fetch("http://localhost:8080/api/cuahang/upload-image", {
          method: "POST",
          body: fd,
        });

        thumbnailName = await res.text();
      }

      // upload banner
      if (form.banner) {
        const fd = new FormData();
        fd.append("file", form.banner);

        const res = await fetch("http://localhost:8080/api/cuahang/upload-image", {
          method: "POST",
          body: fd,
        });

        bannerName = await res.text();
      }

      const user = JSON.parse(localStorage.getItem("user"));

      const response = await fetch("http://localhost:8080/api/cuahang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: form.id || null, // ✅ QUAN TRỌNG
          iduser: user?.iduser,
          ten: form.name,
          danhmuc: form.category,
          diaChi: form.address,
          moTa: form.description,
          bankinh: parseInt(form.radius),
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng),
          ngonngu: form.languages.join(","),
          imageThumbnail: thumbnailName,
          imageBanner: bannerName,
          trangThai: 1,
        }),
      });

      if (!response.ok) {
        alert("Lưu thất bại!");
        return;
      }

      const data = await response.json();

      alert("Thêm POI thành công!");

      onSave(data);
      onClose();

    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu!");
    }
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

            {/* ✅ MÃ CỬA HÀNG */}
            <label>Mã cửa hàng</label>
            <input
              name="id"
              value={form.id}
              placeholder="VD: CH001"
              onChange={handleChange}
            />

            <label>Tên POI</label>
            <input name="name" value={form.name} onChange={handleChange} />

            <label>Danh mục</label>
            <input name="category" value={form.category} onChange={handleChange} />

            <label>Mô tả</label>
            <textarea name="description" value={form.description} onChange={handleChange} />

            <label>Địa chỉ</label>
            <input name="address" value={form.address} onChange={handleChange} />

            <label>Bán kính</label>
            <input name="radius" value={form.radius} onChange={handleChange} />
          </div>

          {/* RIGHT */}
          <div className="right">

            {/* MAP */}
            <div className="map-container">
              <MapContainer
                center={[parseFloat(form.lat), parseFloat(form.lng)]}
                zoom={16}
                whenReady={(map) => (mapRef.current = map.target)}
                style={{ height: "284px" }}
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
                  }))}>
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
import "./AudioMapUI.css";
import React, { useState } from "react";

// Leaflet
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix icon lỗi
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Custom icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function AudioMapUI() {
  const position = [10.761869040134481, 106.70223207668656];

  const [showLang, setShowLang] = useState(false);

  const languages = [
    { code: "EN", label: "English" },
    { code: "ES", label: "Español" },
    { code: "FR", label: "Français" },
    { code: "JP", label: "日本語" },
    { code: "VN", label: "Tiếng Việt" },
    { code: "CN", label: "中文" },
  ];

  // 🔥 Dropdown (trên map)
  const [floatingLang, setFloatingLang] = useState({
    code: "VN",
    label: "Tiếng Việt",
  });

  // 🔥 List button (dưới panel) -> riêng biệt
  const [panelLang, setPanelLang] = useState("Tiếng Việt");

  return (
    <div className="amui-container">
      {/* Map */}
      <div className="amui-map">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position} icon={customIcon}>
            <Popup>Tiệm phở anh Hai</Popup>
          </Marker>
        </MapContainer>

        <div className="amui-map-overlay">GPS sẵn sàng</div>

        {/* 🔥 Dropdown trên map */}
        <div
          className="amui-lang-floating"
          onClick={() => setShowLang(!showLang)}
        >
          <span>{floatingLang.code}</span>
          <strong>{floatingLang.label}</strong>
          <span className="arrow">▼</span>

          {showLang && (
            <div className="amui-lang-dropdown">
              {languages.map((lang, i) => (
                <div
                  key={i}
                  className={`amui-lang-item ${
                    lang.code === floatingLang.code ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFloatingLang(lang); // 🔥 chỉ đổi dropdown
                    setShowLang(false);
                  }}
                >
                  {lang.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panel */}
      <div className="amui-panel">
        <div className="amui-panel-header">
          <h2>Tiệm phở anh Hai</h2>
          <p>~17.8 km từ vị trí của bạn</p>
        </div>

        {/* 🔥 List button dưới (KHÔNG liên quan dropdown) */}
        <div className="amui-languages">
          {languages.map((lang, i) => (
            <button
              key={i}
              className={lang.label === panelLang ? "amui-active" : ""}
              onClick={() => setPanelLang(lang.label)}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <p className="amui-description">
          Đây là tiệm phở của anh Hai
        </p>

        <div className="amui-player">
          <div className="amui-status">Đã phát xong</div>
          <button className="amui-replay">Phát lại</button>
        </div>

        <div className="amui-playing">
          <span>ĐANG PHÁT</span>
          <strong>Tiệm phở anh Hai</strong>
        </div>

        <button className="amui-start-btn">▶ Bắt đầu</button>
      </div>
    </div>
  );
}

export default AudioMapUI;
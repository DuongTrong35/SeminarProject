import React, { useState, useEffect } from "react";
import "./SettingsUI.css";
import { useNavigate } from "react-router-dom";
function SettingsUI() {
  const navigate = useNavigate();
  const [lang, setLang] = useState("Tiếng Việt");
  const [showDevice, setShowDevice] = useState(false);
  const languages = [
    { code: "VN", label: "Tiếng Việt" },
    { code: "US", label: "English" },
    { code: "CN", label: "中文" },
    { code: "JP", label: "日本語" },
    { code: "KR", label: "한국어" },
  ];

  const [deviceInfo, setDeviceInfo] = useState({});
  useEffect(() => {
    const getBrowser = () => {
      const ua = navigator.userAgent;

      if (ua.includes("Chrome")) return "Chrome";
      if (ua.includes("Firefox")) return "Firefox";
      if (ua.includes("Safari")) return "Safari";
      if (ua.includes("Edge")) return "Edge";
      return "Unknown";
    };

    const info = {
      deviceId: crypto.randomUUID(),

      platform: navigator.platform,

      browser: getBrowser(),

      vendor: navigator.vendor,

      screen: `${window.screen.width}x${window.screen.height}`,

      colorDepth: window.screen.colorDepth + " bit",

      language: navigator.language,

      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

      connection: navigator.connection
        ? navigator.connection.effectiveType.toUpperCase()
        : "Unknown",

      cookies: navigator.cookieEnabled ? "Enabled" : "Disabled",

      memory: navigator.deviceMemory
        ? navigator.deviceMemory + " GB"
        : "Unknown",

      cpu: navigator.hardwareConcurrency
        ? navigator.hardwareConcurrency + " cores"
        : "Unknown",
    };

    setDeviceInfo(info);
  }, []);

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <button onClick={() => navigate(-1)}>←</button>
        <h2>Cài đặt</h2>
      </div>

      <div className="settings-content">
        {/* User */}
        <div className="settings-card user-card">
          <div className="user-left">
            <div className="avatar">👤</div>
            <div>
              <h3>Khách du lịch</h3>
              <button className="link-btn">Liên kết tài khoản</button>
            </div>
          </div>
        </div>

        {/* Language */}
        <h4 className="section-title">NGÔN NGỮ</h4>

        <div className="settings-card">
          {languages.map((l, i) => (
            <div
              key={i}
              className={`lang-item ${lang === l.label ? "active" : ""}`}
              onClick={() => setLang(l.label)}
            >
              <span>{l.code}</span>
              <p>{l.label}</p>

              {lang === l.label && <div className="check">✓</div>}
            </div>
          ))}
        </div>

        {/* App Info */}
        <h4 className="section-title">THÔNG TIN ỨNG DỤNG</h4>

        <div className="settings-card">
          <div className="info-row">
            <span>Phiên bản</span>
            <strong>1.0.0</strong>
          </div>

          <div className="info-row">
            <span>Phố Ẩm Thực Vĩnh Khánh</span>
            <strong className="beta">Beta</strong>
          </div>
        </div>

        {/* Device */}
        <h4 className="section-title">THÔNG TIN THIẾT BỊ</h4>

        <div
          className="settings-card clickable"
          onClick={() => setShowDevice(!showDevice)}
        >
          <div className="info-row">
            <span>📱 Xem chi tiết thiết bị</span>

            <span className={showDevice ? "arrow rotate" : "arrow"}>⌄</span>
          </div>
        </div>
        {showDevice && (
          <div className="settings-card device-detail">
            <div className="info-row">
              <span>Device ID</span>
              <strong>{deviceInfo.deviceId}</strong>
            </div>

            <div className="info-row">
              <span>Platform</span>
              <strong>{deviceInfo.platform}</strong>
            </div>

            <div className="info-row">
              <span>Browser</span>
              <strong>{deviceInfo.browser}</strong>
            </div>

            <div className="info-row">
              <span>Vendor</span>
              <strong>{deviceInfo.vendor}</strong>
            </div>

            <div className="info-row">
              <span>Màn hình</span>
              <strong>{deviceInfo.screen}</strong>
            </div>

            <div className="info-row">
              <span>Color depth</span>
              <strong>{deviceInfo.colorDepth}</strong>
            </div>

            <div className="info-row">
              <span>Ngôn ngữ</span>
              <strong>{deviceInfo.language}</strong>
            </div>

            <div className="info-row">
              <span>Múi giờ</span>
              <strong>{deviceInfo.timezone}</strong>
            </div>

            <div className="info-row">
              <span>Tốc độ mạng</span>
<strong>{deviceInfo.connection}</strong>
            </div>

            <div className="info-row">
              <span>Cookies</span>
              <strong>{deviceInfo.cookies}</strong>
            </div>

            <div className="info-row">
              <span>Bộ nhớ</span>
              <strong>{deviceInfo.memory}</strong>
            </div>

            <div className="info-row">
              <span>CPU</span>
              <strong>{deviceInfo.cpu}</strong>
            </div>
          </div>
        )}
        {/* Partner */}
        <div className="settings-card partner">
          <div>
            <h5>GÓC ĐỐI TÁC</h5>
            <h3>Trung tâm đối tác nhà hàng</h3>
            <p>Quản lý nội dung giới thiệu, menu...</p>
          </div>

          <div className="icon">🏪</div>
        </div>

        {/* Payment */}
        <div className="settings-card">
          <div className="info-row">
            <div>
              <h3>Xem hóa đơn</h3>
              <p>Đặt món ăn</p>
            </div>

            <div className="icon dark">🧾</div>
          </div>
        </div>

        {/* Buttons */}
        <button className="save-btn">Lưu cài đặt</button>

        <button className="logout-btn">Đăng xuất tài khoản</button>
      </div>

      <div className="amui-bottom-nav" 
        onClick={() => navigate("/mhuserfree")}

      >
        <div className="amui-nav-item">
          <span>🗺️</span>
          <p>BẢN ĐỒ</p>
        </div>

        {/* <div className="amui-nav-item">
          <span>📍</span>
          <p>LỘ TRÌNH</p>
        </div>

        <div className="amui-nav-item">
          <span>⬇️</span>
          <p>TẢI OFFLINE</p>
        </div> */}

        <div className="amui-nav-item active">
          <span>👤</span>
          <p>TÔI</p>
        </div>
      </div>
    </div>
  );
}

export default SettingsUI;

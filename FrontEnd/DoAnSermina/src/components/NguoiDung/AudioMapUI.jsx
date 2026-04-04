import "./AudioMapUI.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Leaflet
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Fix icon shadow
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// 🔴 ICON ĐỎ
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🔵 ICON XANH
const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🔥 Auto focus map
function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position]);
  return null;
}

function AudioMapUI() {
  const navigate = useNavigate();
  const [position, setPosition] = useState([10.761992635455506, 106.7022316837637]);
  // const [position, setPosition] = useState([10.76, 106.7]);
  const [showLang, setShowLang] = useState(false);
  const [shop, setShop] = useState(null);
  const [route, setRoute] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioObj, setAudioObj] = useState(null);
  const [tourShops, setTourShops] = useState([]);

  const [isMoving, setIsMoving] = useState(false);
const startSimulation = () => {
  if (!route.length) return;

  setIsMoving(true);

  let i = 0;

  const interval = setInterval(() => {
    if (i >= route.length) {
      clearInterval(interval);
      setIsMoving(false);
      return;
    }

    setPosition(route[i]);
    i++;
  }, 500); // tốc độ di chuyển (ms)
};

  // ⭐ POPUP TOUR
  const [showTourModal, setShowTourModal] = useState(true);
  const [hasTour, setHasTour] = useState(null);

  // ⭐ SIDEBAR TOUR
  const [showTourList, setShowTourList] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  
  const [tours, setTours] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/tours")
      .then((res) => {
        setTours(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const [floatingLang, setFloatingLang] = useState({
    code: "VN",
    label: "Tiếng Việt",
  });

  const [panelLang, setPanelLang] = useState("Tiếng Việt");

  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () =>
      window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
  setPosition([10.761992635455506, 106.7022316837637]);
}, []);
  // useEffect(() => {
  //   const watchId = navigator.geolocation.watchPosition(
  //     (pos) => {
  //       setPosition([pos.coords.latitude, pos.coords.longitude]);
  //     },
  //     (err) => console.error(err),
  //     { enableHighAccuracy: true }
  //   );

  //   return () => navigator.geolocation.clearWatch(watchId);
  // }, []);

  useEffect(() => {
    if (!selectedTour) return;

    axios
      .get(`http://localhost:8080/api/admin/tours/${selectedTour.id}/cuahangs`)
      .then((res) => {
        setTourShops(res.data);

        // set shop đầu tiên để panel vẫn chạy
        if (res.data.length > 0) {
          setShop(res.data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [selectedTour]);
  // ⭐ LOAD SHOP MẶC ĐỊNH (QUAN TRỌNG)
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8080/api/cuahang/ch1") // chọn mặc định
  //     .then((res) => setShop(res.data))
  //     .catch((err) => console.error(err));
  // }, []);
  
  useEffect(() => {
  if (tourShops.length === 0) return;

  const coordinates = [
    `${position[1]},${position[0]}`, // vị trí hiện tại
    ...tourShops.map((s) => `${s.lng},${s.lat}`),
  ].join(";");

  // ❌ BỎ steps=true (gây chia đoạn)
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data.routes || data.routes.length === 0) return;

      // ✅ chỉ lấy route đầu tiên
      let coords = data.routes[0].geometry.coordinates;

      // ✅ FIX: loại bỏ điểm trùng (tránh vẽ 2 đường)
      const cleanCoords = [];
      for (let i = 0; i < coords.length; i++) {
        if (
          i === 0 ||
          coords[i][0] !== coords[i - 1][0] ||
          coords[i][1] !== coords[i - 1][1]
        ) {
          cleanCoords.push(coords[i]);
        }
      }

      // convert lng,lat -> lat,lng
      const finalRoute = cleanCoords.map((c) => [c[1], c[0]]);

      setRoute(finalRoute);
    })
    .catch((err) => console.error(err));
}, [tourShops, position]);

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  const distance =
    shop && getDistance(position[0], position[1], shop.lat, shop.lng);

  const dbLanguages =
    shop?.ngonngu?.split(",").map((l) => ({
      code: l,
      label: l,
    })) || [];

  const speakText = async (text, langCode) => {
    if (!text) return;

    setIsSpeaking(true);

    try {
      const targetLang = langCode === "EN" ? "en" : "vi";
      let finalText = text;

      if (targetLang !== "vi") {
        const res = await fetch(
          `http://localhost:8080/api/translate/translate?text=${encodeURIComponent(
            text
          )}&target=${targetLang}`
        );
        const data = await res.json();
        finalText = data?.translatedText || text;
      }

      const audioRes = await fetch(
        `http://localhost:8080/api/tts?text=${encodeURIComponent(
          finalText
        )}&lang=${targetLang}`
      );

      const blob = await audioRes.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      setAudioObj(audio);

      audio.play();
      audio.onended = () => setIsSpeaking(false);
    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
    }
  };

  const stopSpeak = () => {
    window.speechSynthesis.cancel();

    if (audioObj) {
      audioObj.pause();
      audioObj.currentTime = 0;
    }

    setIsSpeaking(false);
  };


  const handleSelectShop = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/cuahang/${id}`
    );

    setShop(res.data); // 🔥 cập nhật panel
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="amui-container">
      {/* ⭐ POPUP TOUR */}
      {showTourModal && (
        <div className="amui-modal-overlay">
          <div className="amui-modal-box">
            <h2>Bạn có muốn chọn tour không?</h2>

            <div className="amui-modal-buttons">
              <button
                className="amui-btn yes"
                onClick={() => {
                  setHasTour(true);
                  setShowTourModal(false);
                  setShowTourList(true);
                }}
              >
                Có
              </button>

              <button
  className="amui-btn no"
  onClick={() => {
    setShowTourModal(false);
    navigate("/mhuserfree");
  }}
>
  Không
</button>
            </div>
          </div>
        </div>
      )}

      {/* ⭐ OVERLAY */}
      {showTourList && (
        <div className="amui-overlay" onClick={() => setShowTourList(false)} />
      )}

      {/* ⭐ SIDEBAR */}
      <div className={`amui-tour-sidebar ${showTourList ? "open" : ""}`}>
        <div className="amui-tour-header">
          <h3>Chọn tour</h3>
          <button onClick={() => setShowTourList(false)}>✕</button>
        </div>

        <div className="amui-tour-list">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="amui-tour-item"
              onClick={() => {
                setSelectedTour(tour);
              }}
            >
              <b>{tour.tenTour}</b>
              <p>{tour.moTa}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MAP */}
      <div className="amui-map">
        <MapContainer center={position} zoom={15} style={{ height: "100%" }}>
          <RecenterMap position={position} />

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={position} icon={blueIcon}>
            <Popup>Vị trí của bạn</Popup>
          </Marker>

       {tourShops.map((s, index) => (
  <Marker
    key={index}
    position={[s.lat, s.lng]}
    icon={redIcon}
    eventHandlers={{
      click: () => handleSelectShop(s.id),
    }}
  >
    <Popup>{s.ten}</Popup>
  </Marker>
))}

          {route.length > 0 && <Polyline positions={route} color="blue" />}
        </MapContainer>

        <div className="amui-map-overlay">GPS đang bật</div>

        {/* ⭐ GROUP TOP RIGHT */}
        <div className="amui-top-right-controls">
          {/* 🌐 LANGUAGE */}
          <div
            className="amui-lang-floating"
            onClick={() => setShowLang(!showLang)}
          >
            <span>{floatingLang.code}</span>
            <strong>{floatingLang.label}</strong>

            {showLang && (
              <div className="amui-lang-dropdown">
                {dbLanguages.map((lang, i) => (
                  <div
                    key={i}
                    className="amui-lang-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFloatingLang(lang);
                      setShowLang(false);
                    }}
                  >
                    {lang.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🍜 TOUR BUTTON */}
          <button
            className="amui-tour-btn"
            onClick={() => setShowTourList(true)}
          >
            ☰ Tour
          </button>
        </div>
      </div>

      {/* PANEL */}
      <div className="amui-panel">
        <div className="amui-panel-header">
          <h2>{shop?.ten || "Đang tải..."}</h2>
          <p>
            {distance
              ? `${distance.toFixed(2)} km từ vị trí của bạn`
              : "Đang tính..."}
          </p>
        </div>

        <div className="amui-languages">
          {dbLanguages.map((lang, i) => (
            <button
              key={i}
              className={lang.label === panelLang ? "amui-active" : ""}
              onClick={() => setPanelLang(lang.label)}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <p className="amui-description">{shop?.moTa || "Đang tải mô tả..."}</p>

        <div className="amui-player">
          <div className="amui-status">
            {isSpeaking ? "Đang phát..." : "Đã phát xong"}
          </div>

          <div>
            <button
              className="amui-replay"
              onClick={() =>
                speakText(shop?.moTa, panelLang === "Tiếng Việt" ? "vi" : "en")
              }
            >
              Phát lại
            </button>

            <button className="amui-replay" onClick={stopSpeak}>
              Dừng
            </button>
          </div>
        </div>

        <div className="amui-playing">
          <span>ĐANG PHÁT</span>
          <strong>{shop?.ten}</strong>
        </div>

<button 
  className="amui-start-btn"
  onClick={startSimulation}
>
  ▶ Bắt đầu
</button>      </div>
    </div>
  );
}

export default AudioMapUI;

import "./AudioMapFreeUI.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Circle } from "react-leaflet";
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

function AudioMapFreeUI() {
    const navigate = useNavigate();
  
      const [position, setPosition] = useState([10.761992635455506, 106.7022316837637]);
    
//   const [position, setPosition] = useState([10.76, 106.7]);
  const [showLang, setShowLang] = useState(false);
const [shops, setShops] = useState([]);
  const [route, setRoute] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

const [selectedShop, setSelectedShop] = useState(null);


  const moveStep = 0.0005; // độ nhảy (có thể chỉnh lớn nhỏ)

  const moveUp = () => {
    setPosition([position[0] + moveStep, position[1]]);
  };

  const moveDown = () => {
    setPosition([position[0] - moveStep, position[1]]);
  };

  const moveLeft = () => {
    setPosition([position[0], position[1] - moveStep]);
  };

  const moveRight = () => {
    setPosition([position[0], position[1] + moveStep]);
  };

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
  // 🔥 LOAD VOICES
  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  // 🔥 SPEAK THEO NGÔN NGỮ
  const [audioObj, setAudioObj] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speakText = async (text, langCode) => {
    if (!text) return;

    setIsSpeaking(true);

    try {
      // ===== LANGUAGE =====
      const targetLang = langCode === "EN" ? "en" : "vi";

      // ===== TRANSLATE =====
      let finalText = text;

      if (targetLang !== "vi") {
        const res = await fetch(
          `http://localhost:8080/api/translate/translate?text=${encodeURIComponent(
            text
          )}&target=${targetLang}`
        );

        if (!res.ok) throw new Error("Translate lỗi");

        const data = await res.json();

        finalText = data?.[0]?.map((item) => item?.[0]).join("") || text;
      }

      console.log("FINAL TEXT:", finalText);

      // ===== TTS =====
      const audioRes = await fetch(
        `http://localhost:8080/api/tts?text=${encodeURIComponent(
          finalText
        )}&lang=${targetLang}`
      );

      if (!audioRes.ok) throw new Error("TTS lỗi backend");

      const blob = await audioRes.blob();

      if (!blob || blob.size === 0) {
        throw new Error("Audio rỗng");
      }

      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);

      setAudioObj(audio);

      audio.play();

      audio.onended = () => {
        setIsSpeaking(false);
      };
    } catch (err) {
      console.error("❌ SPEAK ERROR:", err);
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

  // 🔥 GPS REALTIME
//   useEffect(() => {
//     const watchId = navigator.geolocation.watchPosition(
//       (pos) => {
//         setPosition([pos.coords.latitude, pos.coords.longitude]);
//       },
//       (err) => console.error(err),
//       { enableHighAccuracy: true }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);
useEffect(() => {
  setPosition([10.761992635455506, 106.7022316837637]);
}, []);
  // 🔥 API
  useEffect(() => {
  axios
    .get("http://localhost:8080/api/cuahang")
    .then((res) => setShops(res.data))
    .catch((err) => console.error(err));
}, []);

  // 🔥 ROUTE
  useEffect(() => {
    if (!selectedShop) return;

const url = `https://router.project-osrm.org/route/v1/driving/${position[1]},${position[0]};${selectedShop.lng},${selectedShop.lat}?overview=full&geometries=geojson`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (!data.routes?.length) return;
        const coords = data.routes[0].geometry.coordinates;
        setRoute(coords.map((c) => [c[1], c[0]]));
      });
  }, [selectedShop, position]);


 const visibleShops = shops.filter((s) => {
  const distance = getDistance(
    position[0],
    position[1],
    s.lat,
    s.lng
  );

  return distance <= s.bankinh / 1000;
});
useEffect(() => {
  if (!visibleShops.length) {
    setSelectedShop(null);
    return;
  }

  let nearest = visibleShops[0];
  let minDistance = Infinity;

  visibleShops.forEach((s) => {
    const d = getDistance(
      position[0],
      position[1],
      s.lat,
      s.lng
    );

    if (d < minDistance) {
      minDistance = d;
      nearest = s;
    }
  });

  setSelectedShop(nearest);

}, [position, visibleShops]);
  // 🔥 DISTANCE
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
  selectedShop &&
  getDistance(
    position[0],
    position[1],
    selectedShop.lat,
    selectedShop.lng
  );

  const dbLanguages =
  selectedShop?.ngonngu?.split(",").map((l) => ({
    code: l,
    label: l,
  })) || [];

  const [floatingLang, setFloatingLang] = useState({
    code: "VN",
    label: "Tiếng Việt",
  });

  const [panelLang, setPanelLang] = useState("Tiếng Việt");

  return (
    <div className="amui-container">
      <div className="amui-map">
        <div className="amui-controller">
  <div></div>
  <button onClick={moveUp}>▲</button>
  <div></div>

  <button onClick={moveLeft}>◀</button>
  <div></div>
  <button onClick={moveRight}>▶</button>

  <div></div>
  <button onClick={moveDown}>▼</button>
  <div></div>
</div>
        <MapContainer center={position} zoom={15} style={{ height: "100%" }}>
          <RecenterMap position={position} />

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={position} icon={blueIcon}>
            <Popup>Vị trí của bạn</Popup>
          </Marker>

        {visibleShops.map((s, index) => (
  <React.Fragment key={index}>
    <Marker position={[s.lat, s.lng]} icon={redIcon}>
      <Popup>{s.ten}</Popup>
    </Marker>

    <Circle
      center={[s.lat, s.lng]}
      radius={s.bankinh}
      pathOptions={{ color: "red" }}
    />
  </React.Fragment>
))}

          {route.length > 0 && <Polyline positions={route} color="blue" />}
        </MapContainer>

        <div className="amui-map-overlay">GPS đang bật</div>
 <button
    className="amui-back-floating"
onClick={() => navigate("/mhuser")}  >
    QUAY LẠI
  </button>
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
      </div>

      <div className="amui-panel">
        <div className="amui-panel-header">
          <h2>{selectedShop?.ten || "Đang tải..."}</h2>
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
        <p className="amui-description">{selectedShop?.moTa || "Đang tải mô tả..."}</p>
        {/* 🔊 PLAYER */}
        <div className="amui-player">
          <div className="amui-status">
            {isSpeaking ? "Đang phát..." : "Đã phát xong"}
          </div>

          <div>
            <button
              className="amui-replay"
              onClick={() =>
                speakText(selectedShop?.moTa, panelLang === "Tiếng Việt" ? "vi" : "en")
              }
            >
              Phát lại
            </button>

            <button
              className="amui-replay"
              onClick={stopSpeak}
              style={{ marginLeft: 10 }}
            >
              Dừng
            </button>
          </div>
        </div>
        <div className="amui-playing">
          <span>ĐANG PHÁT</span>
          <strong>{selectedShop?.ten}</strong>
        </div>
        <button className="amui-start-btn" onClick={startSimulation}>
          ▶ Bắt đầu
        </button>{" "}
      </div>
    </div>
  );
}

export default AudioMapFreeUI;

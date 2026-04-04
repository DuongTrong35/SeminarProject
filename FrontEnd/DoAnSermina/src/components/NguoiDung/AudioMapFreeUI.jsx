import "./AudioMapFreeUI.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Circle } from "react-leaflet";
import { useNavigate } from "react-router-dom";

// Leaflet
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    map.setView(position);
  }, [position]);
  return null;
}

// TỪ ĐIỂN NGÔN NGỮ ĐỂ NGOÀI FUNCTION
const langCodeMap = {
  "Tiếng Việt": "vi", "Vietnamese": "vi",
  "English": "en", 
  "French": "fr", 
  "Spanish": "es",
  "Portuguese": "pt",
  "German": "de",
  "Japanese": "ja",
  "Chinese (Simplified)": "zh-CN",
  "Korean": "ko",
  "Italian": "it",
  "Russian": "ru",
  "Thai": "th",
};

function AudioMapFreeUI() {
  const navigate = useNavigate();

  // TẤT CẢ CÁC STATE NẰM Ở ĐÂY
  const [position, setPosition] = useState([10.761992635455506, 106.7022316837637]);
  const [showLang, setShowLang] = useState(false);
  const [shops, setShops] = useState([]);
  const [route, setRoute] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isMoving, setIsMoving] = useState(false);
  const [audioObj, setAudioObj] = useState(null);
  const [floatingLang, setFloatingLang] = useState({ code: "VN", label: "Tiếng Việt" });
  
  // STATE CHO ĐA NGÔN NGỮ
  const [panelLang, setPanelLang] = useState("Tiếng Việt");
  const [displayTitle, setDisplayTitle] = useState("");
  const [displayDesc, setDisplayDesc] = useState("");

  const moveStep = 0.0005;
  const moveUp = () => setPosition([position[0] + moveStep, position[1]]);
  const moveDown = () => setPosition([position[0] - moveStep, position[1]]);
  const moveLeft = () => setPosition([position[0], position[1] - moveStep]);
  const moveRight = () => setPosition([position[0], position[1] + moveStep]);

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
    }, 500);
  };

  useEffect(() => {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }, []);

  // API TẢI QUÁN
  useEffect(() => {
    axios.get("http://localhost:8080/api/cuahang")
      .then((res) => setShops(res.data))
      .catch((err) => console.error(err));
  }, []);

  // LẤY ĐƯỜNG ĐI TỪ OSRM
  useEffect(() => {
    if (!selectedShop) return;
    const url = `https://router.project-project-osrm.org/route/v1/driving/${position[1]},${position[0]};${selectedShop.lng},${selectedShop.lat}?overview=full&geometries=geojson`;
    fetch(url)
      .then((res) => {
          if (!res.ok) throw new Error("OSRM quá tải!");
          return res.json();
      })
      .then((data) => {
        if (!data.routes?.length) return;
        const coords = data.routes[0].geometry.coordinates;
        setRoute(coords.map((c) => [c[1], c[0]]));
      }).catch(err => console.error(err));
  }, [selectedShop]); // Không spam API OSRM nữa

  // TÌM QUÁN GẦN NHẤT
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  const visibleShops = shops.filter((s) => getDistance(position[0], position[1], s.lat, s.lng) <= s.bankinh / 1000);

  useEffect(() => {
    if (!visibleShops.length) {
      setSelectedShop(null);
      return;
    }
    let nearest = visibleShops[0];
    let minDistance = Infinity;
    visibleShops.forEach((s) => {
      const d = getDistance(position[0], position[1], s.lat, s.lng);
      if (d < minDistance) { minDistance = d; nearest = s; }
    });
    setSelectedShop(nearest);
  }, [position, visibleShops]);

  const distance = selectedShop && getDistance(position[0], position[1], selectedShop.lat, selectedShop.lng);
  
  // Tự động bỏ khoảng trắng dư trong database
  const dbLanguages = selectedShop?.ngonngu?.split(",").map((l) => ({ code: l.trim(), label: l.trim() })) || [];

  // ==========================================
  // LOGIC DỊCH NGÔN NGỮ (CHỈ DỊCH MÔ TẢ, TÊN QUÁN GIỮ NGUYÊN)
  // ==========================================
  useEffect(() => {
    if (!selectedShop) {
        setDisplayTitle("Đang tải...");
        setDisplayDesc("Đang tải mô tả...");
        return;
    }

    // 1. LUÔN LUÔN GIỮ NGUYÊN TÊN QUÁN GỐC BẰNG TIẾNG VIỆT
    setDisplayTitle(selectedShop.ten);

    const targetLangCode = langCodeMap[panelLang] || "vi";

    if (targetLangCode === "vi") {
      setDisplayDesc(selectedShop.moTa); 
    } else {
      setDisplayDesc(`Đang dịch sang ${panelLang}...`);
      
      const fetchTranslations = async () => {
         try {
             // 2. CHỈ GỌI API DỊCH ĐOẠN MÔ TẢ
             const resDesc = await fetch(`http://localhost:8080/api/translate?text=${encodeURIComponent(selectedShop.moTa)}&to=${targetLangCode}`);
             const dataDesc = await resDesc.json();
             
             setDisplayDesc(dataDesc.translatedText || "Lỗi khi dịch");
         } catch (error) {
             console.error("❌ Lỗi fetch dịch thuật:", error);
             setDisplayDesc("Lỗi dịch thuật, không kết nối được Backend");
         }
      };

      fetchTranslations();
    }
  }, [selectedShop, panelLang]);

  // ==========================================
  // LOGIC PHÁT ÂM THANH (CHỈ ĐỌC MÔ TẢ)
  // ==========================================
  const speakText = async () => {
    if (!displayDesc || displayDesc.includes("Đang dịch")) return;
    setIsSpeaking(true);

    try {
      const targetLangCode = langCodeMap[panelLang] || "vi";
      
      // 🔥 CHỈ ĐỌC MỖI ĐOẠN MÔ TẢ ĐÃ ĐƯỢC DỊCH
      const textToRead = displayDesc;
      
      const audioRes = await fetch(`http://localhost:8080/api/tts?text=${encodeURIComponent(textToRead)}&lang=${targetLangCode}`);
      
      if (!audioRes.ok) throw new Error("Backend lỗi TTS");

      const blob = await audioRes.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setAudioObj(audio);

      audio.play();
      audio.onended = () => setIsSpeaking(false);

    } catch (err) {
      console.error(err);
      setIsSpeaking(false);
      alert("Lỗi phát âm thanh!");
    }
  };

  const stopSpeak = () => {
    if (audioObj) { audioObj.pause(); audioObj.currentTime = 0; }
    setIsSpeaking(false);
  };

  return (
    <div className="amui-container">
      <div className="amui-map">
        {/* Bản đồ và các nút */}
        <div className="amui-controller">
          <div></div><button onClick={moveUp}>▲</button><div></div>
          <button onClick={moveLeft}>◀</button><div></div><button onClick={moveRight}>▶</button>
          <div></div><button onClick={moveDown}>▼</button><div></div>
        </div>
        <MapContainer center={position} zoom={15} style={{ height: "100%" }}>
          <RecenterMap position={position} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position} icon={blueIcon}><Popup>Vị trí của bạn</Popup></Marker>
          {visibleShops.map((s, index) => (
            <React.Fragment key={index}>
              <Marker position={[s.lat, s.lng]} icon={redIcon}><Popup>{s.ten}</Popup></Marker>
              <Circle center={[s.lat, s.lng]} radius={s.bankinh} pathOptions={{ color: "red" }} />
            </React.Fragment>
          ))}
          {route.length > 0 && <Polyline positions={route} color="blue" />}
        </MapContainer>
        <div className="amui-map-overlay">GPS đang bật</div>
        <button className="amui-back-floating" onClick={() => navigate("/mhuser")}>QUAY LẠI</button>
        
        {/* Nút chọn ngôn ngữ góc phải trên */}
        <div className="amui-lang-floating" onClick={() => setShowLang(!showLang)}>
          <span>{floatingLang.code}</span><strong>{floatingLang.label}</strong>
          {showLang && (
            <div className="amui-lang-dropdown">
              {dbLanguages.map((lang, i) => (
                <div key={i} className="amui-lang-item" onClick={(e) => { e.stopPropagation(); setFloatingLang(lang); setShowLang(false); }}>
                  {lang.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="amui-panel">
        <div className="amui-panel-header">
          <h2>{displayTitle}</h2>
          <p>{distance ? `${distance.toFixed(2)} km từ vị trí của bạn` : "Đang tính..."}</p>
        </div>
        
        {/* NÚT CHỌN NGÔN NGỮ ĐỂ DỊCH VÀ ĐỌC */}
        <div className="amui-languages">
          {dbLanguages.map((lang, i) => (
            <button key={i} className={lang.label === panelLang ? "amui-active" : ""} onClick={() => setPanelLang(lang.label)}>
              {lang.label}
            </button>
          ))}
        </div>
        
        {/* CHỖ IN MÔ TẢ ĐÃ DỊCH */}
        <p className="amui-description">{displayDesc}</p>
        
        <div className="amui-player">
          <div className="amui-status">{isSpeaking ? "Đang phát..." : "Đã phát xong"}</div>
          <div>
            <button className="amui-replay" onClick={speakText}>Phát lại</button>
            <button className="amui-replay" onClick={stopSpeak} style={{ marginLeft: 10 }}>Dừng</button>
          </div>
        </div>

        <div className="amui-playing">
          <span>ĐANG PHÁT</span>
          <strong>{displayTitle}</strong>
        </div>
        <button className="amui-start-btn" onClick={startSimulation}>▶ Bắt đầu</button>
      </div>
    </div>
  );
}

export default AudioMapFreeUI;
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import { FaArrowLeft } from "react-icons/fa";
import { AiFillHome } from 'react-icons/ai';
import { GiKnifeFork } from 'react-icons/gi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FiVolume2 } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

const NOMINATIM_SEARCH = "https://nominatim.openstreetmap.org/search";

async function fetchNominatim(query, limit = 6) {
  const url = `${NOMINATIM_SEARCH}?format=json&addressdetails=1&limit=${limit}&dedupe=1&q=${encodeURIComponent(
    query
  )}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Không thể kết nối tới dịch vụ tìm kiếm.");
  const data = await res.json();
  return data.map((item) => ({
    label: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
}

function Routing({ start, end, onRouteFound, onRouteError }) {
  const map = useMap();
  const controlRef = useRef(null);

  const createStyledMarker = (label, color) =>
    L.divIcon({
      html: `<div style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:${color};color:#fff;font-weight:800;font-size:14px;border:2px solid rgba(255,255,255,0.9);box-shadow:0 5px 18px rgba(0,0,0,0.25);">${label}</div>`,
      className: "custom-marker",
      iconSize: [34, 34],
      iconAnchor: [17, 34],
    });

  useEffect(() => {
    if (!start || !end) return;
    if (controlRef.current) {
      controlRef.current.off();
      map.removeControl(controlRef.current);
    }

    controlRef.current = L.Routing.control({
      waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
      lineOptions: {
        styles: [{ color: "#ff6b35", weight: 7, opacity: 0.88 }],
      },
      showAlternatives: false,
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoute: false,
      createMarker: (i, wp) => {
        const isStart = i === 0;
        const marker = L.marker(wp.latLng, {
          icon: createStyledMarker(isStart ? "S" : "D", isStart ? "#1abc9c" : "#e74c3c"),
        });
        marker.bindPopup(isStart ? "Điểm bắt đầu" : "Điểm đến");
        return marker;
      },
    }).addTo(map);

    controlRef.current.on("routesfound", (evt) => {
      const route = evt.routes[0];
      if (route && route.bounds) {
        map.flyToBounds(route.bounds, { padding: [60, 60], duration: 1.2 });
      }
      onRouteFound && onRouteFound(route);
    });

    controlRef.current.on("routingerror", (err) => {
      onRouteError && onRouteError(err);
    });

    return () => {
      if (controlRef.current) {
        controlRef.current.off();
        map.removeControl(controlRef.current);
      }
    };
  }, [map, start, end, onRouteFound, onRouteError]);

  return null;
}

function MapInitializer({ map }) {
  useEffect(() => {
    if (!map) return;
    map.invalidateSize();
  }, [map]);

  return null;
}

function DirectionsPage() {
      const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  
    useEffect(() => {
      const onScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }, []);
  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [routeCoords, setRouteCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapInstance, setMapInstance] = useState(null);

  const startTimeout = useRef(null);
  const endTimeout = useRef(null);

  const resetRoute = () => {
    setRouteCoords(null);
    setError("");
  };

  useEffect(() => {
    if (!startQuery.trim()) {
      setStartSuggestions([]);
      return;
    }

    clearTimeout(startTimeout.current);
    startTimeout.current = setTimeout(async () => {
      try {
        const results = await fetchNominatim(startQuery);
        setStartSuggestions(results);
      } catch {
        setStartSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(startTimeout.current);
  }, [startQuery]);

  useEffect(() => {
    if (!endQuery.trim()) {
      setEndSuggestions([]);
      return;
    }

    clearTimeout(endTimeout.current);
    endTimeout.current = setTimeout(async () => {
      try {
        const results = await fetchNominatim(endQuery);
        setEndSuggestions(results);
      } catch {
        setEndSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(endTimeout.current);
  }, [endQuery]);

  const selectSuggestion = (type, item) => {
    if (type === "start") {
      setStartQuery(item.label);
      setStartCoords({ lat: item.lat, lng: item.lng });
      setStartSuggestions([]);
    } else {
      setEndQuery(item.label);
      setEndCoords({ lat: item.lat, lng: item.lng });
      setEndSuggestions([]);
    }
    resetRoute();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setRouteCoords(null);

    if (!startQuery.trim() || !endQuery.trim()) {
      setError("Vui lòng nhập điểm bắt đầu và điểm đến.");
      return;
    }

    setIsLoading(true);

    try {
      const start =
        startCoords && startCoords.label === startQuery
          ? startCoords
          : (await fetchNominatim(startQuery, 1))[0];
      const end =
        endCoords && endCoords.label === endQuery
          ? endCoords
          : (await fetchNominatim(endQuery, 1))[0];
      if (!start || !end) throw new Error("Không tìm thấy điểm khởi hành hoặc điểm đến.");
      setStartCoords(start);
      setEndCoords(end);
      setRouteCoords({ start, end });
    } catch (err) {
      setError(err.message || "Xảy ra lỗi khi tìm đường.");
      setIsLoading(false);
    }
  };

  const handleRouteFound = () => {
    setIsLoading(false);
    setError("");
  };

  const handleRouteError = () => {
    setIsLoading(false);
    setError("Không tìm thấy lộ trình phù hợp. Vui lòng thử lại với điểm khác.");
  };

  const defaultCenter = { lat: 10.7579, lng: 106.6887 };

  // Ensure Leaflet map layout is correct when the container becomes visible
  useEffect(() => {
    if (!mapInstance) return;
    mapInstance.invalidateSize();
  }, [mapInstance]);

  return (
    <>
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <div className="logo">Vinh Khanh Food Tour</div>
        <ul className="menu">
          
          <li>
            <a href="#">
              <AiFillHome /> Home
            </a>
          </li>
          <li>
            <a href="#food-directory">
              <GiKnifeFork /> Food
            </a>
          </li>
          {/* <li>
            <a href="#">
              <FaMapMarkerAlt /> Map
            </a>
          </li> */}
          <li>
            <a href="#">
              <FiVolume2 /> Audio Guide
            </a>
          </li>
          <li  onClick={() => navigate("/login")}
        style={{ cursor: "pointer" }}>
            <a href="#">
              <AiFillHome /> Đăng nhập
            </a>
          </li>
        </ul>
      </div>
    </nav>
    <main className="directions-page">
      <section className="directions-hero">
        <button className="btn back-btn" onClick={() => navigate(-1)}>
  <FaArrowLeft /> Quay lại
</button>
        <h1>Chỉ đường đến đường Ẩm thực Vinh Khánh</h1>
        <div className="directions-card">
          <form className="directions-form" onSubmit={handleSearch} autoComplete="off">
            <div className="input-group">
              <div className="input-icon">📍</div>
              <input
                value={startQuery}
                onChange={(e) => setStartQuery(e.target.value)}
                placeholder="Nhập điểm bắt đầu"
              />
              {startSuggestions.length > 0 && (
                <ul className="suggestions">
                  {startSuggestions.map((item) => (
                    <li key={`${item.lat}-${item.lng}`} onClick={() => selectSuggestion("start", item)}>
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="input-group">
              <div className="input-icon">🧭</div>
              <input
                value={endQuery}
                onChange={(e) => setEndQuery(e.target.value)}
                placeholder="Nhập điểm đến"
              />
              {endSuggestions.length > 0 && (
                <ul className="suggestions">
                  {endSuggestions.map((item) => (
                    <li key={`${item.lat}-${item.lng}`} onClick={() => selectSuggestion("end", item)}>
                      {item.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="btn primary" type="submit" disabled={isLoading}>
              {isLoading ? "Đang tìm..." : "Tìm"}
            </button>

            {error && <p className="directions-error">{error}</p>}
          </form>
        </div>
      </section>

      <section className="directions-map">
        <div className="map-wrapper">
          <MapContainer
            center={defaultCenter}
            zoom={14}
            scrollWheelZoom={true}
            zoomControl={false}
            whenCreated={setMapInstance}
            style={{ height: "100%", width: "100%" }}
          >
            <ZoomControl position="topright" />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {routeCoords && (
              <Routing
                start={routeCoords.start}
                end={routeCoords.end}
                onRouteFound={handleRouteFound}
                onRouteError={handleRouteError}
              />
            )}
          </MapContainer>

          {mapInstance && <MapInitializer map={mapInstance} />}


          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner" />
              <span>Đang tính lộ trình...</span>
            </div>
          )}
        </div>
      </section>
    </main>
    </>
  );
}

export default DirectionsPage;

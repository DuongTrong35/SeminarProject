import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCompass, FaLocationArrow, FaArrowLeft } from "react-icons/fa";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";

// ✅ ROUTING COMPONENT (FIX FULL)
function Routing({ start, end }) {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const control = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng),
      ],

      // 🎯 style đường
      lineOptions: {
        styles: [{ color: "#ff6b35", weight: 6 }],
      },

      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,

      // ❌ Ẩn panel chỉ đường (fix tiếng Hàn luôn)
      show: true,

      // ❌ bỏ marker mặc định
      createMarker: () => null,

      // ✅ ép language về EN (tránh random language)
      router: L.Routing.osrmv1({
        language: "en",
      }),
    }).addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map, start, end]);

  return null;
}

function MapPage() {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const destination = {
    lat: 10.7589,
    lng: 106.7044,
  };

  const handleDirections = () => {
    navigate("/directions");
  };

  const handleLiveLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Trình duyệt không hỗ trợ định vị.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.watchPosition(
  (position) => {
    const coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    setUserLocation(coords);

    if (mapRef.current) {
      mapRef.current.flyTo(coords, 16);
    }
  },
  (error) => {
    setLocationError("Không thể lấy vị trí: " + error.message);
  },
  {
    enableHighAccuracy: true,
    maximumAge: 0, 
    timeout: 10000,
  }
);
  };

  return (
    <main className="map-page">
      <section className="map-page__hero">
        <button className="btn back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Quay lại
        </button>

        <h1>Explore Vinh Khanh Food Street Map</h1>

        <div className="map-page__actions">
          <button className="btn primary" onClick={handleDirections}>
            <FaCompass /> Chỉ đường
          </button>

          <button className="btn secondary" onClick={handleLiveLocation}>
            <FaLocationArrow />
            {isLocating ? "Đang định vị..." : "Định vị trực tiếp"}
          </button>
        </div>

        {/* ✅ MAP */}
        <section className="map-page__map">
          <div className="leaflet-map" style={{ height: "500px" }}>
            <MapContainer
              center={destination}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              whenCreated={(map) => {
                mapRef.current = map;

                // 🔥 fix map bị xám
                setTimeout(() => {
                  map.invalidateSize();
                }, 100);
              }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* ✅ có vị trí thì vẽ route */}
              {userLocation && (
                <Routing start={userLocation} end={destination} />
              )}
            </MapContainer>
          </div>
        </section>

        {locationError && (
          <p className="map-page__error">{locationError}</p>
        )}
      </section>
    </main>
  );
}

export default MapPage;
import React from "react";
import { FaMapMarkerAlt } from 'react-icons/fa';

function MapSection() {
  return (
    <section className="map-section" data-aos="fade-up">
      <h2>
        <FaMapMarkerAlt /> Bản đồ
      </h2>
      <p className="section-description">
        Định vị vị trí phố ẩm thực Vĩnh Khánh ngay lập tức.
      </p>
      <div className="map-container">
        <iframe
          title="Vinh Khanh Street Map"
          src="https://www.google.com/maps?q=V%C4%A9nh+Kh%C3%A1nh+Street,+District+4,+Ho+Chi+Minh+City&output=embed"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}

export default MapSection;

import React, { useState, useRef, useEffect } from "react";
import { FiVolume2 } from 'react-icons/fi';

function Hero() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const endedHandler = () => setPlaying(false);
    audio.addEventListener('ended', endedHandler);
    return () => audio.removeEventListener('ended', endedHandler);
  }, []);

  return (
    <section className="hero-section">
      <audio ref={audioRef} src="/audio/vinhkhanh-guide.mp3" />
      <div className="overlay" />
      <div className="hero-content">
        <h1>Phố Ẩm Thực Vĩnh Khánh</h1>
        <p>
          Khám phá thiên đường ẩm thực Quận 4 với hệ thống thuyết minh tự động
        </p>
        <div className="hero-buttons">
          <button onClick={toggleAudio} className="btn primary cta">
            <FiVolume2 className={playing ? 'speaker-icon playing' : 'speaker-icon'} />
            Nghe thuyết minh
          </button>
          <a href="#food-directory" className="btn secondary">
            Khám phá ngay
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;

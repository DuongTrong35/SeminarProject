import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import "./QRScannerUI.css";

function QRScannerUI() {
  const navigate = useNavigate();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const scannerRef = useRef(null);
const [scanSuccess, setScanSuccess] = useState(false);
const [scanText, setScanText] = useState("");

  useEffect(() => {
    if (!isCameraOn) return;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: undefined,
        },
       (decodedText) => {
  setScanText(decodedText);
  setScanSuccess(true);

  if (scannerRef.current) {
    scannerRef.current.stop().catch(() => {});
  }

  setIsCameraOn(false);
},
        () => {}
      )
      .catch((err) => console.error(err));

    return () => {
  if (scannerRef.current) {
    try {
      scannerRef.current.stop();
    } catch (e) {}
  }
};
  }, [isCameraOn]);

  useEffect(() => {
  if (!isCameraOn) return;

  const timeout = setTimeout(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: "environment" },
      { fps: 10 },
      (decodedText) => {
        setScanText(decodedText);
        setScanSuccess(true);

        scanner.stop().catch(() => {});
        setIsCameraOn(false);
      },
      () => {}
    );
  }, 300); // 🔥 delay nhẹ

  return () => clearTimeout(timeout);
}, [isCameraOn]);
  return (
    <div className="qr-container">
      {/* CAMERA */}
      {isCameraOn && <div id="reader" className="qr-camera"></div>}

      {/* OVERLAY */}
      <div className="qr-overlay">
        {scanSuccess && (
  <div className="qr-success">
    <div className="qr-success-box">
      <h3>✅ Quét thành công</h3>
      <p>{scanText}</p>
      <button onClick={() => setScanSuccess(false)}>OK</button>
    </div>
  </div>
)}
        {/* HEADER */}
        <div className="qr-header" onClick={() => navigate(-1)}>
          ← Hủy
        </div>

        {/* CENTER */}
        <div className="qr-center">
          <div className="qr-frame">
            <span className="corner top-left"></span>
            <span className="corner top-right"></span>
            <span className="corner bottom-left"></span>
            <span className="corner bottom-right"></span>

            {/* 🔥 line scan */}
            {isCameraOn && <div className="scan-line"></div>}
          </div>

          <h2>Quét mã QR tại điểm đến</h2>
          <p>
            Đặt mã QR vào giữa khung hình để
            <br />
            nghe thuyết minh tự động
          </p>

          {!isCameraOn && <div className="qr-warning">🚫 Camera chưa bật</div>}
        </div>

        {/* BOTTOM */}
        <div className="qr-bottom">
          <div className="qr-library">
            <div className="circle small">🖼️</div>
            <span>THƯ VIỆN</span>
          </div>

          <div className="circle big" onClick={() => setIsCameraOn(true)}>
            📷
          </div>

          <div className="qr-bar"></div>
        </div>
      </div>
    </div>
  );
}

export default QRScannerUI;

import "./Login.css";
import logo from "../../assets/images/logodn.png";
import mhdn from "../../assets/images/mhđn.jpg";
import Navbar from "../Navbar";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [taikhoan, setTaikhoan] = useState("");
  const [matkhau, setMatkhau] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login/xulydn", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ taikhoan, matkhau }),
      });

      const text = await response.text();
      console.log("Phản hồi từ server:", text);

      if (response.status === 401) {
        alert("Sai tài khoản hoặc mật khẩu");
        return;
      }

      if (!response.ok) {
        alert("Đăng nhập thất bại");
        return;
      }

      const data = JSON.parse(text);

      console.log("USER LOGIN:", data);

      // ✅ FIX CHUẨN 100%
      const user = {
        id: data.id, // id bảng login
        iduser: data.iduser, // 🔥 CÁI QUAN TRỌNG (dùng cho cửa hàng)
        taikhoan: data.taikhoan,
        role: data.role,
      };

      console.log("SAVE USER:", user);

      // lưu localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // điều hướng
      if (user.role === "STORE") {
        navigate("/store/home");
      } else if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/homeuse");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="Container d-flex align-items-center justify-content-center"
        style={{ backgroundImage: `url(${mhdn})` }}
      >
        <div className="login-wrapper">
          <div className="card custom-card p-4">
            {/* Logo */}
            <div className="text-center mb-3">
              <img src={logo} alt="logo" width="70" />
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h4>Đăng nhập Konoha Market</h4>
              <small className="text-muted">
                Nếu cậu không thích số phận của mình, đừng chấp nhận nó.
              </small>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin}>
              {/* Username */}
              <div className="mb-3 input-group">
                <span className="input-group-text">
                  <i className="fa fa-user"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={taikhoan}
                  onChange={(e) => setTaikhoan(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="mb-3 input-group">
                <span className="input-group-text">
                  <i className="fa fa-key"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={matkhau}
                  onChange={(e) => setMatkhau(e.target.value)}
                />
              </div>

              <button className="btn btn-primary w-100">Sign In</button>

              <div className="text-center mt-3">
                <a href="/forgotpassword">Forgot Password?</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

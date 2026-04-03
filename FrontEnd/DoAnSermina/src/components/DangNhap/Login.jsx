import "./Login.css";
import logo from "../../assets/images/LogoVK.jpg";
import mhdn from "../../assets/images/BG_Login.png";
import Navbar from "../Navbar";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  
  // State cho Đăng nhập
  const [taikhoan, setTaikhoan] = useState("");
  const [matkhau, setMatkhau] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // State cho Đăng ký (Rút gọn tối đa)
  const [regTaikhoan, setRegTaikhoan] = useState("");
  const [regMatkhau, setRegMatkhau] = useState("");
  const [regRole, setRegRole] = useState("USER"); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/login/xulydn", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ taikhoan, matkhau }),
      });

      const text = await response.text();
      if (response.status === 401) return alert("Sai tài khoản hoặc mật khẩu");
      if (!response.ok) return alert("Đăng nhập thất bại");

      const data = JSON.parse(text);
      localStorage.setItem("user", JSON.stringify({
        id: data.id, 
        username: data.username,
        role: data.role,
        goiDichVu: data.goiDichVu
      }));

      if (data.role === "STORE") navigate("/store/home");
      else if (data.role === "ADMIN") navigate("/admin");
      else navigate("/mhuser");

    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Chỉ gửi đúng 3 trường dữ liệu cơ bản
    const requestData = { 
        taikhoan: regTaikhoan, 
        matkhau: regMatkhau, 
        role: regRole 
    };

    try {
      const response = await fetch("http://localhost:8080/login/dangky", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(requestData),
      });

      if (response.ok) {
        alert(regRole === "STORE" ? "Đăng ký thành công! Vui lòng đăng nhập và vào quản lý để cập nhật thông tin quán." : "Đăng ký thành công! Bạn có thể đăng nhập ngay.");
        setIsRegister(false);
        // Reset form
        setRegTaikhoan(""); 
        setRegMatkhau("");
      } else {
        alert("Đăng ký thất bại, tài khoản đã tồn tại hoặc lỗi dữ liệu!");
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="Container" style={{ backgroundImage: `url(${mhdn})` }}>
        <div className="login-wrapper">
          <div className="custom-card p-4">
            <div className="login-logo">
              <img src={logo} alt="logo" width="70" />
            </div>

            {!isRegister ? (
              /* ================= FORM ĐĂNG NHẬP ================= */
              <>
                <div className="login-textTitle"><h4>Log in</h4></div>
                <form onSubmit={handleLogin}>
                  <div className="input-group login-input-group">
                    <span className="input-group-text"><i className="fa fa-user"></i></span>
                    <input type="text" className="form-control" placeholder="Username" value={taikhoan} onChange={(e) => setTaikhoan(e.target.value)} required/>
                  </div>
                  <div className="input-group login-input-group">
                    <span className="input-group-text"><i className="fa fa-key"></i></span>
                    <input type="password" className="form-control" placeholder="Password" value={matkhau} onChange={(e) => setMatkhau(e.target.value)} required/>
                  </div>
                  <div className="btn-login-group">
                    <button type="submit" className="btn btn-primary w-100 mb-2">Sign In</button>
                    <button type="button" className="btn btn-second w-100" onClick={() => setIsRegister(true)}>Register</button>
                  </div>
                </form>
              </>
            ) : (
              /* ================= FORM ĐĂNG KÝ (Rút gọn) ================= */
              <>
                <div className="login-textTitle"><h4>Create your Account</h4></div>
                <form onSubmit={handleRegister}>
                  <div className="input-group login-input-group">
                    <span className="input-group-text"><i className="fa fa-id-badge"></i></span>
                    <select className="select-role" value={regRole} onChange={(e) => setRegRole(e.target.value)}>
                      <option value="USER">Người dùng (Khách hàng)</option>
                      <option value="STORE">Quán ăn (Cửa hàng)</option>
                    </select>
                  </div>

                  <div className="input-group login-input-group">
                    <span className="input-group-text"><i className="fa fa-user"></i></span>
                    <input type="text" className="form-control" placeholder="Username" value={regTaikhoan} onChange={(e) => setRegTaikhoan(e.target.value)} required />
                  </div>
                  
                  <div className="input-group login-input-group">
                    <span className="input-group-text"><i className="fa fa-key"></i></span>
                    <input type="password" className="form-control" placeholder="Password" value={regMatkhau} onChange={(e) => setRegMatkhau(e.target.value)} required />
                  </div>

                  <div className="btn-login-group mt-4">
                    <button type="submit" className="btn btn-primary w-100 mb-2">Confirm</button>
                    <button type="button" className="btn btn-second w-100" onClick={() => setIsRegister(false)}>Back</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
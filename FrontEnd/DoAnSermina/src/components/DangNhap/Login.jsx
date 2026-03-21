import "./Login.css";
import logo from "../../assets/images/logodn.png";
import mhdn from "../../assets/images/mhđn.jpg";
import Navbar from "../Navbar";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  
  // State cho Đăng nhập (Giữ nguyên của bạn)
  const [taikhoan, setTaikhoan] = useState("");
  const [matkhau, setMatkhau] = useState("");

  // State MỚI: Dùng để chuyển đổi giữa form Đăng nhập và Đăng ký
  const [isRegister, setIsRegister] = useState(false);

  // State MỚI: Cho form Đăng ký
  const [regTaikhoan, setRegTaikhoan] = useState("");
  const [regMatkhau, setRegMatkhau] = useState("");
  const [regRole, setRegRole] = useState("USER"); // Mặc định là Người dùng

  // Hàm Đăng nhập (Giữ nguyên của bạn)
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

      const user = {
        id: data.id, 
        iduser: data.iduser, 
        taikhoan: data.taikhoan,
        role: data.role,
      };

      console.log("SAVE USER:", user);

      localStorage.setItem("user", JSON.stringify(user));

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

  // Hàm MỚI: Xử lý Đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/login/dangky", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ 
          taikhoan: regTaikhoan, 
          matkhau: regMatkhau, 
          role: regRole 
        }),
      });

      if (response.ok) {
        alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
        // Thành công thì chuyển về màn hình đăng nhập và xóa trắng form
        setIsRegister(false);
        setRegTaikhoan("");
        setRegMatkhau("");
      } else {
        alert("Đăng ký thất bại, tài khoản có thể đã tồn tại!");
      }
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="Container"
        style={{ backgroundImage: `url(${mhdn})` }}
      >
        <div className="login-wrapper">
          <div className="custom-card p-4">
            {/* Logo */}
            <div className="text-center mb-3" style={{ marginBottom: '10px' }}>
              <img src={logo} alt="logo" width="70" />
            </div>

            {/* KIỂM TRA ĐIỀU KIỆN ĐỂ HIỂN THỊ FORM NÀO */}
            {!isRegister ? (
              /* ================= FORM ĐĂNG NHẬP ================= */
              <>
                <div className="text-center mb-4" style={{ marginBottom: '20px' }}>
                  <h4>Đăng nhập Konoha Market</h4>
                  <small className="text-muted">
                    Nếu cậu không thích số phận của mình, đừng chấp nhận nó.
                  </small>
                </div>

                <form onSubmit={handleLogin}>
                  <div className="mb-3 input-group" style={{ marginBottom: '10px' }}>
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

                  <div className="mb-3 input-group" style={{ marginBottom: '10px' }}>
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
                  <div className="btn-login-group">
                    <button type="submit" className="btn btn-primary w-100">Sign In</button>
                    {/* Thêm type="button" và sự kiện onClick để chuyển sang Đăng ký */}
                    <button type="button" className="btn btn-second w-100" onClick={() => setIsRegister(true)}>Register</button>
                  </div>
                  <div className="text-center mt-3">
                    <a href="/forgotpassword">Forgot Password?</a>
                  </div>
                </form>
              </>
            ) : (
              /* ================= FORM ĐĂNG KÝ ================= */
              <>
                <div className="text-center mb-4" style={{ marginBottom: '20px' }}>
                  <h4>Đăng ký Konoha Market</h4>
                  <small className="text-muted">
                    Tạo tài khoản mới để tham gia cùng chúng tôi.
                  </small>
                </div>

                <form onSubmit={handleRegister}>
                  {/* Trường Chọn Role */}
                  <div className="mb-3 input-group" style={{ marginBottom: '10px' }}>
                    <span className="input-group-text">
                      <i className="fa fa-id-badge"></i>
                    </span>
                    <select 
                      className="select-role" 
                      value={regRole} 
                      onChange={(e) => setRegRole(e.target.value)}
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="USER">Người dùng (Khách hàng)</option>
                      <option value="STORE">Quán ăn (Cửa hàng)</option>
                    </select>
                  </div>

                  {/* Username */}
                  <div className="mb-3 input-group" style={{ marginBottom: '10px' }}>
                    <span className="input-group-text">
                      <i className="fa fa-user"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      value={regTaikhoan}
                      onChange={(e) => setRegTaikhoan(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3 input-group" style={{ marginBottom: '10px' }}>
                    <span className="input-group-text">
                      <i className="fa fa-key"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={regMatkhau}
                      onChange={(e) => setRegMatkhau(e.target.value)}
                      required
                    />
                  </div>

                  <div className="btn-login-group">
                    <button type="submit" className="btn btn-primary w-100">Confirm</button>
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
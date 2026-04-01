package com.example.SerminaProject.Controller;

import com.example.SerminaProject.Model.TaiKhoan;
import com.example.SerminaProject.Service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*") // Tạm để * để frontend cổng nào gọi cũng được
@RestController
@RequestMapping("/login")
public class TaiKhoanController {

    @Autowired
    private TaiKhoanService service;

    @PostMapping("/xulydn")
    public ResponseEntity<?> login(
            @RequestParam String taikhoan,
            @RequestParam String matkhau) {

        // Lưu ý: Hàm checkLogin trong Service phải được sửa để dùng username/password nha
        TaiKhoan user = service.checkLogin(taikhoan, matkhau);

        if (user == null) {
            return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu");
        }

        // ✅ Trả đầy đủ dữ liệu cần thiết cho ReactJS (Theo cấu trúc DB mới)
        return ResponseEntity.ok(new Object() {
            public final Long id = user.getId();
            // Đã xóa iduser vì không còn xài nữa
            public final String username = user.getUsername(); // Trả về username
            public final String role = user.getRole();
            public final String goiDichVu = user.getGoiDichVu(); // FE cần biết gói Basic hay Pro để mở khóa Tour
        });
    }

    @PostMapping("/dangky")
    public ResponseEntity<?> register(
            @RequestParam String taikhoan,
            @RequestParam String matkhau,
            @RequestParam String role) {

        try {
            TaiKhoan newUser = new TaiKhoan();

            // Sử dụng các hàm Setter mới
            newUser.setUsername(taikhoan);
            newUser.setPassword(matkhau);
            newUser.setRole(role);

            // Bơm sẵn các thông số mặc định cho User mới tạo
            newUser.setGoiDichVu("BASIC");
            newUser.setNgonNguUaThich("vi");
            newUser.setVungMienUaThich("Mien Nam");

            // Đã XÓA dòng newUser.setIduser(...) vì ID giờ do Database tự lo (Auto Increment)

            TaiKhoan savedUser = service.dangKyTaiKhoan(newUser);

            if (savedUser != null) {
                return ResponseEntity.ok("Đăng ký thành công");
            } else {
                return ResponseEntity.status(400).body("Đăng ký thất bại");
            }

        } catch (Exception e) {
            System.out.println("LỖI ĐĂNG KÝ: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi Server hoặc Tài khoản đã tồn tại!");
        }
    }
}
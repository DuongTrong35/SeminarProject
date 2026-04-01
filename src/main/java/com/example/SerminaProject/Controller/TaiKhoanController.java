package com.example.SerminaProject.Controller;

import com.example.SerminaProject.Model.HopDong;
import com.example.SerminaProject.Model.TaiKhoan;
import com.example.SerminaProject.Repository.CuaHangRepository;
import com.example.SerminaProject.Service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/login")
public class TaiKhoanController {

    @Autowired
    private TaiKhoanService service;

    @Autowired
    private com.example.SerminaProject.Repository.CuaHangRepository cuaHangRepository;

    @PostMapping("/xulydn")
    public ResponseEntity<?> login(
            @RequestParam String taikhoan,
            @RequestParam String matkhau) {

        TaiKhoan user = service.checkLogin(taikhoan, matkhau);

        if (user == null) {
            return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu");
        }

        return ResponseEntity.ok(new Object() {
            public final Long id = user.getId();
            public final String username = user.getUsername();
            public final String role = user.getRole();
            public final String goiDichVu = user.getGoiDichVu();
        });
    }

@PostMapping("/dangky")
    public ResponseEntity<?> register(
            @RequestParam String taikhoan,
            @RequestParam String matkhau,
            @RequestParam String role,
            @RequestParam(required = false) String tenCuaHang,
            @RequestParam(required = false) String diaChi,
            @RequestParam(required = false) String danhMuc,
            @RequestParam(required = false) String moTa,
            @RequestParam(required = false) Double viDo,
            @RequestParam(required = false) Double kinhDo,
            @RequestParam(required = false) String linkHinhAnh
    ) {
        try {
            // 1. TẠO TÀI KHOẢN TRƯỚC
            TaiKhoan newUser = new TaiKhoan();
            newUser.setUsername(taikhoan);
            newUser.setPassword(matkhau);
            newUser.setRole(role);
            newUser.setGoiDichVu("BASIC");
            newUser.setNgonNguUaThich("vi");
            newUser.setVungMienUaThich("Mien Nam");

            TaiKhoan savedUser = service.dangKyTaiKhoan(newUser);

            // 2. TẠO CỬA HÀNG
            if ("STORE".equals(role) && savedUser != null) {
                com.example.SerminaProject.Model.CuaHang cuaHang = new com.example.SerminaProject.Model.CuaHang();
                
                // FIX LỖI TRAN DATA: Dùng ID ngắn gọn (CH_ + Số mili-giây)
                cuaHang.setId("CH_" + System.currentTimeMillis()); 

                cuaHang.setTen(tenCuaHang != null ? tenCuaHang : "Cửa hàng của " + taikhoan);
                cuaHang.setDiaChi(diaChi != null ? diaChi : "Chưa cập nhật");
                cuaHang.setDanhmuc(danhMuc != null ? danhMuc : "Khác");
                cuaHang.setMoTa(moTa != null ? moTa : "");
                
                // Nếu Frontend không gửi lên tọa độ thì lấy đại tọa độ mặc định
                cuaHang.setLat(viDo != null ? viDo : 10.7588);
                cuaHang.setLng(kinhDo != null ? kinhDo : 106.7025);
                
                cuaHang.setImageThumbnail(linkHinhAnh != null ? linkHinhAnh : "default.jpg");
                cuaHang.setImageBanner("default_banner.jpg"); // FIX LỖI NOT NULL (nếu có)
                
                cuaHang.setBankinh(20); 
                cuaHang.setNgonngu("vi");
                cuaHang.setTrangThai(0); // 0 = PENDING, Chờ Admin duyệt
                cuaHang.setIduser(savedUser.getId()); 

                // Lưu xuống DB
                cuaHangRepository.save(cuaHang);
            }

            return ResponseEntity.ok("Đăng ký thành công! Hãy chờ Admin duyệt cửa hàng.");

        } catch (Exception e) {
            // Bắt bệnh ở đây: Nếu chạy vẫn lỗi, ông nhìn vào Console của IntelliJ nó sẽ in ra dòng đỏ này!
            System.err.println("============= LỖI CRASH KHI LƯU CỬA HÀNG =============");
            e.printStackTrace(); 
            return ResponseEntity.status(500).body("Lỗi Server: " + e.getMessage());
        }
    }
}
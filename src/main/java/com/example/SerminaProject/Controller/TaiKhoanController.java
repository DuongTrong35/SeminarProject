package com.example.SerminaProject.Controller;

import com.example.SerminaProject.Model.TaiKhoan;
import com.example.SerminaProject.Service.TaiKhoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000") // React
@RestController
@RequestMapping("/login")
public class TaiKhoanController {

    @Autowired
    private TaiKhoanService service;

    @PostMapping("/xulydn")
    public ResponseEntity<?> login(
            @RequestParam String taikhoan,
            @RequestParam String matkhau) {

        TaiKhoan user = service.checkLogin(taikhoan, matkhau);

        if (user == null) {
            return ResponseEntity.status(401).body("Sai tài khoản hoặc mật khẩu");
        }

        return ResponseEntity.ok(user);
    }
}
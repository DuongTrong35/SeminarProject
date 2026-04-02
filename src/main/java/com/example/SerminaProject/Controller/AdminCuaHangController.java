package com.example.SerminaProject.Controller;

import com.example.SerminaProject.Model.CuaHang;
import com.example.SerminaProject.Repository.CuaHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin/cuahang")
public class AdminCuaHangController {

    @Autowired
    private CuaHangRepository cuaHangRepository;

    // 1. Lấy danh sách cửa hàng CHỜ DUYỆT (trangThai = 0)
    @GetMapping("/pending")
    public ResponseEntity<List<CuaHang>> getPendingStores() {
        List<CuaHang> danhSachCho = cuaHangRepository.findByTrangThai(0);
        return ResponseEntity.ok(danhSachCho);
    }

    // 2. Nút DUYỆT - Đổi trạng thái thành 1
    @PutMapping("/duyet/{id}")
    public ResponseEntity<?> approveStore(@PathVariable String id) { // ID của CuaHang là String
        CuaHang cuaHang = cuaHangRepository.findById(id).orElse(null);
        
        if (cuaHang == null) {
            return ResponseEntity.status(404).body("Không tìm thấy cửa hàng!");
        }

        cuaHang.setTrangThai(1); // 1 = Đã duyệt, hiển thị lên bản đồ khách
        cuaHangRepository.save(cuaHang);
        
        return ResponseEntity.ok("Đã duyệt cửa hàng thành công!");
    }
}
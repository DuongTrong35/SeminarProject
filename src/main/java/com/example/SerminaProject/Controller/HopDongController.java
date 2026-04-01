package com.example.SerminaProject.Controller;

import com.example.SerminaProject.Model.HopDong;
import com.example.SerminaProject.Repository.HopDongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin/hopdong")
public class HopDongController {

    @Autowired
    private HopDongRepository hopDongRepository;

    // 1. Lấy danh sách các Chủ quán đang "Chờ duyệt"
    @GetMapping("/pending")
    public ResponseEntity<List<HopDong>> getPendingContracts() {
        List<HopDong> danhSachCho = hopDongRepository.findByTrangThaiHopDong("PENDING");
        return ResponseEntity.ok(danhSachCho);
    }

    // 2. Nút "Duyệt" - Đổi trạng thái thành APPROVED
    @PutMapping("/duyet/{id}")
    public ResponseEntity<?> approveContract(@PathVariable Long id) {
        HopDong hopDong = hopDongRepository.findById(id).orElse(null);
        
        if (hopDong == null) {
            return ResponseEntity.status(404).body("Không tìm thấy hợp đồng!");
        }

        hopDong.setTrangThaiHopDong("APPROVED");
        hopDongRepository.save(hopDong);
        
        return ResponseEntity.ok("Đã duyệt cửa hàng thành công!");
    }
}
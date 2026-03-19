package com.example.SerminaProject.Controller;

import com.example.SerminaProject.Model.CuaHang;
import com.example.SerminaProject.Service.CuaHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuahang")
@CrossOrigin(origins = "*")
public class CuaHangController {

    @Autowired
    private CuaHangService service;

    // 🔥 Lấy tất cả cửa hàng
    @GetMapping
    public List<CuaHang> getAll() {
        return service.getAll();
    }

    // ✅ sửa Integer -> String
    @GetMapping("/user/{iduser}")
    public List<CuaHang> getByUser(@PathVariable String iduser) {
        return service.getByUser(iduser);
    }

    // 🔥 Thêm cửa hàng
    @PostMapping
    public CuaHang add(@RequestBody CuaHang ch) {
        return service.add(ch);
    }

    // 🔥 Update cửa hàng
    @PutMapping("/{id}")
    public CuaHang update(@PathVariable String id, @RequestBody CuaHang ch) {
        return service.update(id, ch);
    }

    // 🔥 Xóa cửa hàng
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    // 🔥 Search
    @GetMapping("/search")
    public List<CuaHang> search(@RequestParam String keyword) {
        return service.search(keyword);
    }
}
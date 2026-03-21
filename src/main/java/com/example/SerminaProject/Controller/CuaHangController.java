package com.example.SerminaProject.Controller;

import com.example.SerminaProject.Model.CuaHang;
import com.example.SerminaProject.Service.CuaHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import java.util.List;

@RestController
@RequestMapping("/api/cuahang")
@CrossOrigin(origins = "*")
public class CuaHangController {

    @Autowired
    private CuaHangService service;

    // Lấy tất cả
    @GetMapping
    public List<CuaHang> getAll() {
        return service.getAll();
    }

    // Lấy theo user
    @GetMapping("/user/{iduser}")
    public List<CuaHang> getByUser(@PathVariable String iduser) {
        return service.getByUser(iduser);
    }

    // Thêm mới
    @PostMapping
    public CuaHang add(@RequestBody CuaHang ch) {
        return service.add(ch);
    }

    // Update
    @PutMapping("/{id}")
    public CuaHang update(@PathVariable String id, @RequestBody CuaHang ch) {
        return service.update(id, ch);
    }

    // Xóa
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    // Search
    @GetMapping("/search")
    public List<CuaHang> search(@RequestParam String keyword) {
        return service.search(keyword);
    }

    @PostMapping("/upload-image")
    public String uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return "Lỗi: File rỗng";
        }
        try {
            // Lấy tên file gốc và tạo tên mới để tránh trùng lặp
            String originalFilename = file.getOriginalFilename();
            String newFilename = UUID.randomUUID().toString() + "_" + originalFilename;

            // Đường dẫn lưu file (lưu vào thư mục static/images của Spring Boot)
            // Lưu ý: Cần tạo sẵn thư mục này trong project của bạn
            String uploadDir = "src/main/resources/static/images/";
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            byte[] bytes = file.getBytes();
            Path path = Paths.get(uploadDir + newFilename);
            Files.write(path, bytes);

            // Trả về tên file để Frontend lưu vào Database (trường imageUrl)
            return newFilename;
        } catch (IOException e) {
            e.printStackTrace();
            return "Lỗi khi upload file";
        }
    }

    // Lấy theo ID
    @GetMapping("/{id}")
    public CuaHang getById(@PathVariable String id) {
        return service.getById(id);
    }
}
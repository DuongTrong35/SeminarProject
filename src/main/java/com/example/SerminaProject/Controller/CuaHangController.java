package com.example.SerminaProject.Controller;

import com.example.SerminaProject.Model.CuaHang;
import com.example.SerminaProject.Service.CuaHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cuahang")
@CrossOrigin("*")
public class CuaHangController {

    @Autowired
    private CuaHangService service;

    @GetMapping
    public List<CuaHang> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public CuaHang getById(@PathVariable String id) {
        return service.getById(id);
    }

    @GetMapping("/user/{iduser}")
    public List<CuaHang> getByUser(@PathVariable Long iduser) {
        return service.getByUser(iduser);
    }

    @PostMapping
    public CuaHang add(@RequestBody CuaHang ch) {
        return service.add(ch);
    }

    @PutMapping("/{id}")
    public CuaHang update(@PathVariable String id, @RequestBody CuaHang ch) {
        return service.update(id, ch);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @GetMapping("/search")
    public List<CuaHang> search(@RequestParam String keyword) {
        return service.search(keyword);
    }

    // Upload ảnh
    @PostMapping("/upload-image")
    public String uploadImage(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) return "File rỗng";

        try {
            String newFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            String uploadDir = "uploads/";
            Path path = Paths.get(uploadDir);

            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            Path filePath = path.resolve(newFileName);

            Files.write(filePath, file.getBytes());

            System.out.println("Saved: " + filePath.toAbsolutePath());

            return newFileName;

        } catch (IOException e) {
            e.printStackTrace();
            return "Upload lỗi";
        }
    }
}
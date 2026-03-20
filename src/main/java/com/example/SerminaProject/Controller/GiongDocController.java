package com.example.SerminaProject.Controller;

import com.example.SerminaProject.Model.GiongDoc;
import com.example.SerminaProject.Repository.GiongDocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/giongdoc")
@CrossOrigin(origins = "*") // Cho phép React gọi qua
public class GiongDocController {

    @Autowired
    private GiongDocRepository repository;

    // Đường dẫn lưu file vật lý (Thư mục uploads/voice/ sẽ được tạo ngang hàng với thư mục src)
    private final String UPLOAD_DIR = "uploads/voice/";

    // 1. LẤY DANH SÁCH
    @GetMapping
    public List<GiongDoc> getAllVoices() {
        return repository.findAll();
    }

    // 2. THÊM MỚI (CÓ UPLOAD FILE)
    @PostMapping
    public ResponseEntity<GiongDoc> createVoice(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("file") MultipartFile file) {
        
        try {
            // Tạo thư mục nếu chưa có
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Tạo tên file duy nhất để không bị trùng (dùng thời gian hiện tại)
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            
            // Copy file vào thư mục
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Lưu thông tin vào Database
            GiongDoc giongDoc = new GiongDoc();
            giongDoc.setName(name);
            giongDoc.setDescription(description);
            // Link để React phát nhạc
            giongDoc.setSrc("http://localhost:8080/uploads/voice/" + fileName);

            GiongDoc savedGiongDoc = repository.save(giongDoc);
            return ResponseEntity.ok(savedGiongDoc);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 3. XÓA FILE & DATABASE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoice(@PathVariable Long id) {
        GiongDoc giongDoc = repository.findById(id).orElse(null);
        if (giongDoc != null) {
            // Xóa file vật lý trên ổ cứng (Tùy chọn, để cho rác đỡ đầy)
            try {
                String fileName = giongDoc.getSrc().substring(giongDoc.getSrc().lastIndexOf("/") + 1);
                Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                e.printStackTrace();
            }
            // Xóa trong DB
            repository.delete(giongDoc);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // 4. CẬP NHẬT (SỬA) THÔNG TIN
    @PutMapping("/{id}")
    public ResponseEntity<GiongDoc> updateVoice(@PathVariable Long id, @RequestBody GiongDoc updatedVoice) {
        GiongDoc existingVoice = repository.findById(id).orElse(null);
        
        if (existingVoice != null) {
            // Cập nhật tên và mô tả mới
            existingVoice.setName(updatedVoice.getName());
            existingVoice.setDescription(updatedVoice.getDescription());
            // src (đường dẫn file) vẫn giữ nguyên không đổi
            
            GiongDoc saved = repository.save(existingVoice);
            return ResponseEntity.ok(saved);
        }
        
        return ResponseEntity.notFound().build();
    }
}
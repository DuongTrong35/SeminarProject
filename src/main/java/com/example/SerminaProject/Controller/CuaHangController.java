package com.example.SerminaProject.Controller;

import com.example.SerminaProject.Model.CuaHang;
import com.example.SerminaProject.Service.CuaHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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

    @RestController
    @RequestMapping("/api/tts")
    public class TTSController {

        @GetMapping
        public ResponseEntity<byte[]> tts(
                @RequestParam String text,
                @RequestParam(defaultValue = "vi") String lang
        ) {
            try {
                String url = "https://translate.google.com/translate_tts?ie=UTF-8&q="
                        + text   // ❌ KHÔNG encode nữa
                        + "&tl=" + lang + "&client=tw-ob";

                RestTemplate restTemplate = new RestTemplate();
                byte[] audio = restTemplate.getForObject(url, byte[].class);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.valueOf("audio/mpeg"));

                return new ResponseEntity<>(audio, headers, HttpStatus.OK);

            } catch (Exception e) {
                return ResponseEntity.status(500).build();
            }
        }
    }
}
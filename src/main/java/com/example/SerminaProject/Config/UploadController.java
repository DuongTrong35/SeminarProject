package com.example.SerminaProject.Config;


import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class UploadController {

    private static final String UPLOAD_DIR =
            "D:/ITNAM4/DoAnMonSeminar/SeminarProject/FrontEnd/DoAnSermina/src/assets/images/AdminStore/";

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) {

        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            File dest = new File(UPLOAD_DIR + fileName);
            file.transferTo(dest);

            // 🔥 CHỈ TRẢ TÊN FILE (QUAN TRỌNG)
            return fileName;

        } catch (IOException e) {
            e.printStackTrace(); // 🔥 thêm dòng này để debug
            throw new RuntimeException("Upload thất bại!");
        }
    }
}
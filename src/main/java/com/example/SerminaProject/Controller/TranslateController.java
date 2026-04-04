package com.example.SerminaProject.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/translate")
@CrossOrigin("*")
public class TranslateController {

    @GetMapping
    public ResponseEntity<?> translate(
            @RequestParam String text,
            @RequestParam(defaultValue = "en") String to
    ) {
        try {
            // 1. DÙNG BIẾN {to} VÀ {text} ĐỂ REST_TEMPLATE TỰ ĐỘNG ENCODE
            String url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl={to}&dt=t&q={text}";

            RestTemplate restTemplate = new RestTemplate();
            
            // 2. ÉP SPRING BOOT ĐỌC JSON BẰNG LIST CHUẨN CỦA JAVA (Né thư viện ngoài)
            List<?> response = restTemplate.getForObject(url, List.class, to, text);

            StringBuilder translated = new StringBuilder();

            // 3. BÓC TÁCH MẢNG NESTED ĐỂ LẤY ĐÚNG CHỮ ĐÃ DỊCH
            if (response != null && !response.isEmpty() && response.get(0) instanceof List) {
                List<?> sentences = (List<?>) response.get(0);
                for (Object sentenceObj : sentences) {
                    if (sentenceObj instanceof List) {
                        List<?> sentenceDetails = (List<?>) sentenceObj;
                        if (!sentenceDetails.isEmpty() && sentenceDetails.get(0) != null) {
                            translated.append(sentenceDetails.get(0).toString());
                        }
                    }
                }
            }

            return ResponseEntity.ok().body(
                    Map.of("translatedText", translated.toString())
            );

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("translatedText", "Translate lỗi API"));
        }
    }
}
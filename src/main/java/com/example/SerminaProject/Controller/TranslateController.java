package com.example.SerminaProject.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

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
            String url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl="
                    + to
                    + "&dt=t&q="
                    + URLEncoder.encode(text, StandardCharsets.UTF_8);

            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);

            String translated = response.split("\"")[1];

            // 🔥 QUAN TRỌNG
            translated = URLDecoder.decode(translated, StandardCharsets.UTF_8);

            return ResponseEntity.ok().body(
                    java.util.Map.of("translatedText", translated)
            );

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Translate lỗi");
        }
    }
}
//package com.example.SerminaProject.Controller;
//
//import org.springframework.http.*;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.RestTemplate;
//
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//
//@RestController
//@RequestMapping("/api/tts")
//@CrossOrigin("*")
//public class TTSController {
//
//    @GetMapping
//    public ResponseEntity<byte[]> tts(
//            @RequestParam String text,
//            @RequestParam(defaultValue = "vi") String lang
//    ) {
//        try {
//            String url = "https://translate.google.com/translate_tts?ie=UTF-8&q="
//                    + URLEncoder.encode(text, StandardCharsets.UTF_8)
//                    + "&tl=" + lang
//                    + "&client=tw-ob";
//
//            RestTemplate restTemplate = new RestTemplate();
//
//            HttpHeaders headers = new HttpHeaders();
//            headers.set("User-Agent", "Mozilla/5.0");
//            headers.set("Referer", "https://translate.google.com/");
//            headers.set("Accept-Language", "en-US,en;q=0.9");
//
//            HttpEntity<String> entity = new HttpEntity<>(headers);
//
//            ResponseEntity<byte[]> response = restTemplate.exchange(
//                    url,
//                    HttpMethod.GET,
//                    entity,
//                    byte[].class
//            );
//
//            return ResponseEntity.ok()
//                    .contentType(MediaType.valueOf("audio/mpeg"))
//                    .body(response.getBody());
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(500).build();
//        }
//    }
//}
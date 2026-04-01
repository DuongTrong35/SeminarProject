package com.example.SerminaProject.Controller;

import com.example.SerminaProject.Model.Tour;
import com.example.SerminaProject.Model.DTO.TourRequestDTO;
import com.example.SerminaProject.Service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tours")
@CrossOrigin(origins = "*") // RẤT QUAN TRỌNG: Mở cửa cho ReactJS (cổng 3000 hoặc 5173) gọi vào không bị lỗi CORS
public class TourController {

    @Autowired
    private TourService tourService;

    // 1. Lấy danh sách tất cả các Tour
    @GetMapping
    public ResponseEntity<List<Tour>> getAllTours() {
        List<Tour> tours = tourService.getAllTours();
        return new ResponseEntity<>(tours, HttpStatus.OK);
    }

    // 2. Lấy chi tiết 1 Tour (Kèm theo lộ trình các cửa hàng)
    @GetMapping("/{id}")
    public ResponseEntity<?> getTourById(@PathVariable Integer id) {
        try {
            Tour tour = tourService.getTourById(id);
            return new ResponseEntity<>(tour, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    // 3. Tạo Tour mới (Hứng DTO từ React gửi lên)
    @PostMapping
    public ResponseEntity<?> createTour(@RequestBody TourRequestDTO dto) {
        try {
            Tour newTour = tourService.createTour(dto);
            return new ResponseEntity<>(newTour, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // Nếu gửi sai ID Cửa hàng, nó sẽ báo lỗi ở đây
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 4. Xóa Tour
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTour(@PathVariable Integer id) {
        try {
            tourService.deleteTour(id);
            return new ResponseEntity<>("Xóa Tour thành công!", HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
}
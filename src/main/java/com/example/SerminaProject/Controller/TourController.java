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
public class TourController{

    @Autowired
    private TourService tourService;

    @GetMapping
    public List<Tour> getAllTours() {
        return tourService.getAllTours();
    }
}
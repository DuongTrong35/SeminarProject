package com.example.SerminaProject.Model.DTO;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class TourRequestDTO {
    private String tenTour;
    private String moTa;
    private BigDecimal gia;
    
    // Hứng cái mảng chứa danh sách các cửa hàng
    private List<TramDTO> danhSachTram; 
}
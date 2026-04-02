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

    public String getTenTour() {
        return tenTour;
    }

    public void setTenTour(String tenTour) {
        this.tenTour = tenTour;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public BigDecimal getGia() {
        return gia;
    }

    public void setGia(BigDecimal gia) {
        this.gia = gia;
    }

    public List<TramDTO> getDanhSachTram() {
        return danhSachTram;
    }

    public void setDanhSachTram(List<TramDTO> danhSachTram) {
        this.danhSachTram = danhSachTram;
    }
}
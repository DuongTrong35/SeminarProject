package com.example.SerminaProject.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "tours")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_tour", nullable = false)
    private String tenTour;

    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "gia")
    private Double gia;

    // Quan hệ 1-Nhiều với bảng Lịch Trình Tour
    // orphanRemoval = true: Nếu xóa Tour, tự động xóa luôn các trạm bên trong
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LichTrinhTour> lichTrinhTours;
    
    // getter setter

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public Double getGia() {
        return gia;
    }

    public void setGia(Double gia) {
        this.gia = gia;
    }

    public List<LichTrinhTour> getLichTrinhTours() {
        return lichTrinhTours;
    }

    public void setLichTrinhTours(List<LichTrinhTour> lichTrinhTours) {
        this.lichTrinhTours = lichTrinhTours;
    }
}
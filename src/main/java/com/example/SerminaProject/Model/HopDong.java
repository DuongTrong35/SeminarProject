package com.example.SerminaProject.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "hop_dong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HopDong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Trỏ về ông Chủ quán nào đăng ký cái hợp đồng này
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_chu_quan", nullable = false)
    private TaiKhoan chuQuan;

    // Lúc mới đăng ký thì chưa có cửa hàng, khi nào Admin duyệt xong mới gán id cửa hàng vào đây
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cua_hang")
    private CuaHang cuaHang;

    @Column(name = "ngay_bat_dau")
    private LocalDate ngayBatDau;

    @Column(name = "ngay_het_han")
    private LocalDate ngayHetHan;

    @Column(name = "giay_to", length = 500)
    private String giayTo; // Link URL của ảnh upload

    @Column(name = "trang_thai_hop_dong", length = 20)
    private String trangThaiHopDong; // PENDING (Chờ duyệt), ACTIVE (Đã duyệt), EXPIRED (Hết hạn)
}
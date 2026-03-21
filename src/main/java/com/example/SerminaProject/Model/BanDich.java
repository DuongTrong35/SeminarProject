package com.example.SerminaProject.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "bandich")
public class BanDich {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Liên kết với cửa hàng nào (POI nào)
    @Column(name = "id_cuahang")
    private String idCuaHang;

    @Column(name = "ngon_ngu_dich")
    private String ngonNguDich; // VD: "English", "日本語" (Nhật), "中文" (Trung)

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String noiDung; // Bản dịch của phần mô tả

    @Column(name = "tao_boi_ai")
    private Boolean taoBoiAI; // Đánh dấu xem có dùng AI sinh ra không

    // Cấu trúc Constructors, Getters, Setters...
    public BanDich() {}

    // ... (Thêm các hàm Get/Set ở đây)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdCuaHang() {
        return idCuaHang;
    }

    public void setIdCuaHang(String idCuaHang) {
        this.idCuaHang = idCuaHang;
    }

    public String getNgonNguDich() {
        return ngonNguDich;
    }

    public void setNgonNguDich(String ngonNguDich) {
        this.ngonNguDich = ngonNguDich;
    }

    public String getNoiDung() {
        return noiDung;
    }

    public void setNoiDung(String noiDung) {
        this.noiDung = noiDung;
    }

    public Boolean getTaoBoiAI() {
        return taoBoiAI;
    }

    public void setTaoBoiAI(Boolean taoBoiAI) {
        this.taoBoiAI = taoBoiAI;
    }
}
package com.example.SerminaProject.Model;

import jakarta.persistence.*;
import org.locationtech.jts.geom.Point;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "cuahang")
public class CuaHang {

    @Id
    @Column(name = "id")
    private String id;

    // ✅ sửa từ Integer -> String
    @Column(name = "iduser")
    private String iduser;

    @Column(name = "ten")
    private String ten;

    @Column(name = "DiaChi")
    private String diaChi;

    @Column(name = "MoTa")
    private String moTa;

    @Column(name = "imageurl")
    private String imageUrl;

    @Column(name = "TrangThai")
    private Integer trangThai;

    @JsonIgnore
    @Column(name = "toa_do", columnDefinition = "POINT")
    private Point toaDo;

    // 🔥 THÊM 2 BIẾN ẢO NÀY ĐỂ NHẬN/TRẢ DATA VỚI REACT
    @Transient
    private Double kinhDo;

    @Transient
    private Double viDo;

    public CuaHang() {}

    // ✅ sửa constructor


    public CuaHang(String id, String iduser, String ten, String diaChi, String moTa, String imageUrl, Integer trangThai, Point toaDo) {
        this.id = id;
        this.iduser = iduser;
        this.ten = ten;
        this.diaChi = diaChi;
        this.moTa = moTa;
        this.imageUrl = imageUrl;
        this.trangThai = trangThai;
        this.toaDo = toaDo;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    // ✅ sửa getter/setter
    public String getIduser() { return iduser; }
    public void setIduser(String iduser) { this.iduser = iduser; }

    public String getTen() { return ten; }
    public void setTen(String ten) { this.ten = ten; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }

    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Integer getTrangThai() { return trangThai; }
    public void setTrangThai(Integer trangThai) { this.trangThai = trangThai; }

    public Point getToaDo() { return toaDo; }
    public void setToaDo(Point toaDo) { this.toaDo = toaDo; }

    public Double getKinhDo() {
        // Nếu có gửi từ React lên thì dùng, không thì lấy từ Point trong DB trả về
        if (this.kinhDo != null) return this.kinhDo;
        return toaDo != null ? toaDo.getX() : null;
    }
    public void setKinhDo(Double kinhDo) { this.kinhDo = kinhDo; }

    public Double getViDo() {
        if (this.viDo != null) return this.viDo;
        return toaDo != null ? toaDo.getY() : null;
    }
    public void setViDo(Double viDo) { this.viDo = viDo; }
}
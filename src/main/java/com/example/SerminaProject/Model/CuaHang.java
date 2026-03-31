package com.example.SerminaProject.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "cuahang")
public class CuaHang {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "iduser")
    private String iduser;

    @Column(name = "ten")
    private String ten;

    @Column(name = "danhmuc")
    private String danhmuc;

    @Column(name = "DiaChi")
    private String diaChi;

    @Column(name = "MoTa")
    private String moTa;

    @Column(name = "bankinh")
    private Integer bankinh;

    @Column(name = "imagethumbnail")
    private String imageThumbnail;

    @Column(name = "imagebanner")
    private String imageBanner;

    @Column(name = "lat")
    private Double lat;

    @Column(name = "lng")
    private Double lng;

    @Column(name = "ngonngu")
    private String ngonngu;

    @Column(name = "TrangThai")
    private Integer trangThai;

    public CuaHang() {}

    // ===== GET SET =====

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getIduser() { return iduser; }
    public void setIduser(String iduser) { this.iduser = iduser; }

    public String getTen() { return ten; }
    public void setTen(String ten) { this.ten = ten; }

    public String getDanhmuc() { return danhmuc; }
    public void setDanhmuc(String danhmuc) { this.danhmuc = danhmuc; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }

    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }

    public Integer getBankinh() { return bankinh; }
    public void setBankinh(Integer bankinh) { this.bankinh = bankinh; }

    public String getImageThumbnail() { return imageThumbnail; }
    public void setImageThumbnail(String imageThumbnail) { this.imageThumbnail = imageThumbnail; }

    public String getImageBanner() { return imageBanner; }
    public void setImageBanner(String imageBanner) { this.imageBanner = imageBanner; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }

    public String getNgonngu() { return ngonngu; }
    public void setNgonngu(String ngonngu) { this.ngonngu = ngonngu; }

    public Integer getTrangThai() { return trangThai; }
    public void setTrangThai(Integer trangThai) { this.trangThai = trangThai; }
}
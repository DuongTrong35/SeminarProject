package com.example.SerminaProject.Model;

import jakarta.persistence.*;
@Entity
@Table(name = "taikhoan") // đổi thành tên bảng thật trong DB
public class TaiKhoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "iduser", length = 100, nullable = false)
    private String iduser;

    @Column(name = "taikhoan", length = 50, nullable = false)
    private String taikhoan;

    @Column(name = "matkhau", length = 50, nullable = false)
    private String matkhau;

    private String role; // "ADMIN" hoặc "USER"

    // Constructor rỗng (bắt buộc)
    public TaiKhoan() {
    }

    // Getter & Setter
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getIduser() {
        return iduser;
    }

    public void setIduser(String iduser) {
        this.iduser = iduser;
    }

    public String getTaikhoan() {
        return taikhoan;
    }

    public void setTaikhoan(String taikhoan) {
        this.taikhoan = taikhoan;
    }

    public String getMatkhau() {
        return matkhau;
    }

    public void setMatkhau(String matkhau) {
        this.matkhau = matkhau;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
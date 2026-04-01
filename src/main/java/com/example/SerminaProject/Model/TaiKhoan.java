package com.example.SerminaProject.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "user")
public class TaiKhoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // SỬA: Đổi sang Long vì Database dùng BIGINT

    @Column(name = "device_id", unique = true)
    private String deviceId; // MỚI: Cho khách vãng lai

    @Column(name = "username", unique = true, length = 50)
    private String username; // SỬA: Thay cho 'taikhoan' cũ

    @Column(name = "password")
    private String password; // SỬA: Thay cho 'matkhau' cũ

    private String role; // "ADMIN", "STORE" hoặc "TOURIST"

    @Column(name = "goi_dich_vu", length = 20)
    private String goiDichVu; // MỚI: BASIC hoặc PRO

    @Column(name = "ngon_ngu_ua_thich", length = 20)
    private String ngonNguUaThich; // MỚI

    @Column(name = "vung_mien_ua_thich", length = 50)
    private String vungMienUaThich; // MỚI

    // Constructor rỗng (bắt buộc)
    public TaiKhoan() {
    }

    // --- BẮT ĐẦU GETTER & SETTER ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getGoiDichVu() { return goiDichVu; }
    public void setGoiDichVu(String goiDichVu) { this.goiDichVu = goiDichVu; }

    public String getNgonNguUaThich() { return ngonNguUaThich; }
    public void setNgonNguUaThich(String ngonNguUaThich) { this.ngonNguUaThich = ngonNguUaThich; }

    public String getVungMienUaThich() { return vungMienUaThich; }
    public void setVungMienUaThich(String vungMienUaThich) { this.vungMienUaThich = vungMienUaThich; }
}
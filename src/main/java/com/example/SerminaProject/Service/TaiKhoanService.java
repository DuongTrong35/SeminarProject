package com.example.SerminaProject.Service;

import com.example.SerminaProject.Model.TaiKhoan;
import com.example.SerminaProject.Repository.TaiKhoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaiKhoanService {

    @Autowired
    private TaiKhoanRepository repository;

    public List<TaiKhoan> getAll() {
        return repository.findAll();
    }

    public TaiKhoan save(TaiKhoan tk) {
        return repository.save(tk);
    }

    public TaiKhoan checkLogin(String taikhoan, String matkhau) {
        // SỬA: Gọi đúng tên hàm findByUsernameAndPassword
        // Vẫn giữ tham số truyền vào là taikhoan, matkhau để không phải sửa Controller
        return repository.findByUsernameAndPassword(taikhoan, matkhau)
                .orElse(null);
    }

    public TaiKhoan dangKyTaiKhoan(TaiKhoan taiKhoan) {
        return repository.save(taiKhoan);
    }
}
package com.example.SerminaProject.Repository;

import com.example.SerminaProject.Model.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Integer> {
    Optional<TaiKhoan> findByTaikhoanAndMatkhau(String taikhoan, String matkhau);

}
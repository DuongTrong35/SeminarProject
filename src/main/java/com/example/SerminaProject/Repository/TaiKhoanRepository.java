package com.example.SerminaProject.Repository;

import com.example.SerminaProject.Model.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Long> { // SỬA: Integer -> Long

    // SỬA: Đổi tên hàm cho khớp với 2 biến mới trong Model
    Optional<TaiKhoan> findByUsernameAndPassword(String username, String password);

}
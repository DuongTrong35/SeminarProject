package com.example.SerminaProject.Repository;

import com.example.SerminaProject.Model.CuaHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CuaHangRepository extends JpaRepository<CuaHang, String> {

    // ✅ sửa Integer -> String
    List<CuaHang> findByIduser(String iduser);

    // 🔥 Search theo tên
    List<CuaHang> findByTenContaining(String keyword);
}
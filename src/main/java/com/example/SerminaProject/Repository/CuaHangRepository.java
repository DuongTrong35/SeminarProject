package com.example.SerminaProject.Repository;

import com.example.SerminaProject.Model.CuaHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CuaHangRepository extends JpaRepository<CuaHang, String> {

    // theo user
    List<CuaHang> findByIduser(String iduser);

    // 🔥 search không phân biệt hoa thường
    List<CuaHang> findByTenContainingIgnoreCase(String keyword);
}
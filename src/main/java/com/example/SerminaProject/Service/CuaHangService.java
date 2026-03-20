package com.example.SerminaProject.Service;

import com.example.SerminaProject.Model.CuaHang;
import com.example.SerminaProject.Repository.CuaHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CuaHangService {

    @Autowired
    private CuaHangRepository repository;

    // Lấy tất cả
    public List<CuaHang> getAll() {
        return repository.findAll();
    }

    // 🔥 THÊM MỚI (FIX ID Ở ĐÂY)
    public CuaHang add(CuaHang ch) {

        // nếu chưa có id thì tự tạo
        if (ch.getId() == null || ch.getId().isEmpty()) {
            ch.setId(UUID.randomUUID().toString());
        }

        return repository.save(ch);
    }

    // Xóa
    public void delete(String id) {
        repository.deleteById(id);
    }

    // 🔥 SEARCH XỊN HƠN
    public List<CuaHang> search(String keyword) {
        return repository.findByTenContainingIgnoreCase(keyword);
    }

    // UPDATE
    public CuaHang update(String id, CuaHang ch) {

        CuaHang old = repository.findById(id).orElse(null);

        if (old == null) return null;

        old.setTen(ch.getTen());
        old.setDiaChi(ch.getDiaChi());
        old.setMoTa(ch.getMoTa());
        old.setImageUrl(ch.getImageUrl());
        old.setTrangThai(ch.getTrangThai());
        old.setIduser(ch.getIduser());

        return repository.save(old);
    }

    // Lấy theo user
    public List<CuaHang> getByUser(String iduser) {
        return repository.findByIduser(iduser);
    }

    // Lấy theo ID
    public CuaHang getById(String id) {
        return repository.findById(id).orElse(null);
    }
}
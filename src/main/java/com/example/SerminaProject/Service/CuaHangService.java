package com.example.SerminaProject.Service;

import com.example.SerminaProject.Model.CuaHang;
import com.example.SerminaProject.Repository.CuaHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CuaHangService {

    @Autowired
    private CuaHangRepository repository;

    // 🔥 Lấy tất cả
    public List<CuaHang> getAll() {
        return repository.findAll();
    }

    // 🔥 Thêm mới
    public CuaHang add(CuaHang ch) {
        return repository.save(ch);
    }

    // 🔥 Xóa
    public void delete(String id) {
        repository.deleteById(id);
    }

    // 🔥 Search
    public List<CuaHang> search(String keyword) {
        return repository.findByTenContaining(keyword);
    }

    // 🔥 Update
    public CuaHang update(String id, CuaHang ch) {
        CuaHang old = repository.findById(id).orElse(null);

        if (old != null) {
            old.setTen(ch.getTen());
            old.setDiaChi(ch.getDiaChi());
            old.setMoTa(ch.getMoTa());
            old.setImageUrl(ch.getImageUrl());
            old.setTrangThai(ch.getTrangThai());

            // 🔥 nếu muốn update luôn iduser thì thêm dòng này
            old.setIduser(ch.getIduser());

            return repository.save(old);
        }

        return null;
    }

    // ✅ sửa Integer -> String
    public List<CuaHang> getByUser(String iduser) {
        return repository.findByIduser(iduser);
    }
}
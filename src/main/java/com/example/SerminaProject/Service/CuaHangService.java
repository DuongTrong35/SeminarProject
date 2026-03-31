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

    public List<CuaHang> getAll() {
        return repository.findAll();
    }

    public CuaHang add(CuaHang ch) {
        if (ch.getId() == null || ch.getId().isEmpty()) {
            ch.setId(UUID.randomUUID().toString());
        }
        return repository.save(ch);
    }

    public CuaHang update(String id, CuaHang ch) {
        CuaHang old = repository.findById(id).orElse(null);
        if (old == null) return null;

        old.setTen(ch.getTen());
        old.setDanhmuc(ch.getDanhmuc());
        old.setDiaChi(ch.getDiaChi());
        old.setMoTa(ch.getMoTa());
        old.setBankinh(ch.getBankinh());
        old.setImageThumbnail(ch.getImageThumbnail());
        old.setImageBanner(ch.getImageBanner());
        old.setLat(ch.getLat());
        old.setLng(ch.getLng());
        old.setNgonngu(ch.getNgonngu());
        old.setTrangThai(ch.getTrangThai());
        old.setIduser(ch.getIduser());

        return repository.save(old);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public List<CuaHang> search(String keyword) {
        return repository.findByTenContainingIgnoreCase(keyword);
    }

    public List<CuaHang> getByUser(String iduser) {
        return repository.findByIduser(iduser);
    }

    public CuaHang getById(String id) {
        return repository.findById(id).orElse(null);
    }
}
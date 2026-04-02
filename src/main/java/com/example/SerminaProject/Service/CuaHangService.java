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

        // BỌC GIÁP CHỐNG NULL: Chỉ update khi Frontend có gửi dữ liệu lên
        if (ch.getTen() != null) old.setTen(ch.getTen());
        if (ch.getDanhmuc() != null) old.setDanhmuc(ch.getDanhmuc());
        if (ch.getDiaChi() != null) old.setDiaChi(ch.getDiaChi());
        if (ch.getMoTa() != null) old.setMoTa(ch.getMoTa());
        if (ch.getBankinh() != null) old.setBankinh(ch.getBankinh());
        if (ch.getImageThumbnail() != null) old.setImageThumbnail(ch.getImageThumbnail());
        if (ch.getImageBanner() != null) old.setImageBanner(ch.getImageBanner());
        if (ch.getLat() != null) old.setLat(ch.getLat());
        if (ch.getLng() != null) old.setLng(ch.getLng());
        if (ch.getNgonngu() != null) old.setNgonngu(ch.getNgonngu());
        if (ch.getIduser() != null) old.setIduser(ch.getIduser());

        // 🔥 MA THUẬT NGHIỆP VỤ: Cứ Update là đạp về trạng thái 0 (Chờ duyệt)
        old.setTrangThai(0);

        return repository.save(old);
    }

    public void delete(String id) {
        repository.deleteById(id);
    }

    public List<CuaHang> search(String keyword) {
        return repository.findByTenContainingIgnoreCase(keyword);
    }

    public List<CuaHang> getByUser(Long iduser) {
        return repository.findByIduser(iduser);
    }

    public CuaHang getById(String id) {
        return repository.findById(id).orElse(null);
    }

    public CuaHang findById(String id) {
        return repository.findById(id).orElse(null);
    }
}
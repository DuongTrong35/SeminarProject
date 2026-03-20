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


    // Thêm hàm tiện ích này nếu bạn chưa có
    private final org.locationtech.jts.geom.GeometryFactory geometryFactory = new org.locationtech.jts.geom.GeometryFactory();
    // 🔥 Update
    public org.locationtech.jts.geom.Point createPoint(double longitude, double latitude) {
        org.locationtech.jts.geom.Point point = geometryFactory.createPoint(new org.locationtech.jts.geom.Coordinate(longitude, latitude));
        point.setSRID(4326);
        return point;
    }

    // Sửa lại hàm update
    public CuaHang update(String id, CuaHang ch) {
        CuaHang old = repository.findById(id).orElse(null);

        if (old != null) {
            old.setTen(ch.getTen());
            old.setDiaChi(ch.getDiaChi());
            old.setMoTa(ch.getMoTa());
            old.setImageUrl(ch.getImageUrl());

            // 🔥 Logic mới: Nếu React có gửi tọa độ lên, thì cập nhật Point mới!
            if (ch.getKinhDo() != null && ch.getViDo() != null) {
                old.setToaDo(createPoint(ch.getKinhDo(), ch.getViDo()));
            }

            return repository.save(old);
        }
        return null;
    }

    // ✅ sửa Integer -> String
    public List<CuaHang> getByUser(String iduser) {
        return repository.findByIduser(iduser);
    }
}
package com.example.SerminaProject.Service;

import com.example.SerminaProject.Model.BanDich;
import com.example.SerminaProject.Repository.BanDichRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BanDichService {
    @Autowired
    private BanDichRepository repository;

    public List<BanDich> getAll() {
        return repository.findAll();
    }

    // Lấy bản dịch theo ID Cửa Hàng
    public List<BanDich> getByCuaHang(String idCuaHang) {
        return repository.findByIdCuaHang(idCuaHang);
    }

    // Thêm mới hoặc Cập nhật bản dịch
    public BanDich save(BanDich banDich) {
        return repository.save(banDich);
    }

    // Xóa bản dịch
    public void delete(Long id) {
        repository.deleteById(id);
    }

    public BanDich update(Long id, BanDich bd) {
        BanDich old = repository.findById(id).orElse(null);
        if (old != null) {
            old.setNgonNguDich(bd.getNgonNguDich());
            old.setNoiDung(bd.getNoiDung());
            old.setTaoBoiAI(bd.getTaoBoiAI());
            return repository.save(old);
        }
        return null;
    }
}
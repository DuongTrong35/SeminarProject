package com.example.SerminaProject.Controller;

import com.example.SerminaProject.Model.BanDich;
import com.example.SerminaProject.Service.BanDichService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bandich")
@CrossOrigin(origins = "*")
public class BanDichController {

    @Autowired
    private BanDichService service;

    @GetMapping
    public List<BanDich> getAll() {
        return service.getAll();
    }

    // API lấy danh sách bản dịch của 1 cửa hàng
    @GetMapping("/cuahang/{idCuaHang}")
    public List<BanDich> getByCuaHang(@PathVariable String idCuaHang) {
        return service.getByCuaHang(idCuaHang);
    }

    // API Thêm mới bản dịch
    @PostMapping
    public BanDich add(@RequestBody BanDich banDich) {
        return service.save(banDich);
    }

    @PutMapping("/{id}")
    public BanDich update(@PathVariable Long id, @RequestBody BanDich bd) {
        return service.update(id, bd);
    }

    // API Xóa bản dịch
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
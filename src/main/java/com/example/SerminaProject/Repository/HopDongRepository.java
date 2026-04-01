package com.example.SerminaProject.Repository;

import com.example.SerminaProject.Model.HopDong;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HopDongRepository extends JpaRepository<HopDong, Long> {
    List<HopDong> findByTrangThaiHopDong(String trangThaiHopDong);
}
package com.example.SerminaProject.Repository;

import com.example.SerminaProject.Model.LichTrinhTour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LichTrinhTourRepository extends JpaRepository<LichTrinhTour, Integer> {

    List<LichTrinhTour> findByTourIdOrderByThuTuTramAsc(Integer tourId);

}
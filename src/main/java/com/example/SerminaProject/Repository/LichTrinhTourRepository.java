package com.example.SerminaProject.Repository;

import com.example.SerminaProject.Model.LichTrinhTour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LichTrinhTourRepository extends JpaRepository<LichTrinhTour, Integer> {
}
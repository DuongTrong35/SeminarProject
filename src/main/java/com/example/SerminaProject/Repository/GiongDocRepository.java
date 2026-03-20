package com.example.SerminaProject.Repository;

import com.example.SerminaProject.Model.GiongDoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GiongDocRepository extends JpaRepository<GiongDoc, Long> {
}
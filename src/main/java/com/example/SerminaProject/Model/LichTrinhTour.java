package com.example.SerminaProject.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "lich_trinh_tour")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LichTrinhTour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    @JsonIgnore 
    private Tour tour;

    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "id_cuahang", nullable = false)
    private CuaHang cuahang;

    @Column(name = "thu_tu_tram", nullable = false)
    private Integer thuTuTram;
}
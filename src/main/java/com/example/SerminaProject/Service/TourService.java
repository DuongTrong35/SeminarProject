package com.example.SerminaProject.Service;

import com.example.SerminaProject.Model.CuaHang;
import com.example.SerminaProject.Model.LichTrinhTour;
import com.example.SerminaProject.Model.Tour;
import com.example.SerminaProject.Model.DTO.TourRequestDTO;
import com.example.SerminaProject.Model.DTO.TramDTO;
import com.example.SerminaProject.Repository.CuaHangRepository;
import com.example.SerminaProject.Repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TourService {

    @Autowired
    private TourRepository tourRepository;

    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }
}
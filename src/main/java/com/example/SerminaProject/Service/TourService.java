package com.example.SerminaProject.Service;

import com.example.SerminaProject.Model.CuaHang;
import com.example.SerminaProject.Model.LichTrinhTour;
import com.example.SerminaProject.Model.Tour;
import com.example.SerminaProject.Model.DTO.TourRequestDTO;
import com.example.SerminaProject.Model.DTO.TramDTO;
import com.example.SerminaProject.Repository.CuaHangRepository;
import com.example.SerminaProject.Repository.LichTrinhTourRepository;
import com.example.SerminaProject.Repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourService {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private CuaHangRepository cuaHangRepository;

    // 1. Lấy danh sách tất cả Tour

    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    // 2. Lấy chi tiết 1 Tour
    public Tour getTourById(Integer id) {
        return tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour có ID: " + id));
    }

    // 3. Tạo Tour mới (Kèm theo lộ trình)
    @Transactional // Đảm bảo lưu thành công cả Tour và Lịch trình, nếu lỗi 1 cái là Hủy hết
                   // (Rollback)
    public Tour createTour(TourRequestDTO dto) {
        Tour tour = new Tour();
        tour.setTenTour(dto.getTenTour());
        tour.setMoTa(dto.getMoTa());
//        tour.setGia(dto.getGia());

        List<LichTrinhTour> lichTrinhList = new ArrayList<>();

        // Bóc tách danh sách trạm từ DTO để gán vào Tour
        if (dto.getDanhSachTram() != null && !dto.getDanhSachTram().isEmpty()) {
            for (TramDTO tramDTO : dto.getDanhSachTram()) {
                // Kiểm tra xem ID Cửa Hàng có tồn tại không
                CuaHang cuahang = cuaHangRepository.findById(tramDTO.getIdCuahang())
                        .orElseThrow(() -> new RuntimeException("Cửa hàng không tồn tại: " + tramDTO.getIdCuahang()));

                LichTrinhTour lichTrinh = new LichTrinhTour();
                lichTrinh.setTour(tour);
                lichTrinh.setCuahang(cuahang);
                lichTrinh.setThuTuTram(tramDTO.getThuTuTram());

                lichTrinhList.add(lichTrinh);
            }
        }

        tour.setLichTrinhTours(lichTrinhList);

        // Lưu 1 phát ăn luôn cả bảng tours và lich_trinh_tour nhờ CascadeType.ALL trong
        // Entity
        // Lưu 1 phát ăn luôn cả bảng tours và lich_trinh_tour nhờ CascadeType.ALL trong Entity
        return tourRepository.save(tour);
    }

    // 4. Xóa Tour
    public void deleteTour(Integer id) {
        if (!tourRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy Tour để xóa");
        }
        tourRepository.deleteById(id);
    }

    // 5. Cập nhật Tour (Sửa Tour)
    @Transactional
    public Tour updateTour(Integer id, TourRequestDTO dto) {
        // BƯỚC 1: Tìm xem Tour có tồn tại không
        Tour existingTour = tourRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Tour có ID: " + id));

        // BƯỚC 2: Cập nhật các thông tin cơ bản
        existingTour.setTenTour(dto.getTenTour());
        existingTour.setMoTa(dto.getMoTa());
//        existingTour.setGia(dto.getGia());

        // BƯỚC 3: Xóa lộ trình cũ
        // Mình clear() cái list cũ đi. Nhờ dòng 'orphanRemoval = true' trong Entity
        // Tour,
        // Mình clear() cái list cũ đi. Nhờ dòng 'orphanRemoval = true' trong Entity Tour,
        // Database sẽ tự động xóa sạch các trạm cũ của Tour này.
        existingTour.getLichTrinhTours().clear();

        // BƯỚC 4: Lắp lộ trình mới vào (Giống y hệt lúc Create)
        if (dto.getDanhSachTram() != null && !dto.getDanhSachTram().isEmpty()) {
            for (TramDTO tramDTO : dto.getDanhSachTram()) {
                CuaHang cuahang = cuaHangRepository.findById(tramDTO.getIdCuahang())
                        .orElseThrow(() -> new RuntimeException("Cửa hàng không tồn tại: " + tramDTO.getIdCuahang()));

                LichTrinhTour lichTrinh = new LichTrinhTour();
                lichTrinh.setTour(existingTour); // Nhớ trỏ về existingTour
                lichTrinh.setCuahang(cuahang);
                lichTrinh.setThuTuTram(tramDTO.getThuTuTram());

                existingTour.getLichTrinhTours().add(lichTrinh);
            }
        }

        // BƯỚC 5: Lưu lại
        return tourRepository.save(existingTour);
    }


    @Autowired
    private LichTrinhTourRepository lichTrinhTourRepository;
    public List<CuaHang> getShopsByTourId(Integer tourId) {
        List<LichTrinhTour> list = lichTrinhTourRepository
                .findByTourIdOrderByThuTuTramAsc(tourId);
        return list.stream()
                .map(LichTrinhTour::getCuahang)
                .collect(Collectors.toList());
    }
}
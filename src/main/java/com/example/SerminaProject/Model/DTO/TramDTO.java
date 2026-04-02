package com.example.SerminaProject.Model.DTO;

import lombok.Data;

@Data
public class TramDTO {
    private String idCuahang;
    private Integer thuTuTram;

    public String getIdCuahang() {
        return idCuahang;
    }

    public void setIdCuahang(String idCuahang) {
        this.idCuahang = idCuahang;
    }

    public Integer getThuTuTram() {
        return thuTuTram;
    }

    public void setThuTuTram(Integer thuTuTram) {
        this.thuTuTram = thuTuTram;
    }
}
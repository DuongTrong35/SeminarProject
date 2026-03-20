package com.example.SerminaProject.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "giong_doc")
public class GiongDoc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String src; // Sẽ lưu chuỗi ví dụ: "http://localhost:8080/uploads/voice/file.mp3"

    // --- GETTERS & SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSrc() { return src; }
    public void setSrc(String src) { this.src = src; }
}
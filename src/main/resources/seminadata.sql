-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 04, 2026 lúc 04:28 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `seminardata`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bandich`
--

CREATE TABLE `bandich` (
  `id` bigint(20) NOT NULL,
  `id_cuahang` varchar(50) NOT NULL,
  `ngon_ngu_dich` varchar(50) NOT NULL,
  `noi_dung` text NOT NULL,
  `tao_boi_ai` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cuahang`
--

CREATE TABLE `cuahang` (
  `id` varchar(50) NOT NULL,
  `iduser` bigint(20) NOT NULL COMMENT 'Khóa ngoại trỏ tới chủ quán trong bảng user',
  `ten` varchar(255) DEFAULT NULL,
  `danhmuc` varchar(25) NOT NULL,
  `DiaChi` varchar(50) NOT NULL,
  `MoTa` varchar(50) NOT NULL,
  `bankinh` int(4) NOT NULL DEFAULT 20 COMMENT 'Bán kính phát audio',
  `imagethumbnail` varchar(5000) NOT NULL,
  `imagebanner` varchar(8000) NOT NULL,
  `lat` double DEFAULT NULL,
  `lng` double NOT NULL,
  `ngonngu` varchar(50) NOT NULL,
  `TrangThai` int(1) NOT NULL,
  `ma_qr` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cuahang`
--

INSERT INTO `cuahang` (`id`, `iduser`, `ten`, `danhmuc`, `DiaChi`, `MoTa`, `bankinh`, `imagethumbnail`, `imagebanner`, `lat`, `lng`, `ngonngu`, `TrangThai`, `ma_qr`) VALUES
('ADSADA', 3, 'ASDASDSA', 'DADASDASD', 'ASDASDADASD', 'DASDASDAS', 100, 'aa22372e-3bc5-45f8-a2e2-90f51a4bc104_Screenshot 2026-03-29 155853.png', 'b1a371aa-b8ec-45d6-b22a-360b755695ab_Screenshot 2026-03-31 145805.png', 10.760543, 106.702124, 'Vietnamese', 1, NULL),
('ali', 3, 'li', 'li', 'li', 'li', 23, '3fcb908f-c5d3-4474-bee3-e95a075c9f65_mancity.png', '6d8b616e-1a8f-4b79-a19e-c122faa8e7e6_muado.jpg', 10.747748, 106.682911, 'Vietnamese,English,French', 1, NULL),
('cb1', 3, 'cn2', 'cbfa2', 'afadadas', 'aadadasdad', 105, '76d6faf4-beaa-42f8-ae81-696a12fe0afc_muado.jpg', '2ac15252-8fc1-4d72-9f0e-d2d41328cde1_gg.png', 10.759847, 106.701373, 'Vietnamese,English', 1, NULL),
('ch1', 2, 'Ốc Oanh Vĩnh Khánh', 'a', '534 đường Vĩnh Khánh', 'Đây là quán ốc được đánh giá ngon nhất nhì Sài Gòn', 120, 'ocoanh.jpg', 'ocoanh.jpg', 10.761276690166167, 106.70265601749765, 'Vietnamese,English', 0, NULL),
('Chanh', 3, 'Chanh', 'Chanh', 'Chanh', 'Chanh', 4, '5194ea75-69e1-464b-a483-5b45da4532e4_Doraemon45.jpg', 'b27aadd3-0f14-4727-b474-8554a3b3d9c4_doremon.jpg', 10.754776, 106.694638, 'Vietnamese,French,Italian', 1, NULL),
('CHJack', 3, 'jaaaaa', 'adasdad', 'bvfzczczc', 'adsadasdasdasdasv', 34, '4ce87735-8d19-4de9-999a-a9b06d80cdc9_Screenshot 2026-03-31 150110.png', '0e2efd23-a6d0-44ec-8079-d7b31c733d98_Screenshot 2026-03-28 094830.png', 10.733381, 106.663776, 'Vietnamese,Spanish,English,French', 1, NULL),
('CHSON', 3, 'SON', 'SSDDFSF', 'ASADASCZXCZCZC', 'FADADASDA', 23, '07ad2d3d-5ef0-410d-87e1-8d8b8a6172f0_Screenshot 2026-03-31 142132.png', '2178f1ef-d7ce-464c-826b-16fd2c293a22_Screenshot 2026-03-31 145805.png', 10.759173, 106.69968, 'Vietnamese,English,Spanish', 1, NULL),
('CHst', 3, 'dasdasvzczxxc', 'czxcasdasd', 'addagadasd', 'zdvzczczczczcfasdasdasda', 22, '1fc85544-4c21-446a-a20c-5d3ce28098ef_Screenshot 2026-03-29 222332.png', 'b1ab31b9-b3f9-490b-a0d2-c6d115cafff4_Screenshot 2026-03-31 164753.png', 10.728422, 106.645387, 'Vietnamese,English,French', 1, NULL),
('cv', 3, 'cv', 'cv', 'cv', 'cv', 10, '5facce27-fed8-444d-b5e6-507eb89327c9_mancity.png', '806cb9cc-6708-4147-9fed-9294779b7b84_Ngôi sao.webp', 10.746351, 106.690021, 'German,Vietnamese,Spanish', 1, NULL),
('em', 3, 'em', 'em', 'em', 'em', 32, '95bbf1f7-4b13-4fd3-bf55-bde0998910a4_conan.jpg', 'f43d6b27-1e40-48cb-bb1e-e1f3ea960d3a_poke.jpg', 10.760678871524348, 106.70389552239294, 'English,French,Vietnamese', 1, NULL),
('f1af7597-20a1-42e9-997e-45ee385f9b06', 3, 'a', 'a', 'a', 'a', 12, 'c36f0c83-2fd4-4379-a392-14251761c58d_Screenshot 2026-03-31 102506.png', 'e51f22f8-5cbd-4151-ac48-aabccc632d34_Screenshot 2026-03-31 145805.png', 10.754809, 106.69303, 'Vietnamese,English', 1, NULL),
('haha', 3, 'haha', 'haha', 'ahahah', 'ahahaha', 100, 'cf96000a-3b1a-48b0-8034-7747d16fc47d_mancity.png', 'db3f39dc-e6a5-44f9-b96d-962ca41b9630_muado.jpg', 10.76120672127123, 106.70539201707193, 'Vietnamese,English,French', 1, NULL),
('qw', 3, 'qw', 'qw', 'qw', 'qw', 100, 'e2b2cfb1-6fd8-474c-87bd-f1f2a329dd3e_conan.jpg', '35253637-746c-45be-a91e-59fd6df0e50b_scc.jpg', 10.75269, 106.681016, 'Vietnamese,Spanish', 1, NULL),
('trà', 3, 'trà', 'trà', 'trà', 'trà', 22, '65b76708-3c0a-4b34-aa41-382d710373a8_bdqk.jpg', 'e2fa082f-89b9-4d3d-84ce-97c2c02707bb_cartitle.jpg', 10.753303, 106.695731, 'Vietnamese,Spanish,English,Japanese', 1, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giong_doc`
--

CREATE TABLE `giong_doc` (
  `id` bigint(20) NOT NULL,
  `id_cuahang` varchar(50) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `src` varchar(500) DEFAULT NULL,
  `ngon_ngu` varchar(20) DEFAULT 'vi',
  `tao_boi_ai` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `giong_doc`
--

INSERT INTO `giong_doc` (`id`, `id_cuahang`, `name`, `description`, `src`, `ngon_ngu`, `tao_boi_ai`) VALUES
(1, 'ch1', 'Test', 'Test', 'http://localhost:8080/uploads/voice/1774016288965_file_example_MP3_2MG.mp3', 'vi', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lich_trinh_tour`
--

CREATE TABLE `lich_trinh_tour` (
  `id` int(11) NOT NULL,
  `tour_id` int(11) NOT NULL,
  `id_cuahang` varchar(50) NOT NULL,
  `thu_tu_tram` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `lich_trinh_tour`
--

INSERT INTO `lich_trinh_tour` (`id`, `tour_id`, `id_cuahang`, `thu_tu_tram`) VALUES
(1, 1, 'ch1', 1),
(2, 1, 'em', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `narration_log`
--

CREATE TABLE `narration_log` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL COMMENT 'Trỏ tới bảng user (id)',
  `id_cuahang` varchar(50) NOT NULL,
  `thoi_gian_nghe` datetime DEFAULT current_timestamp(),
  `hinh_thuc` varchar(20) DEFAULT 'GPS' COMMENT 'Kích hoạt bằng GPS hay QR'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tours`
--

CREATE TABLE `tours` (
  `id` int(11) NOT NULL,
  `ten_tour` varchar(255) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `gia` decimal(12,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tours`
--

INSERT INTO `tours` (`id`, `ten_tour`, `mo_ta`, `gia`) VALUES
(1, 'Ăn no hết sức', 'Dịch vụ ăn đủ thử món mà no căng bụng', 250000.00),
(2, 'aaaaaaaaaaa', 'aaadasdascvadasdassfsfada', 398000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `device_id` varchar(255) DEFAULT NULL COMMENT 'Dành cho khách vãng lai',
  `username` varchar(50) DEFAULT NULL COMMENT 'Dành cho Admin/Chủ quán',
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'TOURIST' COMMENT 'TOURIST, STORE, ADMIN',
  `goi_dich_vu` varchar(20) DEFAULT 'BASIC' COMMENT 'BASIC hoặc PRO',
  `ngon_ngu_ua_thich` varchar(20) DEFAULT 'vi',
  `vung_mien_ua_thich` varchar(50) DEFAULT 'Mien Nam'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `device_id`, `username`, `password`, `role`, `goi_dich_vu`, `ngon_ngu_ua_thich`, `vung_mien_ua_thich`) VALUES
(1, NULL, 'naruto', '123', 'TOURIST', 'BASIC', 'vi', 'Mien Nam'),
(2, NULL, 'a', 'a', 'STORE', 'PRO', 'vi', 'Mien Nam'),
(3, NULL, 'sasuke', 'a', 'ADMIN', 'PRO', 'vi', 'Mien Nam');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bandich`
--
ALTER TABLE `bandich`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_bandich_cuahang` (`id_cuahang`);

--
-- Chỉ mục cho bảng `cuahang`
--
ALTER TABLE `cuahang`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ma_qr` (`ma_qr`),
  ADD KEY `fk_cuahang_user` (`iduser`);

--
-- Chỉ mục cho bảng `giong_doc`
--
ALTER TABLE `giong_doc`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_giongdoc_cuahang` (`id_cuahang`);

--
-- Chỉ mục cho bảng `lich_trinh_tour`
--
ALTER TABLE `lich_trinh_tour`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_ltt_tour` (`tour_id`),
  ADD KEY `fk_ltt_cuahang` (`id_cuahang`);

--
-- Chỉ mục cho bảng `narration_log`
--
ALTER TABLE `narration_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_log_user` (`user_id`),
  ADD KEY `fk_log_cuahang` (`id_cuahang`);

--
-- Chỉ mục cho bảng `tours`
--
ALTER TABLE `tours`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `device_id` (`device_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bandich`
--
ALTER TABLE `bandich`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `giong_doc`
--
ALTER TABLE `giong_doc`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `lich_trinh_tour`
--
ALTER TABLE `lich_trinh_tour`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `narration_log`
--
ALTER TABLE `narration_log`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `tours`
--
ALTER TABLE `tours`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bandich`
--
ALTER TABLE `bandich`
  ADD CONSTRAINT `fk_bandich_cuahang` FOREIGN KEY (`id_cuahang`) REFERENCES `cuahang` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `cuahang`
--
ALTER TABLE `cuahang`
  ADD CONSTRAINT `fk_cuahang_user` FOREIGN KEY (`iduser`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `giong_doc`
--
ALTER TABLE `giong_doc`
  ADD CONSTRAINT `fk_giongdoc_cuahang` FOREIGN KEY (`id_cuahang`) REFERENCES `cuahang` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `lich_trinh_tour`
--
ALTER TABLE `lich_trinh_tour`
  ADD CONSTRAINT `fk_ltt_cuahang` FOREIGN KEY (`id_cuahang`) REFERENCES `cuahang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_ltt_tour` FOREIGN KEY (`tour_id`) REFERENCES `tours` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `narration_log`
--
ALTER TABLE `narration_log`
  ADD CONSTRAINT `fk_log_cuahang` FOREIGN KEY (`id_cuahang`) REFERENCES `cuahang` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_log_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

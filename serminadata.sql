-- --------------------------------------------------------
-- Database setup cho Hệ thống POI & Tracking GPS
-- --------------------------------------------------------

CREATE DATABASE IF NOT EXISTS `seminardata` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `seminardata`;

-- --------------------------------------------------------
-- 1. Bảng TÀI KHOẢN (Giữ nguyên cấu trúc của trưởng nhóm)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `taikhoan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iduser` varchar(20) NOT NULL,
  `taikhoan` varchar(50) NOT NULL,
  `matkhau` varchar(50) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

REPLACE INTO `taikhoan` (`id`, `iduser`, `taikhoan`, `matkhau`, `role`) VALUES
  (1, 'a', 'naruto', '123', 'USER'),
  (2, '2', 'a', 'a', 'STORE'),
  (3, '3', 'sasuke', 'a', 'ADMIN');

-- --------------------------------------------------------
-- 2. Bảng CỬA HÀNG (Đã nâng cấp Spatial Data & Mở rộng dung lượng)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cuahang` (
  `id` varchar(50) NOT NULL,
  `iduser` varchar(2) NOT NULL,
  `ten` varchar(255) DEFAULT NULL,
  `DiaChi` varchar(255) NOT NULL, -- Nới rộng độ dài địa chỉ
  `toa_do` POINT NOT NULL SRID 4326, -- Cột Spatial Data lưu Tọa độ GPS (Kinh độ, Vĩ độ) theo chuẩn 4326
  `MoTa` TEXT NOT NULL, -- Đổi sang TEXT để tránh tràn data
  `imageurl` varchar(255) NOT NULL, -- Nới rộng để chứa link Cloud
  `TrangThai` int(1) NOT NULL,
  PRIMARY KEY (`id`),
  SPATIAL INDEX `idx_toa_do` (`toa_do`) -- Đánh index không gian giúp tìm kiếm bán kính cực nhanh
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- 3. Bảng BẢN DỊCH (Phục vụ Task 4 - Quản lý Localization/AI)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bandich` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_cuahang` varchar(50) NOT NULL,
  `ngon_ngu_dich` varchar(50) NOT NULL,
  `noi_dung` TEXT NOT NULL,
  `tao_boi_ai` tinyint(1) DEFAULT 0, -- 0 là Manual, 1 là AI
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_bandich_cuahang` FOREIGN KEY (`id_cuahang`) REFERENCES `cuahang` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

  -- 1. Chèn lại dữ liệu bảng cuahang (Đã đảo vị trí: Vĩ độ trước, Kinh độ sau)
REPLACE INTO `cuahang` (`id`, `iduser`, `ten`, `DiaChi`, `toa_do`, `MoTa`, `imageurl`, `TrangThai`) VALUES
  ('ch1', '2', 'Ốc Oanh Vĩnh Khánh', '534 đường Vĩnh Khánh, Quận 4, TP.HCM', ST_GeomFromText('POINT(10.760740 106.700140)', 4326), 'Đây là quán ốc được đánh giá ngon nhất nhì Sài Gòn, rất đông khách vào buổi tối.', 'https://mock-cloud.com/images/ocoanh.jpg', 0),
  ('ch2', '3', 'Chili - Lẩu nướng tự chọn', '232/105 đường Vĩnh Khánh, Quận 4, TP.HCM', ST_GeomFromText('POINT(10.761200 106.701500)', 4326), 'Chili được thực khách yêu thích bởi giá cả hợp lý và không gian thoáng mát.', 'https://mock-cloud.com/images/lauchili.jpg', 0);

-- 2. Chèn lại dữ liệu bảng bandich (Bây giờ đã có cửa hàng ch1, ch2 để tham chiếu)
REPLACE INTO `bandich` (`id_cuahang`, `ngon_ngu_dich`, `noi_dung`, `tao_boi_ai`) VALUES
  ('ch1', 'English', 'Oc Oanh is rated as one of the best snail restaurants in Saigon, very crowded in the evening.', 0),
  ('ch1', '日本語', 'オック・オアン（Oc Oanh）はサイゴンで最も美味しいカタツムリ料理店の一つとして評価されています。', 1),
  ('ch2', 'English', 'Chili is loved by diners for its reasonable prices and airy space.', 0);
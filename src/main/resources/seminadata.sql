-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for seminardata
CREATE DATABASE IF NOT EXISTS `seminardata` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `seminardata`;

-- Dumping structure for table seminardata.bandich
CREATE TABLE IF NOT EXISTS `bandich` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_cuahang` varchar(50) NOT NULL,
  `ngon_ngu_dich` varchar(50) NOT NULL,
  `noi_dung` text NOT NULL,
  `tao_boi_ai` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_bandich_cuahang` (`id_cuahang`),
  CONSTRAINT `fk_bandich_cuahang` FOREIGN KEY (`id_cuahang`) REFERENCES `cuahang` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table seminardata.bandich: ~0 rows (approximately)
REPLACE INTO `bandich` (`id`, `id_cuahang`, `ngon_ngu_dich`, `noi_dung`, `tao_boi_ai`) VALUES
	(1, 'ch1', 'Việt', 'abc', 0);

-- Dumping structure for table seminardata.cuahang
CREATE TABLE IF NOT EXISTS `cuahang` (
  `id` varchar(50) NOT NULL,
  `iduser` varchar(10) NOT NULL,
  `ten` varchar(255) DEFAULT NULL,
  `DiaChi` varchar(50) NOT NULL,
  `MoTa` varchar(50) NOT NULL,
  `imageurl` varchar(5000) NOT NULL,
  `TrangThai` int(1) NOT NULL,
  `toa_do` point DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table seminardata.cuahang: ~5 rows (approximately)
REPLACE INTO `cuahang` (`id`, `iduser`, `ten`, `DiaChi`, `MoTa`, `imageurl`, `TrangThai`, `toa_do`) VALUES
	('CH004', 'ND4', 'a', 'a', 'casds', '1774022850254_scc.jpg', 0, NULL),
	('ch1', '2', 'Ốc Oanh Vĩnh Khánh', '534 đường Vĩnh Khánh', 'Đây là quán ốc được đánh giá ngon nhất nhì Sài Gòn', 'ocoanh.jpg', 0, NULL),
	('ch2', '3', 'Chili - Lẩu nướng tự chọn', '232/105 đường Vĩnh Khánh', 'Chili được thực khách yêu thích bởi giá cả hợp lý ', 'lauchili.jpg', 0, NULL),
	('ch7', 'nm1', 'Sasuke', 'ghb', 'siuuuuuuu', '1774016408876_cr7.webp', 0, NULL);

-- Dumping structure for table seminardata.giong_doc
CREATE TABLE IF NOT EXISTS `giong_doc` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `src` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table seminardata.giong_doc: ~0 rows (approximately)
REPLACE INTO `giong_doc` (`id`, `name`, `description`, `src`) VALUES
	(1, 'Test', 'Test', 'http://localhost:8080/uploads/voice/1774016288965_file_example_MP3_2MG.mp3');

-- Dumping structure for table seminardata.taikhoan
CREATE TABLE IF NOT EXISTS `taikhoan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iduser` varchar(20) NOT NULL,
  `taikhoan` varchar(50) NOT NULL,
  `matkhau` varchar(50) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table seminardata.taikhoan: ~3 rows (approximately)
REPLACE INTO `taikhoan` (`id`, `iduser`, `taikhoan`, `matkhau`, `role`) VALUES
	(1, 'a', 'naruto', '123', 'USER'),
	(2, '2', 'a', 'a', 'STORE'),
	(3, '3', 'sasuke', 'a', 'ADMIN');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

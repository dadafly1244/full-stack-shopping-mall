CREATE DATABASE  IF NOT EXISTS `ojd` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ojd`;
-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: localhost    Database: ojd
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cart_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantity` int NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_item_cart_id_fkey` (`cart_id`),
  KEY `cart_item_product_id_fkey` (`product_id`),
  CONSTRAINT `cart_item_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `cart_item_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES ('2d1e1e2e-d40a-46be-b343-d055f5f358af','34b0bdb7-2500-4402-b15b-b2b967f6cc08','3e8638a1-48af-406c-b9f4-d97f972cd4dd',3,'2024-10-07 00:50:54.501','2024-10-07 01:08:46.831'),('300b3ae2-056e-425a-a26a-b03aa3ad2982','2abf3e04-f229-428a-8ff8-02a1601285f2','3e8638a1-48af-406c-b9f4-d97f972cd4dd',1,'2024-10-03 19:39:27.506','2024-10-03 19:39:27.506'),('47a65e60-2cc2-497b-a5f5-663257b998a7','34b0bdb7-2500-4402-b15b-b2b967f6cc08','0be76572-0d48-4af4-86ff-aacdad41fc6e',1,'2024-10-07 00:51:01.846','2024-10-07 01:00:21.411'),('6acb5288-c237-48aa-9ef0-276a59caf0a0','2abf3e04-f229-428a-8ff8-02a1601285f2','28722657-fcff-41a9-ab38-b3a2cd2ea5e4',1,'2024-10-03 19:39:22.037','2024-10-03 19:39:22.037'),('7bbf3520-3643-408b-864e-df195a17e0ec','34b0bdb7-2500-4402-b15b-b2b967f6cc08','f1f26182-6ecc-4e95-8059-eeeb98e0cafe',1,'2024-10-07 01:00:02.292','2024-10-07 01:00:02.292'),('9e6c9db3-d766-41ee-8ddc-973ed2da1f0b','2abf3e04-f229-428a-8ff8-02a1601285f2','c44b556c-bc18-4db2-8312-1293979cb7ed',1,'2024-10-03 19:39:17.870','2024-10-03 19:39:17.870'),('df20c618-0a71-4b59-b178-60b07225b199','34b0bdb7-2500-4402-b15b-b2b967f6cc08','c44b556c-bc18-4db2-8312-1293979cb7ed',1,'2024-10-07 00:50:51.351','2024-10-07 00:58:01.651'),('dfd447b6-267a-4710-a27d-cfacf1514f17','34b0bdb7-2500-4402-b15b-b2b967f6cc08','28722657-fcff-41a9-ab38-b3a2cd2ea5e4',1,'2024-10-07 00:58:06.168','2024-10-07 00:58:06.168');
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-07 12:59:26

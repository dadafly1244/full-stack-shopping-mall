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
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('READY_TO_ORDER','ORDER','DELIVERED','CANCELLED','REFUND','UNKNOWN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `total_price` int NOT NULL,
  `cart_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_user_id_fkey` (`user_id`),
  KEY `order_cart_id_fkey` (`cart_id`),
  CONSTRAINT `order_cart_id_fkey` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `order_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES ('010837fb-d896-448f-98b7-43252e2cce34','333fd5a0-6436-4ef5-9e21-0d5428f823e6','CANCELLED','경북 안동시 풍산읍 다담길 5 (수곡리),  (36622)',0,'2024-10-07 01:09:40.243','2024-10-07 01:09:45.439',20000000,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('054d8008-0b9e-47e6-9402-9d0528aa13b0','39a08b0a-5dec-489c-9633-4ded840b2123','ORDER','제주특별자치도 서귀포시 대정읍 영어도시로 1 (보성리, 구억25시편의점), ㅇㅇㅇ (63518)',0,'2024-10-03 23:42:01.762','2024-10-04 09:36:49.357',20010000,'5b6c2f0e-b408-42fa-918e-3d4553fcf06f'),('0746ddac-544c-46f3-ac25-ec3ae1083b26','333fd5a0-6436-4ef5-9e21-0d5428f823e6','READY_TO_ORDER','대구 달성군 화원읍 명천로 57 (본리리, 대곡역그린빌),  (42965)',0,'2024-10-03 10:55:36.134','2024-10-03 10:55:36.134',100000000,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('0c9385b9-543e-45f9-b907-1187f982c418','39a08b0a-5dec-489c-9633-4ded840b2123','READY_TO_ORDER','경기 성남시 분당구 판교로25번길 6 (운중동), 1233123 (13467)',0,'2024-10-03 19:37:42.022','2024-10-03 19:37:42.022',11111100,'5b6c2f0e-b408-42fa-918e-3d4553fcf06f'),('13a9670f-04f4-4537-b722-10df8e597041','333fd5a0-6436-4ef5-9e21-0d5428f823e6','ORDER','대구 달서구 상화로8길 23 (대곡동, 수목원삼성래미안),  (42767)',0,'2024-10-04 12:01:41.191','2024-10-04 12:02:31.224',320114110,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('21cf7a58-fddc-48b8-a0d9-c42f97aabc75','333fd5a0-6436-4ef5-9e21-0d5428f823e6','CANCELLED','경기 성남시 분당구 돌마로 866 (야탑동, 성은학교), 123 (13508)',0,'2024-10-03 17:25:18.788','2024-10-03 18:11:41.448',6000,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('21d7c9e5-3794-4758-a308-9398ee169ab1','740a527e-8ec0-400b-b48e-fe7c7537238b','CANCELLED','부산 사하구 감내1로 7 (감천동), ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇ (49376)',0,'2024-10-03 12:52:33.369','2024-10-04 12:07:28.130',8000,'67afe57c-dfb4-4f6c-8543-3917e89ae1c4'),('343d08b4-95b1-49f1-b910-f8f996a7f7de','333fd5a0-6436-4ef5-9e21-0d5428f823e6','ORDER','부산 북구 양달로4번길 7 (화명동),  (46517)',0,'2024-10-07 00:01:30.687','2024-10-07 01:36:44.957',21567610,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('3799c0e6-8327-44fb-80d3-3f58ac68da51','333fd5a0-6436-4ef5-9e21-0d5428f823e6','CANCELLED','제주특별자치도 서귀포시 안덕면 상아니올로 20 (감산리), 아니올로 (63531)',0,'2024-10-03 10:57:00.878','2024-10-03 18:14:48.991',60000,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('38b24e31-6e97-481c-892f-76ea0f3ccca5','333fd5a0-6436-4ef5-9e21-0d5428f823e6','CANCELLED','서울 중구 남대문로 109 (다동, 국제빌딩), ㅇㅇㅇ (04522)',0,'2024-10-03 11:04:14.523','2024-10-04 04:17:10.381',8000,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('3add9174-3baa-46d1-885f-4787af7af71d','333fd5a0-6436-4ef5-9e21-0d5428f823e6','READY_TO_ORDER','서울 관악구 낙성대로 2 (봉천동, 낙성벤처창업센터), 1231 (08789)',0,'2024-10-03 18:15:28.629','2024-10-03 18:15:28.629',2000,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('3fc8dc97-4107-4b58-9741-d056430c4466','2438ec33-1000-4520-8664-308810a202d5','ORDER','대구광역시지롱',0,'2024-09-04 06:53:59.423','2024-09-04 06:53:59.423',400000,NULL),('49574db5-ea20-4342-9a9e-b9a9ca0c9d38','740a527e-8ec0-400b-b48e-fe7c7537238b','READY_TO_ORDER','부산 남구 우암양달로 2-5 (우암동),  (48474)',0,'2024-10-06 23:57:38.023','2024-10-06 23:57:38.023',20112110,'67afe57c-dfb4-4f6c-8543-3917e89ae1c4'),('49f9ac36-7f38-4c29-ab9f-04896ec24907','333fd5a0-6436-4ef5-9e21-0d5428f823e6','READY_TO_ORDER','강원특별자치도 강릉시 주문진읍 거문동길 24-10 (주문리),  (25405)',0,'2024-10-04 06:46:03.939','2024-10-04 11:32:37.669',4448440,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('4a2f756d-bc2b-4b0d-8a87-5e3ae5425d84','333fd5a0-6436-4ef5-9e21-0d5428f823e6','CANCELLED','대구 달성군 화원읍 명천로 57 (본리리, 대곡역그린빌), 234 (42965)',0,'2024-10-04 01:11:20.776','2024-10-04 01:11:43.534',402000,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('4cdcf91e-4657-4b76-a43c-aca9e1cd5c1f','2438ec33-1000-4520-8664-308810a202d5','ORDER','대구광역시지롱',0,'2024-09-04 06:54:00.349','2024-09-04 06:54:00.349',400000,NULL),('65ab68e1-a5fc-4d7e-b45b-3b668ed77b7e','333fd5a0-6436-4ef5-9e21-0d5428f823e6','DELIVERED','경기 성남시 분당구 미금일로 21 (구미동, 하얀마을),  (13634)',0,'2024-10-03 10:53:02.989','2024-10-03 10:53:02.989',22222200,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('6af5a837-fd18-448e-baa9-8a1faa80c063','740a527e-8ec0-400b-b48e-fe7c7537238b','DELIVERED','경기 성남시 분당구 미금일로 5 (구미동, 청구빌라), ㅇㄹㅇㅇ (13634)',0,'2024-10-03 12:57:34.220','2024-10-03 12:57:34.220',2000,'67afe57c-dfb4-4f6c-8543-3917e89ae1c4'),('6bc43feb-733b-4c00-a2e6-8040cb7ea0b3','a6248e5d-3732-4310-b50f-e40b165b9e27','READY_TO_ORDER','경북 상주시 함창읍 문경대로 177 (대조리), ㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ (37110)',0,'2024-10-03 19:38:54.403','2024-10-03 19:38:54.403',10000,'2abf3e04-f229-428a-8ff8-02a1601285f2'),('6c1fc1ee-5f64-4edf-907f-e193ea46f89c','333fd5a0-6436-4ef5-9e21-0d5428f823e6','ORDER','경기 화성시 봉담읍 안녕길 151 (수기리), 23424 (18364)',0,'2024-10-03 17:36:21.804','2024-10-03 17:36:21.804',93343300,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('78a918f0-ae34-4ce6-acaf-77b75deff7a6','39a08b0a-5dec-489c-9633-4ded840b2123','ORDER','경북 예천군 예천읍 양궁로 10 (남본리, 바보온달해장국),  (36829)',0,'2024-10-04 12:04:30.801','2024-10-04 12:05:25.671',8765610,'5b6c2f0e-b408-42fa-918e-3d4553fcf06f'),('796d2377-fae2-4ea0-96da-aaa22c5f1f9f','39a08b0a-5dec-489c-9633-4ded840b2123','READY_TO_ORDER','경기 성남시 분당구 서판교로 32 (판교동), ㄴㅇㄹㄴㅇㄹ (13479)',0,'2024-10-03 23:41:36.087','2024-10-03 23:41:36.087',10000,'5b6c2f0e-b408-42fa-918e-3d4553fcf06f'),('7ff3301c-d39d-4411-a8c0-274687bd8338','2e32dc1d-20a4-470a-b8f6-5e399a9b205b','CANCELLED','경기 성남시 분당구 미금일로 21 (구미동, 하얀마을), 상세주소 (13634)',0,'2024-10-04 01:58:53.122','2024-10-04 01:59:22.230',200000,'aad0ed74-1e23-416b-b40e-6b3530701b52'),('9384111d-b4a7-421d-b8d0-4c13d3a334fc','2438ec33-1000-4520-8664-308810a202d5','ORDER','대구광역시지롱',0,'2024-09-04 06:53:55.558','2024-09-04 06:53:55.558',400000,NULL),('9c229c2e-6bd3-44a8-8ec6-8200299bcb5b','333fd5a0-6436-4ef5-9e21-0d5428f823e6','READY_TO_ORDER','서울 마포구 마포대로 156 (공덕동, 공덕푸르지오시티), 123 (04211)',0,'2024-10-03 10:51:12.317','2024-10-03 10:51:12.317',600000,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('a8a7f35d-037e-41d9-ba77-0bc61bb36975','a6248e5d-3732-4310-b50f-e40b165b9e27','READY_TO_ORDER','경북 문경시 가은읍 가은공단길 17 (왕능리), ㄴㅇㄹㅁㄴㅇㄹ (36995)',0,'2024-10-03 19:39:09.237','2024-10-03 19:39:09.237',10000,'2abf3e04-f229-428a-8ff8-02a1601285f2'),('b8e03b36-1a36-4536-a20a-da9fd1ac17d4','740a527e-8ec0-400b-b48e-fe7c7537238b','READY_TO_ORDER','부산 기장군 철마면 대곡1길 7 (장전리), sdfsdfs (46049)',0,'2024-10-04 12:07:22.205','2024-10-06 23:53:30.462',100000000,'67afe57c-dfb4-4f6c-8543-3917e89ae1c4'),('ee4022fb-4a3f-4abf-8e96-8d5e8913fd1a','333fd5a0-6436-4ef5-9e21-0d5428f823e6','ORDER','경기 남양주시 경춘로 1303 (평내동, 미금농협),  (12217)',0,'2024-10-07 01:10:18.863','2024-10-07 01:36:42.258',60000000,'34b0bdb7-2500-4402-b15b-b2b967f6cc08'),('ef81c114-8104-4997-8ef1-efeaca876e4e','333fd5a0-6436-4ef5-9e21-0d5428f823e6','READY_TO_ORDER','경남 사천시 삼천포대교로 485 (동림동, 바보주유소), 바보 (52553)',0,'2024-10-03 17:49:21.041','2024-10-03 17:49:21.041',20000000,'34b0bdb7-2500-4402-b15b-b2b967f6cc08');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
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

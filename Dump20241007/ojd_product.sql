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
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` int NOT NULL DEFAULT '0',
  `sale` int DEFAULT NULL,
  `count` int NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('AVAILABLE','TEMPORARILY_OUT_OF_STOCK','OUT_OF_STOCK','DISCONTINUED','PROHIBITION_ON_SALE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'OUT_OF_STOCK',
  `main_image_path` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc_images_path` json DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `category_id` int NOT NULL,
  `store_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_store_id_fkey` (`store_id`),
  KEY `product_category_id_fkey` (`category_id`),
  CONSTRAINT `product_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `product_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `store` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('00ddf6b4-16b2-4249-b0c9-9e42c119a0da','sdfsdfsdf',NULL,200000,1500,3,0,'AVAILABLE','/product_images/579821b5-7630-41e4-82b9-e21e969076ca-다운로드_(2).jpeg','\"[]\"','2024-09-27 11:44:03.271','2024-10-04 02:14:10.298',2,'9f0d3c81-9f15-4c9e-84f5-5fd44085494c'),('0be76572-0d48-4af4-86ff-aacdad41fc6e','자사호붉은','붉은색자사호입니다.',2000,1500,9,0,'AVAILABLE','/product_images/98ce163d-1b4c-47a8-aa37-fc79fc93f3dd-다운로드_(7).jpeg','\"[\\\"/product_desc_images/4754215c-da82-4bd8-83cf-8cedf30547c5-다운로드_(7).jpeg\\\"]\"','2024-09-10 04:31:11.770','2024-09-27 08:43:40.489',15,'9f0d3c81-9f15-4c9e-84f5-5fd44085494c'),('1670806e-1332-41de-9244-2b7f293927db','자사호_찻잔','상품 설명 수정하기 수정하기',200000,190000,0,0,'OUT_OF_STOCK','/product_images/d05bd35d-59e9-4c16-bd66-039a94304af6-다운로드_(9).jpeg','\"[\\\"/product_desc_images/0dbcbf8f-6eb0-4d32-8592-b96690bad701-고양이1.webp\\\",\\\"/product_desc_images/08c91a50-243f-4d8c-84ce-0a9c6c5207fa-고양이2.webp\\\",\\\"/product_desc_images/e0ec64bb-01e6-4327-a22c-fe3b4e9dd34c-고양이3.jpeg\\\",\\\"/product_desc_images/30c030fc-bdf5-4af2-af8a-14527cfa773d-김과자.jpeg\\\",\\\"/product_desc_images/27c74bdc-2a4e-4d39-896f-7944e5fc7655-다운로드_(1).jpeg\\\",\\\"/product_desc_images/e818e302-3267-4bb1-a584-c204bbebd6e1-다운로드_(2).jpeg\\\",\\\"/product_desc_images/7031172b-e6ea-4b9b-94f3-b27b7ad1e73c-다운로드_(3).jpeg\\\"]\"','2024-09-04 06:48:40.680','2024-09-27 09:12:55.487',15,'9f0d3c81-9f15-4c9e-84f5-5fd44085494c'),('28722657-fcff-41a9-ab38-b3a2cd2ea5e4','이름뭐야','좁이후슬 아몹아 퇌틋너에서 다닷손은 수으렁이며 나파언으면 후에실묍니다 태는 올새와 . 랄젼간상만 딴크견 아팠세륵포슷의 주기롯다연은 사리와 에애촡네에 서란과 메랜언어는 자니지 섭도로 췃네뇩아',11111100,1111110,5,0,'AVAILABLE','/product_images/3a128099-7f47-4ed5-938b-6cde4d175e9b-다운로드_(2).jpeg','\"[\\\"/product_desc_images/8f5feab8-f53d-471c-adb9-d97d0f017834-고양이2.webp\\\",\\\"/product_desc_images/2f9e236e-67c9-46ff-a18c-c1f9632d2be3-고양이3.jpeg\\\"]\"','2024-09-27 01:46:03.448','2024-10-07 01:36:44.957',2,'9f0d3c81-9f15-4c9e-84f5-5fd44085494c'),('3dbb86fd-cf14-49e7-af58-57ee811e2a4f','에어팟','AirPods(3세대)은 땀, 습기에 강한 생활 방수(워터 스포츠 및 운동 제외) 디자인으로 IPX4 등급을 획득하였습니다.',200000,190000,2,0,'OUT_OF_STOCK','/product_images/72f9b7fc-0c1a-49fa-a1df-c4496cd8a063-다운로드_(3).jpeg','\"[\\\"/product_desc_images/4f68bd67-a630-437c-91c7-df07064fd5c2-다운로드_(4).jpeg\\\"]\"','2024-09-04 06:39:03.350','2024-09-27 09:32:51.920',1,'9f0d3c81-9f15-4c9e-84f5-5fd44085494c'),('3e8638a1-48af-406c-b9f4-d97f972cd4dd','여성복_반팔','어메이징 시원한 여성복 반팔 ',10000,1000,85,0,'AVAILABLE','/product_images/4f7e7a78-f479-4fe3-9948-6d32a60f8d68-여성반팔.jpg','\"[]\"','2024-09-04 06:49:30.481','2024-10-07 01:36:44.957',16,'9f0d3c81-9f15-4c9e-84f5-5fd44085494c'),('45f35c9c-481b-495b-9c22-9802b446dcc8','노란색 자사호','노란색 자사호 입니다. 붉은색 자사호와는 다른 매력을 느껴보세요.야효',20000000,19000000,3,0,'AVAILABLE','/product_images/5ad49c1a-0504-483b-bc36-d6b9199692cb-다운로드_(8).jpeg','\"[]\"','2024-09-20 01:56:00.353','2024-10-07 01:36:44.957',15,'9f0d3c81-9f15-4c9e-84f5-5fd44085494c'),('5a3e70cb-847c-4d9a-a9df-2e2add495561','LG QNED TV 스탠드형 163cm','6세대 인공지능 알파5\n알아서 맞춰주는 최적의 화질과 사운드\n6세대 인공지능 알파5가 영상을 스스로 분석하여 콘텐츠에 맞는 화질과 사운드를 즐기실 수 있습니다. 모델명: 65QNED70NRA ',300000000,0,9,0,'AVAILABLE','/product_images/d4e46342-0696-4434-adaa-f3b93451c5c8-lg모니터.jpeg','\"[]\"','2024-09-04 06:45:13.843','2024-09-27 08:43:47.170',1,'9f0d3c81-9f15-4c9e-84f5-5fd44085494c'),('5ab90a6a-3971-44d0-8652-45a93fef9847','아이폰15','강력하다. 아름답다. 강인하다. 새롭게 선보이는 iPhone 15 Pro, iPhone 15 Pro Max, iPhone 15',2000000,1800000,500,0,'DISCONTINUED','/product_images/067c5420-b0d1-451e-a935-32743c62a42f-아이패드.png','\"[\\\"/product_desc_images/7b736519-07b5-416a-87a1-e3523e0b5911-다운로드_(1).jpeg\\\",\\\"/product_desc_images/dc0622f2-28eb-417b-aae5-e6c6d4fcc87d-다운로드_(2).jpeg\\\",\\\"/product_desc_images/e1528cd2-49d8-4863-be77-aa06047ae1c0-다운로드_(3).jpeg\\\",\\\"/product_desc_images/d700c38b-1f5e-4587-b13e-ef80c1dbaecd-다운로드_(4).jpeg\\\",\\\"/product_desc_images/6cf51cde-9887-45fa-a3bc-6334dd96b9b3-다운로드_(5).jpeg\\\",\\\"/product_desc_images/83a401aa-9ef5-48a6-85b8-fc7a3b2bf6de-다운로드_(6).jpeg\\\",\\\"/product_desc_images/ddd11b01-f1e8-4ab3-954c-5257352a4dcc-다운로드_(7).jpeg\\\"]\"','2024-09-04 06:35:59.578','2024-09-27 11:34:55.454',9,'9f0d3c81-9f15-4c9e-84f5-5fd44085494c'),('61395984-6ec6-4831-9d36-dce6301c2d10','자사호','차를 공부해보세요.',200000,0,2,0,'AVAILABLE','/product_images/98ce163d-1b4c-47a8-aa37-fc79fc93f3dd-다운로드_(7).jpeg','\"[]\"','2024-09-04 06:47:09.005','2024-09-27 08:43:49.736',15,'9f0d3c81-9f15-4c9e-84f5-5fd44085494c'),('c44b556c-bc18-4db2-8312-1293979cb7ed','고양이2','sdfsdfsdfasdfasdfasdfasdfasdfasdfasdfa',2000,1500,4,0,'AVAILABLE','/product_images/64f2d2ab-784f-44a0-8db6-74ff33c2501d-고양이1.webp','\"[\\\"/product_desc_images/6abb727c-e4d1-466b-8203-9bee971a3c35-다운로드_(2).jpeg\\\",\\\"/product_desc_images/a1981699-85db-4fdc-9897-c0f82d520baf-다운로드_(3).jpeg\\\",\\\"/product_desc_images/5080f6cc-fbf3-4251-8310-f10f5f823e20-다운로드_(4).jpeg\\\"]\"','2024-09-27 07:01:40.468','2024-10-07 01:36:44.957',35,'9f0d3c81-9f15-4c9e-84f5-5fd44085494c'),('f1f26182-6ecc-4e95-8059-eeeb98e0cafe','dddddd','곴포다 푤오귀다히니, 잘앸슨어 판어존을 라사마저에서 허산홀빟단이 엥거건즘의 쟝시어. 누 갭어아와 배쥴킴오아 빌그맡 라파앵티가 징개 무거멘앤바에 이그면 강긴세오는 이하봐너즈가. 철뮤어비 터언은 디엡',20000000,1450000,44,0,'AVAILABLE','/product_images/ae4974f1-808f-45bb-99ee-3a55de03d16b-고양이1.webp','\"[\\\"/product_desc_images/17429e56-2e86-4dfe-b620-f77622b491bc-고양이1.webp\\\",\\\"/product_desc_images/fcd62bb5-3452-4a75-932c-8ba42d4bc461-고양이2.webp\\\",\\\"/product_desc_images/cd8879f2-be2a-4685-8350-322f2162b141-고양이3.jpeg\\\"]\"','2024-09-27 08:53:06.744','2024-10-07 01:36:44.957',35,'9f0d3c81-9f15-4c9e-84f5-5fd44085494c');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
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

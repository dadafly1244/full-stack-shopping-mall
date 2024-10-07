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
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '문의합니다',
  `desc` text COLLATE utf8mb4_unicode_ci,
  `score` double NOT NULL DEFAULT '3',
  `images_path` json DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_review_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `review_user_id_fkey` (`user_id`),
  KEY `review_product_id_fkey` (`product_id`),
  KEY `review_parent_review_id_fkey` (`parent_review_id`),
  CONSTRAINT `review_parent_review_id_fkey` FOREIGN KEY (`parent_review_id`) REFERENCES `review` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `review_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES ('04539ec5-0f6c-4c60-8699-7bf81680d1cf','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으...','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으의 이지다, 오웜니로 에기알아 뱌베닌으로. 다갈인 오소투넜기 희다가 지뫄조의 기아실게 걸번마다 랄아에. 인루가가 근산읨으라, 으기하긔갖앙마엫다 은흑사어다 저든. 봐겨패아임이 각이로세건상는 티힐이닡일의 스해다 디으스아도 해어가 얼않도 랞덕시겜도오에서 포룸프뎐딜고삭진에 월럭엉는 봠소어다.',0,'null',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','1670806e-1332-41de-9244-2b7f293927db','f062f360-76b3-4129-aeb6-62c3d053532e','2024-10-04 01:03:46.598','2024-10-04 01:03:46.598'),('131cda24-988d-46fe-b807-1cbdfb8856ce','\n아프곤후를 다버곤미질로 깨퍄옴써는 브얄자거미나는 릴공...','\n아프곤후를 다버곤미질로 깨퍄옴써는 브얄자거미나는 릴공을 줘셤갔딕어 듈호행라의 온잔은, 텅짗믈배처가. 도은다 제빅쇼다 셩얼 운훔럴들 젼야우한테, 링허오뻥 깅 르라고옥게 비와수셔엔 절딩은 녀뇜. 좌자에서 이메 여브는 반어술이다 철자지만 힌꽷낸 우자다대던은 시도잇단흐저의. 버쇠기로 주즈멕며게 멀비도 ',0,'\"/product_images/2b659a93-10be-43ee-837c-d2a0c5e3dc23-고양이2.webp\"',1,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-30 01:31:41.493','2024-09-30 05:26:35.693'),('15cb9398-33fd-4b19-8933-f9466cb43f94','Vite + React + TSVite +ite + R...','Vite + React + TSVite +ite + React + TSasdfsdfsdfsdfsdfsdfsdfite + React + TSasdfsdfsdfsdfsdfsdfsdfite + React + TSasdfsdfsdfsdfsdfsdfsdf',0,'null',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','0be76572-0d48-4af4-86ff-aacdad41fc6e',NULL,'2024-10-03 18:55:20.223','2024-10-03 18:56:25.426'),('1a6db385-0f1d-4c95-8627-08af9c1c7c77','adsfasdfasdfasdfasdfasdfasdfg ...','adsfasdfasdfasdfasdfasdfasdfg ascfq wae rtfqw45rq234qc34rc324523453456345frdgrw4562wserfaefasdfasdfasdfaerqwaefasdfawerawedasdfasdfa',4.5,'\"/product_images/73837e4a-9a68-49e3-8065-5a4e0d3868e5-고양이3.jpeg\"',1,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8','7fdd283c-986d-4c46-9756-1c88ddf92f6b','2024-09-30 00:27:58.876','2024-09-30 05:28:45.487'),('1ca657a7-dad4-466f-b05c-b9bc56cc394f','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으...','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으의 이지다, 오웜니로 에기알아 뱌베닌으로. 다갈인 오소투넜기 희다가 지뫄조의 기아실게 걸번마다 랄아에. 인루가가 근산읨으라, 으기하긔갖앙마엫다 은흑사어다 저든. 봐겨패아임이 각이로세건상는 티힐이닡일의 스해다 디으스아도 해어가 얼않도 랞덕시겜도오에서 포룸프뎐딜고삭진에 월럭엉는 봠소어다.',0,'null',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','3dbb86fd-cf14-49e7-af58-57ee811e2a4f',NULL,'2024-10-04 01:07:08.460','2024-10-04 01:07:08.460'),('21abc191-e576-4921-acfe-d76073bd043b','캉카혹시어 댜둔을 소르실아는 디레호를 호에껜너겨컵니까....','캉카혹시어 댜둔을 소르실아는 디레호를 호에껜너겨컵니까. 닌간안어가 즈허샤가비의 멤묘나웅는다면 아나럴을 아좌붔궈에다. 옷릘가다 좐헤랜는으며 사재가 몟에스첨긴의, 슈이이느에 쥘가힘운지즈가 라제를. 벼마 개간은 끼구소르채고 다기냔는 주란느우. 가개스쎄긴 비일응이 밴다섯뤄, 세러딘지요다 아번세지 을온아닪머다가 씩히일음 셔지득보의 흔랴나언바의. 거히델뇡임 날비, 엇수심헌잽자부터 혀궁는 앨뼌콘다. 저알과 텸겠조게 시나다 터란으로 매잔, 뵈펭스기 소웜믑아기 에리를. 본앤헤신차다 렬그알은 오즌히막뎌로 굴연앱형 로노.',2.5,'\"/product_images/40cccb43-b519-424b-b28d-73c34edc1d5e-다운로드_(2).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8','1a6db385-0f1d-4c95-8627-08af9c1c7c77','2024-09-30 01:07:05.615','2024-09-30 05:29:53.437'),('261aae6a-fca9-4b8f-b8fc-9ac168b6730c','리뷰리뷸비류비ㅏㅇ리ㅓ미나어리ㅏㅁ넝리ㅏㅓㅁ 니아ㅓ리마넝ㄹ...','리뷰리뷸비류비ㅏㅇ리ㅓ미나어리ㅏㅁ넝리ㅏㅓㅁ 니아ㅓ리마넝ㄹ ㅣㅏ먼이;ㅏ러미;나ㅓㅇㄹ ㅣㅏ먼이라ㅓㅁ니아러미나어리마넝리ㅏ먼이;라ㅓㅁ니아러미;나어리;ㅏㅁ넝리ㅏ먼이라ㅓ미나얼마넝리;ㅏㅁㄴ어;람니;아',5,'\"/product_images/2f4c949d-95c7-4ea2-838e-f0786cc0c93d-김과자.jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 13:12:28.066','2024-09-29 23:42:55.716'),('29d809dc-55dc-4456-80f7-d41bea4d9cdb','리뷰달기 리뷰 좋아요 리뷰달기 리뷰 좋아요 리뷰달기 리...','리뷰달기 리뷰 좋아요 리뷰달기 리뷰 좋아요 리뷰달기 리뷰 좋아요 리',4,'\"/product_images/60f4fa09-2271-403f-80fd-caf7ee8945cf-고양이3.jpeg\"',0,'740a527e-8ec0-400b-b48e-fe7c7537238b','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-10-03 12:47:11.823','2024-10-03 12:48:45.051'),('3a41c410-fbe7-4e37-b371-7a0a2491d13a','한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면...','한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리마넝리ㅏㅁㄴㅇㄹ한글로 하면왜그렇게알미;나어리',0,'null',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','0be76572-0d48-4af4-86ff-aacdad41fc6e',NULL,'2024-10-03 18:50:48.574','2024-10-03 18:50:48.574'),('4028ca46-0f3d-48b7-907b-2ea86d0257d2','리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰...','리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! ',0,'\"/product_images/4d71b698-6662-4ac6-acb3-2dc4a5554296-다운로드_(2).jpeg\"',0,'39a08b0a-5dec-489c-9633-4ded840b2123','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-10-03 19:09:35.946','2024-10-03 19:27:27.373'),('41bbb8c5-70aa-47d1-b212-5379a0c66cb6','asdkf;lkas\';dlflaksjd;lfkjasl;...','asdkf;lkas\';dlflaksjd;lfkjasl;dkjfal;ksjdfl;kajsdlfkjal;skdjffkjlakjsdlfknasldkjnvaksjdnfo;qiehtuo\'asdfasdgaqe4rtwㅁㄹㅇ휵ㄴㄷㅁㄱㅅㅈDFsdfgsdrtgwertwa 감사 감사~ ',0,'\"/product_images/0e7ef266-9138-4078-bcf6-a14fe3df2446-다운로드_(3).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8','dcfe5397-fe53-47cb-9c42-5d8978529fec','2024-09-30 00:00:44.713','2024-09-30 00:00:44.713'),('4ac92a0f-5d41-4a11-9a89-2cbf9290c548','page: pageStatus,\n    pageSize...','page: pageStatus,\n    pageSize: PAGE_SIZE,\n    productId: product?.id,\n    isDeleted: isAdmin ? undefined : false,page: pageStatus,\n    pageSize: PAGE_SIZE,\n    productId: product?.id,\n    isDeleted: isAdmin ? undefined : false,',3,'\"/product_images/4da97503-a062-442b-85a8-01caf20ffbfe-다운로드_(1).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 06:56:21.085','2024-09-29 23:43:05.579'),('4c2436cb-5d86-48aa-aabf-ad6aa148224f','\n아프곤후를 다버곤미질로 깨퍄옴써는 브얄자거미나는 릴공...','\n아프곤후를 다버곤미질로 깨퍄옴써는 브얄자거미나는 릴공을 줘셤갔딕어 듈호행라의 온잔은, 텅짗믈배처가. 도은다 제빅쇼다 셩얼 운훔럴들 젼야우한테, 링허오뻥 깅 르라고옥게 비와수셔엔 절딩은 녀뇜. 좌자에서 이메 여브는 반어술이다 철자지만 힌꽷낸 우자다대',4,'\"/product_images/d614e1c2-3692-4078-ae3a-9395a0222807-다운로드_(2).jpeg\"',0,'39a08b0a-5dec-489c-9633-4ded840b2123','28722657-fcff-41a9-ab38-b3a2cd2ea5e4',NULL,'2024-09-30 05:37:14.214','2024-09-30 05:37:28.172'),('4d0b67cc-7b89-4a9c-a527-31fd9aefc349','갠잘로에 히서는 이큼무히는 라니벤차고, 깬옷므다. 토욭...','갠잘로에 히서는 이큼무히는 라니벤차고, 깬옷므다. 토욭쫀느어 새무자자가 뫄믹헤드를 하라자랭 힌믔긴루름이란 오잉노, 곤차를. 첨돈을 미히궈누다 구겝혹한은 과군옵널 토버군은, 낑뎨디지다, 에득빈대너다, 련아드럴에 흐잰에민. 바센렁에어야만 드서선에게 거기삽허만메가 우하고 ',0,'\"/product_images/7dccddf0-89ce-4b2f-a7c7-57d7ee0b4110-다운로드_(4).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 06:19:08.704','2024-09-29 06:19:08.704'),('4dcc5d5c-3b27-4f87-ac27-653bf97d5c66','리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰...','리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! 리뷰를 달고 싶어요!!! ',0,'null',0,'39a08b0a-5dec-489c-9633-4ded840b2123','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-10-03 19:09:13.136','2024-10-03 19:09:13.136'),('50b244a9-c436-42b6-bf6f-ed4f379e2fbd','ㅁㄹㄴㅁㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹ...','ㅁㄹㄴㅁㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹㄴㅇㄹ',0,'null',0,'39a08b0a-5dec-489c-9633-4ded840b2123','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-10-03 19:27:48.935','2024-10-03 19:27:48.935'),('518402a4-e271-4b90-b68f-679eb27d41ab','\n아프곤후를 다버곤미질로 깨퍄옴써는 브얄자거미나는 릴공...','\n아프곤후를 다버곤미질로 깨퍄옴써는 브얄자거미나는 릴공을 줘셤갔딕어 듈호행라의 온잔은, 텅짗믈배처가. 도은다 제빅쇼다 셩얼 운훔럴들 젼야우한테, 링허오뻥 깅 르라고옥게 비와수셔엔 절딩은 녀뇜. 좌자에서 이메 여브는 반어술이다 철자지만 힌꽷낸 우자다대던은 시도잇단흐저의. 버쇠기로 주즈멕며게 멀비도 ',0,'\"/product_images/2f11e872-d003-4807-bf72-dc4b6a780a23-다운로드_(1).jpeg\"',1,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-30 01:23:09.731','2024-09-30 05:26:41.705'),('52f20889-8393-4b31-bac4-61eb8345dedb','바부야 ㅁㄴㅇㄹㅁㄴㅇㄹ ㅁㄴㅇㄹ ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ...','바부야 ㅁㄴㅇㄹㅁㄴㅇㄹ ㅁㄴㅇㄹ ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁ ㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ ㅁㄴㅇㄹㅁㄴㅇㄹㄷㄴㄴㄴㅇㄹㅁㄴㅇㄹㅁㄴㄷㄱㅎㅈㅁ4ㄷㅈㅁㅈ',0,'\"/product_images/1f43bbcd-98ff-4277-ba27-ef59fbc67027-다운로드_(5).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 13:13:42.734','2024-09-29 13:13:42.734'),('5745bb49-bcb7-42b7-b706-e1e6862bec05','\n아프곤후를 다버곤미질로 깨퍄옴써는 브얄자거미나는 릴공...','\n아프곤후를 다버곤미질로 깨퍄옴써는 브얄자거미나는 릴공을 줘셤갔딕어 듈호행라의 온잔은, 텅짗믈배처가. 도은다 제빅쇼다 셩얼 운훔럴들 젼야우한테, 링허오뻥 깅 르라고옥게 비와수셔엔 절딩은 녀뇜. 좌자에서 이메 여브는 반어술이다 철자지만 힌꽷낸 우자다대던은 시도잇단흐저의. 버쇠기로 주즈멕며게 멀비도 dfsxsssdfadfasdfsdafasdf',4.5,'\"/product_images/517fce18-2bfa-44d6-95f6-4f03f798760b-다운로드_(1).jpeg\"',1,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8','21abc191-e576-4921-acfe-d76073bd043b','2024-09-30 01:16:53.182','2024-09-30 05:28:13.621'),('616b1f6b-30c8-4ce8-b4b0-734ca530a41d','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으...','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으의 이지다, 오웜니로 에기알아 뱌베닌으로. 다갈인 오소투넜기 희다가 지뫄조의 기아실게 걸번마다 랄아에. 인루가가 근산읨으라, 으기하긔갖앙마엫다 은흑사어다 저든. 봐겨패아임이 각이로세건상는',0,'\"/product_images/395a4410-8f8e-4eae-a420-3cf61f3226dc-고양이2.webp\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','0be76572-0d48-4af4-86ff-aacdad41fc6e',NULL,'2024-10-04 00:35:41.293','2024-10-04 00:35:41.293'),('677b4521-5d24-470c-81dc-f38d8c85d7ca','newVariablesnewVariablesnewVar...','newVariablesnewVariablesnewVariablesnewVariablesnewVariablesnewVariablesimageimageimageimageimageimageimageimageimage',0,'\"/product_images/4de19958-000e-4c02-9c51-8bdf1d3e6c17-다운로드_(3).jpeg\"',1,'39a08b0a-5dec-489c-9633-4ded840b2123','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-10-03 19:35:02.053','2024-10-04 02:00:36.292'),('7205ff4a-d5c5-4a6c-a0db-9f1dfee19f55','정말 좋아dd요','대박대박 너무 부드럽고 좋아요. 다시 입고 싶어요',5,'\"\"',0,'39a08b0a-5dec-489c-9633-4ded840b2123','3e8638a1-48af-406c-b9f4-d97f972cd4dd',NULL,'2024-09-26 06:16:15.645','2024-09-26 06:16:15.645'),('7473f4e3-7f25-44d0-a143-63d723711a05','바부야 ㅁㄴㅇㄹㅁㄴㅇㄹ ㅁㄴㅇㄹ ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ...','바부야 ㅁㄴㅇㄹㅁㄴㅇㄹ ㅁㄴㅇㄹ ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁ ㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ ㅁㄴㅇㄹㅁㄴㅇㄹㄷㄴㄴㄴㅇㄹㅁㄴㅇㄹㅁㄴㄷㄱㅎㅈㅁ4ㄷㅈㅁㅈ바부야 바부야 ㅁㄴㅇ',0,'\"/product_images/24cf6195-0b55-46af-952a-7acf41b2f9e3-다운로드_(5).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 13:16:53.463','2024-09-29 13:16:53.463'),('78ce2a10-35c1-4f68-8242-d5584641aec6','바부야 ㅁㄴㅇㄹㅁㄴㅇㄹ ㅁㄴㅇㄹ ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ...','바부야 ㅁㄴㅇㄹㅁㄴㅇㄹ ㅁㄴㅇㄹ ㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁ ㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹㅁㄴㅇㄹ ㅁㄴㅇㄹㅁㄴㅇㄹㄷㄴㄴㄴㅇㄹㅁㄴㅇㄹㅁㄴㄷㄱㅎㅈㅁ4ㄷㅈㅁㅈ바부야',2.5,'\"/product_images/0fc29a3a-1394-4606-bfb9-d33fa26f5e0e-다운로드_(6).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 13:17:07.077','2024-09-29 23:36:42.733'),('7b19bac1-b4b9-4ca9-ae6e-901f1c1f779c','sdfsdfaaaaadddd  const [search...','sdfsdfaaaaadddd  const [searchParams, setSearchParams] = useSearchParams();\n  const [searchParams, setSearchParams] = useSearchParams();\n',0,'\"/product_images/f2aadaf0-dffa-47b4-975d-938158e93209-다운로드_(6).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 06:43:15.502','2024-09-29 06:43:15.502'),('7fdd283c-986d-4c46-9756-1c88ddf92f6b','ㄴㄴㅇㅁㄴㅇㅁㄴㅇㄹㄴㅇㄹㅇㅇㅇㅇㅁㄴㅇㄹㄹㅇㄴㄷㅁㅇㄴ륲ㅁ...','ㄴㄴㅇㅁㄴㅇㅁㄴㅇㄹㄴㅇㄹㅇㅇㅇㅇㅁㄴㅇㄹㄹㅇㄴㄷㅁㅇㄴ륲ㅁㄹㄷㅇㄹㅁㄴㄷㄹㅈㄷㄷㄱㄴㅇㅇㅁㄴㄷㄹㄹㅁㅈㄹㄷㅌㅋㅇㄹㅁㄴㄹㅈㅇㄹㅇㄹㅈㄷㄷㄹㄹㅋㄹㅋㅌㄹㅇㄴㅇㄷㄱㅎㅁㄷㄱㄹㅎㅁㄴㅇㄹㅋㄴㅌ츟ㄴㄷㄱㅎㅂㅁㄴㅋㄷㄹㅁ',5,'\"/product_images/2cb42b8c-5c6e-4c75-9f79-bab8280ac887-다운로드_(7).jpeg\"',1,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8','41bbb8c5-70aa-47d1-b212-5379a0c66cb6','2024-09-30 00:19:16.929','2024-09-30 05:29:37.020'),('832c6f85-16f6-4bd7-a27a-f4ceefb077a6','정말 좋아dd요jdjdjd','대박대박 너무 부드럽고 좋아요. 다시 입고 싶어요',5,'\"\"',0,'39a08b0a-5dec-489c-9633-4ded840b2123','3e8638a1-48af-406c-b9f4-d97f972cd4dd',NULL,'2024-09-26 06:16:50.074','2024-09-26 06:16:50.074'),('8d5ae692-d7b7-4425-bd98-47f431e1e03b','양다영디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 ...','양다영디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으의 이지다, 오웜니로 에기알아 뱌베닌으로. 다갈인 오소투넜기 희다가 지뫄조의 기아실게 걸번마다 랄아에. 인루가가 근산읨으라, 으기하긔갖앙마엫다 은흑사어다 저든. 봐겨패아임이 각이로세건상는 티힐이닡일의 스해다 디으스아도 해어가 얼않도 랞덕시겜도오에서 포룸프뎐딜고삭진에 월럭엉는 봠소어다.',0,'\"/product_images/75c0b9f6-628d-4ab6-bcca-acdc387f2ae0-다운로드_(1).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','c44b556c-bc18-4db2-8312-1293979cb7ed',NULL,'2024-10-04 00:59:38.144','2024-10-04 00:59:56.343'),('8f33d2f1-9449-41c2-86ff-55cb2dfd7f99','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으...','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으의 이지다, 오웜니로 에기알아 뱌베닌으로. 다갈인 오소투넜기 희다가 지뫄조의 기아실게 걸번마다 랄아에. 인루가가 근산읨으라, 으기하긔갖앙마엫다 은흑사어다 저든. 봐겨패아임이 각이로세건상는 티힐이닡일의 스해다 디으스아도 해어가 얼않도 랞덕시겜도오에서 포룸프뎐딜고삭진에 월럭엉는 봠소어다.',0,'null',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','61395984-6ec6-4831-9d36-dce6301c2d10',NULL,'2024-10-04 01:18:27.840','2024-10-04 01:18:27.840'),('9c04dced-f72e-4e01-aca9-d4771242a338','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으...','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으의 이지다, 오웜니로 에기알아 뱌베닌으로. 다갈인 오소투넜기 희다가 지뫄조의 기아실게 걸번마다 랄아에. 인루가가 근산읨으라, 으기하긔갖앙마엫다 은흑사어다 저든. 봐겨패아임이 각이로세건상는 티힐이닡일의 스해다 디으스아도 해어가 얼않도 랞덕시겜도오에서 포룸프뎐딜고삭진에 월럭엉는 봠소어다.',0,'null',0,'39a08b0a-5dec-489c-9633-4ded840b2123','45f35c9c-481b-495b-9c22-9802b446dcc8','50b244a9-c436-42b6-bf6f-ed4f379e2fbd','2024-10-04 01:06:50.637','2024-10-04 01:06:50.637'),('a730d626-ed97-42e1-90e8-868f47347082','갠잘로에 히서는 이큼무히는 라니벤차고, 깬옷므다. 토욭...','갠잘로에 히서는 이큼무히는 라니벤차고, 깬옷므다. 토욭쫀느어 새무자자가 뫄믹헤드를 하라자랭 힌믔긴루름이란 오잉노, 곤차를. 첨돈을 미히궈누다 구겝혹한은 과군옵널 토버군은, 낑뎨디지다, 에득빈대너다, 련아드럴에 흐잰에민. 바센렁에어야만 드서선에게 거기삽허만메가 우하고 ',0,'\"/product_images/1a7fb6e1-d5e8-48be-8e68-431761808f08-다운로드_(1).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 06:12:22.055','2024-09-29 06:12:22.055'),('a769a41a-d081-41e3-8d35-9e1c5234728d','const image = await saveFile(\n...','const image = await saveFile(\n              args.images_path?.file,\n              \"product_images\",\n            );\n\n            //TODO: 사용자가 실제로 이 상품을 주문한 이력이 있는지 확인하기하고 있으면 통과, 없으면 에러\n\n            const newReview = await context.prisma.review.create({\n              data: {\n                title,\n                desc,\n                score,\n                images_path: image,\n                is_deleted: false,\n                user: { connect: { id: user.id } },\n                product: { connect: { id: product_id } },\n                parentReview: args.parent_review_id\n                  ? { connect: { id: args.parent_review_id } }\n                  : undefined, // 관리자의 경우 대댓글 허용\n              },\n            });\n\n            return newReview;',0,NULL,0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','0be76572-0d48-4af4-86ff-aacdad41fc6e',NULL,'2024-10-04 00:37:59.829','2024-10-04 00:37:59.829'),('b01cbab0-4a99-4a21-a742-dc0fadac9915','const image = await saveFile(\n...','const image = await saveFile(\n              args.images_path?.file,\n              \"product_images\",\n            );\n\n            //TODO: 사용자가 실제로 이 상품을 주문한 이력이 있는지 확인하기하고 있으면 통과, 없으면 에러\n\n            const newReview = await context.prisma.review.create({\n              data: {\n                title,\n                desc,\n                score,\n                images_path: image,\n                is_deleted: false,\n                user: { connect: { id: user.id } },\n                product: { connect: { id: product_id } },\n                parentReview: args.parent_review_id\n                  ? { connect: { id: args.parent_review_id } }\n                  : undefined, // 관리자의 경우 대댓글 허용\n              },\n            });\n\n            return newReview;',0,NULL,1,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','0be76572-0d48-4af4-86ff-aacdad41fc6e',NULL,'2024-10-04 00:37:53.222','2024-10-04 00:38:54.559'),('b030dea8-c6ab-48f3-950a-6c0ea71704d3','\n아프곤후를 다버곤미질로 깨퍄옴써는 브얄자거미나는 릴공...','\n아프곤후를 다버곤미질로 깨퍄옴써는 브얄자거미나는 릴공을 줘셤갔딕어 듈호행라의 온잔은, 텅짗믈배처가. 도은다 제빅쇼다 셩얼 운훔럴들 젼야우한테, 링허오뻥 깅 르라고옥게 비와수셔엔 절딩은 녀뇜. 좌자에서 이메 여브는 반어술이다 철자지만 힌꽷낸 우자다대던은 시도잇단흐저의. 버쇠기로 주즈멕며게 멀비도 ',0,'\"/product_images/21299484-3d21-4e8b-acb8-29717673318d-고양이1.webp\"',0,'39a08b0a-5dec-489c-9633-4ded840b2123','28722657-fcff-41a9-ab38-b3a2cd2ea5e4',NULL,'2024-09-30 05:37:34.587','2024-10-04 00:14:01.511'),('b24d2d49-4281-4ca0-9c6b-7b69eb64de8f','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으...','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으의 이지다, 오웜니로 에기알아 뱌베닌으로. 다갈인 오소투넜기 희다가 지뫄조의 기아실게 걸번마다 랄아에. 인루가가 근산읨으라, 으기하긔갖앙마엫다 은흑사어다 저든. 봐겨패아임이 각이로세건상는 티힐이닡일의 스해다 디으스아도 해어가 얼않도 랞덕시겜도오에서 포룸프뎐딜고삭진에 월럭엉는 봠소어다.디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으의 이지다, 오웜니로 에기알아 뱌베닌으로. 다갈인 오소투넜기 희다가 지뫄조의 기아실게 걸번마다 랄아에. 인루가가 근산읨으라, 으기하긔갖앙마엫다 은흑사어다 저든. 봐겨패아임이 각이로세건상는 티힐이닡일의 스해다 디으스아도 해어가 얼않도 랞덕시겜도오에서 포룸프뎐딜고삭진에 월럭엉는 봠소어다.',0,'null',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','c44b556c-bc18-4db2-8312-1293979cb7ed','8d5ae692-d7b7-4425-bd98-47f431e1e03b','2024-10-04 00:59:42.828','2024-10-04 00:59:48.922'),('c6dd9c1f-dc86-4dde-a73d-9bb12294e9bd','asdkf;lkas\';dlflaksjd;lfkjasl;...','asdkf;lkas\';dlflaksjd;lfkjasl;dkjfal;ksjdfl;kajsdlfkjal;skdjffkjlakjsdlfknasldkjnvaksjdnfo;qiehtuo\'asdfasdgaqe4rtwㅁㄹㅇ휵ㄴㄷㅁㄱㅅㅈDFsdfgsdrtgwertwa 감사 감사~ ㄴㅇㅇㄹㄹㄴㅇㄹㄴㅇㄹㄴ',0,'\"/product_images/8a8a379d-4a68-4116-bf34-74caa3206b9c-다운로드_(6).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8','dcfe5397-fe53-47cb-9c42-5d8978529fec','2024-09-30 00:18:25.854','2024-09-30 05:29:39.664'),('c7f56cbd-a062-435b-9611-02d116ef4d4b',' key={reviewKey} key={reviewKe...',' key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey}',0,'\"/product_images/70a4f745-1425-43fd-93db-1c767acbdfb6-고양이3.jpeg\"',1,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-30 01:41:13.914','2024-09-30 05:26:58.221'),('cb3a3f19-d917-4aba-9a11-e72cd2837c21','dsfconst newReview = await con...','dsfconst newReview = await context.prisma.review.create({\n              data: {\n                title,\n                desc,\n                score,\n                images_path: image,\n                is_deleted: false,\n                user: { connect: { id: user.id } },\n                product: { connect: { id: product_id } },\n                parentReview: args.parent_review_id\n                  ? { connect: { id: args.parent_review_id } }\n                  : undefined, // 관리자의 경우 대댓글 허용\n              },\n            });\n            return newReview;const newReview = await context.prisma.review.create({\n              data: {\n                title,\n                desc,\n                score,\n                images_path: image,\n                is_deleted: false,\n                user: { connect: { id: user.id } },\n                product: { connect: { id: product_id } },\n                parentReview: args.parent_review_id\n                  ? { connect: { id: args.parent_review_id } }\n    ',0,'\"/product_images/fe410251-4fdb-405a-ab05-2532580fe432-김과자.jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','0be76572-0d48-4af4-86ff-aacdad41fc6e',NULL,'2024-10-04 00:43:05.031','2024-10-04 00:43:05.031'),('ccd127fd-9ca7-4905-8c37-ce65705e3270','리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰...','리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리뷰등록리333333333333',3,'\"/product_images/1e0f48d2-84b1-4d31-82c5-9a388906f935-고양이3.jpeg\"',0,'2e32dc1d-20a4-470a-b8f6-5e399a9b205b','f1f26182-6ecc-4e95-8059-eeeb98e0cafe',NULL,'2024-10-04 01:55:11.187','2024-10-04 01:55:42.983'),('cda86ddf-b7fc-462c-bed5-b57f2a00828d','asdfsdconst image = await save...','asdfsdconst image = await saveFile(\n              args.images_path?.file,\n              \"product_images\",\n            );\n\n            //TODO: 사용자가 실제로 이 상품을 주문한 이력이 있는지 확인하기하고 있으면 통과, 없으면 에러\n\n            const newReview = await context.prisma.review.create({\n              data: {\n                title,\n                desc,\n                score,\n                images_path: image,\n                is_deleted: false,\n                user: { connect: { id: user.id } },\n                product: { connect: { id: product_id } },\n                parentReview: args.parent_review_id\n                  ? { connect: { id: args.parent_review_id } }\n                  : undefined, // 관리자의 경우 대댓글 허용\n              },\n            });\n\n            return newReview;',0,NULL,0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','0be76572-0d48-4af4-86ff-aacdad41fc6e',NULL,'2024-10-04 00:37:35.838','2024-10-04 00:37:35.838'),('d4f7f249-4599-47b0-9166-6d6266b88135','hello   const [searchParams, s...','hello   const [searchParams, setSearchParams] = useSearchParams();\n  const [searchParams, setSearchParams] = useSearchParams();\n  const [searchParams, setSearchParams] = useSearchParams();\n  const [searchParams, setSearchParams] = useSearchParams();\n',0,'\"/product_images/3bff02f3-6975-4bd2-8ee7-c05d7da02d82-다운로드_(2).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 06:38:59.707','2024-09-29 06:38:59.707'),('dcfe5397-fe53-47cb-9c42-5d8978529fec','asdfsdfasdfasdfasdfasdssssfffd...','asdfsdfasdfasdfasdfasdssssfffdasd g4wwewetwetasdfsdfㄴㄴㄷㄱㅈ234235362ㄹㄴㅇㄹㅁㄹㅎㅍㅌㅊㅌㅊㅍㅋㅇㄴㄹㅎㄴㄱㅅㅈㄷㄴㅇㄹㅁ4ㅈㅅ23452346345',2.5,'\"/product_images/e887bd28-3129-4a4f-8406-3c711c9905be-다운로드_(5).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 13:28:46.900','2024-09-29 23:39:19.579'),('df2dd44e-a54e-4cae-ac08-f8bb498711d4','sdfsdfadfaasdfasdfasdfasdfa sd...','sdfsdfadfaasdfasdfasdfasdfa sdfasdfaw3ewfszdfasdf awefasdgfa dfarg agasdfa sedfa wergsefgasd. awergsfgsddaag sdsf adg',3.5,'\"/product_images/6f7d8353-feff-49ba-9016-b5d0eea3f20b-고양이3.jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 13:19:17.022','2024-09-29 23:34:26.568'),('df96b64c-fdb9-4d07-88f1-19679a5c57ac','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으...','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으의 이지다, 오웜니로 에기알아 뱌베닌으로. 다갈인 오소투넜기 희다가 지뫄조의 기아실게 걸번마다 랄아에. 인루가가 근산읨으라, 으기하긔갖앙마엫다 은흑사어다 저든. 봐겨패아임이 각이로세건상는 티힐이닡일의 스해다 디으스아도 해어가 얼않도 랞덕시겜도오에서 포룸프뎐딜고삭진에 월럭엉는 봠소어다.',0,'null',0,'39a08b0a-5dec-489c-9633-4ded840b2123','28722657-fcff-41a9-ab38-b3a2cd2ea5e4','b030dea8-c6ab-48f3-950a-6c0ea71704d3','2024-10-04 01:06:59.852','2024-10-04 01:06:59.852'),('e0da9b45-d80f-4765-ad94-35c2dd296697','searchParams.set(\"tabState\", \"...','searchParams.set(\"tabState\", \"desc\");\n    setSearchParams(searchParams);searchParams.set(\"tabState\", \"desc\");\n    setSearchParams(searchParams);',0,'\"/product_images/9fbd3d3e-bd34-4ce3-885f-b47baf74053f-다운로드_(1).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 06:36:50.120','2024-09-29 06:36:50.120'),('e80d48de-cb3b-4e48-b604-4cdb590d94dc','key={reviewKey} key={reviewKey...','key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKey} key={reviewKe',0,'null',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8','c7f56cbd-a062-435b-9611-02d116ef4d4b','2024-10-04 02:01:26.248','2024-10-04 02:01:26.248'),('ebb1e57c-f160-47ac-aa73-2032bb405638','const image = await saveFile(\n...','const image = await saveFile(\n              args.images_path?.file,\n              \"product_images\",\n            );',0,'\"/product_images/de7ca6c1-f42d-4137-805f-b9253eabdcdd-다운로드_(1).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','0be76572-0d48-4af4-86ff-aacdad41fc6e',NULL,'2024-10-04 00:38:45.428','2024-10-04 00:38:45.428'),('edf9e706-7807-4875-9888-a5d5ad898acc','sdfsdfs디오랄깄 이미날블어서 안압하셔다 어껸으로 ...','sdfsdfs디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으의 이지다, 오웜니로 에기알아 뱌베닌으로. 다갈인 오소투넜기 희다가 지뫄조의 기아실게 걸번마다 랄아에. 인루가가 근산읨으라, 으기하긔갖앙마엫다 은흑사어다 저든. 봐겨패아임이 각이로세건상는 티힐이닡일의 스해다 디으스아도 해어가 얼않도 랞덕시겜도오에서 포룸프뎐딜고삭진에 월럭엉는 봠소어다.',0,'null',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','0be76572-0d48-4af4-86ff-aacdad41fc6e','cb3a3f19-d917-4aba-9a11-e72cd2837c21','2024-10-04 01:02:48.665','2024-10-04 01:02:48.665'),('f062f360-76b3-4129-aeb6-62c3d053532e','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으...','디오랄깄 이미날블어서 안압하셔다 어껸으로 항괐은 운보으의 이지다, 오웜니로 에기알아 뱌베닌으로. 다갈인 오소투넜기 희다가 지뫄조의 기아실게 걸번마다 랄아에. 인루가가 근산읨으라, 으기하긔갖앙마엫다 은흑사어다 저든. 봐겨패아임이 각이로세건상는 티힐이닡일의 스해다 디으스아도 해어가 얼않도 랞덕시겜도오에서 포룸프뎐딜고삭진에 월럭엉는 봠소어다.',0,'\"/product_images/e8e910a6-e6c8-491f-9df3-2bec65c768ea-다운로드_(6).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','1670806e-1332-41de-9244-2b7f293927db',NULL,'2024-10-04 01:03:42.491','2024-10-04 01:03:42.491'),('f5c28787-cc64-455e-b08a-be15dc4bfc41','  const [searchParams, setSear...','  const [searchParams, setSearchParams] = useSearchParams();\n  const [searchParams, setSearchParams] = useSearchParams();\n  const [searchParams, setSearchParams] = useSearchParams();\n',0,'\"/product_images/7a7265ec-4ec9-4baa-acff-c6bd1d7093de-다운로드_(3).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 06:40:25.816','2024-09-29 06:40:25.816'),('f5eb0fc4-821a-4ed2-bacb-74d72cc1c0c5','page: pageStatus,\n    pageSize...','page: pageStatus,\n    pageSize: PAGE_SIZE,\n    productId: product?.id,\n    isDeleted: isAdmin ? undefined : false,page: pageStatus,\n    pageSize: PAGE_SIZE,\n    productId: product?.id,\n    isDeleted: isAdmin ? undefined : false,',0,'\"/product_images/e52159f1-e674-4aa1-ad1c-9249edc71145-다운로드_(1).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 06:55:55.241','2024-09-29 06:55:55.241'),('f6c5095d-d25a-4221-8b4c-e80714304717','아프곤후를 다버곤미질로 깨퍄옴써는 브얄자거미나는 릴공을...','아프곤후를 다버곤미질로 깨퍄옴써는 브얄자거미나는 릴공을 줘셤갔딕어 듈호행라의 온잔은, 텅짗믈배처가. 도은다 제빅쇼다 셩얼 운훔럴들 젼야우한테, 링허오뻥 깅 르라고옥게 비와수셔엔 절딩은 녀뇜. 좌자에서 이메 여브는 반어술이다 철자지만 힌꽷낸 우자다대던은 시도잇단흐저의. 버쇠기로 주즈멕며게 멀비도 ',3.5,'\"/product_images/e5a62f1a-d306-4985-941a-a2b29f7fcfb1-고양이2.webp\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-30 01:17:41.578','2024-09-30 01:17:47.812'),('f81e22b9-81bd-4705-8347-52451c4f283b','\n    if(rawUrls === \"[]\") retu...','\n    if(rawUrls === \"[]\") return \"\"\n    if(rawUrls){\n      return `${import.meta.env.VITE_BE_URL}${rawUrls}`\n    }else {\n return \"\"\n    }',0,'null',0,'39a08b0a-5dec-489c-9633-4ded840b2123','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-10-03 19:24:57.099','2024-10-03 19:24:57.099'),('f948e360-0057-4833-b2e4-94b21e145d56','onClick={handleCreateReview}on...','onClick={handleCreateReview}onClick={handleCreateReview}onClick={handleCreateReview}onClick={handleCreateReview}onClick={handleCreateReview}onClick={handleCreateReview}onClick={handleCreateReview}onClick={handleCreateReview}',0,'\"/product_images/eb5fd502-33c1-4828-bde3-22a1e5f5357d-다운로드_(4).jpeg\"',0,'333fd5a0-6436-4ef5-9e21-0d5428f823e6','45f35c9c-481b-495b-9c22-9802b446dcc8',NULL,'2024-09-29 06:28:30.133','2024-09-29 06:28:30.133');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
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
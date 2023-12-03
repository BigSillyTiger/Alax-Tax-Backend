-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: alax_tax_db
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_level`
--

DROP TABLE IF EXISTS `admin_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_level` (
  `admin_id` tinyint unsigned NOT NULL AUTO_INCREMENT,
  `fk_uid` tinyint unsigned DEFAULT NULL,
  `dashboard` tinyint NOT NULL DEFAULT '2',
  `clients` tinyint NOT NULL DEFAULT '2',
  `orders` tinyint NOT NULL DEFAULT '2',
  `calendar` tinyint NOT NULL DEFAULT '2',
  `employees` tinyint NOT NULL DEFAULT '2',
  `management` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `fk_uid` (`fk_uid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_level`
--

LOCK TABLES `admin_level` WRITE;
/*!40000 ALTER TABLE `admin_level` DISABLE KEYS */;
INSERT INTO `admin_level` VALUES (1,1,3,3,3,2,3,3),(2,2,3,3,3,2,0,0);
/*!40000 ALTER TABLE `admin_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `client_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone` varchar(25) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `suburb` varchar(100) DEFAULT 'Adelaide',
  `city` varchar(100) DEFAULT 'Adelaide',
  `state` varchar(10) DEFAULT 'SA',
  `country` varchar(20) DEFAULT 'Australia',
  `postcode` varchar(10) DEFAULT '5000',
  `created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `archive` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`client_id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (4,'Eberto','Stivens','120-288-2014','estivens3@myspace.com','Room 530','JP-35','Melbourne','SA','Australia','1084','2023-10-15 10:36:22',1),(5,'Esmaria','Dericot','858-880-0741','edericot4@telegraph.co.uk','Room 826','US-AK','Eastern Suburbs Mc','SA','Australia','2117','2023-10-15 10:36:22',1),(6,'Danna1','Robshaw','102-400-6958','drobshaw5@tinyurl.com','PO Box 50422','DZ-11','Adelaide Mail Centre','SA','Australia','7412','2023-10-15 10:36:22',0),(7,'Roberto','Meardon','588-462-6770','rmeardon6@is.gd','4th Floor','MM-03','Sydney South','SA','Australia','5700','2023-10-15 10:36:22',0),(8,'Carilyn','Doutch','595-454-7334','cdoutch7@wp.com','3rd Floor','CU-04','Melbourne','SA','Australia','6660','2023-10-15 10:36:22',0),(9,'Woody','Ozanne','333-974-2525','wozanne8@de.vu','Apt 1233','IN-AS','Sydney','SA','Australia','2984','2023-10-15 10:36:22',0),(10,'Lyndel','Blanket','822-844-6411','lblanket9@cnet.com','Suite 88','JP-47','Melbourne','SA','Australia','3489','2023-10-15 10:36:22',0),(11,'Ellary','Keatch','523-379-8431','ekeatcha@facebook.com','Apt 519','FJ-N','Sydney','SA','Australia','4207','2023-10-15 10:36:22',0),(12,'Linea','Laffranconi','231-816-9313','llaffranconib@biglobe.ne.jp','19th Floor','UA-48','Perth','SA','Australia','1408','2023-10-15 10:36:22',0),(13,'Sheilakathryn','McGrae','144-499-6997','smcgraec@irs.gov','Apt 475','PK-PB','Sydney','SA','Australia','2617','2023-10-15 10:36:22',0),(14,'Pearce','Melwall','326-287-5954','pmelwalld@apple.com','Suite 2','US-TX','Adelaide Mail Centre','SA','Australia','6160','2023-10-15 10:36:22',0),(15,'Emeline','Bees','928-992-6995','ebeese@nba.com','Room 651','US-AK','Sydney','SA','Australia','7590','2023-10-15 10:36:22',0),(16,'Rockie','Vivien','239-842-3956','rvivienf@google.pl','Apt 633','PG-WPD','Sydney','SA','Australia','7804','2023-10-15 10:36:22',0),(17,'Lizzie','Gallico','450-133-1787','lgallicog@diigo.com','Suite 80','US-WA','Perth','SA','Australia','6129','2023-10-15 10:36:22',0),(18,'Elysha','Harvie','790-480-2161','eharvieh@posterous.com','Room 1524','CA-ON','Northern Suburbs Mc','SA','Australia','5154','2023-10-15 10:36:22',0),(19,'Jessa','Carbery','183-796-5434','jcarberyi@dmoz.org','Suite 46','AU-WA','Launceston','SA','Australia','1604','2023-10-15 10:36:22',0),(20,'Gusella','Dimmer','579-246-2230','gdimmerj@ezinearticles.com','PO Box 18398','MX-COA','Launceston','SA','Australia','5724','2023-10-15 10:36:22',0),(21,'Dolores','Sheehan','909-255-9615','dsheehank@phoca.cz','Room 1425','FR-V','Eastern Suburbs Mc','SA','Australia','6907','2023-10-15 10:36:22',0),(22,'Tades','Pietruszka','562-804-4389','tpietruszkal@adobe.com','Room 326','AU-VIC','Brisbane','SA','Australia','6967','2023-10-15 10:36:22',0),(23,'Archibaldo','Wych','316-272-5748','awychm@mapy.cz','Apt 406','GB-ENG','Australia Square','SA','Australia','1027','2023-10-15 10:36:22',0),(24,'Matthiew','Orman','435-121-2214','mormann@buzzfeed.com','1st Floor','US-AK','Perth','SA','Australia','5275','2023-10-15 10:36:22',0),(25,'Linea','Headley','634-260-5043','lheadleyo@foxnews.com','17th Floor','CG-8','Perth','SA','Australia','1162','2023-10-15 10:36:22',0),(26,'Felipa','Spolton','349-550-0891','fspoltonp@businessinsider.com','Room 510','GG-U-A','Sydney','SA','Australia','6015','2023-10-15 10:36:22',0),(27,'Kevina','Hainsworth','993-482-4240','khainsworthq@icio.us','Apt 102','US-ID','Sydney','SA','Australia','7562','2023-10-15 10:36:22',0),(28,'Shandy','Mapam','243-490-5030','smapamr@cbslocal.com','Apt 930','IS-7','Australia Square','SA','Australia','6476','2023-10-15 10:36:22',0),(29,'Venus','Purrington','822-973-7707','vpurringtons@symantec.com','Apt 210','BJ-AL','Strawberry Hills','SA','Australia','4410','2023-10-15 10:36:22',0),(30,'Charmane','Littleover','887-244-5930','clittleovert@sun.com','Apt 1834','MY-01','Sydney','SA','Australia','2027','2023-10-15 10:36:22',0),(31,'Rubetta','Grummitt','149-853-2493','rgrummittu@seattletimes.com','Room 1997','US-WY','Hobart','SA','Australia','7710','2023-10-15 10:36:22',0),(32,'Priscilla','Hurdle','377-665-0318','phurdlev@lycos.com','Suite 11','AU-VIC','Adelaide','SA','Australia','2254','2023-10-15 10:36:22',0),(33,'Louise','Migheli','688-296-7694','lmigheliw@microsoft.com','Apt 737','ZM-04','Hobart','SA','Australia','2651','2023-10-15 10:36:22',0),(34,'Kellyann','Caulton','872-968-0871','kcaultonx@imageshack.us','9th Floor','CA-MB','Sydney','SA','Australia','2706','2023-10-15 10:36:22',0),(35,'Timmy','Lias','672-438-5564','tliasy@ezinearticles.com','Suite 34','GA-6','Sydney','SA','Australia','6863','2023-10-15 10:36:22',0),(36,'Brnaba','Stille','276-371-8671','bstillez@apple.com','19th Floor','AU-NSW','Sydney South','SA','Australia','3367','2023-10-15 10:36:22',0),(37,'Teodor','Franklin','327-287-3950','tfranklin10@ebay.co.uk','16th Floor','US-VA','Sydney','SA','Australia','5184','2023-10-15 10:36:22',0),(38,'Florentia','Pinke','245-357-8209','fpinke11@seesaa.net','16th Floor','US-TX','Adelaide Mail Centre','SA','Australia','3684','2023-10-15 10:36:22',0),(39,'Abbot','Pargiter','955-729-2922','apargiter12@narod.ru','PO Box 60117','US-AK','Northern Suburbs Mc','SA','Australia','1396','2023-10-15 10:36:22',0),(40,'Matteo','Beloe','881-145-3020','mbeloe13@theglobeandmail.com','Room 908','AU-QLD','Sydney','SA','Australia','5793','2023-10-15 10:36:22',0),(41,'Elisa','Gisbey','590-848-8827','egisbey14@huffingtonpost.com','PO Box 67980','US-TX','Hobart','SA','Australia','6354','2023-10-15 10:36:22',0),(42,'Drucie','Agge','138-159-3155','dagge15@dmoz.org','Suite 15','BW-GH','Perth','SA','Australia','5915','2023-10-15 10:36:22',0),(43,'Rolfe','Kelloway','141-792-3412','rkelloway16@wired.com','PO Box 53233','US-CA','Sydney','SA','Australia','3405','2023-10-15 10:36:22',0),(44,'Mira','Kays','224-808-4284','mkays17@photobucket.com','PO Box 97748','CR-P','Melbourne','SA','Australia','1417','2023-10-15 10:36:22',0),(45,'Allistir','Zum Felde','756-567-4822','azumfelde18@jalbum.net','6th Floor','VN-40','Sydney','SA','Australia','3094','2023-10-15 10:36:22',0),(46,'Mycah','Draycott','726-217-9561','mdraycott19@goodreads.com','2nd Floor','BR-SP','Eastern Suburbs Mc','SA','Australia','7112','2023-10-15 10:36:22',0),(47,'Leola','Meadway','949-964-3478','lmeadway1a@pagesperso-orange.fr','Apt 1995','US-OH','Melbourne','SA','Australia','5720','2023-10-15 10:36:22',0),(48,'Jennica','Mcwhinney','347-864-1609','jmcwhinney1b@storify.com','PO Box 61671','CN-65','Perth','SA','Australia','5040','2023-10-15 10:36:22',0),(49,'Lita','Jeavons','118-920-6487','ljeavons1c@opera.com','Suite 58','US-WI','Eastern Suburbs Mc','SA','Australia','7306','2023-10-15 10:36:22',0),(50,'Ranee','Bissill','139-845-9907','rbissill1d@adobe.com','Suite 37','US-CA','Eastern Suburbs Mc','SA','Australia','6438','2023-10-15 10:36:22',0),(51,'Robinett','Vandenhoff','269-812-8357','rvandenhoff1e@barnesandnoble.com','Apt 811','PT-11','Eastern Suburbs Mc','SA','Australia','7031','2023-10-15 10:36:22',0),(52,'Flint','Pettus','303-465-7837','fpettus1f@wiley.com','Apt 225','PG-SHM','Launceston','SA','Australia','6821','2023-10-15 10:36:22',0),(53,'Cornie','Lonergan','901-950-7384','clonergan1g@usatoday.com','PO Box 13311','ES-M','Melbourne','SA','Australia','3681','2023-10-15 10:36:22',0),(54,'Clyve','Hateley','277-510-8810','chateley1h@wp.com','Room 1157','US-FL','Sydney','SA','Australia','1588','2023-10-15 10:36:22',0),(55,'Tammi','Gieves','899-691-0602','tgieves1i@t-online.de','7th Floor','US-TX','Adelaide','SA','Australia','2074','2023-10-15 10:36:22',0),(56,'Tina','Krebs','835-213-4505','tkrebs1j@reuters.com','Suite 23','GY-BA','Sydney','SA','Australia','5454','2023-10-15 10:36:22',0),(57,'Bernete','Olivello','542-237-7949','bolivello1k@npr.org','PO Box 88161','VE-V','Adelaide Mail Centre','SA','Australia','6827','2023-10-15 10:36:22',0),(58,'Mame','Povele','987-786-4333','mpovele1l@about.me','Room 886','CN-22','Sydney South','SA','Australia','2583','2023-10-15 10:36:22',0),(59,'Dael','Allmark','726-815-2426','dallmark1m@sourceforge.net','Suite 52','MX-BCS','Hobart','SA','Australia','7037','2023-10-15 10:36:22',0),(60,'Darbee','Grushin','368-555-8494','dgrushin1n@yahoo.co.jp','PO Box 75055','FI-LL','Northern Suburbs Mc','SA','Australia','3652','2023-10-15 10:36:22',0),(61,'Janela','Zanettini','974-297-8783','jzanettini1o@skype.com','18th Floor','GB-ENG','Eastern Suburbs Mc','SA','Australia','5968','2023-10-15 10:36:22',0),(62,'Gerianne','Howland','691-512-4109','ghowland1p@reddit.com','18th Floor','SN-DK','Launceston','SA','Australia','6006','2023-10-15 10:36:22',0),(63,'Mortimer','Spilstead','975-348-1721','mspilstead1q@google.com.br','Apt 1285','OM-WU','Adelaide Mail Centre','SA','Australia','2790','2023-10-15 10:36:22',0),(64,'Shirline','Hollier','404-673-8948','shollier1r@dion.ne.jp','Apt 1768','BY-MA','Eastern Suburbs Mc','SA','Australia','4848','2023-10-15 10:36:22',0),(65,'Uta','Mecchi','680-410-3657','umecchi1s@disqus.com','18th Floor','BR-TO','Perth','SA','Australia','7674','2023-10-15 10:36:22',0),(66,'Dell','Laydon','648-953-5673','dlaydon1t@friendfeed.com','Apt 761','MS-U-A','Sydney','SA','Australia','7894','2023-10-15 10:36:22',0),(67,'Peri','Taillard','388-489-8046','ptaillard1u@spiegel.de','Suite 5','CZ-MO','Hobart','SA','Australia','4991','2023-10-15 10:36:22',0),(68,'Samaria','Cuttles','134-555-8335','scuttles1v@cafepress.com','Room 449','JP-12','Adelaide Mail Centre','SA','Australia','4044','2023-10-15 10:36:22',0),(76,'Areos1','Chen','1111','1111@gmail.com','4A Bignell Street','SA','RICHMOND','SA','Australia','5033','2023-10-15 11:40:20',0),(88,'Areos','Chen','+61478697668','areos.cc@gmail.com','4A Bignell Street','SA','RICHMOND','SA','Australia','5033','2023-11-03 12:21:14',0);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company` (
  `id` tinyint unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `bld` varchar(20) DEFAULT NULL,
  `phone` varchar(25) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `abn` varchar(15) NOT NULL,
  `bsb` varchar(15) NOT NULL,
  `acc` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'Sandu landscaping1','123456','+6142332455','sandu.lanscaping@gmail.com','elizabath 123423','12345','015025','12345');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `managers`
--

DROP TABLE IF EXISTS `managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `managers` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `managers`
--

LOCK TABLES `managers` WRITE;
/*!40000 ALTER TABLE `managers` DISABLE KEYS */;
INSERT INTO `managers` VALUES (1,'A','A','111@gmail.com','111111','$2b$10$QSsAw7CMJcNQP.ULe5fZzeQmkO5uyHfJUDNrEaV9e/DM.cM3.VlTm',NULL,'2023-10-15 05:52:00'),(2,'B','B','222@gmail.com','222222','$2b$10$pe96OA6A7SR2W9ezAl/ZKeIrCT3OuWbt71SK.1xx4e3qZ6/Tm4byW',NULL,'2023-10-15 05:53:08');
/*!40000 ALTER TABLE `managers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_desc`
--

DROP TABLE IF EXISTS `order_desc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_desc` (
  `fk_order_id` smallint unsigned NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `qty` smallint unsigned NOT NULL DEFAULT '1',
  `unit` varchar(20) NOT NULL,
  `unit_price` decimal(10,2) unsigned DEFAULT '0.00',
  `netto` decimal(10,2) unsigned DEFAULT '0.00',
  `taxable` tinyint(1) NOT NULL DEFAULT '1',
  `gst` decimal(9,2) unsigned DEFAULT '0.00',
  `title` varchar(255) NOT NULL,
  `ranking` tinyint unsigned DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_desc`
--

LOCK TABLES `order_desc` WRITE;
/*!40000 ALTER TABLE `order_desc` DISABLE KEYS */;
INSERT INTO `order_desc` VALUES (4,'service ',1,'m',10.00,10.00,1,0.00,'',0),(4,'service',1,'m',10.00,10.00,1,0.00,'',0),(4,'service',1,'m',10.00,10.00,1,0.00,'',0),(4,'service',1,'m',10.00,10.00,1,0.00,'',0),(4,'service',1,'m',10.00,10.00,1,0.00,'',0),(4,'service',1,'m',10.00,10.00,1,0.00,'',0),(6,'service 4',1,'m',10.00,10.00,1,0.00,'',0),(8,'s 123',1,'m',10.00,10.00,1,0.00,'',0),(8,'aa 34',1,'m',10.00,10.00,1,0.00,'',0),(8,'bb 456',1,'m',10.00,10.00,1,0.00,'',0),(9,'service44444',1,'m',10.00,20.00,1,0.00,'',0),(12,'service',1,'m',10.00,10.00,1,0.00,'',0),(13,'service',1,'m',10.00,10.00,1,0.00,'',0),(14,'12344',1,'m',22.00,22.00,1,0.00,'',0),(17,'23123',1,'m',10.00,10.00,1,0.00,'',0),(17,'321321',1,'m',10.00,10.00,1,0.00,'',0),(18,'3333',1,'m',10.00,10.00,1,0.00,'',0),(19,'123123',1,'m',10.00,10.00,1,0.00,'',0),(20,'123123',1,'m',10.00,10.00,1,0.00,'',0),(21,'333',1,'m',10.00,10.00,1,0.00,'',0),(23,'service 33333',1,'m',10.00,10.00,1,0.00,'',0),(24,'55555',1,'m',10.00,10.00,1,0.00,'',0),(25,'22345',1,'m',10.00,10.00,1,0.00,'',0),(26,'service22',1,'m',10.00,10.00,1,0.00,'',0),(27,'service',1,'m',10.00,10.00,1,0.00,'',0),(44,'',1,'gbh1',4231.00,4231.00,1,423.00,'service 11',0),(44,'',1,'fgh',333.00,333.00,1,33.00,'33',0),(45,'',1,'cm',555.00,555.00,1,56.00,'service 555',0),(45,'',1,'cm',555.00,555.00,1,56.00,'service 555',0),(3,'service',1,'m',10.00,10.00,1,1.00,'',0),(3,'service',1,'m',10.00,10.00,1,1.00,'',0),(15,'service',1,'m',10.00,10.00,1,1.00,'',0),(15,'service',1,'m',10.00,10.00,1,1.00,'',0),(15,'service',1,'m',10.00,10.00,1,0.00,'',0),(16,'service',1,'m',10.00,10.00,1,1.00,'',0),(22,'999999',1,'m',10.00,10.00,1,1.00,'',0),(28,'service',1,'m',10.00,10.00,1,1.00,'',0),(29,'service',1,'m',10.00,10.00,1,1.00,'',0),(30,'service',1,'m',10.00,10.00,1,1.00,'',0),(31,'service',1,'m',10.00,10.00,1,1.00,'',0),(31,'',1,'fgh',333.00,333.00,1,33.30,'33',0),(32,'service',1,'m',10.00,10.00,1,1.00,'',0),(43,'',1,'cm',555.00,555.00,1,55.50,'service 555',0),(43,'',1,'1',22.00,22.00,1,2.20,'service 142',0),(43,'',1,'gh',32.00,32.00,1,3.00,'service 2',0),(46,'',1,'mm',777.00,777.00,1,77.70,'service 7',0),(46,'',1,'m4',11.00,11.00,1,1.10,'tao',0),(47,'',1,'m4',111.00,111.00,1,11.10,'service 122',0),(47,'',1,'jj',77.00,77.00,1,7.70,'556',0),(2,'service',1,'m',10.00,10.00,1,1.00,'service 3',1),(2,'service',1,'m',10.00,10.00,1,1.00,'service 2',2),(2,'service',1,'m',10.00,10.00,1,1.00,'service 1',3),(48,'',4,'gh',32.00,128.00,0,0.00,'service 2',0),(48,'',1,'gh',32.00,32.00,1,3.20,'service 122',0),(48,'',1,'fgh',333.00,333.00,1,33.30,'33',0),(1,'',1,'1',22.00,22.00,0,0.00,'service 1',1),(1,'',3,'m4',111.00,333.00,0,0.00,'service 2',2),(1,'',5,'gh',32.00,160.00,1,16.00,'ser 3',3),(1,'',1,'rr',133.00,133.00,1,13.30,'serv 4',4),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',5),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',6),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',7),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',8),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',9),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',10),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',11),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',12),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',13),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',14),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',15),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',16),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',17),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',18),(1,'',1,'m4',111.00,111.00,1,11.10,'service 122',19);
/*!40000 ALTER TABLE `order_desc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` smallint unsigned NOT NULL AUTO_INCREMENT,
  `fk_client_id` smallint unsigned DEFAULT NULL,
  `order_address` varchar(255) DEFAULT NULL,
  `order_suburb` varchar(100) DEFAULT 'Adelaide',
  `order_city` varchar(20) DEFAULT 'Adelaide',
  `order_state` varchar(20) DEFAULT 'SA',
  `order_country` varchar(20) DEFAULT 'Australia',
  `order_pc` varchar(10) DEFAULT '5000',
  `order_status` varchar(10) DEFAULT 'Pending',
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `order_total` decimal(10,2) unsigned DEFAULT '0.00',
  `order_gst` decimal(9,2) unsigned DEFAULT '0.00',
  `order_deposit` decimal(9,2) unsigned DEFAULT '0.00',
  `quotation_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `invoice_issue_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `archive` tinyint(1) NOT NULL DEFAULT '0',
  `order_paid` decimal(10,2) unsigned DEFAULT '0.00',
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,76,'4A444, test lenght, need a vaey a ','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-15 11:48:48',2508.80,195.80,12.00,'2023-10-29 03:11:06','2023-11-09 13:30:00',0,510.00),(2,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-15 11:48:53',33.00,3.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,15.00),(3,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Processing','2023-10-15 11:48:57',22.00,2.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(4,23,'Apt 406','GB-ENG','Australia Square','SA','Australia','1027','Pending','2023-10-17 07:07:14',0.00,0.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(5,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-23 13:38:14',0.00,0.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(7,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-23 13:39:07',0.00,0.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(10,76,'123','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-24 05:58:27',0.00,0.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(11,76,'12333','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-24 05:58:56',0.00,0.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(15,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Completed','2023-10-24 11:52:13',32.00,2.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(16,76,'435435634','SA','RICHMOND','SA','Australia','5033','Closed','2023-10-24 12:05:34',11.00,1.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(17,NULL,'123123123','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-24 22:32:40',0.00,0.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(18,NULL,'1111','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-24 22:33:32',0.00,0.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(19,NULL,'123123','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-24 22:46:11',0.00,0.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(20,NULL,'123123','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-24 22:48:05',0.00,0.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(21,NULL,'3333','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-24 22:48:38',0.00,0.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(22,76,'123123123123123','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-24 22:49:13',11.00,1.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(28,76,'4A Bigne33333','SA','RICHMOND','SA','Australia','5033','Processing','2023-10-26 12:56:43',11.00,1.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(29,76,'4A B44444','SA','RICHMOND','SA','Australia','5033','Closed','2023-10-26 12:56:53',11.00,1.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(30,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Processing','2023-10-27 01:46:21',11.00,1.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(31,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-27 01:55:48',377.30,34.30,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(32,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Processing','2023-10-27 01:55:51',11.00,1.00,0.00,'2023-10-29 03:11:06','2023-10-29 03:11:16',0,0.00),(33,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-29 03:47:06',0.00,0.00,0.00,'2023-10-29 03:47:06','2023-10-29 03:47:06',0,0.00),(34,76,'test stringg','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-29 03:47:31',0.00,0.00,0.00,'2023-10-29 03:47:31','2023-10-29 03:47:31',0,0.00),(35,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-29 03:55:04',0.00,0.00,12.00,'2023-10-29 03:55:04','2023-10-29 03:55:04',0,0.00),(36,76,'etst  1234','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-29 04:00:50',0.00,0.00,12.00,'2023-10-29 04:00:50','2023-10-29 04:00:50',0,0.00),(37,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-29 04:01:52',78.00,0.00,12.00,'2023-10-29 04:01:52','2023-10-29 04:01:52',0,0.00),(38,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-29 04:03:15',78.00,0.00,12.00,'2023-10-29 04:03:15','2023-10-29 04:03:15',0,0.00),(39,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-29 04:03:46',78.00,0.00,11.00,'2023-10-29 04:03:46','2023-10-29 04:03:46',0,0.00),(40,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-29 04:04:01',78.00,0.00,11.00,'2023-10-29 04:04:01','2023-10-29 04:04:01',0,0.00),(41,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-29 04:09:33',555.00,0.00,12.00,'2023-10-29 04:09:33','2023-10-29 04:09:33',0,0.00),(42,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-29 04:09:58',1665.00,0.00,0.00,'2023-10-29 04:09:58','2023-10-29 04:09:58',0,0.00),(43,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-29 04:13:27',669.70,60.70,123.00,'2023-10-29 04:13:27','2023-10-29 04:13:27',0,0.00),(44,76,'teststrreet','SA','RICHMOND','SA','Australia','5033','Pending','2023-10-29 04:34:04',4564.00,0.00,1234.00,'2023-10-29 04:34:04','2023-10-29 04:34:04',1,0.00),(46,76,'t1103','SA','RICHMOND','SA','Australia','5033','Pending','2023-11-03 11:54:18',866.80,78.80,234.00,'2023-11-03 11:54:18','2023-11-03 11:54:18',0,0.00),(47,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-11-04 08:24:52',206.80,18.80,0.00,'2023-11-04 08:24:52','2023-11-04 08:24:52',0,0.00),(48,76,'4A Bignell Street','SA','RICHMOND','SA','Australia','5033','Pending','2023-11-05 13:31:11',529.50,36.50,0.00,'2023-11-05 13:31:11','2023-11-05 13:31:11',0,0.00);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `pay_id` int NOT NULL AUTO_INCREMENT,
  `fk_order_id` mediumint unsigned NOT NULL,
  `paid` decimal(10,2) unsigned DEFAULT '0.00',
  `paid_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`pay_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (7,2,13.00,'2023-11-04 13:30:00'),(8,2,2.00,'2023-11-03 13:30:00'),(16,1,110.00,'2023-11-03 13:30:00'),(17,1,33.00,'2023-11-02 13:30:00'),(18,1,334.00,'2023-11-01 13:30:00'),(19,1,33.00,'2023-10-31 13:30:00');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service` varchar(255) NOT NULL,
  `unit` varchar(20) DEFAULT NULL,
  `unit_price` decimal(8,2) unsigned DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `service` (`service`),
  UNIQUE KEY `title` (`service`),
  UNIQUE KEY `service_2` (`service`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES (11,'service 2','gh',32.00),(12,'service 11','gbh1',423.00),(13,'service 44','m4',444.00),(14,'serv 143','jj',78.00),(15,'service 122','m4',111.00),(16,'service 142','1',22.00),(17,'33','fgh',333.00),(18,'556','jj',77.00),(19,'tao','m4',11.00),(20,'serv 133','rr',133.00);
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tests`
--

DROP TABLE IF EXISTS `tests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tests` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tests`
--

LOCK TABLES `tests` WRITE;
/*!40000 ALTER TABLE `tests` DISABLE KEYS */;
/*!40000 ALTER TABLE `tests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unit_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unit_name` (`unit_name`),
  UNIQUE KEY `title` (`unit_name`),
  UNIQUE KEY `unit_name_2` (`unit_name`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (9,'fgh1'),(13,'frg'),(8,'jj'),(7,'m4'),(4,'mm'),(11,'p123'),(12,'p334'),(10,'pp');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-30 16:30:02

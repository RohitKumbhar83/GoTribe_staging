-- MySQL dump 10.13  Distrib 5.6.35, for Linux (x86_64)
--
-- Host: localhost    Database: gotribe
-- ------------------------------------------------------
-- Server version	5.6.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `gym_attendance`
--

LOCK TABLES `gym_attendance` WRITE;
/*!40000 ALTER TABLE `gym_attendance` DISABLE KEYS */;
INSERT INTO `gym_attendance` VALUES (1,135,1,'2017-05-12','Taken',130,'staff_member',2088,0),(2,135,1,'2017-05-12','Taken',130,'staff_member',4697,0),(3,149,1,'2017-05-15','Taken',46,'staff_member',5219,0),(4,149,1,'2017-05-15','Cancelled',45,'staff_member',5220,0),(5,154,1,'2017-05-17','cancelled_by_trainer',134,'staff_member',5743,0),(6,134,1,'2017-05-17','cancelled_by_trainer',134,'staff_member',5743,0),(7,154,1,'2017-05-15','Taken',134,'staff_member',5221,0),(8,154,1,'2017-05-15','Taken',130,'staff_member',1,0),(9,154,3,'2017-05-13','Taken',134,'staff_member',6265,0),(10,135,1,'2017-05-23','Cancelled',134,'staff_member',6266,1),(11,137,1,'2017-05-23','Taken',134,'staff_member',6266,0),(12,138,1,'2017-05-23','Taken',134,'staff_member',6266,0),(13,146,1,'2017-05-23','Taken',134,'staff_member',6266,0),(14,135,1,'2017-05-15','Taken',134,'staff_member',5221,0),(15,135,1,'2017-05-16','Taken',130,'staff_member',3132,0),(16,135,1,'2017-05-22','Taken',134,'staff_member',5222,0),(17,173,1,'2017-05-16','Taken',130,'staff_member',3132,0),(18,173,1,'2017-05-17','Taken',130,'staff_member',1045,0),(19,172,3,'2017-05-22','Taken',134,'staff_member',6269,0),(20,172,3,'2017-05-29','Taken',134,'staff_member',6270,0),(21,147,2,'2017-05-23','Taken',134,'staff_member',6271,0),(22,147,2,'2017-05-30','Taken',134,'staff_member',6272,0),(23,147,2,'2017-06-06','Taken',134,'staff_member',6273,0),(24,147,2,'2017-06-13','Taken',134,'staff_member',6274,0),(25,112,2,'2017-05-17','Taken',45,'staff_member',6275,0),(26,112,2,'2017-05-18','Taken',45,'staff_member',6276,0),(27,112,2,'2017-05-19','cancelled_by_trainer',45,'staff_member',6277,0),(28,112,2,'2017-05-20','Taken',45,'staff_member',6278,0),(29,112,2,'2017-05-22','Taken',45,'staff_member',6279,0),(30,112,2,'2017-05-23','Taken',45,'staff_member',6280,0);
/*!40000 ALTER TABLE `gym_attendance` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-16 10:04:41

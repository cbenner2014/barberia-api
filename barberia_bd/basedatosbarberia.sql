CREATE DATABASE  IF NOT EXISTS `barberia_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `barberia_db`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: barberia_db
-- ------------------------------------------------------
-- Server version	8.0.42

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
-- Table structure for table `barbero`
--

DROP TABLE IF EXISTS `barbero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `barbero` (
  `id_Barbero` int NOT NULL AUTO_INCREMENT,
  `nombre_barbero` varchar(255) DEFAULT NULL,
  `edad_Barbero` int DEFAULT NULL,
  `email_barbero` varchar(255) DEFAULT NULL,
  `usuario_barbero` varchar(255) DEFAULT NULL,
  `contrasena_barbero` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_Barbero`),
  UNIQUE KEY `usuario_Barbero` (`usuario_barbero`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `barbero`
--

LOCK TABLES `barbero` WRITE;
/*!40000 ALTER TABLE `barbero` DISABLE KEYS */;
INSERT INTO `barbero` VALUES (1,'Juan Pérez EDIT',52,'juanp@barberia.com',NULL,NULL),(2,'Carlos Gómez',28,'carlosg@barberia.com','carlitos','passcarlos'),(3,'Luis Martínez',35,'luism@barberia.com','luism','luispass'),(5,'PRUEBA',21,'EJEMPLO@GMAIL.COM','prueba','123456');
/*!40000 ALTER TABLE `barbero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cita`
--

DROP TABLE IF EXISTS `cita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cita` (
  `id_Cita` int NOT NULL AUTO_INCREMENT,
  `id_Cliente` int DEFAULT NULL,
  `id_Servicio` int DEFAULT NULL,
  `id_Barbero` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` enum('Programada','Atendida','Cancelada') DEFAULT 'Programada',
  `estado_pago` enum('Pagado','Pendiente') DEFAULT 'Pendiente',
  PRIMARY KEY (`id_Cita`),
  KEY `id_Cliente` (`id_Cliente`),
  KEY `id_Servicio` (`id_Servicio`),
  KEY `id_Barbero` (`id_Barbero`),
  CONSTRAINT `cita_ibfk_1` FOREIGN KEY (`id_Cliente`) REFERENCES `cliente` (`id_Cliente`),
  CONSTRAINT `cita_ibfk_2` FOREIGN KEY (`id_Servicio`) REFERENCES `servicio` (`id_Servicio`),
  CONSTRAINT `cita_ibfk_3` FOREIGN KEY (`id_Barbero`) REFERENCES `barbero` (`id_Barbero`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cita`
--

LOCK TABLES `cita` WRITE;
/*!40000 ALTER TABLE `cita` DISABLE KEYS */;
INSERT INTO `cita` VALUES (1,1,1,1,'2025-06-24','10:00:00','Cancelada',NULL),(2,2,2,2,'2025-06-24','11:00:00','Atendida','Pendiente'),(3,3,3,3,'2025-06-25','14:30:00','Cancelada','Pendiente'),(4,5,5,5,'2026-04-01','11:30:00','Atendida',NULL),(5,2,2,3,'2026-04-06','11:09:00','Programada',NULL);
/*!40000 ALTER TABLE `cita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_Cliente` int NOT NULL AUTO_INCREMENT,
  `nombre_cliente` varchar(255) DEFAULT NULL,
  `telefono_cliente` varchar(255) DEFAULT NULL,
  `email_cliente` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_Cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Andrea Torres','987654321','andreat@gmail.com'),(2,'Pedro Castillo','912345678','pedroc@hotmail.com'),(3,'Lucía Fernández edit','998877665','luciaf@outlook.com'),(5,'PRUEBA CLIENTE','986251234','CLIENTE1@GMAIL.COM');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horario`
--

DROP TABLE IF EXISTS `horario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horario` (
  `id_Horario` int NOT NULL AUTO_INCREMENT,
  `id_Barbero` int DEFAULT NULL,
  `dia_semana` enum('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo') DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  PRIMARY KEY (`id_Horario`),
  KEY `id_Barbero` (`id_Barbero`),
  CONSTRAINT `horario_ibfk_1` FOREIGN KEY (`id_Barbero`) REFERENCES `barbero` (`id_Barbero`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horario`
--

LOCK TABLES `horario` WRITE;
/*!40000 ALTER TABLE `horario` DISABLE KEYS */;
INSERT INTO `horario` VALUES (1,5,'Lunes','10:00:00','17:00:00');
/*!40000 ALTER TABLE `horario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id_Pago` int NOT NULL AUTO_INCREMENT,
  `id_Cita` int DEFAULT NULL,
  `monto` double DEFAULT NULL,
  `metodo_pago` enum('Efectivo','Tarjeta','Yape','Plin') DEFAULT NULL,
  `fecha_pago` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_Pago`),
  KEY `id_Cita` (`id_Cita`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`id_Cita`) REFERENCES `cita` (`id_Cita`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (1,4,20,'Efectivo','2026-04-01 08:34:00');
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicio`
--

DROP TABLE IF EXISTS `servicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicio` (
  `id_Servicio` int NOT NULL AUTO_INCREMENT,
  `nombre_servicio` varchar(255) DEFAULT NULL,
  `precio_servicio` double DEFAULT NULL,
  `duracion_Servicio` int DEFAULT NULL,
  PRIMARY KEY (`id_Servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicio`
--

LOCK TABLES `servicio` WRITE;
/*!40000 ALTER TABLE `servicio` DISABLE KEYS */;
INSERT INTO `servicio` VALUES (1,'Corte de Cabello',20,30),(2,'Afeitado',15,20),(3,'Corte + Barba',30,45),(5,'PRUEBA DE CORTE',20,40);
/*!40000 ALTER TABLE `servicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_Usuario` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMIN','BARBERO','CLIENTE') NOT NULL,
  `id_Barbero` int DEFAULT NULL,
  `id_Cliente` int DEFAULT NULL,
  PRIMARY KEY (`id_Usuario`),
  UNIQUE KEY `username` (`username`),
  KEY `id_Barbero` (`id_Barbero`),
  KEY `id_Cliente` (`id_Cliente`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`id_Barbero`) REFERENCES `barbero` (`id_Barbero`) ON DELETE SET NULL,
  CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`id_Cliente`) REFERENCES `cliente` (`id_Cliente`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'admin@barberia.com','123456','ADMIN',NULL,NULL),(2,'juanp@barberia.com','123456','BARBERO',1,NULL),(3,'carlosg@barberia.com','123456','BARBERO',2,NULL),(4,'luism@barberia.com','123456','BARBERO',3,NULL),(5,'EJEMPLO@GMAIL.COM','123456','BARBERO',5,NULL),(9,'andreat@gmail.com','123456','CLIENTE',NULL,1),(10,'pedroc@hotmail.com','123456','CLIENTE',NULL,2),(11,'luciaf@outlook.com','123456','CLIENTE',NULL,3),(12,'CLIENTE1@GMAIL.COM','123456','CLIENTE',NULL,5);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-05 23:38:58

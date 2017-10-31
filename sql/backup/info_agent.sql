/*
 Navicat Premium Data Transfer

 Source Server         : My Site
 Source Server Type    : MySQL
 Source Server Version : 50635
 Source Host           : localhost
 Source Database       : local_crm2

 Target Server Type    : MySQL
 Target Server Version : 50635
 File Encoding         : utf-8

 Date: 09/05/2017 13:41:14 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `info_agent`
-- ----------------------------
DROP TABLE IF EXISTS `info_agent`;
CREATE TABLE `info_agent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `agent_name` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `region` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `address` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `duty_employee` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `link_name` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `mobile_phone` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `telephone` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `fax` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `qq` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `email` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `id_card` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `gender` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `payment_way` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `bank_account` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `creator_id` varchar(200) CHARACTER SET utf8 NOT NULL,
  `create_time` int(11) NOT NULL,
  `note` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

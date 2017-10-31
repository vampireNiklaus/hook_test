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

 Date: 09/09/2017 17:27:52 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `info_protocol_manage`
-- ----------------------------
DROP TABLE IF EXISTS `info_protocol_manage`;
CREATE TABLE `info_protocol_manage` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `status` int(11) DEFAULT '0',
  `protocol_number` varchar(200) DEFAULT NULL COMMENT '协议编号',
  `start_date` varchar(200) DEFAULT NULL COMMENT '开始日期',
  `end_date` varchar(200) DEFAULT NULL COMMENT '结束日期',
  `execute_date` varchar(200) DEFAULT NULL COMMENT '执行协议日期',
  `drug_id` int(11) DEFAULT NULL COMMENT '药品id',
  `agent_id` int(11) DEFAULT NULL COMMENT '代理商',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

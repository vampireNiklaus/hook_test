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

 Date: 09/09/2017 17:14:06 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `info_protocol_detail`
-- ----------------------------
DROP TABLE IF EXISTS `info_protocol_detail`;
CREATE TABLE `info_protocol_detail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `status` int(11) DEFAULT '0',
  `parent_protocol_id` varchar(200) DEFAULT NULL COMMENT '协议编号',
  `region` varchar(200) DEFAULT NULL COMMENT '地区',
  `hospital_name` varchar(200) DEFAULT NULL COMMENT '医院名称',
  `drug_name` varchar(200) DEFAULT NULL COMMENT '药品名称',
  `drug_id` int(11) DEFAULT NULL COMMENT '药品id',
  `drug_guige` varchar(200) DEFAULT NULL,
  `cash_deposit` decimal(10,2) DEFAULT NULL COMMENT '保证金',
  `if_pay` int(11) DEFAULT NULL COMMENT '保证金到账情况',
  `develop_time` varchar(200) DEFAULT NULL COMMENT '开发时间',
  `protocol_amount` varchar(200) DEFAULT NULL COMMENT '协议销售量',
  `bidding_price` decimal(10,2) DEFAULT NULL COMMENT '中标价',
  `commission` decimal(10,2) DEFAULT NULL COMMENT '佣金',
  `cover_business` varchar(200) DEFAULT NULL COMMENT '覆盖商业',
  `flow_type` varchar(200) DEFAULT NULL COMMENT '流向形式',
  `zs_employee` varchar(200) DEFAULT NULL COMMENT '招商人员',
  `zs_commission` varchar(200) DEFAULT NULL COMMENT '招商佣金',
  `note` varchar(200) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8;

SET FOREIGN_KEY_CHECKS = 1;

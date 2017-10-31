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

 Date: 09/18/2017 14:46:19 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `t_menu_item`
-- ----------------------------
DROP TABLE IF EXISTS `t_menu_item`;
CREATE TABLE `t_menu_item` (
  `id` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `fid` varchar(255) DEFAULT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `show_order` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `t_menu_item`
-- ----------------------------
BEGIN;
INSERT INTO `t_menu_item` VALUES ('', '', null, null, '0'), ('01', '文件', null, null, '1'), ('0101', '首页', '-9997', '01', '1'), ('0102', '重新登录', '-9999', '01', '2'), ('0103', '个人中心', '-9996', '01', '3'), ('0104', '使用帮助', '-9998', '01', '4'), ('0105', '文件中心', '0105', '01', '5'), ('02', '基本信息', null, null, '2'), ('0200', '药品信息', '0200', '02', '0'), ('0201', '医院信息', '0201', '02', '1'), ('0202', '合作伙伴信息', '0202', '02', '2'), ('0203', '供应商信息', '0203', '02', '3'), ('0204', '配送公司', '0204', '02', '5'), ('0205', '业务配置', '0205', '02', '6'), ('0206', '代理商信息', '0206', '02', '4'), ('03', '业务流程管理', null, null, '3'), ('0301', '自销', '0301', '03', '1'), ('030101', '自销采购单', '030101', '0301', '1'), ('030102', '自销付款单', '030102', '0301', '2'), ('030103', '入配送公司', '030103', '0301', '5'), ('030104', '自销税票单', '030104', '0301', '6'), ('030105', '自销回款单', '030105', '0301', '7'), ('030106', '入开票公司', '030106', '0301', '3'), ('030107', '出开票公司', '030107', '0301', '4'), ('0302', '代销', '0302', '03', '2'), ('030202', '代销回款单', '030202', '0302', '2'), ('0303', '销售管理', '0303', '03', '4'), ('0304', '实时流向', '0304', '03', '5'), ('0305', '招商管理', '0305', '03', '3'), ('030501', '协议管理', '030501', '0305', '1'), ('04', '库存管理', null, null, '4'), ('0401', '库存管理', '0401', '04', '1'), ('05', '资金管理', null, null, '5'), ('0501', '收支科目与结算方式', '0501', '05', '1'), ('0502', '账款管理', '0502', '05', '2'), ('0503', '银行存取款', '0503', '05', '3'), ('0504', '业务支付', '0504', '05', '4'), ('050401', '直营结算', '050401', '0504', '1'), ('050402', '招商结算', '050402', '0504', '2'), ('06', '报表', null, null, '6'), ('0601', '销售报表', '0601', '06', '1'), ('0602', '业务员报表', '0602', '06', '2'), ('0603', '进销存报表', '0603', '06', '3'), ('0604', '业务分析表', '0604', '06', '4'), ('0605', '财务分析表', '0605', '06', '5'), ('07', '系统管理', null, null, '7'), ('0701', '员工管理', '-8999', '07', '1'), ('0702', '权限管理', '-8996', '07', '2'), ('0703', '业务日志', '-8997', '07', '3'), ('0704', '业务设置', '2008', '07', '4'), ('08', '帮助', null, null, '8'), ('0801', '使用帮助', '-9995', '08', '1'), ('0802', '联系我们', '-9993', '08', '2');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
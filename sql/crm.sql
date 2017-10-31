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

 Date: 09/18/2017 14:45:18 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `bank_io`
-- ----------------------------
DROP TABLE IF EXISTS `bank_io`;
CREATE TABLE `bank_io` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `out_account_id` varchar(200) NOT NULL,
  `in_account_id` varchar(200) NOT NULL,
  `amount` decimal(20,2) NOT NULL DEFAULT '0.00',
  `purpose` varchar(200) NOT NULL,
  `piaoju_code` varchar(200) NOT NULL,
  `danju_code` varchar(200) NOT NULL,
  `create_time` int(11) unsigned NOT NULL DEFAULT '0',
  `verify_time` int(11) unsigned NOT NULL,
  `creator_id` int(10) NOT NULL,
  `verifier_id` int(10) NOT NULL,
  `note` varchar(200) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_business_pay`
-- ----------------------------
DROP TABLE IF EXISTS `bill_business_pay`;
CREATE TABLE `bill_business_pay` (
  `id` int(16) unsigned NOT NULL AUTO_INCREMENT COMMENT '业务支付单id',
  `employee_id` int(11) NOT NULL COMMENT '业务员id',
  `pay_account_id` int(11) NOT NULL COMMENT '付款账户',
  `pay_amount` decimal(20,2) NOT NULL DEFAULT '0.00' COMMENT '支付金额',
  `bill_date` date NOT NULL COMMENT '支付日期',
  `bill_code` varchar(100) NOT NULL DEFAULT '' COMMENT '单据编号',
  `creator_id` int(11) NOT NULL COMMENT '创建人id',
  `note` varchar(200) NOT NULL DEFAULT '' COMMENT '备注',
  `status` int(11) NOT NULL COMMENT '单据状态',
  `pay_month` varchar(100) NOT NULL DEFAULT '' COMMENT '支付月份',
  `verifier_id` int(11) NOT NULL COMMENT '审核人id',
  `operation_detail` varchar(500) NOT NULL DEFAULT '' COMMENT '操作详情',
  `create_time` int(11) NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_invest_pay`
-- ----------------------------
DROP TABLE IF EXISTS `bill_invest_pay`;
CREATE TABLE `bill_invest_pay` (
  `id` int(16) unsigned NOT NULL AUTO_INCREMENT COMMENT '业务支付单id',
  `agent_id` int(11) NOT NULL COMMENT '代理商id',
  `pay_account_id` int(11) NOT NULL COMMENT '付款账户',
  `pay_amount` decimal(20,2) NOT NULL DEFAULT '0.00' COMMENT '支付金额',
  `bill_date` date NOT NULL COMMENT '支付日期',
  `bill_code` varchar(100) NOT NULL DEFAULT '' COMMENT '单据编号',
  `creator_id` int(11) NOT NULL COMMENT '创建人id',
  `note` varchar(200) NOT NULL DEFAULT '' COMMENT '备注',
  `status` int(11) NOT NULL COMMENT '单据状态',
  `pay_month` varchar(100) NOT NULL DEFAULT '' COMMENT '支付月份',
  `verifier_id` int(11) NOT NULL COMMENT '审核人id',
  `operation_detail` varchar(500) NOT NULL DEFAULT '' COMMENT '操作详情',
  `create_time` int(11) NOT NULL,
  `operate_info` longtext,
  `select_id` varchar(100) DEFAULT NULL COMMENT '被选中支付的销售信息id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_daily_sell`
-- ----------------------------
DROP TABLE IF EXISTS `bill_daily_sell`;
CREATE TABLE `bill_daily_sell` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL COMMENT '销售单据编号',
  `employee_id` int(11) NOT NULL COMMENT '业务员id',
  `employee_des` varchar(255) NOT NULL COMMENT '业务员身份描述',
  `employee_profit` decimal(20,2) NOT NULL COMMENT '业务员提成',
  `employee_name` varchar(50) NOT NULL COMMENT '业务员姓名',
  `drug_id` int(11) NOT NULL COMMENT '药品id',
  `drug_name` varchar(255) NOT NULL COMMENT '药品名称',
  `drug_guige` varchar(50) NOT NULL COMMENT '药品规格',
  `drug_manufacture` varchar(100) NOT NULL COMMENT '药品生产企业',
  `hospital_id` int(11) NOT NULL COMMENT '医院id',
  `hospital_name` varchar(255) NOT NULL COMMENT '医院名称',
  `stock_id` int(11) NOT NULL COMMENT '仓库id',
  `deliver_id` int(11) NOT NULL COMMENT '配送公司id',
  `deliver_name` varchar(255) NOT NULL COMMENT '配送公司名称',
  `batch_num` varchar(120) NOT NULL COMMENT '药品编号',
  `sell_amount` varchar(200) NOT NULL DEFAULT '0' COMMENT '销售数量',
  `sell_date` date NOT NULL COMMENT '销售日期',
  `create_time` int(100) NOT NULL COMMENT '创建时间',
  `creator_id` varchar(250) NOT NULL COMMENT '创建人id',
  `note` varchar(200) NOT NULL COMMENT '备注',
  `if_paid` smallint(1) unsigned zerofill NOT NULL DEFAULT '0',
  `pay_time` varchar(200) NOT NULL DEFAULT '' COMMENT '支付时间',
  `paybill_id` varchar(200) NOT NULL DEFAULT '0' COMMENT '支付单id',
  `status` int(11) NOT NULL DEFAULT '2' COMMENT '单据状态位',
  `expire_time` date DEFAULT NULL COMMENT '有效期',
  `operate_info` longtext,
  `huikuan_status` int(10) NOT NULL DEFAULT '0' COMMENT '回款状态',
  `huikuan_unit_price` decimal(10,3) NOT NULL DEFAULT '0.000' COMMENT '回款单价',
  `huikuan_bill_code` varchar(200) NOT NULL DEFAULT '0' COMMENT '支付单id',
  PRIMARY KEY (`id`),
  KEY `paybill_id` (`paybill_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=36808 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_daily_sell_temp`
-- ----------------------------
DROP TABLE IF EXISTS `bill_daily_sell_temp`;
CREATE TABLE `bill_daily_sell_temp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) DEFAULT NULL COMMENT '销售单据编号',
  `employee_id` int(11) DEFAULT NULL COMMENT '业务员id',
  `employee_des` varchar(255) DEFAULT NULL COMMENT '业务员身份描述',
  `employee_profit` decimal(20,2) DEFAULT NULL COMMENT '业务员提成',
  `employee_name` varchar(50) DEFAULT NULL COMMENT '业务员姓名',
  `drug_id` int(11) DEFAULT NULL COMMENT '药品id',
  `drug_name` varchar(255) DEFAULT NULL COMMENT '药品名称',
  `drug_guige` varchar(50) DEFAULT NULL COMMENT '药品规格',
  `drug_manufacture` varchar(100) DEFAULT NULL COMMENT '药品生产企业',
  `hospital_id` int(11) DEFAULT NULL COMMENT '医院id',
  `hospital_name` varchar(255) DEFAULT NULL COMMENT '医院名称',
  `stock_id` int(11) DEFAULT NULL COMMENT '仓库id',
  `deliver_id` int(11) DEFAULT NULL COMMENT '配送公司id',
  `deliver_name` varchar(255) DEFAULT NULL COMMENT '配送公司名称',
  `batch_num` varchar(120) DEFAULT NULL COMMENT '药品编号',
  `sell_amount` varchar(200) DEFAULT '0' COMMENT '销售数量',
  `sell_date` varchar(100) DEFAULT '' COMMENT '销售日期',
  `create_time` int(100) DEFAULT NULL COMMENT '创建时间',
  `creator_id` varchar(250) DEFAULT NULL COMMENT '创建人id',
  `note` varchar(200) DEFAULT NULL COMMENT '备注',
  `if_paid` smallint(1) unsigned zerofill DEFAULT '0',
  `pay_time` varchar(200) DEFAULT '' COMMENT '支付时间',
  `paybill_id` varchar(200) DEFAULT '' COMMENT '支付单id',
  `status` int(11) DEFAULT NULL COMMENT '单据状态位',
  `expire_time` date DEFAULT NULL COMMENT '有效期',
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=143993 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_dele_huikuan`
-- ----------------------------
DROP TABLE IF EXISTS `bill_dele_huikuan`;
CREATE TABLE `bill_dele_huikuan` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `purchase_id` int(11) NOT NULL COMMENT '采购单id',
  `drug_id` int(11) NOT NULL COMMENT '药品id',
  `deliver_id` int(11) NOT NULL COMMENT '配送公司id',
  `supplier_id` int(11) NOT NULL COMMENT '供应商id',
  `batch_num` varchar(200) NOT NULL,
  `kaipiao_unit_price` decimal(20,2) NOT NULL COMMENT '开票单价',
  `huikuan_amount` int(11) NOT NULL COMMENT '开票数量',
  `sum_kaipiao_money` decimal(20,2) NOT NULL COMMENT '开票金额',
  `had_amount` int(11) NOT NULL COMMENT '应付数量',
  `note` varchar(200) NOT NULL COMMENT '备注',
  `create_time` int(11) NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_dele_huikuan_sub`
-- ----------------------------
DROP TABLE IF EXISTS `bill_dele_huikuan_sub`;
CREATE TABLE `bill_dele_huikuan_sub` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL COMMENT '药品id',
  `parent_id` int(11) NOT NULL COMMENT '采购单id',
  `deliver_id` int(11) NOT NULL COMMENT '配送公司',
  `supplier_id` int(11) NOT NULL COMMENT '供应商id',
  `batch_num` varchar(200) NOT NULL,
  `kaipiao_unit_price` decimal(20,2) NOT NULL COMMENT '开票单价',
  `huikuan_num` int(11) NOT NULL COMMENT '开票数量',
  `huikuan_money` decimal(20,2) NOT NULL COMMENT '开票金额',
  `huikuan_code` varchar(200) NOT NULL COMMENT '回款单单据编号',
  `huikuan_account` int(11) NOT NULL COMMENT '回款账户id',
  `bill_date` date NOT NULL COMMENT '业务日期',
  `kaidanren` int(11) NOT NULL COMMENT '开单人',
  `note` varchar(200) NOT NULL COMMENT '备注',
  `status` int(11) NOT NULL COMMENT '单据状态',
  `verifier_id` int(11) NOT NULL COMMENT '审核人id',
  `create_time` int(11) NOT NULL COMMENT '未付数量',
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_dele_purchase`
-- ----------------------------
DROP TABLE IF EXISTS `bill_dele_purchase`;
CREATE TABLE `bill_dele_purchase` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL COMMENT '开单编号',
  `drug_id` int(11) NOT NULL COMMENT '药品id',
  `supplier_id` int(11) NOT NULL COMMENT '供应商',
  `deliver_id` int(11) NOT NULL COMMENT '配送公司',
  `batch_num` varchar(200) NOT NULL,
  `buy_amount` int(10) NOT NULL COMMENT '购买数量',
  `unit` varchar(200) NOT NULL COMMENT '计量单位',
  `per_price` decimal(20,2) NOT NULL COMMENT '单价',
  `sum_pay` decimal(20,2) NOT NULL COMMENT '总额',
  `kaipiao_unit_price` decimal(20,2) NOT NULL COMMENT '开票单价',
  `sum_kaipiao_money` decimal(20,2) NOT NULL COMMENT '开票总额',
  `buy_date` varchar(50) NOT NULL COMMENT '购买日期',
  `kaidan_date` varchar(50) NOT NULL COMMENT '开单日期',
  `note` varchar(200) NOT NULL COMMENT '备注',
  `kaidanren` int(11) NOT NULL COMMENT '开单人',
  `verified` int(1) NOT NULL COMMENT '是否审核',
  `in_use` int(1) NOT NULL COMMENT '是否引用',
  `verifier_id` int(11) NOT NULL COMMENT '审核人id',
  `status` int(11) NOT NULL COMMENT '单据状态',
  `create_time` varchar(50) NOT NULL COMMENT '创建时间',
  `creator_id` int(11) NOT NULL,
  `instock_date` varchar(100) DEFAULT NULL COMMENT '入库时间',
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_extra`
-- ----------------------------
DROP TABLE IF EXISTS `bill_extra`;
CREATE TABLE `bill_extra` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type_id` int(10) unsigned NOT NULL COMMENT '科目id',
  `type_name` varchar(100) NOT NULL COMMENT '单据科目',
  `bill_type` varchar(100) NOT NULL COMMENT '单据类型',
  `bank_account_id` int(11) NOT NULL,
  `bank_account_num` varchar(100) NOT NULL,
  `bank_account_name` varchar(200) NOT NULL,
  `money` decimal(20,3) NOT NULL COMMENT '金额',
  `status` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '状态',
  `note` varchar(500) NOT NULL COMMENT '备注',
  `verify_date` date NOT NULL,
  `verify_id` int(11) NOT NULL COMMENT '审核人id',
  `create_time` int(11) NOT NULL,
  `operate_info` longtext,
  `drug_id` int(11) DEFAULT NULL,
  `yewu_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_product_agency`
-- ----------------------------
DROP TABLE IF EXISTS `bill_product_agency`;
CREATE TABLE `bill_product_agency` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `drug_id` int(11) NOT NULL,
  `earnest_money` decimal(20,3) NOT NULL COMMENT '保证金',
  `bill_date` date NOT NULL,
  `protocol_time` smallint(6) NOT NULL,
  `guige` varchar(200) NOT NULL,
  `manufacturer` varchar(200) NOT NULL,
  `note` varchar(500) NOT NULL,
  `amount` int(11) NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_promote_agency`
-- ----------------------------
DROP TABLE IF EXISTS `bill_promote_agency`;
CREATE TABLE `bill_promote_agency` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `drug_name` varchar(250) NOT NULL,
  `guige` varchar(200) NOT NULL,
  `manufacturer` varchar(200) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `employee_name` varchar(250) NOT NULL,
  `region_id` varchar(200) NOT NULL,
  `region_name` varchar(250) NOT NULL,
  `earnest_money` decimal(20,3) NOT NULL COMMENT '保证金',
  `earnest_detail` varchar(300) NOT NULL COMMENT '保证金详情',
  `earnest_date` date NOT NULL COMMENT '保证金日期',
  `phone_num` varchar(100) NOT NULL,
  `bill_detail` varchar(300) NOT NULL,
  `agency_date` date NOT NULL,
  `note` varchar(500) NOT NULL,
  `expand_money` decimal(20,3) NOT NULL COMMENT '推广费用',
  `operate_info` longtext,
  PRIMARY KEY (`id`),
  KEY `drug_id` (`drug_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_receipt_pay`
-- ----------------------------
DROP TABLE IF EXISTS `bill_receipt_pay`;
CREATE TABLE `bill_receipt_pay` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type_id` int(11) NOT NULL,
  `type_name` varchar(100) NOT NULL,
  `bill_type` varchar(100) NOT NULL,
  `money` decimal(20,3) NOT NULL,
  `status` tinyint(4) NOT NULL,
  `note` varchar(500) NOT NULL,
  `verify_date` date NOT NULL,
  `verify_id` int(11) NOT NULL,
  `create_time` int(11) NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_self_huikuan`
-- ----------------------------
DROP TABLE IF EXISTS `bill_self_huikuan`;
CREATE TABLE `bill_self_huikuan` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `tax_bill_id` int(11) NOT NULL COMMENT '对应子税票单',
  `deliver_id` int(11) NOT NULL COMMENT '配送公司id',
  `supplier_id` int(11) NOT NULL COMMENT '供应商id',
  `kaipiao_unit_price` decimal(20,2) NOT NULL,
  `huikuan_amount` int(11) unsigned NOT NULL,
  `sum_kaipiao_money` decimal(20,2) NOT NULL,
  `had_amount` int(11) unsigned NOT NULL DEFAULT '0',
  `create_time` int(11) unsigned NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_self_huikuan_sub`
-- ----------------------------
DROP TABLE IF EXISTS `bill_self_huikuan_sub`;
CREATE TABLE `bill_self_huikuan_sub` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `deliver_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `kaipiao_unit_price` decimal(20,2) NOT NULL,
  `huikuan_num` int(11) NOT NULL COMMENT '回款数量',
  `sum_kaipiao_money` decimal(20,2) NOT NULL,
  `huikuan_code` varchar(200) NOT NULL,
  `huikuan_account` int(11) NOT NULL,
  `bill_date` varchar(50) NOT NULL,
  `kaidanren` int(11) NOT NULL,
  `note` varchar(200) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `verifier_id` int(11) NOT NULL,
  `create_time` int(11) NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_self_pay`
-- ----------------------------
DROP TABLE IF EXISTS `bill_self_pay`;
CREATE TABLE `bill_self_pay` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL COMMENT '药品id',
  `buy_bill_id` int(11) NOT NULL COMMENT '采购id',
  `supplier_id` int(11) NOT NULL COMMENT '供应商',
  `kpgs_id` int(11) NOT NULL COMMENT '配送公司',
  `unit` varchar(50) NOT NULL COMMENT '计量单位',
  `unit_price` decimal(20,2) NOT NULL COMMENT '单价',
  `sum_pay_money` decimal(20,2) NOT NULL COMMENT '支付总额',
  `tax_unit_price` decimal(20,2) NOT NULL COMMENT '税价（单价）',
  `sum_tax_money` decimal(20,2) NOT NULL,
  `kaipiao_unit_price` decimal(20,2) NOT NULL,
  `sum_kaipiao_money` decimal(20,2) NOT NULL,
  `pay_amount` int(20) NOT NULL COMMENT '支付数量',
  `pay_1st_account` int(11) NOT NULL COMMENT '主付款账户',
  `pay_1st_amount` decimal(20,2) NOT NULL COMMENT '主付款账户付款金额',
  `pay_2nd_account` int(11) NOT NULL COMMENT '次付账户',
  `pay_2nd_amount` decimal(20,2) NOT NULL COMMENT '次付帐户金额',
  `buy_date` date NOT NULL COMMENT '采购日期',
  `yewu_date` date NOT NULL COMMENT '业务日期',
  `fund_date` date NOT NULL,
  `kaidan_ren` int(11) NOT NULL COMMENT '开单人',
  `note` varchar(200) NOT NULL COMMENT '备注',
  `verified` smallint(1) NOT NULL DEFAULT '0' COMMENT '是否审核',
  `money_should_pay` decimal(20,2) NOT NULL COMMENT '应付金额',
  `amount_should_pay` int(11) NOT NULL COMMENT '应付数量',
  `in_use` smallint(1) NOT NULL DEFAULT '0' COMMENT '是否引用',
  `status` int(11) NOT NULL COMMENT '单据状态',
  `verifier_id` int(11) NOT NULL COMMENT '审核人id',
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_self_purchase`
-- ----------------------------
DROP TABLE IF EXISTS `bill_self_purchase`;
CREATE TABLE `bill_self_purchase` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `kpgs_id` int(11) NOT NULL,
  `buy_amount` int(10) NOT NULL,
  `unit` varchar(200) NOT NULL,
  `per_price` decimal(20,2) NOT NULL,
  `sum_pay` decimal(20,2) NOT NULL,
  `tax_unit_price` decimal(20,2) NOT NULL,
  `sum_tax_money` decimal(20,2) NOT NULL,
  `kaipiao_unit_price` decimal(20,2) NOT NULL,
  `sum_kaipiao_money` decimal(20,2) NOT NULL,
  `buy_date` date NOT NULL,
  `kaidan_date` date NOT NULL,
  `note` varchar(200) NOT NULL,
  `kaidan_ren` int(11) NOT NULL,
  `verifier_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `create_time` int(10) unsigned NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_self_stock`
-- ----------------------------
DROP TABLE IF EXISTS `bill_self_stock`;
CREATE TABLE `bill_self_stock` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `pay_bill_code` varchar(200) NOT NULL DEFAULT '0' COMMENT '付款单 billcode',
  `supplier_id` int(11) NOT NULL,
  `stock_amount` int(11) NOT NULL COMMENT '入库总量',
  `had_amount` int(11) NOT NULL DEFAULT '0' COMMENT '剩余入库总量',
  `create_time` int(10) unsigned NOT NULL,
  `note` varchar(500) NOT NULL,
  `operate_info` longtext,
  `parent_id` int(11) DEFAULT NULL COMMENT '父单编号，开票公司出库单编号',
  `batch_num` varchar(200) NOT NULL DEFAULT '',
  `validity` date NOT NULL,
  `kaipiao_unit_price` decimal(20,3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_self_stock_kaipiao`
-- ----------------------------
DROP TABLE IF EXISTS `bill_self_stock_kaipiao`;
CREATE TABLE `bill_self_stock_kaipiao` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `pay_bill_code` varchar(200) NOT NULL DEFAULT '0' COMMENT '付款单id',
  `supplier_id` int(11) NOT NULL,
  `stock_amount` int(11) NOT NULL COMMENT '入库总量',
  `had_amount` int(11) NOT NULL DEFAULT '0' COMMENT '剩余入库总量',
  `create_time` int(10) unsigned NOT NULL,
  `note` varchar(500) NOT NULL,
  `operate_info` longtext,
  `instock_date` date NOT NULL COMMENT '入库时间',
  `supplier_name` varchar(300) NOT NULL,
  `buy_bill_code` varchar(200) NOT NULL DEFAULT '0' COMMENT '付款单id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_self_stock_kaipiao_out_sub`
-- ----------------------------
DROP TABLE IF EXISTS `bill_self_stock_kaipiao_out_sub`;
CREATE TABLE `bill_self_stock_kaipiao_out_sub` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `parent_id` int(11) NOT NULL COMMENT '对应的入库单编号',
  `drug_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `deliver_id` int(11) NOT NULL COMMENT '配送公司',
  `batch_num` varchar(200) NOT NULL COMMENT '批号',
  `validity` date NOT NULL COMMENT '有效期',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态',
  `create_time` int(11) unsigned NOT NULL,
  `note` varchar(500) NOT NULL,
  `operate_info` longtext,
  `outstock_date` date NOT NULL COMMENT '出库时间',
  `supplier_name` varchar(300) NOT NULL,
  `buy_bill_code` varchar(300) NOT NULL DEFAULT '0' COMMENT '付款单id',
  `kaipiao_unit_price` decimal(10,3) NOT NULL DEFAULT '0.000',
  `pay_bill_code` varchar(200) NOT NULL DEFAULT '0' COMMENT '付款单id',
  `out_amount` int(11) NOT NULL DEFAULT '0' COMMENT '本次出库数量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_self_stock_kaipiao_sub`
-- ----------------------------
DROP TABLE IF EXISTS `bill_self_stock_kaipiao_sub`;
CREATE TABLE `bill_self_stock_kaipiao_sub` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `deliver_id` int(11) NOT NULL COMMENT '配送公司',
  `stock_amount` int(11) NOT NULL COMMENT '子入库单入库数量',
  `batch_num` varchar(200) NOT NULL COMMENT '批号',
  `validity` date NOT NULL COMMENT '有效期',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态',
  `create_time` int(11) unsigned NOT NULL,
  `note` varchar(500) NOT NULL,
  `instock_date` date NOT NULL COMMENT '入库时间',
  `operate_info` longtext,
  `outstock_date` date NOT NULL COMMENT '出库时间',
  `supplier_name` varchar(300) NOT NULL,
  `buy_bill_code` varchar(300) NOT NULL DEFAULT '0' COMMENT '付款单id',
  `kaipiao_unit_price` decimal(10,3) NOT NULL DEFAULT '0.000',
  `pay_bill_code` varchar(200) NOT NULL DEFAULT '0' COMMENT '付款单id',
  `remain_amount` int(11) NOT NULL COMMENT '已入库单对应的未出库数量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_self_stock_sub`
-- ----------------------------
DROP TABLE IF EXISTS `bill_self_stock_sub`;
CREATE TABLE `bill_self_stock_sub` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `deliver_id` int(11) NOT NULL COMMENT '配送公司',
  `stock_num` int(11) NOT NULL COMMENT '子入库单入库数量',
  `batch_num` varchar(200) NOT NULL COMMENT '批号',
  `validity` date NOT NULL COMMENT '有效期',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态',
  `create_time` int(11) unsigned NOT NULL,
  `note` varchar(500) NOT NULL,
  `instock_date` date NOT NULL COMMENT '入库时间',
  `operate_info` longtext,
  `is_broken` smallint(6) NOT NULL DEFAULT '0',
  `kaipiao_unit_price` decimal(20,3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_self_tax`
-- ----------------------------
DROP TABLE IF EXISTS `bill_self_tax`;
CREATE TABLE `bill_self_tax` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL COMMENT '药品id',
  `stock_sub_bill_id` int(11) NOT NULL COMMENT '子入库单id',
  `supplier_id` int(11) NOT NULL COMMENT '供应商',
  `deliver_id` int(11) NOT NULL COMMENT '配送公司',
  `kaipiao_unit_price` decimal(20,2) NOT NULL COMMENT '开票单价',
  `kaipiao_amount` int(11) NOT NULL COMMENT '开票数量',
  `sum_kaipiao_money` decimal(20,2) NOT NULL COMMENT '开票总额',
  `tax_unit_price` decimal(20,2) NOT NULL COMMENT '税价',
  `sum_tax_money` decimal(20,2) NOT NULL COMMENT '税额',
  `amount_had_pay` int(11) NOT NULL DEFAULT '0' COMMENT '已付数量',
  `create_time` int(10) unsigned NOT NULL,
  `note` varchar(200) NOT NULL COMMENT '备注',
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_self_tax_sub`
-- ----------------------------
DROP TABLE IF EXISTS `bill_self_tax_sub`;
CREATE TABLE `bill_self_tax_sub` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) DEFAULT NULL,
  `parent_id` int(11) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `deliver_id` int(11) NOT NULL,
  `kaipiao_unit_price` decimal(20,2) NOT NULL,
  `kaipiao_num` int(11) NOT NULL,
  `sum_kaipiao_money` decimal(20,2) NOT NULL,
  `tax_danju_code` varchar(100) NOT NULL,
  `tax_shuipiao_code` varchar(100) NOT NULL,
  `pay_account` int(11) NOT NULL,
  `tax_unit_price` decimal(20,2) NOT NULL,
  `sum_tax_money` decimal(20,2) NOT NULL,
  `yewu_date` date NOT NULL,
  `taxbill_create_date` date NOT NULL,
  `fund_date` date NOT NULL,
  `kaidan_ren` varchar(200) NOT NULL,
  `note` varchar(200) NOT NULL,
  `verified` smallint(1) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `verifier_id` int(11) NOT NULL,
  `create_time` int(11) NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `bill_stock_trans`
-- ----------------------------
DROP TABLE IF EXISTS `bill_stock_trans`;
CREATE TABLE `bill_stock_trans` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL COMMENT '单据编号',
  `drug_id` int(200) NOT NULL COMMENT '药品id',
  `drug_name` varchar(255) NOT NULL COMMENT '药品名称',
  `supplier_id` int(10) NOT NULL COMMENT '供应商id',
  `supplier_name` varchar(255) NOT NULL COMMENT '供应商名称',
  `amount` int(11) NOT NULL DEFAULT '0' COMMENT '转移数量',
  `bill_date` varchar(200) NOT NULL COMMENT '单据日期',
  `verify_id` int(200) NOT NULL DEFAULT '0' COMMENT '审核人',
  `verify_date` date NOT NULL COMMENT '审核日期',
  `creator_id` varchar(200) NOT NULL DEFAULT '0' COMMENT '创建人id',
  `note` varchar(200) NOT NULL COMMENT '备注',
  `status` int(10) NOT NULL COMMENT '单据状态位',
  `in_deliver_id` int(11) NOT NULL COMMENT '转入配送公司id',
  `in_deliver_name` varchar(255) NOT NULL COMMENT '转入配送公司名称',
  `out_deliver_id` int(11) NOT NULL COMMENT '转出配送公司id',
  `out_deliver_name` varchar(255) NOT NULL COMMENT '转出配送公司名称',
  `batch_num` varchar(255) NOT NULL COMMENT '批号',
  `create_time` int(11) NOT NULL,
  `piaoju_code` varchar(200) NOT NULL,
  `danju_code` varchar(200) NOT NULL,
  `purpose` varchar(300) NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `info_bank_account`
-- ----------------------------
DROP TABLE IF EXISTS `info_bank_account`;
CREATE TABLE `info_bank_account` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `account_name` varchar(200) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `account_num` varchar(100) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `bank_name` varchar(200) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `init_money` decimal(20,2) NOT NULL DEFAULT '0.00',
  `now_money` decimal(20,2) NOT NULL DEFAULT '0.00',
  `is_cash` smallint(1) unsigned NOT NULL DEFAULT '1',
  `disabled` smallint(1) unsigned NOT NULL DEFAULT '0',
  `operate_info` longtext COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
--  Table structure for `info_bankaccount`
-- ----------------------------
DROP TABLE IF EXISTS `info_bankaccount`;
CREATE TABLE `info_bankaccount` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `account_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(100) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `capital_type` int(20) DEFAULT NULL,
  `is_stopped` varchar(20) DEFAULT NULL,
  `now_amount` float(30,2) NOT NULL DEFAULT '0.00',
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `info_business_record`
-- ----------------------------
DROP TABLE IF EXISTS `info_business_record`;
CREATE TABLE `info_business_record` (
  `id` int(11) NOT NULL,
  `business_type` enum('每日库存值','代销入库数量','自销入库记录') DEFAULT NULL COMMENT '业务类型',
  `business_date` date DEFAULT NULL COMMENT '业务日期',
  `amount` decimal(20,3) DEFAULT NULL COMMENT '数量（或者是资金）',
  `note` varchar(255) DEFAULT NULL COMMENT '备注',
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `info_capital_type`
-- ----------------------------
DROP TABLE IF EXISTS `info_capital_type`;
CREATE TABLE `info_capital_type` (
  `id` int(11) NOT NULL DEFAULT '0',
  `capital_name` varchar(100) NOT NULL,
  `capital_type` int(8) NOT NULL,
  `parent_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `info_deliver`
-- ----------------------------
DROP TABLE IF EXISTS `info_deliver`;
CREATE TABLE `info_deliver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` int(200) DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `manager_name` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `manager_phone` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `manager_fax` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `zhiguanke_name` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `zhiguanke_phone` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `zhiguanke_fax` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `accountant_name` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `accountant_phone` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `accountant_qq` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `company_email` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `company_postcode` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `company_bankaccount` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `business_license_code` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `business_license_expire_time` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `gmp_code` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `gmp_expire_time` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `qs_code` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `qs_expire_time` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `client_code` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `client_expire_time` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `creator_id` varchar(255) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  `company_address` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `peisong_address` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `note` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `info_drug`
-- ----------------------------
DROP TABLE IF EXISTS `info_drug`;
CREATE TABLE `info_drug` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drug_code` varchar(100) DEFAULT NULL,
  `common_name` varchar(100) DEFAULT NULL,
  `goods_name` varchar(100) DEFAULT NULL,
  `jx` varchar(100) DEFAULT NULL,
  `guige` varchar(50) DEFAULT NULL,
  `jldw` varchar(50) DEFAULT NULL,
  `manufacturer` varchar(200) DEFAULT NULL,
  `bid_type` varchar(50) DEFAULT NULL,
  `bid_price` decimal(20,3) DEFAULT NULL,
  `retail_price` decimal(20,3) DEFAULT NULL,
  `kaipiao_price` decimal(20,3) DEFAULT NULL,
  `tax_price` decimal(20,3) DEFAULT NULL,
  `base_price` decimal(20,3) DEFAULT NULL,
  `other_price` decimal(10,0) unsigned DEFAULT '0' COMMENT '其他费用',
  `profit` decimal(20,3) DEFAULT NULL,
  `is_self` smallint(1) DEFAULT NULL,
  `is_new` smallint(1) DEFAULT NULL,
  `disabled` smallint(1) DEFAULT NULL,
  `medicare_code_province` varchar(200) DEFAULT NULL,
  `medicare_code_country` varchar(200) DEFAULT NULL,
  `protocol_region` varchar(100) DEFAULT NULL,
  `business_license_code` varchar(100) DEFAULT NULL,
  `business_license_expire_time` varchar(50) DEFAULT NULL,
  `gmp_code` varchar(100) DEFAULT NULL,
  `gmp_expire_time` varchar(50) DEFAULT NULL,
  `qs_code` varchar(100) DEFAULT NULL,
  `qs_expire_time` varchar(50) DEFAULT NULL,
  `client_code` varchar(100) DEFAULT NULL,
  `client_expire_time` varchar(50) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `pym` varchar(200) DEFAULT NULL,
  `deliver_list` varchar(500) DEFAULT NULL,
  `supplier_list` varchar(500) DEFAULT NULL,
  `delegate_list` varchar(500) DEFAULT NULL,
  `creator_id` varchar(200) DEFAULT '0',
  `create_time` int(11) DEFAULT NULL,
  `approval_code` varchar(200) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=381 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `info_drug2delegate`
-- ----------------------------
DROP TABLE IF EXISTS `info_drug2delegate`;
CREATE TABLE `info_drug2delegate` (
  `drug_id` int(11) NOT NULL,
  `delegate_id` int(11) NOT NULL,
  `drug_name` varchar(255) DEFAULT NULL COMMENT '药品名称',
  `delegate_name` varchar(255) DEFAULT NULL COMMENT '代理商名称',
  PRIMARY KEY (`drug_id`,`delegate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `info_drug2deliver`
-- ----------------------------
DROP TABLE IF EXISTS `info_drug2deliver`;
CREATE TABLE `info_drug2deliver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drug_id` int(11) NOT NULL,
  `drug_name` varchar(255) NOT NULL COMMENT '药品名称',
  `deliver_id` int(11) NOT NULL,
  `deliver_name` varchar(255) NOT NULL COMMENT '配送公司名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1066 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `info_drug2hospital`
-- ----------------------------
DROP TABLE IF EXISTS `info_drug2hospital`;
CREATE TABLE `info_drug2hospital` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drug_id` int(11) DEFAULT NULL,
  `drug_name` varchar(255) CHARACTER SET utf8 DEFAULT '',
  `hospital_id` int(11) DEFAULT NULL,
  `hospital_name` varchar(255) CHARACTER SET utf8 DEFAULT '',
  `create_time` int(11) DEFAULT NULL,
  `creator_id` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `company_profit` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3751 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `info_drug2supplier`
-- ----------------------------
DROP TABLE IF EXISTS `info_drug2supplier`;
CREATE TABLE `info_drug2supplier` (
  `drug_id` int(11) NOT NULL,
  `supplier_id` int(11) NOT NULL,
  `drug_name` varchar(255) DEFAULT NULL COMMENT '药品名称',
  `supplier_name` varchar(255) DEFAULT NULL COMMENT '供应商名称',
  PRIMARY KEY (`drug_id`,`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `info_drug_daily_sell_record`
-- ----------------------------
DROP TABLE IF EXISTS `info_drug_daily_sell_record`;
CREATE TABLE `info_drug_daily_sell_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drug_id` int(11) DEFAULT NULL COMMENT '药品id',
  `drug_name` varchar(255) DEFAULT NULL COMMENT '药品名称',
  `drug_guige` varchar(255) DEFAULT NULL COMMENT '药品规格',
  `drug_manufacture` varchar(255) DEFAULT NULL COMMENT '药品生产企业',
  `sell_sum_amount` int(11) DEFAULT NULL COMMENT '总销售数量',
  `sell_date` datetime DEFAULT NULL COMMENT '销售日期',
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `info_drug_profit_assign`
-- ----------------------------
DROP TABLE IF EXISTS `info_drug_profit_assign`;
CREATE TABLE `info_drug_profit_assign` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `drug2hos_id` int(11) NOT NULL,
  `description` varchar(50) NOT NULL,
  `employee_name` varchar(255) DEFAULT NULL,
  `employee_id` int(11) NOT NULL,
  `rate` varchar(20) DEFAULT NULL,
  `profit_assign` decimal(20,2) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `drug_name` varchar(100) NOT NULL,
  `hospital_id` int(11) NOT NULL,
  `hospital_name` varchar(100) NOT NULL,
  `note` varchar(200) NOT NULL,
  `creator_id` varchar(255) NOT NULL,
  `create_time` int(11) NOT NULL,
  `employee_alarm_month` int(11) DEFAULT '100' COMMENT '每月销售预警值',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10428 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `info_employee`
-- ----------------------------
DROP TABLE IF EXISTS `info_employee`;
CREATE TABLE `info_employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `bank_account` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `phone` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `qq` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `email` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `pym` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `address` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `note` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `is_employee` int(1) NOT NULL DEFAULT '0',
  `is_off_job` int(1) NOT NULL DEFAULT '0',
  `client_user_name` varchar(200) CHARACTER SET utf8 NOT NULL,
  `client_password` varchar(200) CHARACTER SET utf8 NOT NULL,
  `creator_id` varchar(200) CHARACTER SET utf8 NOT NULL,
  `create_time` int(11) NOT NULL,
  `login_enable` int(11) NOT NULL DEFAULT '0' COMMENT '业务员登录账号是否可用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=123459 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `info_hospital`
-- ----------------------------
DROP TABLE IF EXISTS `info_hospital`;
CREATE TABLE `info_hospital` (
  `hospital_code` varchar(200) CHARACTER SET utf8 NOT NULL,
  `hospital_name` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `region_id` varchar(200) CHARACTER SET utf8 NOT NULL,
  `hospital_type` varchar(200) CHARACTER SET utf8 NOT NULL,
  `pym` varchar(200) CHARACTER SET utf8 NOT NULL,
  `note` varchar(200) CHARACTER SET utf8 NOT NULL,
  `manager` varchar(50) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16972 DEFAULT CHARSET=latin1;

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
  `detail_business_ids` varchar(200) DEFAULT NULL,
  `flow_type` varchar(200) DEFAULT NULL COMMENT '流向形式',
  `zs_employee` varchar(200) DEFAULT NULL COMMENT '招商人员',
  `zs_commission` varchar(200) DEFAULT NULL COMMENT '招商佣金',
  `note` varchar(200) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `info_region`
-- ----------------------------
DROP TABLE IF EXISTS `info_region`;
CREATE TABLE `info_region` (
  `id` int(6) NOT NULL COMMENT '行政区划代码',
  `region_name` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT '行政区划名称',
  `region_type` int(1) NOT NULL COMMENT '行政区划等级',
  `parent_id` int(6) NOT NULL COMMENT '上级行政区划',
  `hospital_count` int(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `info_stock`
-- ----------------------------
DROP TABLE IF EXISTS `info_stock`;
CREATE TABLE `info_stock` (
  `id` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `drug_name` varchar(255) NOT NULL COMMENT '药品名称',
  `deliver_id` int(11) NOT NULL,
  `deliver_name` varchar(255) NOT NULL COMMENT '配送公司名称',
  `batch_num` varchar(250) NOT NULL,
  `amount` int(20) NOT NULL DEFAULT '0',
  `expire_time` date NOT NULL COMMENT '改批号药品过期日期',
  `alarm_amount` int(11) NOT NULL DEFAULT '0',
  `operate_info` longtext NOT NULL,
  PRIMARY KEY (`drug_id`,`deliver_id`,`batch_num`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `info_stock_daily_record`
-- ----------------------------
DROP TABLE IF EXISTS `info_stock_daily_record`;
CREATE TABLE `info_stock_daily_record` (
  `drug_id` int(11) NOT NULL,
  `drug_name` varchar(255) NOT NULL COMMENT '药品名称',
  `deliver_id` int(11) NOT NULL,
  `deliver_name` varchar(255) NOT NULL COMMENT '配送公司名称',
  `batch_num` varchar(250) NOT NULL,
  `amount` int(20) NOT NULL DEFAULT '0',
  `expire_time` date NOT NULL COMMENT '改批号药品过期日期',
  `alarm_amount` int(11) NOT NULL COMMENT '药品数量预警值',
  `record_date` date NOT NULL COMMENT '记录日期',
  `operate_info` longtext NOT NULL,
  `id` varchar(200) NOT NULL,
  PRIMARY KEY (`drug_id`,`deliver_id`,`batch_num`,`record_date`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `info_stock_temp`
-- ----------------------------
DROP TABLE IF EXISTS `info_stock_temp`;
CREATE TABLE `info_stock_temp` (
  `id` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `drug_name` varchar(255) NOT NULL COMMENT '药品名称',
  `deliver_id` int(11) NOT NULL,
  `deliver_name` varchar(255) NOT NULL COMMENT '配送公司名称',
  `batch_num` varchar(250) NOT NULL,
  `amount` int(20) NOT NULL DEFAULT '0',
  `expire_time` date NOT NULL COMMENT '改批号药品过期日期',
  `alarm_amount` int(11) NOT NULL DEFAULT '0',
  `operate_info` longtext NOT NULL,
  PRIMARY KEY (`id`,`drug_id`,`deliver_id`,`batch_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `info_supplier`
-- ----------------------------
DROP TABLE IF EXISTS `info_supplier`;
CREATE TABLE `info_supplier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `name` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `manager_name` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `manager_phone` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `manager_mobile` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `neiqin_name` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `neiqin_phone` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `neiqin_qq` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `company_bankaccount` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `company_address` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `note` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `business_license_code` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `business_license_expire_time` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `gmp_code` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `gmp_expire_time` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `qs_code` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `qs_expire_time` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `client_code` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `client_expire_time` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
  `creator_id` varchar(200) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  `company_postcode` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `company_email` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `accountant_name` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `accountant_phone` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `accountant_qq` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `record_bankio_detail`
-- ----------------------------
DROP TABLE IF EXISTS `record_bankio_detail`;
CREATE TABLE `record_bankio_detail` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL COMMENT '操作类目',
  `bankcard_id` int(11) DEFAULT NULL COMMENT '关联银行卡号',
  `operate_time` int(11) DEFAULT NULL COMMENT '业务时间戳',
  `operate_user_id` varchar(255) DEFAULT NULL COMMENT '操作人员id',
  `description` varchar(1000) DEFAULT NULL COMMENT '描述',
  `money` decimal(20,3) DEFAULT NULL COMMENT '涉及金额，可以小于零，精确小数点后3位',
  `fid` varchar(255) DEFAULT NULL COMMENT '对应的fid',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_biz_log`
-- ----------------------------
DROP TABLE IF EXISTS `t_biz_log`;
CREATE TABLE `t_biz_log` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date_created` datetime DEFAULT NULL,
  `info` varchar(1000) NOT NULL,
  `ip` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `log_category` varchar(50) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `ip_from` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=144343 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_cash`
-- ----------------------------
DROP TABLE IF EXISTS `t_cash`;
CREATE TABLE `t_cash` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `biz_date` datetime NOT NULL,
  `in_money` decimal(19,2) DEFAULT NULL,
  `out_money` decimal(19,2) DEFAULT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_cash_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_cash_detail`;
CREATE TABLE `t_cash_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `biz_date` datetime NOT NULL,
  `in_money` decimal(19,2) DEFAULT NULL,
  `out_money` decimal(19,2) DEFAULT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `ref_number` varchar(255) NOT NULL,
  `ref_type` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_config`
-- ----------------------------
DROP TABLE IF EXISTS `t_config`;
CREATE TABLE `t_config` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL,
  `show_order` int(11) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_customer`
-- ----------------------------
DROP TABLE IF EXISTS `t_customer`;
CREATE TABLE `t_customer` (
  `id` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact01` varchar(255) DEFAULT NULL,
  `qq01` varchar(255) DEFAULT NULL,
  `tel01` varchar(255) DEFAULT NULL,
  `mobile01` varchar(255) DEFAULT NULL,
  `contact02` varchar(255) DEFAULT NULL,
  `qq02` varchar(255) DEFAULT NULL,
  `tel02` varchar(255) DEFAULT NULL,
  `mobile02` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `address_shipping` varchar(255) DEFAULT NULL,
  `address_receipt` varchar(255) DEFAULT NULL,
  `py` varchar(255) DEFAULT NULL,
  `init_receivables` decimal(19,2) DEFAULT NULL,
  `init_receivables_dt` datetime DEFAULT NULL,
  `init_payables` decimal(19,2) DEFAULT NULL,
  `init_payables_dt` datetime DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `bank_account` varchar(255) DEFAULT NULL,
  `tax_number` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_customer_category`
-- ----------------------------
DROP TABLE IF EXISTS `t_customer_category`;
CREATE TABLE `t_customer_category` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_fid`
-- ----------------------------
DROP TABLE IF EXISTS `t_fid`;
CREATE TABLE `t_fid` (
  `fid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`fid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_goods`
-- ----------------------------
DROP TABLE IF EXISTS `t_goods`;
CREATE TABLE `t_goods` (
  `id` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sale_price` decimal(19,2) NOT NULL,
  `spec` varchar(255) NOT NULL,
  `unit_id` varchar(255) NOT NULL,
  `purchase_price` decimal(19,2) DEFAULT NULL,
  `py` varchar(255) DEFAULT NULL,
  `spec_py` varchar(255) DEFAULT NULL,
  `bar_code` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `memo` varchar(500) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  `brand_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_goods_bom`
-- ----------------------------
DROP TABLE IF EXISTS `t_goods_bom`;
CREATE TABLE `t_goods_bom` (
  `id` varchar(255) NOT NULL,
  `goods_id` varchar(255) NOT NULL,
  `sub_goods_id` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `sub_goods_count` decimal(19,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_goods_brand`
-- ----------------------------
DROP TABLE IF EXISTS `t_goods_brand`;
CREATE TABLE `t_goods_brand` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `full_name` varchar(1000) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_goods_category`
-- ----------------------------
DROP TABLE IF EXISTS `t_goods_category`;
CREATE TABLE `t_goods_category` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `full_name` varchar(1000) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_goods_si`
-- ----------------------------
DROP TABLE IF EXISTS `t_goods_si`;
CREATE TABLE `t_goods_si` (
  `id` varchar(255) NOT NULL,
  `goods_id` varchar(255) NOT NULL,
  `warehouse_id` varchar(255) NOT NULL,
  `safety_inventory` decimal(19,2) NOT NULL,
  `inventory_upper` decimal(19,2) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_goods_unit`
-- ----------------------------
DROP TABLE IF EXISTS `t_goods_unit`;
CREATE TABLE `t_goods_unit` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_ic_bill`
-- ----------------------------
DROP TABLE IF EXISTS `t_ic_bill`;
CREATE TABLE `t_ic_bill` (
  `id` varchar(255) NOT NULL,
  `bill_status` int(11) NOT NULL,
  `bizdt` datetime NOT NULL,
  `biz_user_id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `input_user_id` varchar(255) NOT NULL,
  `ref` varchar(255) NOT NULL,
  `warehouse_id` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_ic_bill_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_ic_bill_detail`;
CREATE TABLE `t_ic_bill_detail` (
  `id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_id` varchar(255) NOT NULL,
  `goods_count` int(11) NOT NULL,
  `goods_money` decimal(19,2) NOT NULL,
  `show_order` int(11) NOT NULL,
  `icbill_id` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_inventory`
-- ----------------------------
DROP TABLE IF EXISTS `t_inventory`;
CREATE TABLE `t_inventory` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `balance_count` decimal(19,2) NOT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `balance_price` decimal(19,2) NOT NULL,
  `goods_id` varchar(255) NOT NULL,
  `in_count` decimal(19,2) DEFAULT NULL,
  `in_money` decimal(19,2) DEFAULT NULL,
  `in_price` decimal(19,2) DEFAULT NULL,
  `out_count` decimal(19,2) DEFAULT NULL,
  `out_money` decimal(19,2) DEFAULT NULL,
  `out_price` decimal(19,2) DEFAULT NULL,
  `afloat_count` decimal(19,2) DEFAULT NULL,
  `afloat_money` decimal(19,2) DEFAULT NULL,
  `afloat_price` decimal(19,2) DEFAULT NULL,
  `warehouse_id` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_inventory_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_inventory_detail`;
CREATE TABLE `t_inventory_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `balance_count` decimal(19,2) NOT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `balance_price` decimal(19,2) NOT NULL,
  `biz_date` datetime NOT NULL,
  `biz_user_id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_id` varchar(255) NOT NULL,
  `in_count` decimal(19,2) DEFAULT NULL,
  `in_money` decimal(19,2) DEFAULT NULL,
  `in_price` decimal(19,2) DEFAULT NULL,
  `out_count` decimal(19,2) DEFAULT NULL,
  `out_money` decimal(19,2) DEFAULT NULL,
  `out_price` decimal(19,2) DEFAULT NULL,
  `ref_number` varchar(255) DEFAULT NULL,
  `ref_type` varchar(255) NOT NULL,
  `warehouse_id` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_inventory_fifo`
-- ----------------------------
DROP TABLE IF EXISTS `t_inventory_fifo`;
CREATE TABLE `t_inventory_fifo` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `balance_count` decimal(19,2) NOT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `balance_price` decimal(19,2) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_id` varchar(255) NOT NULL,
  `in_count` decimal(19,2) DEFAULT NULL,
  `in_money` decimal(19,2) DEFAULT NULL,
  `in_price` decimal(19,2) DEFAULT NULL,
  `out_count` decimal(19,2) DEFAULT NULL,
  `out_money` decimal(19,2) DEFAULT NULL,
  `out_price` decimal(19,2) DEFAULT NULL,
  `in_ref` varchar(255) DEFAULT NULL,
  `in_ref_type` varchar(255) NOT NULL,
  `warehouse_id` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `pwbilldetail_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_inventory_fifo_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_inventory_fifo_detail`;
CREATE TABLE `t_inventory_fifo_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `balance_count` decimal(19,2) NOT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `balance_price` decimal(19,2) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_id` varchar(255) NOT NULL,
  `in_count` decimal(19,2) DEFAULT NULL,
  `in_money` decimal(19,2) DEFAULT NULL,
  `in_price` decimal(19,2) DEFAULT NULL,
  `out_count` decimal(19,2) DEFAULT NULL,
  `out_money` decimal(19,2) DEFAULT NULL,
  `out_price` decimal(19,2) DEFAULT NULL,
  `warehouse_id` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `pwbilldetail_id` varchar(255) DEFAULT NULL,
  `wsbilldetail_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_it_bill`
-- ----------------------------
DROP TABLE IF EXISTS `t_it_bill`;
CREATE TABLE `t_it_bill` (
  `id` varchar(255) NOT NULL,
  `bill_status` int(11) NOT NULL,
  `bizdt` datetime NOT NULL,
  `biz_user_id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `input_user_id` varchar(255) NOT NULL,
  `ref` varchar(255) NOT NULL,
  `from_warehouse_id` varchar(255) NOT NULL,
  `to_warehouse_id` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_it_bill_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_it_bill_detail`;
CREATE TABLE `t_it_bill_detail` (
  `id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_id` varchar(255) NOT NULL,
  `goods_count` int(11) NOT NULL,
  `show_order` int(11) NOT NULL,
  `itbill_id` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
--  Table structure for `t_menu_item4employee`
-- ----------------------------
DROP TABLE IF EXISTS `t_menu_item4employee`;
CREATE TABLE `t_menu_item4employee` (
  `id` varchar(255) NOT NULL,
  `caption` varchar(255) NOT NULL,
  `fid` varchar(255) DEFAULT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `show_order` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_org`
-- ----------------------------
DROP TABLE IF EXISTS `t_org`;
CREATE TABLE `t_org` (
  `id` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `org_code` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_payables`
-- ----------------------------
DROP TABLE IF EXISTS `t_payables`;
CREATE TABLE `t_payables` (
  `id` varchar(255) NOT NULL,
  `act_money` decimal(19,2) NOT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `ca_id` varchar(255) NOT NULL,
  `ca_type` varchar(255) NOT NULL,
  `pay_money` decimal(19,2) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_payables_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_payables_detail`;
CREATE TABLE `t_payables_detail` (
  `id` varchar(255) NOT NULL,
  `act_money` decimal(19,2) NOT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `ca_id` varchar(255) NOT NULL,
  `ca_type` varchar(255) NOT NULL,
  `biz_date` datetime DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `pay_money` decimal(19,2) NOT NULL,
  `ref_number` varchar(255) NOT NULL,
  `ref_type` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_payment`
-- ----------------------------
DROP TABLE IF EXISTS `t_payment`;
CREATE TABLE `t_payment` (
  `id` varchar(255) NOT NULL,
  `act_money` decimal(19,2) NOT NULL,
  `biz_date` datetime NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `input_user_id` varchar(255) NOT NULL,
  `pay_user_id` varchar(255) NOT NULL,
  `bill_id` varchar(255) NOT NULL,
  `ref_type` varchar(255) NOT NULL,
  `ref_number` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_permission`
-- ----------------------------
DROP TABLE IF EXISTS `t_permission`;
CREATE TABLE `t_permission` (
  `id` varchar(255) NOT NULL,
  `fid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `py` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_po_bill`
-- ----------------------------
DROP TABLE IF EXISTS `t_po_bill`;
CREATE TABLE `t_po_bill` (
  `id` varchar(255) NOT NULL,
  `bill_status` int(11) NOT NULL,
  `biz_dt` datetime NOT NULL,
  `deal_date` datetime NOT NULL,
  `org_id` varchar(255) NOT NULL,
  `biz_user_id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_money` decimal(19,2) NOT NULL,
  `tax` decimal(19,2) NOT NULL,
  `money_with_tax` decimal(19,2) NOT NULL,
  `input_user_id` varchar(255) NOT NULL,
  `ref` varchar(255) NOT NULL,
  `supplier_id` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `deal_address` varchar(255) DEFAULT NULL,
  `bill_memo` varchar(255) DEFAULT NULL,
  `payment_type` int(11) NOT NULL DEFAULT '0',
  `confirm_user_id` varchar(255) DEFAULT NULL,
  `confirm_date` datetime DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_po_bill_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_po_bill_detail`;
CREATE TABLE `t_po_bill_detail` (
  `id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_id` varchar(255) NOT NULL,
  `goods_count` int(11) NOT NULL,
  `goods_money` decimal(19,2) NOT NULL,
  `goods_price` decimal(19,2) NOT NULL,
  `pobill_id` varchar(255) NOT NULL,
  `tax_rate` decimal(19,2) NOT NULL,
  `tax` decimal(19,2) NOT NULL,
  `money_with_tax` decimal(19,2) NOT NULL,
  `pw_count` int(11) NOT NULL,
  `left_count` int(11) NOT NULL,
  `show_order` int(11) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_po_pw`
-- ----------------------------
DROP TABLE IF EXISTS `t_po_pw`;
CREATE TABLE `t_po_pw` (
  `po_id` varchar(255) NOT NULL,
  `pw_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_pr_bill`
-- ----------------------------
DROP TABLE IF EXISTS `t_pr_bill`;
CREATE TABLE `t_pr_bill` (
  `id` varchar(255) NOT NULL,
  `bill_status` int(11) NOT NULL,
  `bizdt` datetime NOT NULL,
  `biz_user_id` varchar(255) NOT NULL,
  `supplier_id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `input_user_id` varchar(255) NOT NULL,
  `inventory_money` decimal(19,2) DEFAULT NULL,
  `ref` varchar(255) NOT NULL,
  `rejection_money` decimal(19,2) DEFAULT NULL,
  `warehouse_id` varchar(255) NOT NULL,
  `pw_bill_id` varchar(255) NOT NULL,
  `receiving_type` int(11) NOT NULL DEFAULT '0',
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_pr_bill_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_pr_bill_detail`;
CREATE TABLE `t_pr_bill_detail` (
  `id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_id` varchar(255) NOT NULL,
  `goods_count` int(11) NOT NULL,
  `goods_money` decimal(19,2) NOT NULL,
  `goods_price` decimal(19,2) NOT NULL,
  `inventory_money` decimal(19,2) NOT NULL,
  `inventory_price` decimal(19,2) NOT NULL,
  `rejection_goods_count` int(11) NOT NULL,
  `rejection_goods_price` decimal(19,2) NOT NULL,
  `rejection_money` decimal(19,2) NOT NULL,
  `show_order` int(11) NOT NULL,
  `prbill_id` varchar(255) NOT NULL,
  `pwbilldetail_id` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_pre_payment`
-- ----------------------------
DROP TABLE IF EXISTS `t_pre_payment`;
CREATE TABLE `t_pre_payment` (
  `id` varchar(255) NOT NULL,
  `supplier_id` varchar(255) NOT NULL,
  `in_money` decimal(19,2) DEFAULT NULL,
  `out_money` decimal(19,2) DEFAULT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_pre_payment_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_pre_payment_detail`;
CREATE TABLE `t_pre_payment_detail` (
  `id` varchar(255) NOT NULL,
  `supplier_id` varchar(255) NOT NULL,
  `in_money` decimal(19,2) DEFAULT NULL,
  `out_money` decimal(19,2) DEFAULT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `biz_date` datetime DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `ref_number` varchar(255) NOT NULL,
  `ref_type` varchar(255) NOT NULL,
  `biz_user_id` varchar(255) NOT NULL,
  `input_user_id` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_pre_receiving`
-- ----------------------------
DROP TABLE IF EXISTS `t_pre_receiving`;
CREATE TABLE `t_pre_receiving` (
  `id` varchar(255) NOT NULL,
  `customer_id` varchar(255) NOT NULL,
  `in_money` decimal(19,2) DEFAULT NULL,
  `out_money` decimal(19,2) DEFAULT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_pre_receiving_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_pre_receiving_detail`;
CREATE TABLE `t_pre_receiving_detail` (
  `id` varchar(255) NOT NULL,
  `customer_id` varchar(255) NOT NULL,
  `in_money` decimal(19,2) DEFAULT NULL,
  `out_money` decimal(19,2) DEFAULT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `biz_date` datetime DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `ref_number` varchar(255) NOT NULL,
  `ref_type` varchar(255) NOT NULL,
  `biz_user_id` varchar(255) NOT NULL,
  `input_user_id` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_psi_db_version`
-- ----------------------------
DROP TABLE IF EXISTS `t_psi_db_version`;
CREATE TABLE `t_psi_db_version` (
  `db_version` varchar(255) NOT NULL,
  `update_dt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_pw_bill`
-- ----------------------------
DROP TABLE IF EXISTS `t_pw_bill`;
CREATE TABLE `t_pw_bill` (
  `id` varchar(255) NOT NULL,
  `bill_status` int(11) NOT NULL,
  `biz_dt` datetime NOT NULL,
  `biz_user_id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_money` decimal(19,2) NOT NULL,
  `input_user_id` varchar(255) NOT NULL,
  `ref` varchar(255) NOT NULL,
  `supplier_id` varchar(255) NOT NULL,
  `warehouse_id` varchar(255) NOT NULL,
  `payment_type` int(11) NOT NULL DEFAULT '0',
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_pw_bill_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_pw_bill_detail`;
CREATE TABLE `t_pw_bill_detail` (
  `id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_id` varchar(255) NOT NULL,
  `goods_count` int(11) NOT NULL,
  `goods_money` decimal(19,2) NOT NULL,
  `goods_price` decimal(19,2) NOT NULL,
  `pwbill_id` varchar(255) NOT NULL,
  `show_order` int(11) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `memo` varchar(1000) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_receivables`
-- ----------------------------
DROP TABLE IF EXISTS `t_receivables`;
CREATE TABLE `t_receivables` (
  `id` varchar(255) NOT NULL,
  `act_money` decimal(19,2) NOT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `ca_id` varchar(255) NOT NULL,
  `ca_type` varchar(255) NOT NULL,
  `rv_money` decimal(19,2) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_receivables_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_receivables_detail`;
CREATE TABLE `t_receivables_detail` (
  `id` varchar(255) NOT NULL,
  `act_money` decimal(19,2) NOT NULL,
  `balance_money` decimal(19,2) NOT NULL,
  `ca_id` varchar(255) NOT NULL,
  `ca_type` varchar(255) NOT NULL,
  `biz_date` datetime DEFAULT NULL,
  `date_created` datetime DEFAULT NULL,
  `ref_number` varchar(255) NOT NULL,
  `ref_type` varchar(255) NOT NULL,
  `rv_money` decimal(19,2) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_receiving`
-- ----------------------------
DROP TABLE IF EXISTS `t_receiving`;
CREATE TABLE `t_receiving` (
  `id` varchar(255) NOT NULL,
  `act_money` decimal(19,2) NOT NULL,
  `biz_date` datetime NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `input_user_id` varchar(255) NOT NULL,
  `remark` varchar(255) NOT NULL,
  `rv_user_id` varchar(255) NOT NULL,
  `bill_id` varchar(255) NOT NULL,
  `ref_number` varchar(255) NOT NULL,
  `ref_type` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_recent_fid`
-- ----------------------------
DROP TABLE IF EXISTS `t_recent_fid`;
CREATE TABLE `t_recent_fid` (
  `fid` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `click_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_role`
-- ----------------------------
DROP TABLE IF EXISTS `t_role`;
CREATE TABLE `t_role` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_role_permission`
-- ----------------------------
DROP TABLE IF EXISTS `t_role_permission`;
CREATE TABLE `t_role_permission` (
  `role_id` varchar(255) DEFAULT NULL,
  `permission_id` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_role_permission_dataorg`
-- ----------------------------
DROP TABLE IF EXISTS `t_role_permission_dataorg`;
CREATE TABLE `t_role_permission_dataorg` (
  `role_id` varchar(255) DEFAULT NULL,
  `permission_id` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_role_user`
-- ----------------------------
DROP TABLE IF EXISTS `t_role_user`;
CREATE TABLE `t_role_user` (
  `role_id` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_so_bill`
-- ----------------------------
DROP TABLE IF EXISTS `t_so_bill`;
CREATE TABLE `t_so_bill` (
  `id` varchar(255) NOT NULL,
  `bill_status` int(11) NOT NULL,
  `biz_dt` datetime NOT NULL,
  `deal_date` datetime NOT NULL,
  `org_id` varchar(255) NOT NULL,
  `biz_user_id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_money` decimal(19,2) NOT NULL,
  `tax` decimal(19,2) NOT NULL,
  `money_with_tax` decimal(19,2) NOT NULL,
  `input_user_id` varchar(255) NOT NULL,
  `ref` varchar(255) NOT NULL,
  `customer_id` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `deal_address` varchar(255) DEFAULT NULL,
  `bill_memo` varchar(255) DEFAULT NULL,
  `receiving_type` int(11) NOT NULL DEFAULT '0',
  `confirm_user_id` varchar(255) DEFAULT NULL,
  `confirm_date` datetime DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_so_bill_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_so_bill_detail`;
CREATE TABLE `t_so_bill_detail` (
  `id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_id` varchar(255) NOT NULL,
  `goods_count` int(11) NOT NULL,
  `goods_money` decimal(19,2) NOT NULL,
  `goods_price` decimal(19,2) NOT NULL,
  `sobill_id` varchar(255) NOT NULL,
  `tax_rate` decimal(19,2) NOT NULL,
  `tax` decimal(19,2) NOT NULL,
  `money_with_tax` decimal(19,2) NOT NULL,
  `ws_count` int(11) NOT NULL,
  `left_count` int(11) NOT NULL,
  `show_order` int(11) NOT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_so_ws`
-- ----------------------------
DROP TABLE IF EXISTS `t_so_ws`;
CREATE TABLE `t_so_ws` (
  `so_id` varchar(255) NOT NULL,
  `ws_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_sr_bill`
-- ----------------------------
DROP TABLE IF EXISTS `t_sr_bill`;
CREATE TABLE `t_sr_bill` (
  `id` varchar(255) NOT NULL,
  `bill_status` int(11) NOT NULL,
  `bizdt` datetime NOT NULL,
  `biz_user_id` varchar(255) NOT NULL,
  `customer_id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `input_user_id` varchar(255) NOT NULL,
  `inventory_money` decimal(19,2) DEFAULT NULL,
  `profit` decimal(19,2) DEFAULT NULL,
  `ref` varchar(255) NOT NULL,
  `rejection_sale_money` decimal(19,2) DEFAULT NULL,
  `warehouse_id` varchar(255) NOT NULL,
  `ws_bill_id` varchar(255) NOT NULL,
  `payment_type` int(11) NOT NULL DEFAULT '0',
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_sr_bill_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_sr_bill_detail`;
CREATE TABLE `t_sr_bill_detail` (
  `id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_id` varchar(255) NOT NULL,
  `goods_count` int(11) NOT NULL,
  `goods_money` decimal(19,2) NOT NULL,
  `goods_price` decimal(19,2) NOT NULL,
  `inventory_money` decimal(19,2) NOT NULL,
  `inventory_price` decimal(19,2) NOT NULL,
  `rejection_goods_count` int(11) NOT NULL,
  `rejection_goods_price` decimal(19,2) NOT NULL,
  `rejection_sale_money` decimal(19,2) NOT NULL,
  `show_order` int(11) NOT NULL,
  `srbill_id` varchar(255) NOT NULL,
  `wsbilldetail_id` varchar(255) NOT NULL,
  `sn_note` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_supplier`
-- ----------------------------
DROP TABLE IF EXISTS `t_supplier`;
CREATE TABLE `t_supplier` (
  `id` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact01` varchar(255) DEFAULT NULL,
  `qq01` varchar(255) DEFAULT NULL,
  `tel01` varchar(255) DEFAULT NULL,
  `mobile01` varchar(255) DEFAULT NULL,
  `contact02` varchar(255) DEFAULT NULL,
  `qq02` varchar(255) DEFAULT NULL,
  `tel02` varchar(255) DEFAULT NULL,
  `mobile02` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `address_shipping` varchar(255) DEFAULT NULL,
  `address_receipt` varchar(255) DEFAULT NULL,
  `py` varchar(255) DEFAULT NULL,
  `init_receivables` decimal(19,2) DEFAULT NULL,
  `init_receivables_dt` datetime DEFAULT NULL,
  `init_payables` decimal(19,2) DEFAULT NULL,
  `init_payables_dt` datetime DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `bank_account` varchar(255) DEFAULT NULL,
  `tax_number` varchar(255) DEFAULT NULL,
  `fax` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_supplier_category`
-- ----------------------------
DROP TABLE IF EXISTS `t_supplier_category`;
CREATE TABLE `t_supplier_category` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_user`
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `id` varchar(255) NOT NULL,
  `enabled` int(11) NOT NULL,
  `login_name` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `org_id` varchar(255) NOT NULL,
  `org_code` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `py` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `birthday` varchar(255) DEFAULT NULL,
  `id_card_number` varchar(255) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL,
  `tel02` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  `all_hospital_view` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_warehouse`
-- ----------------------------
DROP TABLE IF EXISTS `t_warehouse`;
CREATE TABLE `t_warehouse` (
  `id` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `inited` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `py` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_ws_bill`
-- ----------------------------
DROP TABLE IF EXISTS `t_ws_bill`;
CREATE TABLE `t_ws_bill` (
  `id` varchar(255) NOT NULL,
  `bill_status` int(11) NOT NULL,
  `bizdt` datetime NOT NULL,
  `biz_user_id` varchar(255) NOT NULL,
  `customer_id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `input_user_id` varchar(255) NOT NULL,
  `inventory_money` decimal(19,2) DEFAULT NULL,
  `profit` decimal(19,2) DEFAULT NULL,
  `ref` varchar(255) NOT NULL,
  `sale_money` decimal(19,2) DEFAULT NULL,
  `warehouse_id` varchar(255) NOT NULL,
  `receiving_type` int(11) NOT NULL DEFAULT '0',
  `data_org` varchar(255) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  `memo` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_ws_bill_detail`
-- ----------------------------
DROP TABLE IF EXISTS `t_ws_bill_detail`;
CREATE TABLE `t_ws_bill_detail` (
  `id` varchar(255) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `goods_id` varchar(255) NOT NULL,
  `goods_count` int(11) NOT NULL,
  `goods_money` decimal(19,2) NOT NULL,
  `goods_price` decimal(19,2) NOT NULL,
  `inventory_money` decimal(19,2) DEFAULT NULL,
  `inventory_price` decimal(19,2) DEFAULT NULL,
  `show_order` int(11) NOT NULL,
  `wsbill_id` varchar(255) NOT NULL,
  `sn_note` varchar(255) DEFAULT NULL,
  `data_org` varchar(255) DEFAULT NULL,
  `memo` varchar(1000) DEFAULT NULL,
  `company_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `t_yewuset_user2hospital`
-- ----------------------------
DROP TABLE IF EXISTS `t_yewuset_user2hospital`;
CREATE TABLE `t_yewuset_user2hospital` (
  `user_id` varchar(255) NOT NULL,
  `hospital_id` int(255) NOT NULL,
  `drug_id` int(255) NOT NULL,
  `data_org` varchar(255) DEFAULT '',
  PRIMARY KEY (`user_id`,`hospital_id`,`drug_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `tb_info_drug`
-- ----------------------------
DROP TABLE IF EXISTS `tb_info_drug`;
CREATE TABLE `tb_info_drug` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `ypbh` varchar(200) DEFAULT NULL,
  `tym` varchar(200) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `jx` varchar(200) DEFAULT NULL,
  `spm` varchar(200) DEFAULT NULL,
  `guige` varchar(200) DEFAULT NULL,
  `jldw` varchar(200) DEFAULT NULL,
  `scqy` varchar(200) DEFAULT NULL,
  `zbj` varchar(200) DEFAULT NULL,
  `lsj` varchar(200) DEFAULT NULL,
  `pym` varchar(200) DEFAULT NULL,
  `ybdm` varchar(200) DEFAULT NULL,
  `zblx` varchar(200) DEFAULT NULL,
  `kpj` varchar(200) DEFAULT NULL,
  `se` varchar(200) DEFAULT NULL,
  `xyfx` varchar(200) DEFAULT NULL,
  `dj` varchar(200) DEFAULT NULL,
  `fy` varchar(200) DEFAULT NULL,
  `tybz` varchar(200) DEFAULT NULL,
  `dls` varchar(200) DEFAULT NULL,
  `psgs` varchar(200) DEFAULT NULL,
  `note` varchar(200) DEFAULT NULL,
  `dls1` varchar(200) DEFAULT NULL,
  `dls2` varchar(200) DEFAULT NULL,
  `psgs1` varchar(200) DEFAULT NULL,
  `psgs2` varchar(200) DEFAULT NULL,
  `psgs3` varchar(200) DEFAULT NULL,
  `psgs4` varchar(200) DEFAULT NULL,
  `psgs5` varchar(200) DEFAULT NULL,
  `isself` varchar(200) DEFAULT NULL,
  `gjybdm` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `temp`
-- ----------------------------
DROP TABLE IF EXISTS `temp`;
CREATE TABLE `temp` (
  `id` varchar(255) NOT NULL,
  `fid` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `py` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `type_billing`
-- ----------------------------
DROP TABLE IF EXISTS `type_billing`;
CREATE TABLE `type_billing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('支出','结算方式','收入') DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


# Dump of table bill_self_deliver_huikuan_by_two
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bill_self_deliver_huikuan_by_two`;

CREATE TABLE `bill_self_deliver_huikuan_by_two` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `stock_bill_id` int(10) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `deliver_id` int(11) NOT NULL COMMENT '配送公司id',
  `base_price` decimal(10,2) NOT NULL,
  `tax_unit_price` decimal(10,2) NOT NULL,
  `kaipiao_unit_price` decimal(20,2) NOT NULL,
  `huikuan_way` tinyint(4) NOT NULL,
  `huikuan_amount` int(11) unsigned NOT NULL,
  `sum_kaipiao_money` decimal(20,2) NOT NULL,
  `had_amount` int(11) unsigned NOT NULL DEFAULT '0',
  `create_time` int(11) unsigned NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table bill_self_deliver_huikuan_by_two_sub
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bill_self_deliver_huikuan_by_two_sub`;

CREATE TABLE `bill_self_deliver_huikuan_by_two_sub` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `deliver_id` int(11) NOT NULL,
  `kaipiao_unit_price` decimal(20,2) NOT NULL,
  `huikuan_num` int(11) NOT NULL COMMENT '回款数量',
  `huikuan_money` decimal(20,2) NOT NULL,
  `huikuan_code` varchar(200) NOT NULL,
  `huikuan_way` int(4) NOT NULL DEFAULT '0',
  `bill_date` varchar(50) NOT NULL,
  `kaidan_ren` int(11) NOT NULL,
  `note` varchar(200) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `verifier_id` int(11) NOT NULL,
  `create_time` int(11) NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table bill_self_manufacturer_huikuan_by_two
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bill_self_manufacturer_huikuan_by_two`;

CREATE TABLE `bill_self_manufacturer_huikuan_by_two` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `deliver_huikuan_bill_id` int(11) NOT NULL COMMENT '对应子税票单',
  `deliver_id` int(11) NOT NULL COMMENT '配送公司id',
  `kaipiao_unit_price` decimal(20,2) NOT NULL,
  `huikuan_amount` int(11) unsigned NOT NULL,
  `huikuan_money` decimal(20,2) NOT NULL,
  `huikuan_way` tinyint(4) NOT NULL DEFAULT '0',
  `had_amount` int(11) unsigned NOT NULL DEFAULT '0',
  `create_time` int(11) unsigned NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table bill_self_manufacturer_huikuan_by_two_sub
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bill_self_manufacturer_huikuan_by_two_sub`;

CREATE TABLE `bill_self_manufacturer_huikuan_by_two_sub` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `deliver_id` int(11) NOT NULL,
  `huikuan_way` tinyint(4) NOT NULL DEFAULT '0',
  `kaipiao_unit_price` decimal(20,2) NOT NULL,
  `huikuan_num` int(11) NOT NULL COMMENT '回款数量',
  `huikuan_money` decimal(20,2) NOT NULL,
  `huikuan_code` varchar(200) NOT NULL,
  `huikuan_account` int(11) NOT NULL,
  `bill_date` varchar(50) NOT NULL,
  `kaidan_ren` int(11) NOT NULL,
  `note` varchar(200) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `verifier_id` int(11) NOT NULL,
  `create_time` int(11) NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table bill_self_pay_by_two
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bill_self_pay_by_two`;

CREATE TABLE `bill_self_pay_by_two` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL COMMENT '药品id',
  `buy_bill_id` int(11) NOT NULL COMMENT '采购id',
  `base_price` decimal(20,2) NOT NULL COMMENT '单价',
  `tax_unit_price` decimal(20,2) NOT NULL COMMENT '税价（单价）',
  `pay_amount` int(20) NOT NULL COMMENT '支付数量',
  `sum_pay_money` decimal(20,2) NOT NULL COMMENT '支付总额',
  `kaipiao_unit_price` decimal(20,2) NOT NULL,
  `sum_kaipiao_money` decimal(20,2) NOT NULL,
  `pay_1st_account` int(11) NOT NULL COMMENT '主付款账户',
  `pay_1st_amount` decimal(20,2) NOT NULL COMMENT '主付款账户付款金额',
  `pay_2nd_account` int(11) NOT NULL COMMENT '次付账户',
  `pay_2nd_amount` decimal(20,2) NOT NULL COMMENT '次付帐户金额',
  `buy_date` date NOT NULL COMMENT '采购日期',
  `yewu_date` date NOT NULL COMMENT '业务日期',
  `fund_date` date NOT NULL,
  `kaidan_ren` int(11) NOT NULL COMMENT '开单人',
  `note` varchar(200) NOT NULL COMMENT '备注',
  `verified` smallint(1) NOT NULL DEFAULT '0' COMMENT '是否审核',
  `money_should_pay` decimal(20,2) NOT NULL COMMENT '应付金额',
  `amount_should_pay` int(11) NOT NULL COMMENT '应付数量',
  `in_use` smallint(1) NOT NULL DEFAULT '0' COMMENT '是否引用',
  `status` int(11) NOT NULL COMMENT '单据状态',
  `verifier_id` int(11) NOT NULL COMMENT '审核人id',
  `operate_info` longtext,
  `huikuan_way` tinyint(5) NOT NULL COMMENT '回款方式',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table bill_self_purchase_by_two
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bill_self_purchase_by_two`;

CREATE TABLE `bill_self_purchase_by_two` (
  `id` int(16) NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `buy_amount` int(10) NOT NULL COMMENT '数量',
  `base_price` decimal(20,2) NOT NULL COMMENT '底价',
  `tax_unit_price` decimal(20,2) NOT NULL COMMENT '单品税价',
  `kaipiao_unit_price` decimal(20,2) NOT NULL COMMENT '开票单价',
  `huikuan_way` tinyint(4) NOT NULL COMMENT '回款方式：1.现款现代；2.商业公司预付；3.固定期限回款；4.压批回款',
  `sum_pay` decimal(20,2) NOT NULL COMMENT '付款金额',
  `huikuan_pay` decimal(20,2) NOT NULL COMMENT '回款金额',
  `buy_date` date NOT NULL,
  `kaidan_date` date NOT NULL COMMENT '开单日期',
  `note` varchar(200) NOT NULL,
  `kaidan_ren` int(11) NOT NULL,
  `verifier_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态',
  `create_time` int(10) unsigned NOT NULL,
  `operate_info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table bill_self_stock_by_two
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bill_self_stock_by_two`;

CREATE TABLE `bill_self_stock_by_two` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `pay_bill_id` int(5) DEFAULT NULL COMMENT '付款单id',
  `buy_bill_id` int(5) DEFAULT NULL COMMENT '采购单id',
  `stock_amount` int(11) NOT NULL COMMENT '入库总量',
  `had_amount` int(11) NOT NULL DEFAULT '0' COMMENT '剩余入库总量',
  `create_time` int(10) unsigned NOT NULL,
  `note` varchar(500) NOT NULL,
  `operate_info` longtext,
  `parent_id` int(11) DEFAULT NULL COMMENT '父单编号，开票公司出库单编号',
  `batch_num` varchar(200) NOT NULL DEFAULT '',
  `validity` date NOT NULL,
  `huikuan_way` tinyint(4) NOT NULL COMMENT '回款方式',
  `kaipiao_unit_price` decimal(20,2) NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `tax_unit_price` decimal(10,2) NOT NULL,
  `buy_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table bill_self_stock_by_two_sub
# ------------------------------------------------------------

DROP TABLE IF EXISTS `bill_self_stock_by_two_sub`;

CREATE TABLE `bill_self_stock_by_two_sub` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bill_code` varchar(200) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `drug_id` int(11) NOT NULL,
  `deliver_id` int(11) NOT NULL COMMENT '配送公司',
  `stock_num` int(11) NOT NULL COMMENT '子入库单入库数量',
  `batch_num` varchar(200) NOT NULL COMMENT '批号',
  `validity` date NOT NULL COMMENT '有效期',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态',
  `create_time` int(11) unsigned NOT NULL,
  `note` varchar(500) NOT NULL,
  `instock_date` date NOT NULL COMMENT '入库时间',
  `operate_info` longtext,
  `is_broken` smallint(6) NOT NULL DEFAULT '0',
  `kaipiao_unit_price` decimal(20,3) NOT NULL,
  `huikuan_way` tinyint(5) NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `tax_unit_price` decimal(10,2) NOT NULL,
  `buy_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ----------------------------
--  View structure for `bill_daily_sell_full`
-- ----------------------------
DROP VIEW IF EXISTS `bill_daily_sell_full`;
CREATE ALGORITHM=UNDEFINED DEFINER=`crmroot`@`%` SQL SECURITY INVOKER VIEW `bill_daily_sell_full` AS select `bill_daily_sell`.`bill_code` AS `bill_code`,`bill_daily_sell`.`employee_id` AS `employee_id`,`bill_daily_sell`.`employee_des` AS `employee_des`,`bill_daily_sell`.`employee_profit` AS `employee_profit`,`bill_daily_sell`.`employee_name` AS `employee_name`,`bill_daily_sell`.`drug_id` AS `drug_id`,`bill_daily_sell`.`drug_name` AS `drug_name`,`bill_daily_sell`.`drug_guige` AS `drug_guige`,`bill_daily_sell`.`drug_manufacture` AS `drug_manufacture`,`bill_daily_sell`.`hospital_id` AS `hospital_id`,`bill_daily_sell`.`hospital_name` AS `hospital_name`,`bill_daily_sell`.`stock_id` AS `stock_id`,`bill_daily_sell`.`deliver_id` AS `deliver_id`,`bill_daily_sell`.`deliver_name` AS `deliver_name`,`bill_daily_sell`.`batch_num` AS `batch_num`,`bill_daily_sell`.`sell_amount` AS `sell_amount`,`bill_daily_sell`.`sell_date` AS `sell_date`,`bill_daily_sell`.`create_time` AS `create_time`,`bill_daily_sell`.`creator_id` AS `creator_id`,`bill_daily_sell`.`note` AS `note`,`bill_daily_sell`.`if_paid` AS `if_paid`,`bill_daily_sell`.`pay_time` AS `pay_time`,`bill_daily_sell`.`paybill_id` AS `paybill_id`,`bill_daily_sell`.`status` AS `status`,`bill_daily_sell`.`expire_time` AS `expire_time`,`info_hospital`.`hospital_type` AS `hospital_type`,`info_hospital`.`region_id` AS `region_id`,`info_drug`.`bid_price` AS `bid_price` from ((`bill_daily_sell` join `info_hospital` on((`bill_daily_sell`.`hospital_id` = `info_hospital`.`id`))) join `info_drug` on((`bill_daily_sell`.`drug_id` = `info_drug`.`id`)));

-- ----------------------------
--  Function structure for `fristPinyin`
-- ----------------------------
DROP FUNCTION IF EXISTS `fristPinyin`;
delimiter ;;
CREATE DEFINER=`crmroot`@`%` FUNCTION `fristPinyin`(P_NAME VARCHAR(255)) RETURNS varchar(255) CHARSET utf8
BEGIN
    DECLARE V_RETURN VARCHAR(255);
    SET V_RETURN = ELT(INTERVAL(CONV(HEX(left(CONVERT(P_NAME USING gbk),1)),16,10),
        0xB0A1,0xB0C5,0xB2C1,0xB4EE,0xB6EA,0xB7A2,0xB8C1,0xB9FE,0xBBF7,
        0xBFA6,0xC0AC,0xC2E8,0xC4C3,0xC5B6,0xC5BE,0xC6DA,0xC8BB,
        0xC8F6,0xCBFA,0xCDDA,0xCEF4,0xD1B9,0xD4D1),   
    'A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T','W','X','Y','Z');
    RETURN V_RETURN;
END
 ;;
delimiter ;

-- ----------------------------
--  Function structure for `pinyin`
-- ----------------------------
DROP FUNCTION IF EXISTS `pinyin`;
delimiter ;;
CREATE DEFINER=`crmroot`@`%` FUNCTION `pinyin`(P_NAME VARCHAR(255)) RETURNS varchar(255) CHARSET utf8
BEGIN
    DECLARE V_COMPARE VARCHAR(255);
    DECLARE V_RETURN VARCHAR(255);
    DECLARE I INT;

    SET I = 1;
    SET V_RETURN = '';
    while I < LENGTH(P_NAME) do
        SET V_COMPARE = SUBSTR(P_NAME, I, 1);
        IF (V_COMPARE != '' and V_COMPARE != '-' and V_COMPARE !='（' and V_COMPARE !='）' and V_COMPARE !='(' and V_COMPARE !=')') THEN
            #SET V_RETURN = CONCAT(V_RETURN, ',', V_COMPARE);
            SET V_RETURN = CONCAT(V_RETURN, fristPinyin(V_COMPARE));
            #SET V_RETURN = fristPinyin(V_COMPARE);
        END IF;
        SET I = I + 1;
    end while;

    IF (ISNULL(V_RETURN) or V_RETURN = '') THEN
        SET V_RETURN = P_NAME;
    END IF;

    RETURN V_RETURN;
END
 ;;
delimiter ;

-- ----------------------------
--  Function structure for `sellReportQueryByYear`
-- ----------------------------
DROP FUNCTION IF EXISTS `sellReportQueryByYear`;
delimiter ;;
CREATE DEFINER=`crmroot`@`%` FUNCTION `sellReportQueryByYear`() RETURNS int(11)
BEGIN
    DECLARE V_COMPARE VARCHAR(255);
    DECLARE V_RETURN VARCHAR(255);
    DECLARE I INT;

    SET I = 1;
    SET V_RETURN = '';
    while I < LENGTH(P_NAME) do
        SET V_COMPARE = SUBSTR(P_NAME, I, 1);
        IF (V_COMPARE != '' and V_COMPARE != '-' and V_COMPARE !='（' and V_COMPARE !='）' and V_COMPARE !='(' and V_COMPARE !=')') THEN
            #SET V_RETURN = CONCAT(V_RETURN, ',', V_COMPARE);
            SET V_RETURN = CONCAT(V_RETURN, fristPinyin(V_COMPARE));
            #SET V_RETURN = fristPinyin(V_COMPARE);
        END IF;
        SET I = I + 1;
    end while;

    IF (ISNULL(V_RETURN) or V_RETURN = '') THEN
        SET V_RETURN = P_NAME;
    END IF;

    RETURN V_RETURN;
END
 ;;
delimiter ;

-- ----------------------------
--  Function structure for `update_company_profit`
-- ----------------------------
DROP FUNCTION IF EXISTS `update_company_profit`;
delimiter ;;
CREATE DEFINER=`crmroot`@`%` FUNCTION `update_company_profit`() RETURNS int(11)
BEGIN
	#Routine body goes here...

	RETURN 0;
END
 ;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;

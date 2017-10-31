/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50556
Source Host           : localhost:3306
Source Database       : crmdev

Target Server Type    : MYSQL
Target Server Version : 50556
File Encoding         : 65001

Date: 2017-07-04 14:27:30
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for t_permission
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
-- Records of t_permission
-- ----------------------------
INSERT INTO `t_permission` VALUES ('', '', '', null, null, null);
INSERT INTO `t_permission` VALUES ('-8996', '-8996', '权限管理', '通过菜单进入权限管理模块的权限', '权限管理', 'QXGL');
INSERT INTO `t_permission` VALUES ('-8996-01', '-8996-01', '权限管理-新增角色', '权限管理模块[新增角色]按钮的权限', '权限管理', 'QXGLXZJS');
INSERT INTO `t_permission` VALUES ('-8996-02', '-8996-02', '权限管理-编辑角色', '权限管理模块[编辑角色]按钮的权限', '权限管理', 'QXGLBJJS');
INSERT INTO `t_permission` VALUES ('-8996-03', '-8996-03', '权限管理-删除角色', '权限管理模块[删除角色]按钮的权限', '权限管理', 'QXGLSCJS');
INSERT INTO `t_permission` VALUES ('-8997', '-8997', '业务日志', '业务日志', '系统管理', 'YWRZ');
INSERT INTO `t_permission` VALUES ('-8999', '-8999', '用户管理', '通过菜单进入用户管理模块的权限', '用户管理', 'YHGL');
INSERT INTO `t_permission` VALUES ('-8999-01', '-8999-01', '组织机构在业务单据中的使用权限', '组织机构在业务单据中的使用权限', '用户管理', 'ZZJGZYWDJZDSYQX');
INSERT INTO `t_permission` VALUES ('-8999-02', '-8999-02', '业务员在业务单据中的使用权限', '业务员在业务单据中的使用权限', '用户管理', 'YWYZYWDJZDSYQX');
INSERT INTO `t_permission` VALUES ('-8999-03', '-8999-03', '用户管理-新增组织机构', '用户管理模块[新增组织机构]按钮的权限', '用户管理', 'YHGLXZZZJG');
INSERT INTO `t_permission` VALUES ('-8999-04', '-8999-04', '用户管理-编辑组织机构', '用户管理模块[编辑组织机构]按钮的权限', '用户管理', 'YHGLBJZZJG');
INSERT INTO `t_permission` VALUES ('-8999-05', '-8999-05', '用户管理-删除组织机构', '用户管理模块[删除组织机构]按钮的权限', '用户管理', 'YHGLSCZZJG');
INSERT INTO `t_permission` VALUES ('-8999-06', '-8999-06', '用户管理-新增用户', '用户管理模块[新增用户]按钮的权限', '用户管理', 'YHGLXZYH');
INSERT INTO `t_permission` VALUES ('-8999-07', '-8999-07', '用户管理-编辑用户', '用户管理模块[编辑用户]按钮的权限', '用户管理', 'YHGLBJYH');
INSERT INTO `t_permission` VALUES ('-8999-08', '-8999-08', '用户管理-删除用户', '用户管理模块[删除用户]按钮的权限', '用户管理', 'YHGLSCYH');
INSERT INTO `t_permission` VALUES ('-8999-09', '-8999-09', '用户管理-修改用户密码', '用户管理模块[修改用户密码]按钮的权限', '用户管理', 'YHGLXGYHMM');
INSERT INTO `t_permission` VALUES ('02', '02', '基本信息', '基本信息', '基本信息', 'JBXX');
INSERT INTO `t_permission` VALUES ('0200', '0200', '药品信息', '药品信息', '药品信息', 'YPXX');
INSERT INTO `t_permission` VALUES ('0200-01', '0200-01', '药品信息-新增药品类别', '药品信息模块[新增药品类别]按钮的权限', '药品信息', 'YPXXXZYPLB');
INSERT INTO `t_permission` VALUES ('0200-02', '0200-02', '药品信息-删除药品类别', '药品信息模块[删除药品类别]按钮的权限', '药品信息', 'YPXXSCYPLB');
INSERT INTO `t_permission` VALUES ('0200-03', '0200-03', '药品信息-编辑药品类别', '药品信息模块[编辑药品类别]按钮的权限', '药品信息', 'YPXXBJYPLB');
INSERT INTO `t_permission` VALUES ('0200-04', '0200-04', '药品信息-新增药品分配', '药品信息模块[新增药品分配]按钮的权限', '药品信息', 'YPXXXZYPFP');
INSERT INTO `t_permission` VALUES ('0200-05', '0200-05', '药品信息-删除药品分配', '药品信息模块[删除药品分配]按钮的权限', '药品信息', 'YPXXSCYPFP');
INSERT INTO `t_permission` VALUES ('0200-06', '0200-06', '药品信息-新增药品利润分配', '药品信息模块[新增药品利润分配]按钮的权限', '药品信息', 'YPXXXZYPLRFP');
INSERT INTO `t_permission` VALUES ('0200-07', '0200-07', '药品信息-删除药品利润分配', '药品信息模块[删除药品利润分配]按钮的权限', '药品信息', 'YPXXSCYPLRFP');
INSERT INTO `t_permission` VALUES ('0200-08', '0200-08', '药品信息-编辑药品利润分配', '药品信息模块[编辑药品利润分配]按钮的权限', '药品信息', 'YPXXBJYPLRFP');
INSERT INTO `t_permission` VALUES ('0200-09', '0200-09', '药品信息-查看药品敏感信息', '药品信息模块[查看药品敏感信息]的权限', '药品信息', 'YPXXCKYPMGXX');
INSERT INTO `t_permission` VALUES ('0200-11', '0200-11', '药品信息-公司利润信息查看', '药品信息-公司利润信息查看', '药品信息', 'YPXXGSLYCK');
INSERT INTO `t_permission` VALUES ('0200-12', '0200-12', '药品信息-公司利润信息编辑保存', '药品信息-公司利润信息编辑保存', '药品信息', 'YPXXBJBC');
INSERT INTO `t_permission` VALUES ('0200-13', '0200-13', '药品信息-业务员的提成敏感信息查看', '业务员的提成敏感信息查看', '药品信息', 'YPXXYWYCK');
INSERT INTO `t_permission` VALUES ('0200-14', '0200-14', '药品信息-业务员的提成敏感信息增删改', '业务员的提成敏感信息增删改', '药品信息', 'YPXXYWYZSG');
INSERT INTO `t_permission` VALUES ('0201', '0201', '医院信息', '医院信息', '医院信息', 'YYXX');
INSERT INTO `t_permission` VALUES ('0201-01', '0201-01', '医院信息-新增医院', '医院信息模块[新增医院]按钮的权限', '医院信息', 'YYXXXZYY');
INSERT INTO `t_permission` VALUES ('0201-02', '0201-02', '医院信息-编辑医院', '医院信息模块[编辑医院]按钮的权限', '医院信息', 'YYXXBJYY');
INSERT INTO `t_permission` VALUES ('0201-03', '0201-03', '医院信息-删除医院', '医院信息模块[删除医院]按钮的权限', '医院信息', 'YYXXSCYY');
INSERT INTO `t_permission` VALUES ('0201-04', '0201-04', '医院信息-导入医院列表', '医院信息模块[导入医院列表]按钮的权限', '医院信息', 'YYXXDRYYLB');
INSERT INTO `t_permission` VALUES ('0201-05', '0201-05', '医院信息-导出医院列表', '医院信息模块[导出医院列表]按钮的权限', '医院信息', 'YYXXDCYYLB');
INSERT INTO `t_permission` VALUES ('0202', '0202', '业务员信息', '业务员信息', '业务员信息', 'YWYXX');
INSERT INTO `t_permission` VALUES ('0202-01', '0202-01', '业务员信息-新增业务员', '业务员信息模块[新增业务员]按钮的权限', '业务员信息', 'YWYXXXZYWY');
INSERT INTO `t_permission` VALUES ('0202-02', '0202-02', '业务员信息-编辑业务员', '业务员信息模块[编辑业务员]按钮的权限', '业务员信息', 'YWYXXBJYWY');
INSERT INTO `t_permission` VALUES ('0202-03', '0202-03', '业务员信息-删除业务员', '业务员信息模块[删除业务员]按钮的权限', '业务员信息', 'YWYXXSCYWY');
INSERT INTO `t_permission` VALUES ('0202-04', '0202-04', '业务员信息-导入业务员列表', '业务员信息模块[导入业务员列表]按钮的权限', '业务员信息', 'YWYXXDRYWYLB');
INSERT INTO `t_permission` VALUES ('0202-05', '0202-05', '业务员信息-导出业务员列表', '业务员信息模块[导出业务员列表]按钮的权限', '业务员信息', 'YWYXXDCYWYLB');
INSERT INTO `t_permission` VALUES ('0203', '0203', '供应商信息', '供应商信息', '供应商信息', 'GYSXX');
INSERT INTO `t_permission` VALUES ('0203-01', '0203-01', '供应商信息-新增供应商', '供应商信息模块[新增供应商]按钮的权限', '供应商信息', 'GYSXXXZGYS');
INSERT INTO `t_permission` VALUES ('0203-02', '0203-02', '供应商信息-编辑供应商', '供应商信息模块[编辑供应商]按钮的权限', '供应商信息', 'GYSXXBJGYS');
INSERT INTO `t_permission` VALUES ('0203-03', '0203-03', '供应商信息-删除供应商', '供应商信息模块[删除供应商]按钮的权限', '供应商信息', 'GYSXXSCGYS');
INSERT INTO `t_permission` VALUES ('0203-04', '0203-04', '供应商信息-导入供应商列表', '供应商信息模块[导入供应商列表]按钮的权限', '供应商信息', 'GYSXXDRGYSLB');
INSERT INTO `t_permission` VALUES ('0203-05', '0203-05', '供应商信息-导出供应商列表', '供应商信息模块[导出供应商列表]按钮的权限', '供应商信息', 'GYSXXDCGYSLB');
INSERT INTO `t_permission` VALUES ('0204', '0204', '配送公司', '配送公司', '配送公司', 'PSGS');
INSERT INTO `t_permission` VALUES ('0204-01', '0204-01', '配送公司信息-新增配送公司', '配送公司信息模块[新增配送公司]按钮的权限', '配送公司信息', 'PSGSXXXZPSGS');
INSERT INTO `t_permission` VALUES ('0204-02', '0204-02', '配送公司信息-编辑配送公司', '配送公司信息模块[编辑配送公司]按钮的权限', '配送公司信息', 'PSGSXXBJPSGS');
INSERT INTO `t_permission` VALUES ('0204-03', '0204-03', '配送公司信息-删除配送公司', '配送公司信息模块[删除配送公司]按钮的权限', '配送公司信息', 'PSGSXXSCPSGS');
INSERT INTO `t_permission` VALUES ('0204-04', '0204-04', '配送公司信息-导入配送公司列表', '配送公司信息模块[导入配送公司列表]按钮的权限', '配送公司信息', 'PSGSXXDRPSGSLB');
INSERT INTO `t_permission` VALUES ('0204-05', '0204-05', '配送公司信息-导出配送公司列表', '配送公司信息模块[导出配送公司列表]按钮的权限', '配送公司信息', 'PSGSXXDCPSGSLB');
INSERT INTO `t_permission` VALUES ('0205', '0205', '业务配置', '业务配置', '业务配置', 'YWPZ');
INSERT INTO `t_permission` VALUES ('0205-01', '0205-01', '业务员月销量预警值', '业务配置信息模块[业务员月销量预警值]', '业务员月销量预警值', 'YWPZBJYWYYXLYJZ');
INSERT INTO `t_permission` VALUES ('0205-01-01', '0205-01-01', '业务配置-编辑业务员月销量预警值', '业务配置信息模块[编辑业务员月销量预警值]按钮的权限', '业务员月销量预警值', 'YWPZBJYWYYXLYJZ');
INSERT INTO `t_permission` VALUES ('0205-02', '0205-02', '产品代理协议', '业务配置-产品代理协议', '业务配置', 'YWPZCPDLXY');
INSERT INTO `t_permission` VALUES ('0205-02-01', '0205-02-01', '产品代理协议-新增产品代理协议', '产品代理协议-新增产品代理协议', '产品代理协议', 'YWPZXZCPDLXY');
INSERT INTO `t_permission` VALUES ('0205-02-02', '0205-02-02', '产品代理协议-编辑产品代理协议', '产品代理协议-编辑产品代理协议', '产品代理协议', 'YWPZBJCPDLXY');
INSERT INTO `t_permission` VALUES ('0205-02-03', '0205-02-03', '产品代理协议-删除产品代理协议', '产品代理协议-删除产品代理协议', '产品代理协议', 'YWPZSCCPDLXY');
INSERT INTO `t_permission` VALUES ('0205-03', '0205-03', '推广协议', '业务配置-推广协议', '业务配置', 'YWPZTGXY');
INSERT INTO `t_permission` VALUES ('0205-03-01', '0205-03-01', '推广协议-新增推广协议', '推广协议-新增推广协议', '推广协议', 'YWPZXZTGXY');
INSERT INTO `t_permission` VALUES ('0205-03-02', '0205-03-02', '推广协议-编辑推广协议', '推广协议-编辑推广协议', '推广协议', 'YWPZBJTGXY');
INSERT INTO `t_permission` VALUES ('0205-03-03', '0205-03-03', '推广协议-删除推广协议', '推广协议-删除推广协议', '推广协议', 'YWPZSCTGXT');
INSERT INTO `t_permission` VALUES ('03', '03', '业务流程管理', '业务流程管理', '业务流程管理', 'YWLCGL');
INSERT INTO `t_permission` VALUES ('0301', '0301', '自销', '自销', '自销', 'ZX');
INSERT INTO `t_permission` VALUES ('030101', '030101', '自销采购单采购单', '自销采购单', '自销采购单', 'ZXCGDCGD');
INSERT INTO `t_permission` VALUES ('030101-01', '030101-01', '自销采购单信息-新增自销采购单', '自销采购单信息模块[新增自销采购单]按钮的权限', '自销采购单', 'ZXCGDXXXZZXCGD');
INSERT INTO `t_permission` VALUES ('030101-02', '030101-02', '自销采购单信息-编辑自销采购单', '自销采购单信息模块[编辑自销采购单]按钮的权限', '自销采购单', 'ZXCGDXXBJZXCGD');
INSERT INTO `t_permission` VALUES ('030101-03', '030101-03', '自销采购单信息-删除自销采购单', '自销采购单信息模块[删除自销采购单]按钮的权限', '自销采购单', 'ZXCGDXXSCZXCGD');
INSERT INTO `t_permission` VALUES ('030101-04', '030101-04', '自销采购单信息-导入自销采购单列表', '自销采购单信息模块[导入自销采购单列表]按钮的权限', '自销采购单', 'ZXCGDXXDRZXCGDLB');
INSERT INTO `t_permission` VALUES ('030101-05', '030101-05', '自销采购单信息-导出自销采购单列表', '自销采购单信息模块[导出自销采购单列表]按钮的权限', '自销采购单', 'ZXCGDXXDCZXCGDLB');
INSERT INTO `t_permission` VALUES ('030101-06', '030101-06', '自销采购单信息-审核自销采购单', '自销采购单信息模块[审核自销采购单]按钮的权限', '自销采购单', 'ZXCGDXXSHZXCGD');
INSERT INTO `t_permission` VALUES ('030101-07', '030101-07', '自销采购单信息-反审核自销采购单', '自销采购单信息模块[反审核自销采购单]按钮的权限', '自销采购单', 'ZXCGDXXFSHZXCGD');
INSERT INTO `t_permission` VALUES ('030102', '030102', '自销付款单', '自销付款单', '自销付款单', 'ZXFKD');
INSERT INTO `t_permission` VALUES ('030102-02', '030102-02', '自销付款单信息-编辑自销付款单', '自销付款单信息模块[编辑自销付款单]按钮的权限', '自销付款单', 'ZXFKDXXBJZXFKD');
INSERT INTO `t_permission` VALUES ('030102-03', '030102-03', '自销付款单信息-删除自销付款单', '自销付款单信息模块[删除自销付款单]按钮的权限', '自销付款单', 'ZXFKDXXSCZXFKD');
INSERT INTO `t_permission` VALUES ('030102-04', '030102-04', '自销付款单信息-导入自销付款单列表', '自销付款单信息模块[导入自销付款单列表]按钮的权限', '自销付款单', 'ZXFKDXXDRZXFKDLB');
INSERT INTO `t_permission` VALUES ('030102-05', '030102-05', '自销付款单信息-导出自销付款单列表', '自销付款单信息模块[导出自销付款单列表]按钮的权限', '自销付款单', 'ZXFKDXXDCZXFKDLB');
INSERT INTO `t_permission` VALUES ('030102-06', '030102-06', '自销付款单信息-审核自销付款单', '自销付款单信息模块[审核自销付款单]按钮的权限', '自销付款单', 'ZXFKDXXSHZXFKD');
INSERT INTO `t_permission` VALUES ('030102-07', '030102-07', '自销付款单信息-反审核自销付款单', '自销付款单信息模块[反审核自销付款单]按钮的权限', '自销付款单', 'ZXFKDXXFSHZXFKD');
INSERT INTO `t_permission` VALUES ('030103', '030103', '自销入库单', '自销入库单', '自销入库单', 'ZXRKD');
INSERT INTO `t_permission` VALUES ('030103-02', '030103-02', '自销入库单信息-编辑自销入库单', '自销入库单信息模块[编辑自销入库单]按钮的权限', '自销入库单', 'ZXRKDXXBJZXRKD');
INSERT INTO `t_permission` VALUES ('030103-03', '030103-03', '自销入库单信息-删除自销入库单', '自销入库单信息模块[删除自销入库单]按钮的权限', '自销入库单', 'ZXRKDXXSCZXRKD');
INSERT INTO `t_permission` VALUES ('030103-04', '030103-04', '自销入库单信息-导入自销入库单列表', '自销入库单信息模块[导入自销入库单列表]按钮的权限', '自销入库单', 'ZXRKDXXDRZXRKDLB');
INSERT INTO `t_permission` VALUES ('030103-05', '030103-05', '自销入库单信息-导出自销入库单列表', '自销入库单信息模块[导出自销入库单列表]按钮的权限', '自销入库单', 'ZXRKDXXDCZXRKDLB');
INSERT INTO `t_permission` VALUES ('030103-06', '030103-06', '自销入库单信息-审核自销入库单', '自销入库单信息模块[审核自销入库单]按钮的权限', '自销入库单', 'ZXRKDXXSHZXRKD');
INSERT INTO `t_permission` VALUES ('030103-07', '030103-07', '自销入库单信息-反审核自销入库单', '自销入库单信息模块[反审核自销入库单]按钮的权限', '自销入库单', 'ZXRKDXXFSHZXRKD');
INSERT INTO `t_permission` VALUES ('030104', '030104', '自销税票单', '自销税票单', '自销税票单', 'ZXSPD');
INSERT INTO `t_permission` VALUES ('030104-02', '030104-02', '自销税票单信息-编辑自销税票单', '自销税票单信息模块[编辑自销税票单]按钮的权限', '自销税票单', 'ZXSPDXXBJZXSPD');
INSERT INTO `t_permission` VALUES ('030104-03', '030104-03', '自销税票单信息-删除自销税票单', '自销税票单信息模块[删除自销税票单]按钮的权限', '自销税票单', 'ZXSPDXXSCZXSPD');
INSERT INTO `t_permission` VALUES ('030104-04', '030104-04', '自销税票单信息-导入自销税票单列表', '自销税票单信息模块[导入自销税票单列表]按钮的权限', '自销税票单', 'ZXSPDXXDRZXSPDLB');
INSERT INTO `t_permission` VALUES ('030104-05', '030104-05', '自销税票单信息-导出自销税票单列表', '自销税票单信息模块[导出自销税票单列表]按钮的权限', '自销税票单', 'ZXSPDXXDCZXSPDLB');
INSERT INTO `t_permission` VALUES ('030104-06', '030104-06', '自销税票单信息-审核自销税票单', '自销税票单信息模块[审核自销税票单]按钮的权限', '自销税票单', 'ZXSPDXXSHZXSPD');
INSERT INTO `t_permission` VALUES ('030104-07', '030104-07', '自销税票单信息-反审核自销税票单', '自销税票单信息模块[反审核自销税票单]按钮的权限', '自销税票单', 'ZXSPDXXFSHZXSPD');
INSERT INTO `t_permission` VALUES ('030105', '030105', '自销回款单', '自销回款单', '自销回款单', 'ZXHKD');
INSERT INTO `t_permission` VALUES ('030105-02', '030105-02', '自销回款单信息-编辑自销回款单', '自销回款单信息模块[编辑自销回款单]按钮的权限', '自销回款单', 'ZXHKDXXBJZXHKD');
INSERT INTO `t_permission` VALUES ('030105-03', '030105-03', '自销回款单信息-删除自销回款单', '自销回款单信息模块[删除自销回款单]按钮的权限', '自销回款单', 'ZXHKDXXSCZXHKD');
INSERT INTO `t_permission` VALUES ('030105-04', '030105-04', '自销回款单信息-导入自销回款单列表', '自销回款单信息模块[导入自销回款单列表]按钮的权限', '自销回款单', 'ZXHKDXXDRZXHKDLB');
INSERT INTO `t_permission` VALUES ('030105-05', '030105-05', '自销回款单信息-导出自销回款单列表', '自销回款单信息模块[导出自销回款单列表]按钮的权限', '自销回款单', 'ZXHKDXXDCZXHKDLB');
INSERT INTO `t_permission` VALUES ('030105-06', '030105-06', '自销回款单信息-审核自销回款单', '自销回款单信息模块[审核自销回款单]按钮的权限', '自销回款单', 'ZXHKDXXSHZXHKD');
INSERT INTO `t_permission` VALUES ('030105-07', '030105-07', '自销回款单信息-反审核自销回款单', '自销回款单信息模块[反审核自销回款单]按钮的权限', '自销回款单', 'ZXHKDXXFSHZXHKD');
INSERT INTO `t_permission` VALUES ('030106', '030106', '自销入开票公司单', '自销入开票公司单', '自销入开票公司单', 'ZXRKD');
INSERT INTO `t_permission` VALUES ('030106-01', '030106-01', '自销入开票公司单信息-查看自销入开票公司单', '自销入开票公司单信息模块[查看自销入开票公司单]', '自销入开票公司单', 'ZXRKDXXBJZXRKD');
INSERT INTO `t_permission` VALUES ('030106-02', '030106-02', '自销入开票公司单信息-编辑自销入开票公司单', '自销入开票公司单信息模块[编辑自销入开票公司单]按钮的权限', '自销入开票公司单', 'ZXRKDXXBJZXRKD');
INSERT INTO `t_permission` VALUES ('030106-03', '030106-03', '自销入开票公司单信息-删除自销入开票公司单', '自销入开票公司单信息模块[删除自销入开票公司单]按钮的权限', '自销入开票公司单', 'ZXRKDXXSCZXRKD');
INSERT INTO `t_permission` VALUES ('030106-04', '030106-04', '自销入开票公司单信息-导入自销入开票公司单列表', '自销入开票公司单信息模块[导入自销入开票公司单列表]按钮的权限', '自销入开票公司单', 'ZXRKDXXDRZXRKDLB');
INSERT INTO `t_permission` VALUES ('030106-05', '030106-05', '自销入开票公司单信息-导出自销入开票公司单列表', '自销入开票公司单信息模块[导出自销入开票公司单列表]按钮的权限', '自销入开票公司单', 'ZXRKDXXDCZXRKDLB');
INSERT INTO `t_permission` VALUES ('030106-06', '030106-06', '自销入开票公司单信息-审核自销入开票公司单', '自销入开票公司单信息模块[审核自销入开票公司单]按钮的权限', '自销入开票公司单', 'ZXRKDXXSHZXRKD');
INSERT INTO `t_permission` VALUES ('030106-07', '030106-07', '自销入开票公司单信息-反审核自销入开票公司单', '自销入开票公司单信息模块[反审核自销入开票公司单]按钮的权限', '自销入开票公司单', 'ZXRKDXXFSHZXRKD');
INSERT INTO `t_permission` VALUES ('030107', '030107', '自销出开票公司单', '自销出开票公司单', '自销出开票公司单', 'ZXRKD');
INSERT INTO `t_permission` VALUES ('030107-01', '030107-01', '自销出开票公司单信息-查看自销出开票公司单', '自销出开票公司单信息模块[查看自销出开票公司单]', '自销出开票公司单', 'ZXRKDXXBJZXRKD');
INSERT INTO `t_permission` VALUES ('030107-02', '030107-02', '自销出开票公司单信息-编辑自销出开票公司单', '自销出开票公司单信息模块[编辑自销出开票公司单]按钮的权限', '自销出开票公司单', 'ZXRKDXXBJZXRKD');
INSERT INTO `t_permission` VALUES ('030107-03', '030107-03', '自销出开票公司单信息-删除自销出开票公司单', '自销出开票公司单信息模块[删除自销出开票公司单]按钮的权限', '自销出开票公司单', 'ZXRKDXXSCZXRKD');
INSERT INTO `t_permission` VALUES ('030107-04', '030107-04', '自销出开票公司单信息-导入自销出开票公司单列表', '自销出开票公司单信息模块[导入自销出开票公司单列表]按钮的权限', '自销出开票公司单', 'ZXRKDXXDRZXRKDLB');
INSERT INTO `t_permission` VALUES ('030107-05', '030107-05', '自销出开票公司单信息-导出自销出开票公司单列表', '自销出开票公司单信息模块[导出自销出开票公司单列表]按钮的权限', '自销出开票公司单', 'ZXRKDXXDCZXRKDLB');
INSERT INTO `t_permission` VALUES ('030107-06', '030107-06', '自销出开票公司单信息-审核自销出开票公司单', '自销出开票公司单信息模块[审核自销出开票公司单]按钮的权限', '自销出开票公司单', 'ZXRKDXXSHZXRKD');
INSERT INTO `t_permission` VALUES ('030107-07', '030107-07', '自销出开票公司单信息-反审核自销出开票公司单', '自销出开票公司单信息模块[反审核自销出开票公司单]按钮的权限', '自销出开票公司单', 'ZXRKDXXFSHZXRKD');
INSERT INTO `t_permission` VALUES ('0302', '0302', '代销', '代销', '代销', 'DX');
INSERT INTO `t_permission` VALUES ('030201', '030201', '代销采购单', '代销采购单', '代销采购单', 'DXCGD');
INSERT INTO `t_permission` VALUES ('030201-01', '030201-01', '代销采购单信息-新增代销采购单', '代销采购单信息模块[新增代销采购单]按钮的权限', '代销采购单', 'DXCGDXXXZDXCGD');
INSERT INTO `t_permission` VALUES ('030201-02', '030201-02', '代销采购单信息-编辑代销采购单', '代销采购单信息模块[编辑代销采购单]按钮的权限', '代销采购单', 'DXCGDXXBJDXCGD');
INSERT INTO `t_permission` VALUES ('030201-03', '030201-03', '代销采购单信息-删除代销采购单', '代销采购单信息模块[删除代销采购单]按钮的权限', '代销采购单', 'DXCGDXXSCDXCGD');
INSERT INTO `t_permission` VALUES ('030201-04', '030201-04', '代销采购单信息-导入代销采购单列表', '代销采购单信息模块[导入代销采购单列表]按钮的权限', '代销采购单', 'DXCGDXXDRDXCGDLB');
INSERT INTO `t_permission` VALUES ('030201-05', '030201-05', '代销采购单信息-导出代销采购单列表', '代销采购单信息模块[导出代销采购单列表]按钮的权限', '代销采购单', 'DXCGDXXDCDXCGDLB');
INSERT INTO `t_permission` VALUES ('030201-06', '030201-06', '代销采购单信息-审核代销采购单', '代销采购单信息模块[审核代销采购单]按钮的权限', '代销采购单', 'DXCGDXXSHDXCGD');
INSERT INTO `t_permission` VALUES ('030201-07', '030201-07', '代销采购单信息-反审核代销采购单', '代销采购单信息模块[反审核代销采购单]按钮的权限', '代销采购单', 'DXCGDXXFSHDXCGD');
INSERT INTO `t_permission` VALUES ('030202', '030202', '代销回款单', '代销回款单', '代销回款单', 'DXHKD');
INSERT INTO `t_permission` VALUES ('030202-02', '030202-02', '代销回款单信息-编辑代销回款单', '代销回款单信息模块[编辑代销回款单]按钮的权限', '代销回款单', 'DXHKDXXBJDXHKD');
INSERT INTO `t_permission` VALUES ('030202-03', '030202-03', '代销回款单信息-删除代销回款单', '代销回款单信息模块[删除代销回款单]按钮的权限', '代销回款单', 'DXHKDXXSCDXHKD');
INSERT INTO `t_permission` VALUES ('030202-04', '030202-04', '代销回款单信息-导入代销回款单列表', '代销回款单信息模块[导入代销回款单列表]按钮的权限', '代销回款单', 'DXHKDXXDRDXHKDLB');
INSERT INTO `t_permission` VALUES ('030202-05', '030202-05', '代销回款单信息-导出代销回款单列表', '代销回款单信息模块[导出代销回款单列表]按钮的权限', '代销回款单', 'DXHKDXXDCDXHKDLB');
INSERT INTO `t_permission` VALUES ('030202-06', '030202-06', '代销回款单信息-审核代销回款单', '代销回款单信息模块[审核代销回款单]按钮的权限', '代销回款单', 'DXHKDXXSHDXHKD');
INSERT INTO `t_permission` VALUES ('030202-07', '030202-07', '代销回款单信息-反审核代销回款单', '代销回款单信息模块[反审核代销回款单]按钮的权限', '代销回款单', 'DXHKDXXFSHDXHKD');
INSERT INTO `t_permission` VALUES ('0303', '0303', '销售管理', '销售管理', '销售管理', 'XSGL');
INSERT INTO `t_permission` VALUES ('0303-01', '0303-01', '销售管理-新增销售单', '销售管理模块[新增销售单]按钮的权限', '销售管理', 'XSGLXZXSD');
INSERT INTO `t_permission` VALUES ('0303-02', '0303-02', '销售管理-编辑销售单', '销售管理模块[编辑销售单]按钮的权限', '销售管理', 'XSGLBJXSD');
INSERT INTO `t_permission` VALUES ('0303-03', '0303-03', '销售管理-删除销售单', '销售管理模块[删除销售单]按钮的权限', '销售管理', 'XSGLSCXSD');
INSERT INTO `t_permission` VALUES ('0303-04', '0303-04', '销售管理-导入销售单', '销售管理模块[导入销售单]按钮的权限', '销售管理', 'XSGLDRXSD');
INSERT INTO `t_permission` VALUES ('0303-05', '0303-05', '销售管理-导出销售单', '销售管理模块[导出销售单]按钮的权限', '销售管理', 'XSGLDCXSD');
INSERT INTO `t_permission` VALUES ('0303-06', '0303-06', '销售管理-审核临时销售单到正式表', '销售管理模块[审核确认]按钮的权限', '销售管理', 'XSGLSHLSXSDDZSB');
INSERT INTO `t_permission` VALUES ('0303-07', '0303-07', '销售管理-补全销售流向', '销售管理模块[补全销售流向]按钮的权限', '销售管理', 'XSGLBQXSLX');
INSERT INTO `t_permission` VALUES ('0303-09', '0303-09', '销售管理-查看公司利润，业务员利润等重要信息', '销售管理模块[查看公司利润，业务员利润等重要信息]的权限', '销售管理', 'XSGLBQXSLX');
INSERT INTO `t_permission` VALUES ('04', '04', '库存管理', '库存管理', '库存管理', 'KCGL');
INSERT INTO `t_permission` VALUES ('0401', '0401', '库存管理', '库存管理', '库存管理', 'KCGL');
INSERT INTO `t_permission` VALUES ('0401-01', '0401-01', '库存管理-编辑库存预警值', '库存管理-编辑库存预警值', '库存管理', 'KCGL');
INSERT INTO `t_permission` VALUES ('0401-02', '0401-02', '库存管理-编辑库存批号参数', '库存管理-编辑库存批号参数', '库存管理', 'KCGL');
INSERT INTO `t_permission` VALUES ('0401-03', '0401-03', '库存管理-新建库存调拨单', '库存管理-新建库存调拨单', '库存管理', 'KCGL');
INSERT INTO `t_permission` VALUES ('0401-04', '0401-04', '库存管理-编辑库存调拨单', '库存管理-编辑库存调拨单', '库存管理', 'KCGL');
INSERT INTO `t_permission` VALUES ('0401-05', '0401-05', '库存管理-删除库存调拨单', '库存管理-删除库存调拨单', '库存管理', 'KCGL');
INSERT INTO `t_permission` VALUES ('0401-06', '0401-06', '库存管理-审核库存调拨单', '库存管理-审核库存调拨单', '库存管理', 'KCGL');
INSERT INTO `t_permission` VALUES ('0401-07', '0401-07', '库存管理-反审核库存调拨单', '库存管理-反审核库存调拨单', '库存管理', 'KCGL');
INSERT INTO `t_permission` VALUES ('05', '05', '资金管理', '资金管理', '资金管理', 'ZJGL');
INSERT INTO `t_permission` VALUES ('0501', '0501', '收支科目与结算方式', '收支科目与结算方式', '收支科目与结算方式', 'SZKMYJSFS');
INSERT INTO `t_permission` VALUES ('0501-01', '0501-01', '收支科目与结算方式-新增条目', '收支科目与结算方式模块[新增条目]按钮的权限', '收支科目与结算方式', 'SZKMYJSFS');
INSERT INTO `t_permission` VALUES ('0501-02', '0501-02', '收支科目与结算方式-编辑条目', '收支科目与结算方式模块[编辑条目]按钮的权限', '收支科目与结算方式', 'SZKMYJSFS');
INSERT INTO `t_permission` VALUES ('0501-03', '0501-03', '收支科目与结算方式-删除条目', '收支科目与结算方式模块[删除条目]按钮的权限', '收支科目与结算方式', 'SZKMYJSFS');
INSERT INTO `t_permission` VALUES ('0502', '0502', '账款管理', '账款管理', '账款管理', 'ZKGL');
INSERT INTO `t_permission` VALUES ('050201', '050201', '其他收入支出单', '其他收入支出单', '其他收入支出单', 'QTSRZCD');
INSERT INTO `t_permission` VALUES ('050201-01', '050201-01', '其他收入支出单-新增条目', '其他收入支出单[新增条目]', '其他收入支出单', 'QTSRZCD');
INSERT INTO `t_permission` VALUES ('050201-02', '050201-02', '其他收入支出单-编辑条目', '其他收入支出单[编辑条目]', '其他收入支出单', 'QTSRZCD');
INSERT INTO `t_permission` VALUES ('050201-03', '050201-03', '其他收入支出单-删除条目', '其他收入支出单[删除条目]', '其他收入支出单', 'QTSRZCD');
INSERT INTO `t_permission` VALUES ('050201-04', '050201-04', '其他收入支出单-审核条目', '其他收入支出单[审核条目]', '其他收入支出单', 'QTSRZCD');
INSERT INTO `t_permission` VALUES ('050201-05', '050201-05', '其他收入支出单-反审核条目', '其他收入支出单[反审核条目]', '其他收入支出单', 'QTSRZCD');
INSERT INTO `t_permission` VALUES ('050202', '050202', '应收应付款单', '应收应付款单', '应收应付款单', 'QTSRZCD');
INSERT INTO `t_permission` VALUES ('050202-01', '050202-01', '应收应付款单-新增条目', '应收应付款单[新增条目]', '应收应付款单', 'QTSRZCD');
INSERT INTO `t_permission` VALUES ('050202-02', '050202-02', '应收应付款单-编辑条目', '应收应付款单[编辑条目]', '应收应付款单', 'QTSRZCD');
INSERT INTO `t_permission` VALUES ('050202-03', '050202-03', '应收应付款单-删除条目', '应收应付款单[删除条目]', '应收应付款单', 'QTSRZCD');
INSERT INTO `t_permission` VALUES ('050202-04', '050202-04', '应收应付款单-审核条目', '应收应付款单[审核条目]', '应收应付款单', 'QTSRZCD');
INSERT INTO `t_permission` VALUES ('050202-05', '050202-05', '应收应付款单-反审核条目', '应收应付款单[反审核条目]', '应收应付款单', 'QTSRZCD');
INSERT INTO `t_permission` VALUES ('0503', '0503', '银行存取款', '银行存取款', '银行存取款', 'YXCQK');
INSERT INTO `t_permission` VALUES ('0504', '0504', '业务支付', '业务支付', '业务支付', 'YWZF');
INSERT INTO `t_permission` VALUES ('0504-01', '0504-01', '业务支付-新增业务支付单', '业务支付模块[新增业务支付单]按钮的权限', '业务支付', 'YWZFDCEXCEL');
INSERT INTO `t_permission` VALUES ('0504-02', '0504-02', '业务支付-编辑业务支付单', '业务支付模块[编辑业务支付单]按钮的权限', '业务支付', 'YWZFDCEXCEL');
INSERT INTO `t_permission` VALUES ('0504-03', '0504-03', '业务支付-删除业务支付单', '业务支付模块[删除业务支付单]按钮的权限', '业务支付', 'YWZFDCEXCEL');
INSERT INTO `t_permission` VALUES ('0504-04', '0504-04', '业务支付-审核业务支付单', '业务支付模块[审核业务支付单]按钮的权限', '业务支付', 'YWZFDCEXCEL');
INSERT INTO `t_permission` VALUES ('0504-05', '0504-05', '业务支付-反审核业务支付单', '业务支付模块[反审核业务支付单]按钮的权限', '业务支付', 'YWZFDCEXCEL');
INSERT INTO `t_permission` VALUES ('0504-06', '0504-06', '业务支付-导出业务支付单', '业务支付模块[导出业务支付单]按钮的权限', '业务支付', 'YWZFDCEXCEL');
INSERT INTO `t_permission` VALUES ('0504-07', '0504-07', '业务支付-导入业务支付单', '业务支付模块[导入业务支付单]按钮的权限', '业务支付', 'YWZFDCEXCEL');
INSERT INTO `t_permission` VALUES ('0504-08', '0504-08', '业务支付-查看业务支付单关联流向详情', '业务支付模块[查看业务支付单关联流向详情]的权限', '业务支付', 'YWZFDCEXCEL');
INSERT INTO `t_permission` VALUES ('0504-09', '0504-09', '业务支付-查询业务支付单', '业务支付模块[查询业务支付单]按钮的权限', '业务支付', 'YWZFDCEXCEL');
INSERT INTO `t_permission` VALUES ('06', '06', '报表', '报表', '报表', 'BB');
INSERT INTO `t_permission` VALUES ('0601', '0601', '销售报表', '销售报表', '报表', 'XSBB');
INSERT INTO `t_permission` VALUES ('0601-01', '0601-01', '销售报表-销售总表', '销售报表-销售总表', '销售报表', 'XSBB');
INSERT INTO `t_permission` VALUES ('0601-02', '0601-02', '销售报表-按照地区销售总表', '销售报表-按照地区销售总表', '销售报表', 'XSBB');
INSERT INTO `t_permission` VALUES ('0601-03', '0601-03', '销售报表-医院业务开发情况', '销售报表-医院业务开发情况', '销售报表', 'XSBB');
INSERT INTO `t_permission` VALUES ('0601-04', '0601-04', '销售报表-滞销分析', '销售报表-滞销分析', '销售报表', 'XSBB');
INSERT INTO `t_permission` VALUES ('0601-05', '0601-05', '销售报表-销售毛利分析', '销售报表-销售毛利分析', '销售报表', 'XSBB');
INSERT INTO `t_permission` VALUES ('0602', '0602', '业务员报表', '业务员报表', '报表', 'YWYBB');
INSERT INTO `t_permission` VALUES ('0602-01', '0602-01', '业务员报表-月销售报表', '业务员报表-月销售报表', '业务员报表', 'YWYBB');
INSERT INTO `t_permission` VALUES ('0602-02', '0602-02', '业务员报表-业务员支付报表', '业务员报表-业务员支付报表', '业务员报表', 'YWYBB');
INSERT INTO `t_permission` VALUES ('0603', '0603', '进销存报表', '进销存报表', '报表', 'JXCBB');
INSERT INTO `t_permission` VALUES ('0603-01', '0603-01', '进销存报表-进销存总表', '进销存报表-进销存总表', '进销存报表', 'JXCBB');
INSERT INTO `t_permission` VALUES ('0603-02', '0603-02', '进销存报表-销售明细查询', '进销存报表-销售明细查询', '进销存报表', 'JXCBB');
INSERT INTO `t_permission` VALUES ('0603-03', '0603-03', '进销存报表-进货查询', '进销存报表-进货查询', '进销存报表', 'JXCBB');
INSERT INTO `t_permission` VALUES ('0604', '0604', '业务分析表', '业务分析表', '报表', 'YWFXB');
INSERT INTO `t_permission` VALUES ('0604-01', '0604-01', '业务分析表-产品代理协议报表', '业务分析表-产品代理协议报表', '业务分析表', 'YWFXB');
INSERT INTO `t_permission` VALUES ('0605', '0605', '财务分析表', '财务分析表', '报表', 'CWFXB');
INSERT INTO `t_permission` VALUES ('0605-01', '0605-01', '财务分析表-产品收支明细账', '财务分析表-产品收支明细账', '财务分析表', 'CWFXB');
INSERT INTO `t_permission` VALUES ('0605-02', '0605-02', '财务分析表-产品进销汇总表', '财务分析表-产品进销汇总表', '财务分析表', 'CWFXB');
INSERT INTO `t_permission` VALUES ('0605-03', '0605-03', '财务分析表-产品营收账款汇总表', '财务分析表-产品应收账款汇总表', '财务分析表', 'CWFXB');
INSERT INTO `t_permission` VALUES ('0605-04', '0605-04', '财务分析表-产品铺货利润表', '财务分析表-产品铺货利润表', '财务分析表', 'CWFXB');
INSERT INTO `t_permission` VALUES ('2011-01', '2011-01', '首页-销售看板', '首页-销售看板', '首页看板', 'SYXSKB');
INSERT INTO `t_permission` VALUES ('2011-02', '2011-02', '首页-库存看板', '首页-库存看板', '首页看板', 'SYKCKB');
INSERT INTO `t_permission` VALUES ('2011-03', '2011-03', '首页-采购看板', '首页-采购看板', '首页看板', 'SYCGKB');
INSERT INTO `t_permission` VALUES ('2011-04', '2011-04', '首页-资金看板', '首页-资金看板', '首页看板', 'SYZJKB');
SET FOREIGN_KEY_CHECKS=1;

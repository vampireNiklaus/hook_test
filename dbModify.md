** 2016.12.27修改记录**
1. bill_self_stock 添加一行 parent_id 用于关联开票公司的出库单,添加一列validity
2. bill_self_stock 的pay_bill_id 修改为pay_bill_code
3. menu_item修改了次序
4. self_stock_sub 添加了一列  is_broken 小整形
5. bill_extra 表格添加一列  drug_id 用来关联  相关的药品
6. 修改info_stock表格：  expire_time 设置为date，同时所有的列设置为非空
7. 添加定时任务  
           DROP EVENT IF EXISTS `crontab_daily_stock_record`;
           DELIMITER ;;
           CREATE DEFINER=`crmroot`@`localhost` EVENT `crontab_daily_stock_record` ON SCHEDULE EVERY 1 DAY STARTS '2016-12-31 10:05:00' ON COMPLETION NOT PRESERVE ENABLE DO 
           
           BEGIN
               INSERT INTO info_stock_daily_record(drug_id,drug_name,deliver_id,deliver_name,batch_num,amount,expire_time,alarm_amount,operation_info,now()) select drug_id,drug_name,deliver_id,deliver_name,batch_num,amount,expire_time,alarm_amount,operation_info  from info_stock;
           END
           ;;
           DELIMITER ;
           
2017.01.02

1. 表单bill_extra 添加date类型列，yewu_date


2017.01.03
1. bill_selfs_stock和bill_self_stock_sub 添加了kaipiao_unit_price  deciaml  length=20  precise = 3 



2017.01.04
1. 添加财务报表的权限。
 
 
2017.01.17
1.bill_daily_sell表格添加两个列，一个是huikuan_status,另外一个是huikuan_unit_price



2017.03.02
1. 新建视图，视图的定义如下，注意在crm的正式表格中把对应的提花点就好
select `crmdev`.`bill_daily_sell`.`bill_code` AS `bill_code`,`crmdev`.`bill_daily_sell`.`employee_id` AS `employee_id`,`crmdev`.`bill_daily_sell`.`employee_des` AS `employee_des`,`crmdev`.`bill_daily_sell`.`employee_profit` AS `employee_profit`,`crmdev`.`bill_daily_sell`.`employee_name` AS `employee_name`,`crmdev`.`bill_daily_sell`.`drug_id` AS `drug_id`,`crmdev`.`bill_daily_sell`.`drug_name` AS `drug_name`,`crmdev`.`bill_daily_sell`.`drug_guige` AS `drug_guige`,`crmdev`.`bill_daily_sell`.`drug_manufacture` AS `drug_manufacture`,`crmdev`.`bill_daily_sell`.`hospital_id` AS `hospital_id`,`crmdev`.`bill_daily_sell`.`hospital_name` AS `hospital_name`,`crmdev`.`bill_daily_sell`.`stock_id` AS `stock_id`,`crmdev`.`bill_daily_sell`.`deliver_id` AS `deliver_id`,`crmdev`.`bill_daily_sell`.`deliver_name` AS `deliver_name`,`crmdev`.`bill_daily_sell`.`batch_num` AS `batch_num`,`crmdev`.`bill_daily_sell`.`sell_amount` AS `sell_amount`,`crmdev`.`bill_daily_sell`.`sell_date` AS `sell_date`,`crmdev`.`bill_daily_sell`.`create_time` AS `create_time`,`crmdev`.`bill_daily_sell`.`creator_id` AS `creator_id`,`crmdev`.`bill_daily_sell`.`note` AS `note`,`crmdev`.`bill_daily_sell`.`if_paid` AS `if_paid`,`crmdev`.`bill_daily_sell`.`pay_time` AS `pay_time`,`crmdev`.`bill_daily_sell`.`paybill_id` AS `paybill_id`,`crmdev`.`bill_daily_sell`.`status` AS `status`,`crmdev`.`bill_daily_sell`.`expire_time` AS `expire_time`,`crmdev`.`info_hospital`.`hospital_type` AS `hospital_type`,`crmdev`.`info_hospital`.`region_id` AS `region_id`,`crmdev`.`info_drug`.`bid_price` AS `bid_price` from ((`bill_daily_sell` join `info_hospital` on((`crmdev`.`bill_daily_sell`.`hospital_id` = `crmdev`.`info_hospital`.`id`))) join `info_drug` on((`crmdev`.`bill_daily_sell`.`drug_id` = `crmdev`.`info_drug`.`id`)))

2017.03.07
1. 新建表格t_yewuset_user2hospital


2017.03.09
1.新建表格record_bankio_detail


2017.07.06
1.表格t_yewuset_user2hospital中加入drug_id字段

2017.07.07
1.向t_permission表添加四个权限：(需求参考：http://note.youdao.com/noteshare?id=e402d5dd60023df0b820c25deac974f3&sub=83309EFAC7684F929F3A6DB244CA2F6B 20170703 修改计划3)
INSERT INTO `t_permission` VALUES ('0200-11', '0200-11', '药品信息-公司利润信息查看', '药品信息-公司利润信息查看', '药品信息', 'YPXXGSLYCK');
INSERT INTO `t_permission` VALUES ('0200-12', '0200-12', '药品信息-公司利润信息编辑保存', '药品信息-公司利润信息编辑保存', '药品信息', 'YPXXBJBC');
INSERT INTO `t_permission` VALUES ('0200-13', '0200-13', '药品信息-业务员的提成敏感信息查看', '业务员的提成敏感信息查看', '药品信息', 'YPXXYWYCK');
INSERT INTO `t_permission` VALUES ('0200-14', '0200-14', '药品信息-业务员的提成敏感信息增删改', '业务员的提成敏感信息增删改', '药品信息', 'YPXXYWYZSG');

2017.7.10
1、向t_permission表添加2个权限：
INSERT INTO `t_permission` VALUES ('0200-10', '0200-10', '药品信息-查看药品全部信息', '药品信息-查看药品全部信息', '药品信息', 'YPXXCKYPQBXX');
INSERT INTO `t_permission` VALUES ('0204-06', '0204-06', '配送公司信息-药品id查询配送公司', '配送公司信息模块[药品id查询配送公司]', '配送公司信息', 'PSGSXXCXPSGSLB');

2017.7.3
1、向t_permission表添加2个权限：
INSERT INTO `t_permission` VALUES ('0201-06', '0201-06', '医院信息-新增所有医院', '医院信息模块[新增所有医院]按钮的权限', '医院信息', 'YYXXXZSYYY');

2017.9.5
新添加info_agent、info_protocol_manage两张表，分别对应代理商基本信息和协议管理

2017.09.09
新添加info_protocol_detail协议明细表、更新info_protocol_manage协议管理表

2017.09.19
新添加bill_invest_pay招商结算支付单

2017.09.21
1.向t_menu_item表添加两票制菜单
INSERT INTO `t_menu_item` VALUES ('0306', '两票制', '0306', '03', '2');
INSERT INTO `t_menu_item` VALUES ('030601', '自销采购单', '030601', '0306', '1');
INSERT INTO `t_menu_item` VALUES ('030602', '自销付款单', '030602', '0306', '2');
INSERT INTO `t_menu_item` VALUES ('030603', '入配送公司', '030603', '0306', '3');
INSERT INTO `t_menu_item` VALUES ('030604', '自销回款单', '030604', '0306', '4');

2.将t_menu_item表原先的自销菜单修改成过票菜单
UPDATE `t_menu_item` SET caption = '过票' WHERE id = '0301';

2017.09.27
1.向t_menu_item表添加流向抓取菜单
insert into `t_menu_item` ( `id`, `caption`, `fid`, `parent_id`, `show_order`) values ( '0307', '流向抓取', '0307', '03', '5');

2.更新其他菜单的先后顺序
update `t_menu_item` set `id`='0303', `caption`='销售管理', `fid`='0303', `parent_id`='03', `show_order`='6' where `id`='0303';
update `t_menu_item` set `id`='0304', `caption`='实时流向', `fid`='0304', `parent_id`='03', `show_order`='7' where `id`='0304';

3.新增表
bill_self_purchase_by_two、
bill_self_pay_by_two、
bill_self_stock_by_two、
bill_self_stock_by_two_sub、
bill_self_deliver_huikuan_by_two、
bill_self_deliver_huikuan_by_two_sub、
bill_self_manufacturer_huikuan_by_two、
bill_self_manufacturer_huikuan_by_two_sub

2017.10.15
新添加bill_stock_broken破损单表
DROP TABLE IF EXISTS `bill_stock_broken`;
CREATE TABLE `bill_stock_broken` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `stock_id` int(11) NOT NULL,
  `batch_num` varchar(100) NOT NULL DEFAULT '',
  `amount` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `create_time` date NOT NULL,
  `creator` varchar(100) NOT NULL DEFAULT '',
  `drug_id` int(11) NOT NULL,
  `type` int(8) NOT NULL DEFAULT '0',
  `note` varchar(2000) DEFAULT NULL,
  `verify_date` date DEFAULT NULL,
  `verify_id` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;


2017.10.26 
info_drug2hospital 表格的hospital_id和drug_id都不能是null！！！！



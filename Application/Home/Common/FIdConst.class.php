<?php

namespace Home\Common;

/**
 * FId常数值
 *
 * @author Baoyu Li
 */
class FIdConst {



    /**
     * admin的user id
     */
    const ADMIN_USER_ID = "6C2A09CD-A129-11E4-9B6A-782BCBD7746B";


	/**
	 * 登录系统身份类被
	 */
	const LOGIN_TYPE_EMPLOYEE = 1;//合作伙伴
	const LOGIN_TYPE_STAFF = 2;//公司员工
	/**
	 * 首页
	 */
	const HOME = "-9997";
	
	/**
	 * 重新登录
	 */
	const RELOGIN = "-9999";
	
	/**
	 * 修改我的密码
	 */
	const CHANGE_MY_PASSWORD = "-9996";
	
	/**
	 * 使用帮助
	 */
	const HELP = "-9995";
	
	/**
	 * 关于
	 */
	const ABOUT = "-9994";
	
	/**
	 * 购买商业服务
	 */
	const PSI_SERVICE = "-9993";
	
	/**
	 * 用户管理
	 */
	const USR_MANAGEMENT = "-8999";
	
	/**
	 * 用户管理 - 新增组织机构
	 */
	const USER_MANAGEMENT_ADD_ORG = "-8999-03";
	
	/**
	 * 用户管理 - 编辑组织机构
	 */
	const USER_MANAGEMENT_EDIT_ORG = "-8999-04";
	
	/**
	 * 用户管理 - 删除组织机构
	 */
	const USER_MANAGEMENT_DELETE_ORG = "-8999-05";
	
	/**
	 * 用户管理 - 新增用户
	 */
	const USER_MANAGEMENT_ADD_USER = "-8999-06";
	
	/**
	 * 用户管理 - 编辑用户
	 */
	const USER_MANAGEMENT_EDIT_USER = "-8999-07";
	
	/**
	 * 用户管理 - 删除用户
	 */
	const USER_MANAGEMENT_DELETE_USER = "-8999-08";
	
	/**
	 * 用户管理 - 修改用户密码
	 */
	const USER_MANAGEMENT_CHANGE_USER_PASSWORD = "-8999-09";
	
	/**
	 * 权限管理
	 */
	const PERMISSION_MANAGEMENT = "-8996";
	
	/**
	 * 权限管理 - 新增角色 - 按钮权限
	 */
	const PERMISSION_MANAGEMENT_ADD = "-8996-01";
	
	/**
	 * 权限管理 - 编辑角色 - 按钮权限
	 */
	const PERMISSION_MANAGEMENT_EDIT = "-8996-02";
	
	/**
	 * 权限管理 - 删除角色 - 按钮权限
	 */
	const PERMISSION_MANAGEMENT_DELETE = "-8996-03";
	
	/**
	 * 业务日志
	 */
	const BIZ_LOG = "-8997";

	/*基本信息*/
	const DRUG_BASIC_INFO = "0200";
	const HOSPITAL_BASIC_INFO = "0201";
	const EMPLOYEE_BASIC_INFO = "0202";
	const SUPPLIER_BASIC_INFO = "0203";
	const DELIVER_BASIC_INFO = "0204";
//	const BANK_ACCOUNT = "0205";
	const BUSINESS_SETTING = "0205";
	const AGENT_BASIC_INFO = "0206";
	const DELIVER_ACCOUNT_INFO = "0207";

	const HOSPITAL_REGION = "0201-001";
	const EDIT_HOSPITAL_REGION = "0201-002";

	/*
	 * 药品基本信息动作
	*/

	const DRUG_CATEGORY_ADD = "0200-01";//权限--新增药品类别
	const DRUG_CATEGORY_EDIT = "0200-03";//权限--编辑药品类别
	const DRUG_CATEGORY_DELETE = "0200-02";//权限--删除药品类别
	const DRUG_CATEGORY_HOSPITAL_ASSGIN_ADD = "0200-04";//权限--新增药品医院分配
	const DRUG_CATEGORY_HOSPITAL_ASSGIN_DELETE = "0200-05";//权限--删除药品医院分配
	const DRUG_CATEGORY_PROFIT_ASSGIN_ADD = "0200-06";//权限--新增药品提成分配
	const DRUG_CATEGORY_PROFIT_ASSGIN_DELETE = "0200-07";//权限--删除药品提成分配
    const DRUG_CATEGORY_PROFIT_ASSGIN_EDIT = "0200-08";//权限--编辑药品提成分配
	const DRUG_CATEGORY_VIEW_SECRET = "0200-09";//权限--查看药品敏感信息
	const DRUG_CATEGORY_VIEW_ALL = "0200-10";//权限--查看药品全部信息
    const DRUG_CATEGORY_VIEW_COMPANY_PA = "0200-11";//权限--公司利润信息查看
    const DRUG_CATEGORY_ADD_COMPANY_PA = "0200-12";//权限--公司利润信息编辑保存
    const DRUG_CATEGORY_VIEW_EMPLOYEE_PA = "0200-13";//权限--业务员的提成敏感信息查看
    const DRUG_CATEGORY_EDIT_EMPLOYEE_PA = "0200-14";//权限--业务员的提成敏感信息增删改
    const DRUG_CATEGORY_IMPORT = "0200-15";//权限--导入药品类别
    const DRUG_CATEGORY_ASSIGN_IMPORT = "0200-16";//权限--导入药品分配

	/*
	 * 医院基本信息动作
	 * */
	const HOSPITAL_ADD = "0201-01";//权限--新增医院
	const HOSPITAL_EDIT = "0201-02";//权限--编辑医院
	const HOSPITAL_DELETE = "0201-03";//权限--删除医院
	const HOSPITAL_IMPORT = "0201-04";//权限--导入医院
	const HOSPITAL_EXPORT = "0201-05";//权限--导出医院
	const HOSPITAL_ADD_ALL = "0201-06";//权限--新增所有医院

	/*
 	* 业务员基本信息动作
 	*
	*/
	const EMPLOYEE_ADD = "0202-01";//权限--新增医院
	const EMPLOYEE_EDIT = "0202-02";//权限--编辑医院
	const EMPLOYEE_DELETE = "0202-03";//权限--删除医院
	const EMPLOYEE_IMPORT = "0202-04";//权限--导入医院
	const EMPLOYEE_EXPORT_EXCEL = "0202-05";//权限--导出医院

	/*
 	* 供应商基本信息动作
 	*
	*/
	const SUPPLIER_ADD = "0203-01";//权限--新增供应商
	const SUPPLIER_EDIT = "0203-02";//权限--编辑供应商
	const SUPPLIER_DELETE = "0203-03";//权限--删除供应商
	const SUPPLIER_IMPORT = "0203-04";//权限--导入供应商
	const SUPPLIER_EXPORT = "0203-05";//权限--导出供应商

    /*
 	* 代理商基本信息动作
 	*
	*/
    const AGENT_ADD = "0206-01";//权限--新增代理商
    const AGENT_EDIT = "0206-02";//权限--编辑代理商
    const AGENT_DELETE = "0206-03";//权限--删除代理商
    const AGENT_IMPORT = "0206-04";//权限--导入代理商
    const AGENT_EXPORT = "0206-05";//权限--导出代理商

    /*
 	*配送公司流向抓取账号信息动作
 	*
	*/
    const DELIVER_ACCOUNT_ADD = "0207-01";//权限--新增账号
    const DELIVER_ACCOUNT_EDIT = "0207-02";//权限--编辑账号
    const DELIVER_ACCOUNT_DELETE = "0207-03";//权限--删除账号
    const DELIVER_ACCOUNT_DISABLE = "0207-04";//权限--禁用账号

	/*
	 * 业务配置基本信息动作
	 * */

	const EMPLOYEE_MONTH_SELL_ALARM_EDIT = "0205-01";
	/*
	 * 配送公司基本信息动作
	 *
	*/
	const DELIVER_ADD = "0204-01";//权限--新增配送公司
	const DELIVER_EDIT = "0204-02";//权限--编辑配送公司
	const DELIVER_DELETE = "0204-03";//权限--删除配送公司
	const DELIVER_IMPORT = "0204-04";//权限--导入配送公司
	const DELIVER_EXPORT = "0204-05";//权限--导出配送公司

//	const DELIVER_QUERY_CONDITION_BY_DRUGID = "searchByDrugId";//根据药品id查询配送公司
	const DELIVER_QUERY_CONDITION_BY_DRUGID = "0204-06";//根据药品id查询配送公司


	/*业务配置*/
	//产品代理协议与推广协议
	const BUSINESS_SETTING_PRODUCT_AGENCY = "0205-02";//业务配置-产品代理协议
	const BUSINESS_SETTING_PRODUCT_AGENCY_ADD = "0205-02-01";//产品代理协议-新增
	const BUSINESS_SETTING_PRODUCT_AGENCY_EDIT = "0205-02-02";//产品代理协议-编辑
	const BUSINESS_SETTING_PRODUCT_AGENCY_DELETE = "0205-02-03";//产品代理协议-删除
	const BUSINESS_SETTING_PROMOTE_AGENCY = "0205-03";//业务配置-推广协议
	const BUSINESS_SETTING_PROMOTE_AGENCY_ADD = "0205-03-01";//推广协议-新增
	const BUSINESS_SETTING_PROMOTE_AGENCY_EDIT = "0205-03-02";//推广协议-编辑
	const BUSINESS_SETTING_PROMOTE_AGENCY_DELETE = "0205-03-03";//推广协议-删除
	//业务员销量预警值
	const BUSINESS_SETTING_MONTH_SELL_VIEW = "0205-01";//查看--月销量预警报表
	const BUSINESS_SETTING_MONTH_SELL_ALARM_EDIT = "0205-01-01";//编辑--月销量预警值


	/*
	 * 过票自销采购单基本信息动作
	 *
	*/
	const SELF_PURCHASE_BILL_ADD = "030101-01";//权限--新增自销采购单
	const SELF_PURCHASE_BILL_EDIT = "030101-02";//权限--编辑自销采购单
	const SELF_PURCHASE_BILL_DELETE = "030101-03";//权限--删除自销采购单
	const SELF_PURCHASE_BILL_IMPORT = "030101-04";//权限--导入自销采购单
	const SELF_PURCHASE_BILL_EXPORT = "030101-05";//权限--导出自销采购单
	const SELF_PURCHASE_BILL_VERIFY = "030101-06";//权限--导入自销采购单
	const SELF_PURCHASE_BILL_REVERT_VERIFY = "030101-07";//权限--导出自销采购单

	/*
	 * 过票自销付款单基本信息动作
	 *
	*/
	const SELF_PAY_BILL_EDIT = "030102-02";//权限--编辑自销付款单
	const SELF_PAY_BILL_DELETE = "030102-03";//权限--删除自销付款单
	const SELF_PAY_BILL_IMPORT = "030102-04";//权限--导入自销付款单
	const SELF_PAY_BILL_EXPORT = "030102-05";//权限--导出自销付款单
	const SELF_PAY_BILL_VERIFY = "030102-06";//权限--导入自销付款单
	const SELF_PAY_BILL_REVERT_VERIFY = "030102-07";//权限--导出自销付款单


    /*
     * 过票自销入开票公司单基本信息动作
     *
    */
    const SELF_WAREHOUSE_IN_KAIPIAO_BILL_VIEW = "030106-01";//权限--编辑自销入开票公司单
    const SELF_WAREHOUSE_IN_KAIPIAO_BILL_EDIT = "030106-02";//权限--编辑自销入开票公司单
    const SELF_WAREHOUSE_IN_KAIPIAO_BILL_DELETE = "030106-03";//权限--删除自销入开票公司单
    const SELF_WAREHOUSE_IN_KAIPIAO_BILL_IMPORT = "030106-04";//权限--导入自销入开票公司单
    const SELF_WAREHOUSE_IN_KAIPIAO_BILL_EXPORT = "030106-05";//权限--导出自销入开票公司单
    const SELF_WAREHOUSE_IN_KAIPIAO_BILL_VERIFY = "030106-06";//权限--导入自销入开票公司单
    const SELF_WAREHOUSE_IN_KAIPIAO_BILL_REVERT_VERIFY = "030106-07";//权限--导出自销入开票公司单

    /*
     * 自销出开票公司单基本信息动作
     *
    */
    const SELF_WAREHOUSE_OUT_KAIPIAO_BILL_EDIT = "030107-02";//权限--编辑自销出开票公司单
    const SELF_WAREHOUSE_OUT_KAIPIAO_BILL_VIEW = "030107-01";//权限--编辑自销出开票公司单
    const SELF_WAREHOUSE_OUT_KAIPIAO_BILL_DELETE = "030107-03";//权限--删除自销出开票公司单
    const SELF_WAREHOUSE_OUT_KAIPIAO_BILL_IMPORT = "030107-04";//权限--导入自销出开票公司单
    const SELF_WAREHOUSE_OUT_KAIPIAO_BILL_EXPORT = "030107-05";//权限--导出自销出开票公司单
    const SELF_WAREHOUSE_OUT_KAIPIAO_BILL_VERIFY = "030107-06";//权限--导入自销出开票公司单
    const SELF_WAREHOUSE_OUT_KAIPIAO_BILL_REVERT_VERIFY = "030107-07";//权限--导出自销出开票公司单

	/*
	 * 自销入库单基本信息动作
	 *
	*/
	const SELF_WAREHOUSE_BILL_EDIT = "030103-02";//权限--编辑自销入库单
	const SELF_WAREHOUSE_BILL_DELETE = "030103-03";//权限--删除自销入库单
	const SELF_WAREHOUSE_BILL_IMPORT = "030103-04";//权限--导入自销入库单
	const SELF_WAREHOUSE_BILL_EXPORT = "030103-05";//权限--导出自销入库单
	const SELF_WAREHOUSE_BILL_VERIFY = "030103-06";//权限--导入自销入库单
	const SELF_WAREHOUSE_BILL_REVERT_VERIFY = "030103-07";//权限--导出自销入库单

	/*
	 * 自销税票单基本信息动作
	 *
	*/
	const SELF_TAX_BILL_EDIT = "030104-02";//权限--编辑自销税票单
	const SELF_TAX_BILL_DELETE = "030104-03";//权限--删除自销税票单
	const SELF_TAX_BILL_IMPORT = "030104-04";//权限--导入自销税票单
	const SELF_TAX_BILL_EXPORT = "030104-05";//权限--导出自销税票单
	const SELF_TAX_BILL_VERIFY = "030104-06";//权限--导入自销税票单
	const SELF_TAX_BILL_REVERT_VERIFY = "030104-07";//权限--导出自销税票单

	/*
	 * 自销回款单基本信息动作
	 *
	 */
	const SELF_HUIKUAN_BILL_EDIT = "030105-02";//权限--编辑自销回款单
	const SELF_HUIKUAN_BILL_DELETE = "030105-03";//权限--删除自销回款单
	const SELF_HUIKUAN_BILL_IMPORT = "030105-04";//权限--导入自销回款单
	const SELF_HUIKUAN_BILL_EXPORT = "030105-05";//权限--导出自销回款单
	const SELF_HUIKUAN_BILL_VERIFY = "030105-06";//权限--导入自销回款单
	const SELF_HUIKUAN_BILL_REVERT_VERIFY = "030105-07";//权限--导出自销回款单

    /*
     * 两票制自销采购单基本信息动作
     *
     */
    const SELF_PURCHASE_BY_TWO_BILL_ADD = "030601-01";//权限--新增自销采购单
    const SELF_PURCHASE_BY_TWO_BILL_EDIT = "030601-02";//权限--编辑自销采购单
    const SELF_PURCHASE_BY_TWO_BILL_DELETE = "030601-03";//权限--删除自销采购单
    const SELF_PURCHASE_BY_TWO_BILL_IMPORT = "030601-04";//权限--导入自销采购单
    const SELF_PURCHASE_BY_TWO_BILL_EXPORT = "030601-05";//权限--导出自销采购单
    const SELF_PURCHASE_BY_TWO_BILL_VERIFY = "030601-06";//权限--审核自销采购单
    const SELF_PURCHASE_BY_TWO_BILL_REVERT_VERIFY = "030601-07";//权限--反审核自销采购单

    /*
	 * 两票制自销付款单基本信息动作
	 *
	 */
    const SELF_PAY_BY_TWO_BILL_EDIT = "030602-02";//权限--编辑自销付款单
    const SELF_PAY_BY_TWO_BILL_DELETE = "030602-03";//权限--删除自销付款单
    const SELF_PAY_BY_TWO_BILL_IMPORT = "030602-04";//权限--导入自销付款单
    const SELF_PAY_BY_TWO_BILL_EXPORT = "030602-05";//权限--导出自销付款单
    const SELF_PAY_BY_TWO_BILL_VERIFY = "030602-06";//权限--审核自销付款单
    const SELF_PAY_BY_TWO_BILL_REVERT_VERIFY = "030602-07";//权限--反审核自销付款单

    /*
	 * 两票制自销入库单基本信息动作
	 *
	*/
    const SELF_STOCK_BY_TWO_BILL_EDIT = "030603-02";//权限--编辑自销入库单
    const SELF_STOCK_BY_TWO_BILL_DELETE = "030603-03";//权限--删除自销入库单
    const SELF_STOCK_BY_TWO_BILL_IMPORT = "030603-04";//权限--导入自销入库单
    const SELF_STOCK_BY_TWO_BILL_EXPORT = "030603-05";//权限--导出自销入库单
    const SELF_STOCK_BY_TWO_BILL_VERIFY = "030603-06";//权限--审核自销入库单
    const SELF_STOCK_BY_TWO_BILL_REVERT_VERIFY = "030603-07";//权限--反审核自销入库单

    /*
	 * 两票制商业回款单基本信息动作
	 *
	 */

    const SELF_DELIVER_HUIKUAN_BY_TWO_BILL_EDIT = "030604-02";//权限--编辑自销回款单
    const SELF_DELIVER_HUIKUAN_BY_TWO_BILL_DELETE = "030604-03";//权限--删除自销回款单
    const SELF_DELIVER_HUIKUAN_BY_TWO_BILL_IMPORT = "030604-04";//权限--导入自销回款单
    const SELF_DELIVER_HUIKUAN_BY_TWO_BILL_EXPORT = "030604-05";//权限--导出自销回款单
    const SELF_DELIVER_HUIKUAN_BY_TWO_BILL_VERIFY = "030604-06";//权限--审核自销回款单
    const SELF_DELIVER_HUIKUAN_BY_TWO_BILL_REVERT_VERIFY = "030604-07";//权限--反审核自销回款单
    /*
	 * 两票制厂家回款单基本信息动作
	 *
	 */

    const SELF_MANUFACTURER_HUIKUAN_BY_TWO_BILL_EDIT = "030605-02";//权限--编辑自销回款单
    const SELF_MANUFACTURER_HUIKUAN_BY_TWO_BILL_DELETE = "030605-03";//权限--删除自销回款单
    const SELF_MANUFACTURER_HUIKUAN_BY_TWO_BILL_IMPORT = "030605-04";//权限--导入自销回款单
    const SELF_MANUFACTURER_HUIKUAN_BY_TWO_BILL_EXPORT = "030605-05";//权限--导出自销回款单
    const SELF_MANUFACTURER_HUIKUAN_BY_TWO_BILL_VERIFY = "030605-06";//权限--审核自销回款单
    const SELF_MANUFACTURER_HUIKUAN_BY_TWO_BILL_REVERT_VERIFY = "030605-07";//权限--反审核自销回款单


    /*
     * 代销采购单基本信息动作
     *
    */
    const DELE_PURCHASE_BILL_ADD = "030201-01";//权限--新增代销采购单
    const DELE_PURCHASE_BILL_EDIT = "030201-02";//权限--编辑代销采购单
    const DELE_PURCHASE_BILL_DELETE = "030201-03";//权限--删除代销采购单
    const DELE_PURCHASE_BILL_IMPORT = "030201-04";//权限--导入代销采购单
    const DELE_PURCHASE_BILL_EXPORT = "030201-05";//权限--导出代销采购单
    const DELE_PURCHASE_BILL_VERIFY = "030201-06";//权限--导入代销采购单
    const DELE_PURCHASE_BILL_REVERT_VERIFY = "030201-07";//权限--导出代销采购单

    /*
     * 代销回款单基本信息动作
     *
    */
    const DELE_HUIKUAN_BILL_EDIT = "030202-02";//权限--编辑代销回款单
    const DELE_HUIKUAN_BILL_DELETE = "030202-03";//权限--删除代销回款单
	const DELE_HUIKUAN_BILL_IMPORT = "030202-04";//权限--导入代销回款单
	const DELE_HUIKUAN_BILL_EXPORT = "030202-05";//权限--导出代销回款单
	const DELE_HUIKUAN_BILL_VERIFY = "030202-06";//权限--导入代销回款单
	const DELE_HUIKUAN_BILL_REVERT_VERIFY = "030202-07";//权限--导出代销回款单

    /*
	 * 招商管理协议管理基本信息动作
	 *
	*/
    const PROTOCOL_MANAGE_ADD = "030501-01";//权限--新增招商管理协议管理
    const PROTOCOL_MANAGE_EDIT = "030501-02";//权限--编辑招商管理协议管理
    const PROTOCOL_MANAGE_DELETE = "030501-03";//权限--删除招商管理协议管理
    const PROTOCOL_MANAGE_VERIFY = "030501-04";//权限--审核招商管理协议管理
    const PROTOCOL_MANAGE_REVERT_VERIFY = "030501-05";//权限--反审核招商管理协议管理
    const PROTOCOL_MANAGE_IMPORT = "030501-06";//权限--导入招商管理协议管理
    const PROTOCOL_MANAGE_EXPORT = "030501-07";//权限--导出招商管理协议管理

	/*
	 * 业务支付单动作
	 *
	*/
	const BUSINESS_PAY_ADD = "0504-01";//权限--业务支付单
	const BUSINESS_PAY_EDIT = "0504-02";//权限--业务支付单
	const BUSINESS_PAY_DELETE = "0504-03";//权限--业务支付单
	const BUSINESS_PAY_VERIFY = "0504-04";//权限--业务支付单
	const BUSINESS_PAY_REVERT_VERIFY = "0504-05";//权限--业务支付单
	const BUSINESS_PAY_EXPORT_EXCEL = "0504-06";//权限--导出业务支付单
	const BUSINESS_PAY_IMPORT_EXCEL = "0504-07";//权限--导出业务支付单
	const BUSINESS_PAY_VIEW_DETAIL = "0504-08";//权限--查看业务支付单关联的销售单
	const BUSINESS_PAY_SEARCH = "0504-09";//权限--查询业务支付单


    /*
	 * 直营结算单动作
	 *
	*/
    const DIRECT_PAY_ADD = "050401-01";//权限--招商结算单
    const DIRECT_PAY_EDIT = "050401-02";//权限--招商结算单
    const DIRECT_PAY_DELETE = "050401-03";//权限--招商结算单
    const DIRECT_PAY_VERIFY = "050401-04";//权限--招商结算单
    const DIRECT_PAY_REVERT_VERIFY = "050401-05";//权限--招商结算单
    const DIRECT_PAY_EXPORT_EXCEL = "050401-06";//权限--导出招商结算单
    const DIRECT_PAY_IMPORT_EXCEL = "050401-07";//权限--导出招商结算单
    const DIRECT_PAY_VIEW_DETAIL = "050401-08";//权限--查看招商结算单单关联的销售单
    const DIRECT_PAY_SEARCH = "050401-09";//权限--查询招商结算单


    /*
	 * 招商结算单动作
	 *
	*/
    const INVEST_PAY_ADD = "050402-01";//权限--招商结算单
    const INVEST_PAY_EDIT = "050402-02";//权限--招商结算单
    const INVEST_PAY_DELETE = "050402-03";//权限--招商结算单
    const INVEST_PAY_VERIFY = "050402-04";//权限--招商结算单
    const INVEST_PAY_REVERT_VERIFY = "050402-05";//权限--招商结算单
    const INVEST_PAY_EXPORT_EXCEL = "050402-06";//权限--导出招商结算单
    const INVEST_PAY_IMPORT_EXCEL = "050402-07";//权限--导出招商结算单
    const INVEST_PAY_VIEW_DETAIL = "050402-08";//权限--查看招商结算单单关联的销售单
    const INVEST_PAY_SEARCH = "050402-09";//权限--查询招商结算单



	/*库存管理*/
	const STOCK_MANAGE = "0401";

    /*库存基本信息*/
    const STOCK_MANAGE_BASIC = "0402";

    /*库存破损*/
    const STOCK_MANAGE_BROKEN = "0403";
    const STOCK_MANAGE_BROKEN_EDIT = "0403-01";
    const STOCK_MANAGE_BROKEN_VERIFY = "0403-02";
    const STOCK_MANAGE_BROKEN_DELETE = "0403-03";
     //入库单的时候生成的
    const STOCK_MANAGE_BROKEN_TYPE_INSTOCK = 0;
    //已经入库发生的破损可以之后再添加
    const STOCK_MANAGE_BROKEN_TYPE_ZHUIJIA = 1;


    //已经入库发生的破损可以之后再添加
    const STOCK_MANAGE_BROKEN_STATUS_2VERIFY = 0;
    const STOCK_MANAGE_BROKEN_STATUS_VERIFY_PASS = 1;
    const STOCK_MANAGE_BROKEN_STATUS_VERIFY_DENIED = 2;

	/*库存管理--权限相关*/
	const STOCK_MANAGE_EDIT_ALARM = "0401-01";//库存管理--编辑预警值
	const STOCK_MANAGE_EDIT_BATCH = "0401-02";//库存管理--编辑批号参数
	const STOCK_MANAGE_ADD_STOCK_TRANS = "0401-03";//库存管理--新建库存调拨单
	const STOCK_MANAGE_EDIT_STOCK_TRANS = "0401-04";//库存管理--编辑库存调拨单
	const STOCK_MANAGE_DELETE_STOCK_TRANS = "0401-05";//库存管理--删除库存调拨单
	const STOCK_MANAGE_VERIFY_TRANS = "0401-06";//库存管理--审核库存调拨单
	const STOCK_MANAGE_REVERT_VERIFY_TRANS = "0401-07";//库存管理--反审核库存调拨单

	/*销售管理*/
	const DAILY_SELL_STATUS_TEMP_MATCHED = 0; //新添加已经匹配的条目
	const DAILY_SELL_STATUS_TEMP_UNMATCTHED = 1;//新添加未匹配条目

	const DAILY_SELL_STATUS_CONFIRMED = 2;//正式表中没有被添加到业务支付单的
	const DAILY_SELL_STATUS_CONFIRMED_TOPAY = 3;//正式表中已经被添加到业务支付单，并且处于待支付的
	const DAILY_SELL_STATUS_PAIED = 4;//已经付款的
	const DAILY_SELL_STATUS_FREZON = 5;//被冻结单子


    /*销售单回款状态为意义*/
    const DAILY_SELL_STATUS_DELE_HUIKUAN_INIT = 0;//代销品种初始状态
	const DAILY_SELL_STATUS_DELE_HUIKUAN_TOPAY = 1;//代销品种待回款
	const DAILY_SELL_STATUS_DELE_HUIKUAN_PAIED = 2;//代销品种已经回款


	const BUSINESS_PAY_STATUS_TOPAY=0;//待确认的支付单
	const BUSINESS_PAY_STATUS_PAIED=1;//已支付的支付单

	/*销售管理----权限相关*/
	const DAILY_SELL_ITEM_ADD = "0303-01"; //权限--新增销售条目
	const DAILY_SELL_ITEM_EDIT = "0303-02";//权限--编辑销售条目
	const DAILY_SELL_ITEM_DELETE = "0303-03";//权限--删除销售条目
	const DAILY_SELL_ITEM_IMPORT = "0303-04";//权限--导入销售条目
	const DAILY_SELL_ITEM_EXPORT = "0303-05";//权限--导出销售条目
	const DAILY_SELL_ITEM_CONFIRM_MATCHED = "0303-06";//权限--确认已匹配销售条目
	const DAILY_SELL_ITEM_CONFIRM_UNMATCHED="0303-07";//权限--确认未匹配销售条目
	const DAILY_SELL_ITEM_MODIFY_PROFIT="0303-08";//权限--确认未匹配销售条目
	const DAILY_SELL_ITEM_VIEW_SECRET="0303-09";//权限--查看销售信息的敏感信息
	const DAILY_SELL_ITEM_SECRET_ITEMS="";//销售信息的敏感信息条目
    const DAILY_SELL_ITEM_REAL_ITEMS="0303-10";//实时流向查看权限

	/*业务流程管理*/

	const SELF_PURCHASE = "030101";//自销进货单
	const SELF_PAY = "030102";//自销付款单
	const SELF_STOCK = "030103";//自销入库单
	const SELF_STOCK_KAIPIAO = "030106";//自销入开票公司
	const SELF_STOCK_KAIPIAO_OUT = "030107";//自销出开票公司
	const SELF_TAX = "030104";//自销税票单
	const SELF_HUIKUAN = "030105";//自销回款单
    const SELF_PURCHASE_BY_TWO = "030601";//自销采购单两票制
    const SELF_PAY_BY_TWO = "030602";//自销付款单两票制
    const SELF_STOCK_BY_TWO = "030603";//自销入库单两票制
    const SELF_DELIVER_HUIKUAN_BY_TWO = "030604";//自销商业回款单两票制
    const SELF_MANUFACTURER_HUIKUAN_BY_TWO = "030605";//自销厂家回款单两票制
	const SELL_MANAGE = "0303";//销售管理
	const SELL_REAL_TIME_FLOW = "0304";//实时流向
	const SELL_DAILY_FETCH = "0307";//流向抓取
    const PROTOCOL_MANAGE = '030501';//招商管理协议管理

	const DELE_PURCHASE = "030201";//代销回款单
	const DELE_HUIKUAN = "030202";//代销回款单

	/*资金管理*/

	const BANK_DEPOSIT = '0503';//银行存取款
	const BUSINESS_PAY = '0504';//业务支付
	const DIRECT_PAY = '050401';//直营结算
	const INVEST_PAY = '050402';//招商结算
	const BILLING_TYPES = '0501';//收支科目与结算方式
	const ACCOUNT_MANAGE = '0502';//账款管理

	/*其他收入支出单权限*/
	const EXTRA_BILL = '050201';
	const EXTRA_BILL_ADD = '050201-01';
	const EXTRA_BILL_EDIT = '050201-02';
	const EXTRA_BILL_DELETE= '050201-03';
	const EXTRA_BILL_VERIFY = '050201-04';
	const EXTRA_BILL_VERIFY_RETURN = '050201-05';

	/*应收应付款账单单权限*/
	const RECEIPT_AND_PAY_BILL = '050202';
	const RECEIPT_AND_PAY_BILL_ADD = '050202-01';
	const RECEIPT_AND_PAY_BILL_EDIT = '050202-02';
	const RECEIPT_AND_PAY_BILL_DELETE= '050202-03';
	const RECEIPT_AND_PAY_BILL_VERIFY = '050202-04';
	const RECEIPT_AND_PAY_BILL_VERIFY_RETURN = '050202-05';

	/*报表*/
	const REPORT_SELL = '0601';//销售报表
	const REPORT_EMPLOYEE = '0602';//业务员报表
	const REPORT_JINXIAOCUN = '0603';//进销存报表
	const REPORT_BUSINESS_ANALYSIS = '0604';//业务分析
	const REPORT_CAPITAL_ANALYSIS = '0605';//财务分析报表



	/*销售报表*/
	const REPORT_SELL_SUMMARY = '0601-01';//销售报表--销售总表
	const REPORT_SELL_BY_REGION = '0601-02';//销售报表--按照地区分析表
	const REPORT_SELL_HOSPITAL_BUSINESS = '0601-03';//销售报表--医院业务分析表
	const REPORT_SELL_UNSALABLE = '0601-04';//销售报表--滞销分析表
	const REPORT_SELL_PROFIT = '0601-05';//销售报表--毛利分析表

	/*业务员分析报表权限*/
	const REPORT_EMPLOYEE_BY_MONTH = '0602-01';//业务员报表
	const REPORT_EMPLOYEE_PAYMENT = '0602-02';//业务员报表

	/*进销存报表权限*/
	const REPORT_JINXIAOCUN_SUMMARY = '0603-01';//进销存报表
	const REPORT_JINXIAOCUN_SELL_DETAIL = '0603-02';//进销存报表
	const REPORT_JINXIAOCUN_INSTOCK = '0603-03';//进销存报表

	/*业务分析报表权限 0604*/
	const REPORT_BUSINESS_ANALYSIS_PRODUCT_AGENCY = "0604-01";//产品代理协议报表

    /*财务分析报表权限 0604*/
    const REPORT_CAPITAL_ANALYSIS_PRODUCT_IO_DETAIL= '0605-01';//财务分析报表-产品收支明细
    const REPORT_CAPITAL_ANALYSIS_PRODUCT_JINXIAO_SUM= '0605-02';//财务分析报表-产品进校汇总
    const REPORT_CAPITAL_ANALYSIS_PRODUCT_2RECEIVE_SUM= '0605-03';//财务分析报表-产品应收账款汇总
    const REPORT_CAPITAL_ANALYSIS_PRODUCT_PUHUO_PROFIT= '0605-04';//财务分析报表-产品铺货利润
	/*所有相关的状态表begin*/

	//银行存取款相关
	const BANK_IO_STATUS_2VERIFY = 0;//待审核
	const BANK_IO_STATUS_VERIFIY_PASSED = 1;//审核通过
	const BANK_IO_STATUS_VERIFY_DENIED = 2;//审核不通过

	//库存调拨单相关
	const STOCK_TRANS_STATUS_2VERIFY = 0;//待审核
	const STOCK_TRANS_STATUS_VERIFIY_PASSED = 1;//审核通过
	const STOCK_TRANS_STATUS_VERIFY_DENIED = 2;//审核不通过

	//自销采购单相关
	const SELF_PURCHASE_STATUS_2VERIFY = 0;//待审核
	const SELF_PURCHASE_STATUS_VERIFY_PASSED = 1;//审核通过
	const SELF_PURCHASE_STATUS_VERIFY_DENIED = 2;//审核不通过
	const SELF_PURCHASE_STATUS_PAY_BACK = 4;//付款单被撤回

	//自销付款单相关
	const SELF_PAY_STATUS_2EDIT = 0;//待编辑
	const SELF_PAY_STATUS_2FUND = 1;//已编辑，待打款
	const SELF_PAY_STATUS_FUND_DENIED = 2;//未通过打款
	const SELF_PAY_STATUS_FUND_PASSED = 3;//已打款，待复核
	const SELF_PAY_STATUS_VERIFY_PASSED = 4;//审核通过
	const SELF_PAY_STATUS_VERIFY_DENIED = 5;//审核不通过
	const SELF_PAY_STATUS_STOCK_BACK = 6;//入库单被撤回

	//自销入库单相关
	const SELF_STOCK_STATUS_2STOCK = 0;//待出入库
	const SELF_STOCK_STATUS_STOCKED = 3;//已全部出入库
	const SELF_STOCK_STATUS_2VERIFY = 0;//子单，待审核
	const SELF_STOCK_STATUS_VERIFY_PASSED = 1;//审核通过
	const SELF_STOCK_STATUS_VERIFY_DENIED = 2;//审核未通过
	const SELF_STOCK_STATUS_TAX_BACK = 4;//税票单被撤回
	const SELF_STOCK_STATUS_KAIPIAO_OUT_BACK = 4;//出开票公司被撤回


    //自销开票公司出入库单相关
    const SELF_STOCK_KAIPIAO_STATUS_2STOCK = 0;//待出入库
    const SELF_STOCK_KAIPIAO_STATUS_STOCKED = 3;//已全部出入库
    const SELF_STOCK_KAIPIAO_STATUS_2VERIFY = 0;//子单，待审核
    const SELF_STOCK_KAIPIAO_STATUS_VERIFY_PASSED = 1;//审核通过
    const SELF_STOCK_KAIPIAO_STATUS_VERIFY_DENIED = 2;//审核未通过
    const SELF_STOCK_KAIPIAO_STATUS_BACK = 4;//税票单被撤回
    const SELF_STOCK_KAIPIAO_STATUS_OUT_BACK = 4;//出开票公司被撤回




    //自销税票单相关
	const SELF_TAX_STATUS_2EDIT = 0;//待编辑
	const SELF_TAX_STATUS_2FUND = 1;//已编辑，待打款
	const SELF_TAX_STATUS_FUND_DENIED = 2;//未通过打款
	const SELF_TAX_STATUS_FUND_PASSED = 3;//已打款，待复核
	const SELF_TAX_STATUS_VERIFY_PASSED = 4;//审核通过
	const SELF_TAX_STATUS_VERIFY_DENIED = 5;//审核不通过
	const SELF_TAX_STATUS_HUIKUAN_BACK = 6;//入库单被撤回

	//自销回款单相关
	const SELF_HUIKUAN_STATUS_2EDIT =0;//待编辑
	const SELF_HUIKUAN_STATUS_EDITED = 3;//回款单已全部生成
	const SELF_HUIKUAN_STATUS_2VERIFY = 0;//子单，待审核
	const SELF_HUIKUAN_STATUS_VERIFY_PASSED = 1;//审核通过
	const SELF_HUIKUAN_STATUS_VERIFY_DENIED = 2;//审核不通过
    const SELF_DELIVER_HUIKUAN_STATUS_BACK = 4;  //厂家回款单被撤回

	//代销采购单相关
	const DELE_PURCHASE_STATUS_2VERIFY = 0;//待审核
	const DELE_PURCHASE_STATUS_VERIFIY_PASSED = 1;//审核通过
	const DELE_PURCHASE_STATUS_VERIFY_DENIED = 2;//审核不通过
	const DELE_PURCHASE_STATUS_HUIKUAN_BACK = 4;//回款单被撤回

	//代销回款单相关
	const DELE_HUIKUAN_STATUS_2EDIT =0;//待编辑
	const DELE_HUIKUAN_STATUS_EDITED = 3;//回款单已全部生成
	const DELE_HUIKUAN_STATUS_2VERIFY = 0;//子单，待审核
	const DELE_HUIKUAN_STATUS_VERIFY_PASSED = 1;//审核通过
	const DELE_HUIKUAN_STATUS_VERIFY_DENIED = 2;//审核不通过


	//收支科目与结算方式页面权限
	const BILLING_TYPES_ITEM_ADD = '0501-01';//收支科目与结算方式--ADD
	const BILLING_TYPES_ITEM_EDIT = '0501-02';//收支科目与结算方式--EDIT
	const BILLING_TYPES_ITEM_DELETE = '0501-03';//收支科目与结算方式--DELETE


	//代销回款单相关
	const EXTRA_BILL_STATUS_2VERIFY = 0;//子单，待审核
	const EXTRA_BILL_STATUS_VERIFY_PASSED = 1;//审核通过
	const EXTRA_BILL_STATUS_VERIFY_DENIED = 2;//审核不通过

	const RECEIPT_PAY_BILL_STATUS_2VERIFY = 0;//子单，待审核
	const RECEIPT_PAY_BILL_STATUS_VERIFY_PASSED = 1;//审核通过
	const RECEIPT_PAY_BILL_STATUS_VERIFY_DENIED = 2;//审核不通过

    //各种单据编号的开头标称
    const BILL_CODE_TYPE_SELF_STOCK_KAIPIAO = "BSSKP";
    const BILL_CODE_TYPE_SELF_STOCK_DELIVER = "BSSD";
    const BILL_CODE_TYPE_SELF_STOCK_DELIVER_SUB = "BSSD_S";
    const BILL_CODE_TYPE_SELF_TAX = "BST";

    //协议管理相关
    const PROTOCOL_MANAGE_STATUS_2VERIFY = 0;//待审核
    const PROTOCOL_MANAGE_STATUS_VERIFY_PASSED = 1;//审核通过
    const PROTOCOL_MANAGE_STATUS_VERIFY_DENIED = 2;//审核不通过










	/*所有相关的状态表end*/
	//下面是原来的

	/**
	 * 基础数据-仓库
	 */
	const WAREHOUSE = "1003";

	/**
	 * 新增仓库
	 */
	const WAREHOUSE_ADD = "1003-02";

	/**
	 * 编辑仓库
	 */
	const WAREHOUSE_EDIT = "1003-03";

	/**
	 * 删除仓库
	 */
	const WAREHOUSE_DELETE = "1003-04";

	/**
	 * 修改仓库数据域
	 */
	const WAREHOUSE_EDIT_DATAORG = "1003-05";

	/**
	 * 基础数据-供应商档案
	 */
	const SUPPLIER = "0203";

	/**
	 * 供应商分类
	 */
	const SUPPLIER_CATEGORY = "1004-02";

	/**
	 * 新增供应商分类
	 */
	const SUPPLIER_CATEGORY_ADD = "1004-03";

	/**
	 * 编辑供应商分类
	 */
	const SUPPLIER_CATEGORY_EDIT = "1004-04";

	/**
	 * 删除供应商分类
	 */
	const SUPPLIER_CATEGORY_DELETE = "1004-05";


	/**
	 * 基础数据-商品
	 */
	const GOODS = "1001";

	/**
	 * 商品分类
	 */
	const GOODS_CATEGORY = "1001-02";

	/**
	 * 新增商品分类
	 */
	const GOODS_CATEGORY_ADD = "1001-03";

	/**
	 * 编辑商品分类
	 */
	const GOODS_CATEGORY_EDIT = "1001-04";

	/**
	 * 删除商品分类
	 */
	const GOODS_CATEGORY_DELETE = "1001-05";

	/**
	 * 新增商品
	 */
	const GOODS_ADD = "1001-06";

	/**
	 * 编辑商品
	 */
	const GOODS_EDIT = "1001-07";

	/**
	 * 删除商品
	 */
	const GOODS_DELETE = "1001-08";

	/**
	 * 导入商品
	 */
	const GOODS_IMPORT = "1001-09";

	/**
	 * 设置商品安全库存
	 */
	const GOODS_SI = "1001-10";

	/**
	 * 基础数据-商品计量单位
	 */
	const GOODS_UNIT = "1002";

	/**
	 * 客户资料
	 */
	const CUSTOMER = "1007";

	/**
	 * 客户分类
	 */
	const CUSTOMER_CATEGORY = "1007-02";

	/**
	 * 新增客户分类
	 */
	const CUSTOMER_CATEGORY_ADD = "1007-03";

	/**
	 * 编辑客户分类
	 */
	const CUSTOMER_CATEGORY_EDIT = "1007-04";

	/**
	 * 删除客户分类
	 */
	const CUSTOMER_CATEGORY_DELETE = "1007-05";

	/**
	 * 新增客户
	 */
	const CUSTOMER_ADD = "1007-06";

	/**
	 * 编辑客户
	 */
	const CUSTOMER_EDIT = "1007-07";

	/**
	 * 删除客户
	 */
	const CUSTOMER_DELETE = "1007-08";

	/**
	 * 导入客户
	 */
	const CUSTOMER_IMPORT = "1007-09";

	/**
	 * 库存建账
	 */
	const INVENTORY_INIT = "2000";

	/**
	 * 采购入库
	 */
	const PURCHASE_WAREHOUSE = "2001";

	/**
	 * 库存账查询
	 */
	const INVENTORY_QUERY = "2003";

	/**
	 * 应付账款管理
	 */
	const PAYABLES = "2005";

	/**
	 * 应收账款管理
	 */
	const RECEIVING = "2004";

	/**
	 * 销售出库
	 */
	const WAREHOUSING_SALE = "2002";

	/**
	 * 销售退货入库
	 */
	const SALE_REJECTION = "2006";

	/**
	 * 业务设置
	 */
	const BIZ_CONFIG = "2008";

	/**
	 * 库间调拨
	 */
	const INVENTORY_TRANSFER = "2009";

	/**
	 * 库存盘点
	 */
	const INVENTORY_CHECK = "2010";

	/**
	 * 采购退货出库
	 */
	const PURCHASE_REJECTION = "2007";

	/**
	 * 首页-销售看板
	 */
	const PORTAL_SALE = "2011-01";

	/**
	 * 首页-库存看板
	 */
	const PORTAL_STOCK_ALARM = "2011-02";

	/**
	 * 首页-采购看板
	 */
	const PORTAL_PURCHASE = "2011-03";

	/**
	 * 首页-资金看板
	 */
	const PORTAL_MONEY = "2011-04";


	/**
	 * 首页-行业消息看板
	 */
	const PORTAL_BUSINESS_INFO = "2011-05";

	/**
	 * 首页-报警信息看板
	 */
	const PORTAL_ALARM_INFO = "2011-06";


	/**
	 * 首页-库存概况看板
	 */
	const PORTAL_STOCK_INFO = "2011-07";


	/**
	 * 销售日报表(按商品汇总)
	 */
	const REPORT_SALE_DAY_BY_GOODS = "2012";

	/**
	 * 销售日报表(按客户汇总)
	 */
	const REPORT_SALE_DAY_BY_CUSTOMER = "2013";

	/**
	 * 销售日报表(按仓库汇总)
	 */
	const REPORT_SALE_DAY_BY_WAREHOUSE = "2014";

	/**
	 * 销售日报表(按业务员汇总)
	 */
	const REPORT_SALE_DAY_BY_BIZUSER = "2015";

	/**
	 * 销售月报表(按商品汇总)
	 */
	const REPORT_SALE_MONTH_BY_GOODS = "2016";

	/**
	 * 销售月报表(按客户汇总)
	 */
	const REPORT_SALE_MONTH_BY_CUSTOMER = "2017";

	/**
	 * 销售月报表(按仓库汇总)
	 */
	const REPORT_SALE_MONTH_BY_WAREHOUSE = "2018";

	/**
	 * 销售月报表(按业务员汇总)
	 */
	const REPORT_SALE_MONTH_BY_BIZUSER = "2019";

	/**
	 * 安全库存明细表
	 */
	const REPORT_SAFETY_INVENTORY = "2020";

	/**
	 * 应收账款账龄分析表
	 */
	const REPORT_RECEIVABLES_AGE = "2021";

	/**
	 * 应付账款账龄分析表
	 */
	const REPORT_PAYABLES_AGE = "2022";

	/**
	 * 库存超上限明细表
	 */
	const REPORT_INVENTORY_UPPER = "2023";

	/**
	 * 现金收支查询
	 */
	const CASH_INDEX = "2024";

	/**
	 * 预收款管理
	 */
	const PRE_RECEIVING = "2025";

	/**
	 * 预付款管理
	 */
	const PRE_PAYMENT = "2026";

	/**
	 * 采购订单
	 */
	const PURCHASE_ORDER = "2027";

	/**
	 * 采购订单 - 审核
	 */
	const PURCHASE_ORDER_CONFIRM = "2027-01";

	/**
	 * 采购订单 - 生成采购入库单
	 */
	const PURCHASE_ORDER_GEN_PWBILL = "2027-02";

	/**
	 * 销售订单
	 */
	const SALE_ORDER = "2028";

	/**
	 * 销售订单 - 审核
	 */
	const SALE_ORDER_CONFIRM = "2028-01";

	/**
	 * 销售订单 - 生成销售出库单
	 */
	const SALE_ORDER_GEN_WSBILL = "2028-02";

	/**
	 * 基础数据 - 商品品牌
	 */
	const GOODS_BRAND = "2029";



	/*
	 * 以下均为业务员登录对应的功能模块常量表
	 *
	 *
	 * */


	/**
	 * 修改我的密码
	 */
	const CHANGE_MY_PASSWORD4EMPLOYEE = "-9996";
	const YEWUYUAN_DAILY_SELL_ITEMS_SEARCH = "0201";
	const YEWUYUAN_SELL_REPORT = "0202";
	const YEWUYUAN_PAYMENT_INFO = "0204";

}

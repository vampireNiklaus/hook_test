<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\FIdService;
use Home\Service\BizlogService;
use Home\Service\UserService;
use Home\Common\FIdConst;
use Home\Service\MainMenuService;

/**
 * 主菜单Controller
 *
 * @author Baoyu Li
 *        
 */
class MainMenuController extends Controller {

	/**
	 * 页面跳转
	 */
	public function navigateTo() {
		$this->assign("uri", __ROOT__ . "/");
		$fid = I("get.fid");
		$fidService = new FIdService();
		$fidService->insertRecentFid($fid);
		$fidName = $fidService->getFIdName($fid);
		if ($fidName) {
			$bizLogService = new BizlogService();
			$bizLogService->insertBizlog("进入模块：" . $fidName);
		}
		if (! $fid) {
			redirect(__ROOT__ . "/Home");
		}
		$loginType = session("loginType");
		if($loginType == FIdConst::LOGIN_TYPE_STAFF){
			switch ($fid) {
				case FIdConst::ABOUT :
					// 修改我的密码
					redirect(__ROOT__ . "/Home/About/index");
					break;
				case FIdConst::RELOGIN :
					// 重新登录
					$us = new UserService();
					$us->clearLoginUserInSession();
					redirect(__ROOT__ . "/Home");
					break;
				case FIdConst::CHANGE_MY_PASSWORD :
					// 修改我的密码
					redirect(__ROOT__ . "/Home/User/changeMyPassword");
					break;
				case FIdConst::USR_MANAGEMENT :
					// 用户管理
					redirect(__ROOT__ . "/Home/User");
					break;
				case FIdConst::PERMISSION_MANAGEMENT :
					// 权限管理
					redirect(__ROOT__ . "/Home/Permission");
					break;
				case FIdConst::BIZ_LOG :
					// 业务日志
					redirect(__ROOT__ . "/Home/Bizlog");
					break;


				//新添加的相关信息
				case FIdConst::DRUG_BASIC_INFO:
					//业务员信息
					redirect(__ROOT__."/Home/Drug");
					break;

                case FIdConst::AGENT_BASIC_INFO:
                    //代理商信息
                    redirect(__ROOT__."/Home/Agent");
                    break;

				case FIdConst::EMPLOYEE_BASIC_INFO:
					//合作伙伴信息
					redirect(__ROOT__."/Home/Employee");
					break;

				case FIdConst::HOSPITAL_BASIC_INFO:
					//医院信息
					redirect(__ROOT__."/Home/Hospital");
					break;
				case FIdConst::SUPPLIER_BASIC_INFO:
					//供应商信息
					redirect(__ROOT__."/Home/Supplier");
					break;
				case FIdConst::DELIVER_BASIC_INFO:
					//配送公司信息
					redirect(__ROOT__."/Home/Deliver");
					break;
                case FIdConst::DELIVER_ACCOUNT_INFO:
                    //流向抓取配送公司账号信息
                    redirect(__ROOT__."/Home/DeliverAccount");
                    break;
				case FIdConst::BUSINESS_SETTING:
					//银行账户相关信息
					redirect(__ROOT__."/Home/BusinessSetting");
					break;
				case FIdConst::SELF_PURCHASE:
					//业务流程自销采购单
					redirect(__ROOT__."/Home/SelfPurchase");
					break;
				case FIdConst::SELF_PAY:
					//业务流程自销付款单
					redirect(__ROOT__."/Home/SelfPay");
					break;
				case FIdConst::SELF_TAX:
					//业务流程自销税票单
					redirect(__ROOT__."/Home/SelfTax");
					break;
				case FIdConst::SELF_STOCK:
					//业务流程自销入库单
					redirect(__ROOT__."/Home/SelfStock");
					break;
                case FIdConst::SELF_STOCK_KAIPIAO:
					//业务流程自销入库单
					redirect(__ROOT__."/Home/SelfStockKaiPiao");
					break;
                case FIdConst::SELF_STOCK_KAIPIAO_OUT:
					//业务流程自销入库单
					redirect(__ROOT__."/Home/SelfStockKaiPiaoOut");
					break;
				case FIdConst::SELF_HUIKUAN:
					//业务流程自销付款单
					redirect(__ROOT__."/Home/SelfHuikuan");
					break;
                case FIdConst::SELF_PURCHASE_BY_TWO:
                    //两票制自销采购单
                    redirect(__ROOT__."/Home/SelfPurchaseByTwo");
                    break;
                case FIdConst::SELF_PAY_BY_TWO:
                    //两票制自销付款单
                    redirect(__ROOT__."/Home/SelfPayByTwo");
                    break;
                case FIdConst::SELF_STOCK_BY_TWO:
                    //两票制自销入库单
                    redirect(__ROOT__."/Home/SelfStockByTwo");
                    break;
                case FIdConst::SELF_DELIVER_HUIKUAN_BY_TWO:
                    //两票制自销商业回款单
                    redirect(__ROOT__."/Home/SelfDeliverHuikuanByTwo");
                    break;
                case FIdConst::SELF_MANUFACTURER_HUIKUAN_BY_TWO:
                    //两票制自销厂家回款单
                    redirect(__ROOT__."/Home/SelfManufacturerHuikuanByTwo");
                    break;

				case FIdConst::BANK_DEPOSIT:
					//银行存取款
					redirect(__ROOT__."/Home/BankDeposit");
					break;
                case FIdConst::PROTOCOL_MANAGE:
                    //招商管理协议管理
                    redirect(__ROOT__."/Home/ProtocolManage");
                    break;
                case FIdConst::SELL_DAILY_FETCH:
                    //销售管理
                    redirect(__ROOT__."/Home/DailySellFetch");
                    break;
				case FIdConst::SELL_MANAGE:
					//销售管理
					redirect(__ROOT__."/Home/DailySell");
					break;

				case FIdConst::SELL_REAL_TIME_FLOW:
					//实时流向
					redirect(__ROOT__."/Home/RealTimeFlow");
					break;

				case FIdConst::BUSINESS_PAY:
					//业务支付
					redirect(__ROOT__."/Home/BusinessPay");
					break;
                case FIdConst::DIRECT_PAY:
                    //直营结算
                    redirect(__ROOT__."/Home/DirectPay");
                    break;
                case FIdConst::INVEST_PAY:
                    //招商结算
                    redirect(__ROOT__."/Home/InvestPay");
                    break;

				case FIdConst::BILLING_TYPES:
					//单据类型
					redirect(__ROOT__."/Home/BillingTypes");
					break;
				case FIdConst::ACCOUNT_MANAGE:
					//资金管理
					redirect(__ROOT__."/Home/CapitalManage");
					break;

				case FIdConst::DELE_PURCHASE:
					//业务流程代销采购单
//					redirect(__ROOT__."/Home/DelePurchase");
                    redirect(__ROOT__."/Home/DeleHuikuan");

                    break;
				case FIdConst::DELE_HUIKUAN:
					//业务流程代销回款单
					redirect(__ROOT__."/Home/DeleHuikuan");
					break;
				/*
                 *
                 * 库存管理
                */
				case FIdConst::STOCK_MANAGE:
					redirect(__ROOT__."/Home/StockManage");
					break;



				/*
                 * 报表部分
                 * */
				case FIdConst::REPORT_SELL:
					//销售报表
					redirect(__ROOT__."/Home/Report/sellReport");
					break;
				case FIdConst::REPORT_EMPLOYEE:
					//业务员报表
					redirect(__ROOT__."/Home/Report/employeeReport");
					break;
				case FIdConst::REPORT_JINXIAOCUN:
					//进销存报表
					redirect(__ROOT__."/Home/Report/jinXiaoCunReport");
					break;
				case FIdConst::REPORT_BUSINESS_ANALYSIS:
					//业务分析表
					redirect(__ROOT__."/Home/Report/businessAnalysisReport");
					break;
				case FIdConst::REPORT_CAPITAL_ANALYSIS:
					//财务分析表
					redirect(__ROOT__."/Home/Report/capitalAnalysisReport");
					break;




				//之后的是系统原来的相关的信息
				case FIdConst::WAREHOUSE :
					// 基础数据 - 仓库
					redirect(__ROOT__ . "/Home/Warehouse");
					break;
				case FIdConst::SUPPLIER :
					// 基础数据 - 供应商档案
					redirect(__ROOT__ . "/Home/Supplier");
					break;
				case FIdConst::GOODS :
					// 基础数据 - 商品
					redirect(__ROOT__ . "/Home/Goods");
					break;
				case FIdConst::GOODS_UNIT :
					// 基础数据 - 商品计量单位
					redirect(__ROOT__ . "/Home/Goods/unitIndex");
					break;
				case FIdConst::CUSTOMER :
					// 客户关系 - 客户资料
					redirect(__ROOT__ . "/Home/Customer");
					break;
				case FIdConst::INVENTORY_INIT :
					// 库存建账
					redirect(__ROOT__ . "/Home/Inventory/initIndex");
					break;
				case FIdConst::PURCHASE_WAREHOUSE :
					// 采购入库
					redirect(__ROOT__ . "/Home/Purchase/pwbillIndex");
					break;
				case FIdConst::INVENTORY_QUERY :
					// 库存账查询
					redirect(__ROOT__ . "/Home/Inventory/inventoryQuery");
					break;
				case FIdConst::PAYABLES :
					// 应付账款管理
					redirect(__ROOT__ . "/Home/Funds/payIndex");
					break;
				case FIdConst::RECEIVING :
					// 应收账款管理
					redirect(__ROOT__ . "/Home/Funds/rvIndex");
					break;
				case FIdConst::WAREHOUSING_SALE :
					// 销售出库
					redirect(__ROOT__ . "/Home/Sale/wsIndex");
					break;
				case FIdConst::SALE_REJECTION :
					// 销售退货入库
					redirect(__ROOT__ . "/Home/Sale/srIndex");
					break;
				case FIdConst::BIZ_CONFIG :
					// 业务设置
					redirect(__ROOT__ . "/Home/BizConfig");
					break;
				case FIdConst::INVENTORY_TRANSFER :
					// 库间调拨
					redirect(__ROOT__ . "/Home/InvTransfer");
					break;
				case FIdConst::INVENTORY_CHECK :
					// 库存盘点
					redirect(__ROOT__ . "/Home/InvCheck");
					break;
				case FIdConst::PURCHASE_REJECTION :
					// 采购退货出库
					redirect(__ROOT__ . "/Home/PurchaseRej");
					break;
				case FIdConst::REPORT_SALE_DAY_BY_GOODS :
					// 销售日报表(按商品汇总)
					redirect(__ROOT__ . "/Home/Report/saleDayByGoods");
					break;
				case FIdConst::REPORT_SALE_DAY_BY_CUSTOMER :
					// 销售日报表(按客户汇总)
					redirect(__ROOT__ . "/Home/Report/saleDayByCustomer");
					break;
				case FIdConst::REPORT_SALE_DAY_BY_WAREHOUSE :
					// 销售日报表(按仓库汇总)
					redirect(__ROOT__ . "/Home/Report/saleDayByWarehouse");
					break;
				case FIdConst::REPORT_SALE_DAY_BY_BIZUSER :
					// 销售日报表(按业务员汇总)
					redirect(__ROOT__ . "/Home/Report/saleDayByBizuser");
					break;
				case FIdConst::REPORT_SALE_MONTH_BY_GOODS :
					// 销售月报表(按商品汇总)
					redirect(__ROOT__ . "/Home/Report/saleMonthByGoods");
					break;
				case FIdConst::REPORT_SALE_MONTH_BY_CUSTOMER :
					// 销售月报表(按客户汇总)
					redirect(__ROOT__ . "/Home/Report/saleMonthByCustomer");
					break;
				case FIdConst::REPORT_SALE_MONTH_BY_WAREHOUSE :
					// 销售月报表(按仓库汇总)
					redirect(__ROOT__ . "/Home/Report/saleMonthByWarehouse");
					break;
				case FIdConst::REPORT_SALE_MONTH_BY_BIZUSER :
					// 销售月报表(按业务员汇总)
					redirect(__ROOT__ . "/Home/Report/saleMonthByBizuser");
					break;
				case FIdConst::REPORT_SAFETY_INVENTORY :
					// 安全库存明细表
					redirect(__ROOT__ . "/Home/Report/safetyInventory");
					break;
				case FIdConst::REPORT_RECEIVABLES_AGE :
					// 应收账款账龄分析表
					redirect(__ROOT__ . "/Home/Report/receivablesAge");
					break;
				case FIdConst::REPORT_PAYABLES_AGE :
					// 应付账款账龄分析表
					redirect(__ROOT__ . "/Home/Report/payablesAge");
					break;
				case FIdConst::REPORT_INVENTORY_UPPER :
					// 库存超上限明细表
					redirect(__ROOT__ . "/Home/Report/inventoryUpper");
					break;
				case FIdConst::CASH_INDEX :
					// 现金收支查询
					redirect(__ROOT__ . "/Home/Funds/cashIndex");
					break;
				case FIdConst::PRE_RECEIVING :
					// 预收款管理
					redirect(__ROOT__ . "/Home/Funds/prereceivingIndex");
					break;
				case FIdConst::PRE_PAYMENT :
					// 预付款管理
					redirect(__ROOT__ . "/Home/Funds/prepaymentIndex");
					break;
				case FIdConst::PURCHASE_ORDER :
					// 采购订单
					redirect(__ROOT__ . "/Home/Purchase/pobillIndex");
					break;
				case FIdConst::SALE_ORDER :
					// 销售订单
					redirect(__ROOT__ . "/Home/Sale/soIndex");
					break;
				case FIdConst::GOODS_BRAND :
					// 基础数据 - 商品品牌
					redirect(__ROOT__ . "/Home/Goods/brandIndex");
					break;
				default :
					redirect(__ROOT__ . "/Home");
			}
		}elseif($loginType == FIdConst::LOGIN_TYPE_EMPLOYEE){
			switch ($fid) {
				case FIdConst::ABOUT :
					// 修改我的密码
					redirect(__ROOT__ . "/Home/About/index");
					break;
				case FIdConst::RELOGIN :
					// 重新登录
					$us = new UserService();
					$us->clearLoginUserInSession();
					redirect(__ROOT__ . "/Home/User/login");
					break;
				case FIdConst::CHANGE_MY_PASSWORD :
					// 修改我的密码
					redirect(__ROOT__ . "/Home/User/changeMyPassword");
					break;
				//新添加的相关信息
				case FIdConst::YEWUYUAN_DAILY_SELL_ITEMS_SEARCH:
					//流向查询
					redirect(__ROOT__."/Home/YeWuYuan/dailySellItems");
					break;

				case FIdConst::YEWUYUAN_SELL_REPORT:
					//销售报表信息
					redirect(__ROOT__."/Home/YeWuYuan/sellReport");
					break;

				case FIdConst::YEWUYUAN_PAYMENT_INFO:
					//医院信息
					redirect(__ROOT__."/Home/YeWuYuan/paymentInfo");
					break;
				default :
					redirect(__ROOT__ . "/Home");
			}
		}

	}

	/**
	 * 返回生成主菜单的JSON数据
	 * 目前只能处理到生成三级菜单的情况
	 */
	public function mainMenuItems() {
		if (IS_POST) {
			$ms = new MainMenuService();
			$loginType = session("loginType");
			if($loginType == FIdConst::LOGIN_TYPE_STAFF){
				$this->ajaxReturn($ms->mainMenuItems4Staff());
			}elseif($loginType == FIdConst::LOGIN_TYPE_EMPLOYEE){
				$this->ajaxReturn($ms->mainMenuItems4Employee());
			}
		}
	}

	/**
	 * 常用功能
	 */
	public function recentFid() {
		if (IS_POST) {
			$fidService = new FIdService();
			$data = $fidService->recentFid();
			
			$this->ajaxReturn($data);
		}
	}
}

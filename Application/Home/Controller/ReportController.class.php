<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Common\FIdConst;
use Home\Service\ReportService;
use Home\Service\InventoryReportService;
use Home\Service\ReceivablesReportService;
use Home\Service\PayablesReportService;

/**
 * 报表Controller
 *
 * @author Baoyu Li
 *        
 */
class ReportController extends PSIBaseController {


	/**
	 * 销售报表
	 */
	public function sellReport() {
		$us = new UserService();
		if ($us->hasPermission(FIdConst::REPORT_SELL)) {
			$this->initVar();

			$this->assign("title", "销售报表");
			$this->assign("pViewReportSellSummary", $us->hasPermission(FIdConst::REPORT_SELL_SUMMARY) ? 1 : 0);
			$this->assign("pViewReportSellByRegion", $us->hasPermission(FIdConst::REPORT_SELL_BY_REGION) ? 1 : 0);
			$this->assign("pViewReportSellHospitalBusiness", $us->hasPermission(FIdConst::REPORT_SELL_HOSPITAL_BUSINESS) ? 1 : 0);
			$this->assign("pViewReportSellUnSable", $us->hasPermission(FIdConst::REPORT_SELL_UNSALABLE) ? 1 : 0);
			$this->assign("pViewReportSellProfit", $us->hasPermission(FIdConst::REPORT_SELL_PROFIT) ? 1 : 0);

			$this->display();
		} else {
			$this->gotoLoginPage("/Home");
		}
	}




	/**
	 * 根据日期,药品查询销售总表
	 */
	public function sellReportSummaryQueryData(){
		if (IS_POST) {
			$params = array(
				"date" => I("post.date"),
				"drug_id" => I("post.drug_id"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->sellReportSummaryQueryData($params));
		}
	}


	/**
	 * 根据地区与药品相关信息查询数据
	 */
	public function sellReportRegionSortQueryData(){
		if (IS_POST) {
			$params = array(
				"date" => I("post.date"),
				"drug_id" => I("post.drug_id"),
				"region_id" => I("post.region_id"),
				"hospital_type" => I("post.hospital_type"),
				"if_by_region" => I("post.if_by_region"),
//				"page" => I("post.page"),
//				"start" => I("post.start"),
//				"limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->sellReportRegionSortQueryData($params));
		}
	}



	/**
	 * 根据时间与产品名称查询产品的收支明细账
	 */
	public function getProductIODetailList(){
		if (IS_POST) {
            //权限控制
			$params = array(
				"date" => I("post.date"),
				"drug_id" => I("post.drug_id"),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->getProductIODetailList($params));
		}
	}


	/**
	 * 根据时间与产品名称查询产品的进销汇总表
	 */
	public function getProductJinXiaoSumList(){
		if (IS_POST) {
            //权限控制
			$params = array(
				"date_s" => I("post.date_s"),
				"date_e" => I("post.date_e"),
				"drug_id" => I("post.drug_id"),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->getProductJinXiaoSumList($params));
		}
	}

	/**
	 * 根据时间与产品名称查询产品的应收账款明细
	 */
	public function getProduct2ReceiveMoneyList(){
		if (IS_POST) {
            //权限控制
			$params = array(
				"date" => I("post.date"),
				"drug_id" => I("post.drug_id"),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->getProduct2ReceiveMoneyList($params));
		}
	}


	/**
	 * 根据时间与产品名称查询产品的铺货利润表
	 */
	public function getProductPuHuoProfitList(){
		if (IS_POST) {
            //权限控制
			$params = array(
				"date" => I("post.date"),
				"drug_id" => I("post.drug_id"),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->getProductPuHuoProfitList($params));
		}
	}


	/**
	 * 根据地区与药品相关信息查询数据
	 */
	public function sellReportHospitalBusinessQueryData(){
		if (IS_POST) {
			$params = array(
				"date" => I("post.date"),
				"drug_id" => I("post.drug_id"),
				"region_id" => I("post.region_id"),
				"analyse_type" => I("post.analyse_type"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->sellReportHospitalBusinessQueryData($params));
		}
	}


	/**
	 * 滞销分析查询数据
	 */
	public function sellReportUnsalableQueryData(){
		if (IS_POST) {
			$params = array(
				"date" => I("post.date"),
				"drug_id" => I("post.drug_id"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->sellReportUnsalableQueryData($params));
		}
	}

	/**
	 * 销售毛利查询数据
	 */
	public function sellReportGrossProfitQueryData(){
		if (IS_POST) {
			$params = array(
				"date" => I("post.date"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->sellReportGrossProfitQueryData($params));
		}
	}



	/**
	 * 业务员报表
	 */
	public function employeeReport() {
		$us = new UserService();

		if ($us->hasPermission(FIdConst::REPORT_EMPLOYEE)) {
			$this->initVar();

			$this->assign("title", "业务员报表");
			$this->assign("pViewReportEmployeeByMonth", $us->hasPermission(FIdConst::REPORT_EMPLOYEE_BY_MONTH) ? 1 : 0);
			$this->assign("pViewReportEmployeePayment", $us->hasPermission(FIdConst::REPORT_EMPLOYEE_PAYMENT) ? 1 : 0);
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/employeeReport");
		}
	}

	/**
	 * 业务员销售报表
	 */
	public function sellReportQueryData(){
		if (IS_POST) {
			$params = array(
				"date" => I("post.date"),
				"employee_name" => I("post.employee_name"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->sellReportQueryData($params));
		}
	}

	/**
	 * 业务员支付报表
	 */
	public function paymentInfoQueryData(){
		if (IS_POST) {
			$params = array(
				"date" => I("post.date"),
				"employee_name" => I("post.employee_name"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->paymentInfoQueryData($params));
		}
	}



	/**
	 * 进销存报表
	 */
	public function jinXiaoCunReport() {
		$us = new UserService();

		if ($us->hasPermission(FIdConst::REPORT_JINXIAOCUN)) {
			$this->initVar();

			$this->assign("title", "进销存报表");
			$this->assign("pViewReportJinXiaoCunSummary", $us->hasPermission(FIdConst::REPORT_JINXIAOCUN_SUMMARY) ? 1 : 0);
			$this->assign("pViewReportJinXiaoCunSellDetail", $us->hasPermission(FIdConst::REPORT_JINXIAOCUN_SELL_DETAIL) ? 1 : 0);
			$this->assign("pViewReportJinXiaoCunInStock", $us->hasPermission(FIdConst::REPORT_JINXIAOCUN_INSTOCK) ? 1 : 0);
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/jinXiaoCunReport");
		}
	}

	/*进销存总表*/

	public function jinXiaoCunMainQueryData(){
		if (IS_POST) {
			$params = array(
				"date" => I("post.date"),
				"drug_name" => I("post.drug_name"),
				"searchType" => I("post.searchType"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->jinXiaoCunMainQueryData($params));
		}
	}

	/*进销存总表*/

	public function jinXiaoCunSellQueryData(){
		if (IS_POST) {
			$params = array(
				"dateFrom" => I("post.dateFrom"),
				"dateTo" => I("post.dateTo"),
				"drug_name" => I("post.drug_name"),
				"employee_name" => I("post.employee_name"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->jinXiaoCunSellQueryData($params));
		}
	}

	/*进货详情表*/

	public function jinXiaoCunInStockQueryData(){
		if (IS_POST) {
			$params = array(
				"dateFrom" => I("post.dateFrom"),
				"dateTo" => I("post.dateTo"),
				"drug_id" => I("post.drug_id"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new ReportService();
			$this->ajaxReturn($ss->jinXiaoCuninStockQueryData($params));
		}
	}





	/**
	 * 业务分析报表
	 */
	public function businessAnalysisReport() {
		$us = new UserService();

		if ($us->hasPermission(FIdConst::REPORT_BUSINESS_ANALYSIS)) {
			$this->initVar();

			$this->assign("title", "业务分析表");
			$this->assign("pViewReportProductAgency", $us->hasPermission(FIdConst::REPORT_BUSINESS_ANALYSIS_PRODUCT_AGENCY) ? 1 : 0);

			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/businessAnalysisReport");
		}
	}

	/**
	 * 资金状况
	 */
	public function capitalAnalysisReport() {
		$us = new UserService();

		if ($us->hasPermission(FIdConst::REPORT_CAPITAL_ANALYSIS)) {
			$this->initVar();

			$this->assign("title", "财务分析表");
            $this->assign("pViewReportCapitalAnalysisProIoDetail", $us->hasPermission(FIdConst::REPORT_CAPITAL_ANALYSIS_PRODUCT_IO_DETAIL) ? 1 : 0);
            $this->assign("pViewReportCapitalAnalysisPro2ReceiveSum", $us->hasPermission(FIdConst::REPORT_CAPITAL_ANALYSIS_PRODUCT_2RECEIVE_SUM) ? 1 : 0);
            $this->assign("pViewReportCapitalAnalysisProJinXiaoSum", $us->hasPermission(FIdConst::REPORT_CAPITAL_ANALYSIS_PRODUCT_JINXIAO_SUM) ? 1 : 0);
            $this->assign("pViewReportCapitalAnalysisProPuHuoProfit", $us->hasPermission(FIdConst::REPORT_CAPITAL_ANALYSIS_PRODUCT_PUHUO_PROFIT) ? 1 : 0);
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/capitalAnalysisReport");
		}
	}



















	/*
	 * 后面的是原来就有的代码
	 * */

	/**
	 * 销售日报表(按商品汇总)
	 */
	public function saleDayByGoods() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::REPORT_SALE_DAY_BY_GOODS)) {
			$this->initVar();
			
			$this->assign("title", "销售日报表(按商品汇总)");
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/saleDayByGoods");
		}
	}

	/**
	 * 销售日报表(按商品汇总) - 查询数据
	 */
	public function saleDayByGoodsQueryData() {
		if (IS_POST) {
			$params = array(
					"dt" => I("post.dt"),
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleDayByGoodsQueryData($params));
		}
	}

	/**
	 * 销售日报表(按商品汇总) - 查询汇总数据
	 */
	public function saleDayByGoodsSummaryQueryData() {
		if (IS_POST) {
			$params = array(
					"dt" => I("post.dt")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleDayByGoodsSummaryQueryData($params));
		}
	}

	/**
	 * 销售日报表(按客户汇总)
	 */
	public function saleDayByCustomer() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::REPORT_SALE_DAY_BY_CUSTOMER)) {
			$this->initVar();
			
			$this->assign("title", "销售日报表(按客户汇总)");
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/saleDayByCustomer");
		}
	}

	/**
	 * 销售日报表(按客户汇总) - 查询数据
	 */
	public function saleDayByCustomerQueryData() {
		if (IS_POST) {
			$params = array(
					"dt" => I("post.dt"),
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleDayByCustomerQueryData($params));
		}
	}

	/**
	 * 销售日报表(按客户汇总) - 查询汇总数据
	 */
	public function saleDayByCustomerSummaryQueryData() {
		if (IS_POST) {
			$params = array(
					"dt" => I("post.dt")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleDayByCustomerSummaryQueryData($params));
		}
	}

	/**
	 * 销售日报表(按仓库汇总)
	 */
	public function saleDayByWarehouse() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::REPORT_SALE_DAY_BY_WAREHOUSE)) {
			$this->initVar();
			
			$this->assign("title", "销售日报表(按仓库汇总)");
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/saleDayByWarehouse");
		}
	}

	/**
	 * 销售日报表(按仓库汇总) - 查询数据
	 */
	public function saleDayByWarehouseQueryData() {
		if (IS_POST) {
			$params = array(
					"dt" => I("post.dt"),
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleDayByWarehouseQueryData($params));
		}
	}

	/**
	 * 销售日报表(按仓库汇总) - 查询汇总数据
	 */
	public function saleDayByWarehouseSummaryQueryData() {
		if (IS_POST) {
			$params = array(
					"dt" => I("post.dt")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleDayByWarehouseSummaryQueryData($params));
		}
	}

	/**
	 * 销售日报表(按业务员汇总)
	 */
	public function saleDayByBizuser() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::REPORT_SALE_DAY_BY_BIZUSER)) {
			$this->initVar();
			
			$this->assign("title", "销售日报表(按业务员汇总)");
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/saleDayByBizuser");
		}
	}

	/**
	 * 销售日报表(按业务员汇总) - 查询数据
	 */
	public function saleDayByBizuserQueryData() {
		if (IS_POST) {
			$params = array(
					"dt" => I("post.dt"),
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleDayByBizuserQueryData($params));
		}
	}

	/**
	 * 销售日报表(按业务员汇总) - 查询汇总数据
	 */
	public function saleDayByBizuserSummaryQueryData() {
		if (IS_POST) {
			$params = array(
					"dt" => I("post.dt")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleDayByBizuserSummaryQueryData($params));
		}
	}

	/**
	 * 销售月报表(按商品汇总)
	 */
	public function saleMonthByGoods() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::REPORT_SALE_MONTH_BY_GOODS)) {
			$this->initVar();
			
			$this->assign("title", "销售月报表(按商品汇总)");
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/saleMonthByGoods");
		}
	}

	/**
	 * 销售月报表(按商品汇总) - 查询数据
	 */
	public function saleMonthByGoodsQueryData() {
		if (IS_POST) {
			$params = array(
					"year" => I("post.year"),
					"month" => I("post.month"),
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleMonthByGoodsQueryData($params));
		}
	}

	/**
	 * 销售月报表(按商品汇总) - 查询汇总数据
	 */
	public function saleMonthByGoodsSummaryQueryData() {
		if (IS_POST) {
			$params = array(
					"year" => I("post.year"),
					"month" => I("post.month")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleMonthByGoodsSummaryQueryData($params));
		}
	}

	/**
	 * 销售月报表(按客户汇总)
	 */
	public function saleMonthByCustomer() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::REPORT_SALE_MONTH_BY_CUSTOMER)) {
			$this->initVar();
			
			$this->assign("title", "销售月报表(按客户汇总)");
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/saleMonthByCustomer");
		}
	}

	/**
	 * 销售月报表(按客户汇总) - 查询数据
	 */
	public function saleMonthByCustomerQueryData() {
		if (IS_POST) {
			$params = array(
					"year" => I("post.year"),
					"month" => I("post.month"),
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleMonthByCustomerQueryData($params));
		}
	}

	/**
	 * 销售月报表(按客户汇总) - 查询汇总数据
	 */
	public function saleMonthByCustomerSummaryQueryData() {
		if (IS_POST) {
			$params = array(
					"year" => I("post.year"),
					"month" => I("post.month")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleMonthByCustomerSummaryQueryData($params));
		}
	}

	/**
	 * 销售月报表(按仓库汇总)
	 */
	public function saleMonthByWarehouse() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::REPORT_SALE_MONTH_BY_WAREHOUSE)) {
			$this->initVar();
			
			$this->assign("title", "销售月报表(按仓库汇总)");
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/saleMonthByWarehouse");
		}
	}

	/**
	 * 销售月报表(按仓库汇总) - 查询数据
	 */
	public function saleMonthByWarehouseQueryData() {
		if (IS_POST) {
			$params = array(
					"year" => I("post.year"),
					"month" => I("post.month"),
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleMonthByWarehouseQueryData($params));
		}
	}

	/**
	 * 销售月报表(按仓库汇总) - 查询汇总数据
	 */
	public function saleMonthByWarehouseSummaryQueryData() {
		if (IS_POST) {
			$params = array(
					"year" => I("post.year"),
					"month" => I("post.month")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleMonthByWarehouseSummaryQueryData($params));
		}
	}

	/**
	 * 销售月报表(按业务员汇总)
	 */
	public function saleMonthByBizuser() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::REPORT_SALE_MONTH_BY_BIZUSER)) {
			$this->initVar();
			
			$this->assign("title", "销售月报表(按业务员汇总)");
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/saleMonthByBizuser");
		}
	}

	/**
	 * 销售月报表(按业务员汇总) - 查询数据
	 */
	public function saleMonthByBizuserQueryData() {
		if (IS_POST) {
			$params = array(
					"year" => I("post.year"),
					"month" => I("post.month"),
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleMonthByBizuserQueryData($params));
		}
	}

	/**
	 * 销售月报表(按业务员汇总) - 查询汇总数据
	 */
	public function saleMonthByBizuserSummaryQueryData() {
		if (IS_POST) {
			$params = array(
					"year" => I("post.year"),
					"month" => I("post.month")
			);
			
			$rs = new SaleReportService();
			
			$this->ajaxReturn($rs->saleMonthByBizuserSummaryQueryData($params));
		}
	}

	/**
	 * 安全库存明细表
	 */
	public function safetyInventory() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::REPORT_SAFETY_INVENTORY)) {
			$this->initVar();
			
			$this->assign("title", "安全库存明细表");
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/safetyInventory");
		}
	}

	/**
	 * 安全库存明细表 - 查询数据
	 */
	public function safetyInventoryQueryData() {
		if (IS_POST) {
			$params = array(
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			
			$is = new InventoryReportService();
			
			$this->ajaxReturn($is->safetyInventoryQueryData($params));
		}
	}

	/**
	 * 应收账款账龄分析表
	 */
	public function receivablesAge() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::REPORT_RECEIVABLES_AGE)) {
			$this->initVar();
			
			$this->assign("title", "应收账款账龄分析表");
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/receivablesAge");
		}
	}

	/**
	 * 应收账款账龄分析表 - 数据查询
	 */
	public function receivablesAgeQueryData() {
		if (IS_POST) {
			$params = array(
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			
			$rs = new ReceivablesReportService();
			
			$this->ajaxReturn($rs->receivablesAgeQueryData($params));
		}
	}

	/**
	 * 应收账款账龄分析表 - 当期汇总数据查询
	 */
	public function receivablesSummaryQueryData() {
		if (IS_POST) {
			$rs = new ReceivablesReportService();
			
			$this->ajaxReturn($rs->receivablesSummaryQueryData());
		}
	}

	/**
	 * 应付账款账龄分析表
	 */
	public function payablesAge() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::REPORT_PAYABLES_AGE)) {
			$this->initVar();
			
			$this->assign("title", "应付账款账龄分析表");
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/payablesAge");
		}
	}

	/**
	 * 应付账款账龄分析表 - 数据查询
	 */
	public function payablesAgeQueryData() {
		if (IS_POST) {
			$params = array(
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			
			$ps = new PayablesReportService();
			
			$this->ajaxReturn($ps->payablesAgeQueryData($params));
		}
	}

	/**
	 * 应付账款账龄分析表 - 当期汇总数据查询
	 */
	public function payablesSummaryQueryData() {
		if (IS_POST) {
			$ps = new PayablesReportService();
			
			$this->ajaxReturn($ps->payablesSummaryQueryData());
		}
	}

	/**
	 * 库存超上限明细表
	 */
	public function inventoryUpper() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::REPORT_INVENTORY_UPPER)) {
			$this->initVar();
			
			$this->assign("title", "库存超上限明细表");
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Report/inventoryUpper");
		}
	}

	/**
	 * 库存超上限明细表 - 查询数据
	 */
	public function inventoryUpperQueryData() {
		if (IS_POST) {
			$params = array(
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			
			$is = new InventoryReportService();
			
			$this->ajaxReturn($is->inventoryUpperQueryData($params));
		}
	}



	/**
	 * 应付账款账龄分析表 - 数据查询
	 */
	public function getProductAgencyList() {
		if (IS_POST) {
			$params = array(
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit"),
				"date" => I('post.date')
			);

			$ps = new ReportService();

			$this->ajaxReturn($ps->getProductAgencyList($params));
		}
	}
}
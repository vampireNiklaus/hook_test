<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Common\FIdConst;
use Home\Service\YeWuYuanService;

/**
 * 报表Controller
 *
 * @author Baoyu Li
 *        
 */
class YeWuYuanController extends PSIBaseController {

	/**
	 * 首页
	 */
	public function index() {
		$us = new UserService();
//		if ($us->hasPermission()) {
		if (true) {
			$this->initVar();
			$this->assign("title", "业务员首页");
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/YeWuYuan/dailySellItems");
		}
	}
	/**
	 * 流向查询
	 */
	public function dailySellItems() {
		$us = new UserService();
//		if ($us->hasPermission()) {
		if (true) {
			$this->initVar();
			$this->assign("title", "流向查询");
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/YeWuYuan/dailySellItems");
		}
	}

	/**
	 * 根据日期范围查询daily_sell
	 */
	public function dailySellItemsQueryData(){
		if (IS_POST) {
			$params = array(
				"dtFrom" => I("post.dtFrom"),
				"dtTo" => I("post.dtTo"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			if(I("post.drug_name")){
				$params['drug_name'] = I("post.drug_name");
			}
			$ss = new YeWuYuanService();
			$this->ajaxReturn($ss->dailySellItemsQueryData($params));
		}
	}


	/**
	 * 销售报表
	 */
	public function sellReport() {
		$us = new UserService();
//		if ($us->hasPermission(FIdConst::REPORT_SALE_DAY_BY_GOODS)) {
		if (true) {
			$this->initVar();
			$this->assign("title", "销售报表");
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/YeWuYuan/sellReport");
		}
	}

	/**
	 * 根据日期范围查询销售报表
	 */
	public function sellReportQueryData(){
		if (IS_POST) {
			$params = array(
				"date" => I("post.date"),
				"employee_des" => I("post.employee_des"),
//				"page" => I("post.page"),
//				"start" => I("post.start"),
//				"limit" => I("post.limit")
			);
			$ss = new YeWuYuanService();
			$this->ajaxReturn($ss->sellReportQueryData($params));
		}
	}

	/**
	 * 打款查询
	 */
	public function paymentInfo() {
		$us = new UserService();
//		if ($us->hasPermission(FIdConst::REPORT_SALE_DAY_BY_GOODS)) {
		if (true) {
			$this->initVar();
			$this->assign("title", "打款查询");
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/YeWuYuan/paymentInfo");
		}
	}

	/**
	 * 根据日期范围查询打款记录
	 */
	public function paymentInfoQueryData(){
		if (IS_POST) {
			$params = array(
				"date" => I("post.date"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new YeWuYuanService();
			$this->ajaxReturn($ss->paymentInfoQueryData($params));
		}
	}



}
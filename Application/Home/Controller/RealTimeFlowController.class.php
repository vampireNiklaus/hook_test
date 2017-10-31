<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Home\Service\ExportService;
use Home\Service\RealTimeFlowService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\DailySellService;
use Home\Common\FIdConst;
use Home\Service\BizlogService;

/**
 * 销售Controller
 *
 * @author Baoyu Li
 *        
 */
class RealTimeFlowController extends PSIBaseController {

	/**
	 * 实时流向 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::SELL_REAL_TIME_FLOW)) {
			$this->initVar();
			
			$this->assign("title", "实时流向");
			$this->assign("pAddDailySellItem", $us->hasPermission(FIdConst::DAILY_SELL_ITEM_REAL_ITEMS) ? 1 : 0);
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/RealTimeFlow/index");
		}
	}
	/**
	 * 获得实时流向列表
	 * @author huxinlu
	 */
	public function realTimeList() {
		if (IS_POST) {
			$params = array(
				"sell_date_from" => I("post.sell_date_from"),
				"sell_date_to" => I("post.sell_date_to"),
				"drug_name" => I("post.drug_name"),
				"hospital_name" => I("post.hospital_name"),
				"employee_name" => I("post.employee_name"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);

			$gs = new RealTimeFlowService();
			$this->ajaxReturn($gs->realTimeList($params));
		}
	}
}

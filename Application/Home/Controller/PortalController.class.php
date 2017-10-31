<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\PortalService;

/**
 * Portal Controller
 *
 * @author Baoyu Li
 *        
 */
class PortalController extends Controller {




	/**
	 * 库存，资金，销售各个看板统一数据
	 */
	public function getAllPortalData() {
		if (IS_POST) {
			$ps = new PortalService();
			
			$this->ajaxReturn($ps->getAllPortalData());
		}
	}


	/**
	 * 库存，资金，销售各个看板统一数据
	 */
	public function getAllAlarmData() {
		if (IS_POST) {
			$ps = new PortalService();

			$this->ajaxReturn($ps->getAllAlarmData());
		}
	}



	/**
	 * 库存看板
	 */
	public function inventoryPortal() {
		if (IS_POST) {
			$ps = new PortalService();

			$this->ajaxReturn($ps->inventoryPortal());
		}
	}

	/**
	 * 销售看板
	 */
	public function salePortal() {
		if (IS_POST) {
			$ps = new PortalService();
			
			$this->ajaxReturn($ps->salePortal());
		}
	}

	/**
	 * 采购看板
	 */
	public function purchasePortal() {
		if (IS_POST) {
			$ps = new PortalService();
			
			$this->ajaxReturn($ps->purchasePortal());
		}
	}

	/**
	 * 资金看板
	 */
	public function moneyPortal() {
		if (IS_POST) {
			$ps = new PortalService();
			
			$this->ajaxReturn($ps->moneyPortal());
		}
	}
}

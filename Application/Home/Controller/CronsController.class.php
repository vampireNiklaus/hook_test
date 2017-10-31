<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\CronsService;
use Home\Common\FIdConst;

/**
 * 首页Controller
 *
 * @author Baoyu Li
 *        
 */
class CronsController extends PSIBaseController {

	public function update_drug_daily_stock() {
		$cs = new CronsService();
		return $this->ajaxReturn($cs->update_drug_daily_stock());
	}

}
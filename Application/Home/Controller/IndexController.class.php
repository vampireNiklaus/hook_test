<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Common\FIdConst;


/**
 * 首页Controller
 *
 * @author Baoyu Li
 *        
 */
class IndexController extends PSIBaseController {

	/**
	 * 首页
	 */
	public function index() {
		$us = new UserService();
		if(session('loginType')!=null){
			$loginType = session('loginType');
		}else{
			$loginType = FIdConst::LOGIN_TYPE_STAFF;
		}
		if($loginType==FIdConst::LOGIN_TYPE_STAFF){
			if ($us->hasPermission()) {
				$this->initVar();
				$this->assign("title", "首页");
				$this->assign("pSale", $us->hasPermission(FIdConst::PORTAL_SALE) ? 1 : 0);
				$this->assign("pInventory", $us->hasPermission(FIdConst::PORTAL_STOCK_ALARM) ? 1 : 0);
				$this->assign("pStockAlarm", $us->hasPermission(FIdConst::PORTAL_STOCK_ALARM) ? 1 : 0);
				$this->assign("pPurchase", $us->hasPermission(FIdConst::PORTAL_PURCHASE) ? 1 : 0);
				$this->assign("pMoney", $us->hasPermission(FIdConst::PORTAL_MONEY) ? 1 : 0);
				$this->assign("pBusinessInfoPortal", $us->hasPermission(FIdConst::PORTAL_BUSINESS_INFO) ? 1 : 0);
				$this->assign("pAlarmInfoPortal", $us->hasPermission(FIdConst::PORTAL_ALARM_INFO) ? 1 : 0);
				$this->assign("pLoginType", FIdConst::LOGIN_TYPE_STAFF);
				$this->display();
			} else {
				$this->gotoLoginPage();
			}
		}elseif($loginType == FIdConst::LOGIN_TYPE_EMPLOYEE){
			$this->initVar4Employee();
			redirect(__ROOT__ . "/Home/YeWuYuan/sellReport");
//			$this->assign("title", "首页");
//			$this->assign("pSale", 1);
//			$this->assign("pBusiness", 1);
//			$this->assign("pMoney", 1);
//			$this->assign("pLoginType", FIdConst::LOGIN_TYPE_EMPLOYEE);
//			$this->display();
		}
	}

	public function crons() {

	}

	public function random() {
		$arr=range(1,32);
		shuffle($arr);
		foreach($arr as $values)
		{
			echo $values." ";
		}
	}

}
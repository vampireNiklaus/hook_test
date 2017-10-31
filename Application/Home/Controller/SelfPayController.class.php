<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\SelfPayService;
use Home\Common\FIdConst;

/**
 * 自销付款单Controller
 *
 * @author RCG
 *        
 */
class SelfPayController extends PSIBaseController {


	/**
	 * 付款单 - 主页面
	 */
	public function index() {
		$us = new UserService();

		if ($us->hasPermission(FIdConst::SELF_PAY)) {
			$this->initVar();
			$this->assign("title", "过票 - 自销付款单");
			
			$this->assign("pEditSelfPayBill",$us->hasPermission(FIdConst::SELF_PAY_BILL_EDIT) ? 1 : 0);
			$this->assign("pDeleteSelfPayBill",$us->hasPermission(FIdConst::SELF_PAY_BILL_DELETE) ? 1 : 0);
			$this->assign("pImportSelfPayBill", $us->hasPermission(FIdConst::SELF_PAY_BILL_IMPORT) ? 1 : 0);
			$this->assign("pExportSelfPayBill", $us->hasPermission(FIdConst::SELF_PAY_BILL_EXPORT) ? 1 : 0);
			$this->assign("pVerifySelfPayBill", $us->hasPermission(FIdConst::SELF_PAY_BILL_VERIFY) ? 1 : 0);
			$this->assign("pRevertVerifySelfPayBill", $us->hasPermission(FIdConst::SELF_PAY_BILL_REVERT_VERIFY) ? 1 : 0);
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/SelfPay/index");
		}
	}

	/**
 * 获得未编辑付款单列表
 */
	public function listSelfPayUnEdit() {
		if (IS_POST) {
			$ps = new SelfPayService();
			$params = array(
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$this->ajaxReturn($ps->listSelfPayUnEdit($params));
		}
	}

	/**
	 * 获得已编辑付款单列表
	 */
	public function listSelfPayEdit() {
		if (IS_POST) {
			$ps = new SelfPayService();
			$params = array(
				"status" => I("post.status"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$this->ajaxReturn($ps->listSelfPayEdit($params));
		}
	}

	/**
	 * 新增或编辑采购入库单
	 */
	public function editSelfPay() {
		if (IS_POST) {
			$params['id'] = I("post.id");
			$params['pay_1st_account_id'] = I("post.pay_1st_account_id");
			$params['pay_1st_amount'] = I("post.pay_1st_amount");
			$params['pay_2nd_account_id'] = I("post.pay_2nd_account_id");
			$params['pay_2nd_amount'] = I("post.pay_2nd_amount");
			$params['fund_date'] = I("post.fund_date");
			$params['note'] = I("post.note");
			$isParent=I('post.isParent')==1?true:false;
			$isFund=I('post.isFund')==1?true:false;
			$ps = new SelfPayService();
			$this->ajaxReturn($ps->editSelfPay($params,$isParent,$isFund));
		}
	}

	/**
	 * 审核自销付款单
	 */
	public function selfPayStatus(){
		if (IS_POST) {
			$params = array(
				"id" => I("post.id"),
				"type" => I("post.type")
			);

			$ps = new SelfPayService();
			$this->ajaxReturn($ps->selfPayStatus($params));
		}
	}

	/**
	 * 删除付款单
	 */
	public function deleteSelfPay() {
		if (IS_POST) {
			$id = I("post.id");
			$ps = new SelfPayService();
			$this->ajaxReturn($ps->deleteSelfPay($id));
		}
	}


}
<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\SelfPayByTwoService;
use Home\Common\FIdConst;

/**
 * 自销付款单Controller
 *
 * @author RCG
 *        
 */
class SelfPayByTwoController extends PSIBaseController {


	/**
	 * 付款单 - 主页面
	 */
	public function index() {
		$us = new UserService();

		if ($us->hasPermission(FIdConst::SELF_PAY_BY_TWO)) {
			$this->initVar();
			$this->assign("title", "两票制 - 自销付款单");
			
			$this->assign("pEditSelfPayByTwoBill",$us->hasPermission(FIdConst::SELF_PAY_BY_TWO_BILL_EDIT) ? 1 : 0);
			$this->assign("pDeleteSelfPayByTwoBill",$us->hasPermission(FIdConst::SELF_PAY_BY_TWO_BILL_DELETE) ? 1 : 0);
			$this->assign("pImportSelfPayByTwoBill", $us->hasPermission(FIdConst::SELF_PAY_BY_TWO_BILL_IMPORT) ? 1 : 0);
			$this->assign("pExportSelfPayByTwoBill", $us->hasPermission(FIdConst::SELF_PAY_BY_TWO_BILL_EXPORT) ? 1 : 0);
			$this->assign("pVerifySelfPayByTwoBill", $us->hasPermission(FIdConst::SELF_PAY_BY_TWO_BILL_VERIFY) ? 1 : 0);
			$this->assign("pRevertVerifySelfPayByTwoBill", $us->hasPermission(FIdConst::SELF_PAY_BY_TWO_BILL_REVERT_VERIFY) ? 1 : 0);
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/SelfPayByTwo/index");
		}
	}

	/**
 * 获得未编辑付款单列表
 */
	public function listSelfPayByTwoUnEdit() {
		if (IS_POST) {
			$ps = new SelfPayByTwoService();
			$params = array(
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$this->ajaxReturn($ps->listSelfPayByTwoUnEdit($params));
		}
	}

	/**
	 * 获得已编辑付款单列表
	 */
	public function listSelfPayByTwoEdit() {
		if (IS_POST) {
			$ps = new SelfPayByTwoService();
			$params = array(
				"status" => I("post.status"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$this->ajaxReturn($ps->listSelfPayByTwoEdit($params));
		}
	}

	/**
	 * 新增或编辑采购入库单
	 */
	public function editSelfPayByTwo() {
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
			$ps = new SelfPayByTwoService();
			$this->ajaxReturn($ps->editSelfPayByTwo($params,$isParent,$isFund));
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

			$ps = new SelfPayByTwoService();
			$this->ajaxReturn($ps->selfPayStatus($params));
		}
	}

	/**
	 * 删除付款单
	 */
	public function deleteSelfPayByTwo() {
		if (IS_POST) {
			$id = I("post.id");
			$ps = new SelfPayByTwoService();
			$this->ajaxReturn($ps->deleteSelfPayByTwo($id));
		}
	}


}
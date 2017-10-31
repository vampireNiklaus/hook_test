<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\BankCardService;
use Home\Common\FIdConst;

/**
 * 资金账户档案Controller
 *
 * @author Baoyu Li
 *        
 */
class BankCardController extends PSIBaseController {

	/**
	 * 资金账户档案 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::SUPPLIER)) {
			$this->initVar();
			
			$this->assign("title", "资金账户档案");
			
			$this->assign("pAddCategory", 
					$us->hasPermission(FIdConst::SUPPLIER_CATEGORY_ADD) ? 1 : 0);
			$this->assign("pEditCategory", 
					$us->hasPermission(FIdConst::SUPPLIER_CATEGORY_EDIT) ? 1 : 0);
			$this->assign("pDeleteCategory", 
					$us->hasPermission(FIdConst::SUPPLIER_CATEGORY_DELETE) ? 1 : 0);
			$this->assign("pAddBankCard", $us->hasPermission(FIdConst::SUPPLIER_ADD) ? 1 : 0);
			$this->assign("pEditBankCard", $us->hasPermission(FIdConst::SUPPLIER_EDIT) ? 1 : 0);
			$this->assign("pDeleteBankCard", $us->hasPermission(FIdConst::SUPPLIER_DELETE) ? 1 : 0);
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/BankCard/index");
		}
	}


	/**
	 * 资金账户列表
	 */
	public function bankCardList() {
		if (IS_POST) {
			$params = array(
				"account_name" => I("post.account_name"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new BankCardService();
			$this->ajaxReturn($ss->bankCardList($params));
		}
	}

	/**
	 * 新建或编辑资金账户
	 */
	public function editBankCard() {
		if (IS_POST) {
			$us = new UserService();
			if (I("post.id")) {
				// 编辑资金账户
				if (! $us->hasPermission(FIdConst::SUPPLIER_EDIT)) {
					$this->ajaxReturn($this->noPermission("编辑资金账户"));
					return;
				}
			} else {
				// 新增资金账户
				if (! $us->hasPermission(FIdConst::SUPPLIER_ADD)) {
					$this->ajaxReturn($this->noPermission("新增资金账户"));
					return;
				}
			}

			$params = array(
				"id" => I("post.id"),
				"account_name" => I("post.account_name"),
				"account_number" => I("post.account_number"),
				"bank_name" => I("post.bank_name"),
				"capital_type" => I("post.capital_type"),
				"is_stopped" => I("post.is_stopped"),
				"now_amount" => I("post.now_amount")
			);
			$ss = new BankCardService();
			$this->ajaxReturn($ss->editBankCard($params));
		}
	}

	/**
	 * 删除资金账户
	 */
	public function deleteBankCard() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::SUPPLIER_DELETE)) {
				$this->ajaxReturn($this->noPermission("删除资金账户"));
				return;
			}

			$params = array(
				"id" => I("post.id")
			);
			$ss = new BankCardService();
			$this->ajaxReturn($ss->deleteBankCard($params));
		}
	}

}

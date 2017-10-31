<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\DeliverAccountService;
use Home\Common\FIdConst;

/**
 * 配送公司账号信息Controller
 *
 * @author wanbing.shi
 *        
 */
class DeliverAccountController extends PSIBaseController {

	/**
	 * 配送公司档案 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::DELIVER_ACCOUNT_INFO)) {
			$this->initVar();
			
			$this->assign("title", "配送公司账号信息");
			$this->assign("pAddDeliverAccount",
				$us->hasPermission(FIdConst::DELIVER_ACCOUNT_ADD) ? 1 : 0);
			$this->assign("pEditDeliverAccount",
				$us->hasPermission(FIdConst::DELIVER_ACCOUNT_EDIT) ? 1 : 0);
			$this->assign("pDeleteDeliverAccount",
				$us->hasPermission(FIdConst::DELIVER_ACCOUNT_DELETE) ? 1 : 0);
			$this->assign("pDisableDeliverAccount",
                $us->hasPermission(FIdConst::DELIVER_ACCOUNT_DISABLE) ? 1 : 0);
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/DeliverAccount/index");
		}
	}


	/**
	 * 配送公司档案列表
	 */
	public function deliverAccountList() {
		if (IS_POST) {
			$params = array(
				"deliver_name" => I("post.name"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new DeliverAccountService();
			$this->ajaxReturn($ss->deliverAccountList($params));
		}
	}

	/**
	 * 新建或编辑配送公司档案
	 */
	public function editDeliverAccount() {
		if (IS_POST) {
			$us = new UserService();
			if (I("post.id")) {
				// 编辑账号
				if (! $us->hasPermission(FIdConst::DELIVER_ACCOUNT_EDIT)) {
					$this->ajaxReturn($this->noPermission("编辑账号"));
				}
			} else {
				// 新增账号
				if (! $us->hasPermission(FIdConst::DELIVER_ACCOUNT_ADD)) {
					$this->ajaxReturn($this->noPermission("新增账号"));
				}
			}

			$params = array(
				"id" => I("post.id"),
				"deliver_id" => I("post.deliver_id"),
				"deliver_name" => I("post.deliver_name"),
                "url" => I("post.url"),
                "username" => I("post.username"),
                "password" => I("post.password"),
                "disabled" => I("post.disabled")
			);
			$ss = new DeliverAccountService();
			$this->ajaxReturn($ss->editDeliverAccount($params));
		}
	}

	/**
	 * 删除配送公司档案
	 */
	public function deleteDeliverAccount() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::DELIVER_ACCOUNT_DELETE)) {
				$this->ajaxReturn($this->noPermission("删除配送公司账号"));
				return;
			}

			$params = array(
				"id" => I("post.id")
			);
			$ss = new DeliverAccountService();
			$this->ajaxReturn($ss->deleteDeliverAccount($params));
		}
	}

	/**
	 * 配送公司自定义字段查询
	 */
	public function queryData() {
		if (IS_POST) {
			$params = array(
				"queryKey" => I("post.queryKey"),
			);
//			if(I("post.queryConditionType")){
//				$params['queryConditionType'] = I("queryConditionType");
//				$params['queryConditionKey'] = I("queryConditionKey");
//			}
			$cs = new DeliverService();
			$this->ajaxReturn($cs->queryData($params));
		}
	}

}

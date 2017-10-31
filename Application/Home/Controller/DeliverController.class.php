<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\DeliverService;
use Home\Common\FIdConst;

/**
 * 配送公司档案Controller
 *
 * @author Baoyu Li
 *        
 */
class DeliverController extends PSIBaseController {

	/**
	 * 配送公司档案 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::DELIVER_BASIC_INFO)) {
			$this->initVar();
			
			$this->assign("title", "配送公司档案");
			$this->assign("pAddDeliver",
				$us->hasPermission(FIdConst::DELIVER_ADD) ? 1 : 0);
			$this->assign("pEditDeliver",
				$us->hasPermission(FIdConst::DELIVER_EDIT) ? 1 : 0);
			$this->assign("pDeleteDeliver",
				$us->hasPermission(FIdConst::DELIVER_DELETE) ? 1 : 0);
			$this->assign("pImportDeliver", $us->hasPermission(FIdConst::DELIVER_IMPORT) ? 1 : 0);
			$this->assign("pExportDeliver", $us->hasPermission(FIdConst::DELIVER_EXPORT) ? 1 : 0);
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Deliver/index");
		}
	}


	/**
	 * 配送公司档案列表
	 */
	public function deliverList() {
		if (IS_POST) {
			$params = array(
				"name" => I("post.name"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$ss = new DeliverService();
			$this->ajaxReturn($ss->deliverList($params));
		}
	}

	/**
	 * 新建或编辑配送公司档案
	 */
	public function editDeliver() {
		if (IS_POST) {
			$us = new UserService();
			if (I("post.id")) {
				// 编辑配送公司档案
				if (! $us->hasPermission(FIdConst::SUPPLIER_EDIT)) {
					$this->ajaxReturn($this->noPermission("编辑配送公司档案"));
					return;
				}
			} else {
				// 新增配送公司档案
				if (! $us->hasPermission(FIdConst::SUPPLIER_ADD)) {
					$this->ajaxReturn($this->noPermission("新增配送公司档案"));
					return;
				}
			}

			$params = array(
				"id" => I("post.id"),
				"code" => I("post.code"),
				"name" => I("post.name"),
				"manager_name" => I("post.manager_name"),
				"manager_phone" => I("post.manager_phone"),
				"manager_fax" => I("post.manager_fax"),
				"zhiguanke_name" => I("post.zhiguanke_name"),
				"zhiguanke_phone" => I("post.zhiguanke_phone"),
				"zhiguanke_fax" => I("post.zhiguanke_fax"),
				"accountant_name" => I("post.accountant_name"),
				"accountant_qq" => I("post.accountant_qq"),
				"accountant_phone" => I("post.accountant_phone"),
				"company_email" => I("post.company_email"),
				"company_bankaccount" => I("post.company_bankaccount"),
				"company_address" => I("post.company_address"),
				"note" => I("post.note"),
				"company_postcode" => I("post.company_postcode"),
				"peisong_address" => 	I("post.peisong_address"),
				"business_license_code"=> I("business_license_code"),
				"business_license_expire_time"=> I("business_license_expire_time"),
				"gmp_code"=> I("gmp_code"),
				"gmp_expire_time"=> I("gmp_expire_time"),
				"qs_code"=> I("qs_code"),
				"qs_expire_time"=> I("qs_expire_time"),
				"client_code"=> I("client_code"),
				"client_expire_time"=> I("client_expire_time"),
				"creator_id"=> I("creator_id"),
				"create_time"=> I("create_time"),
			);
			$ss = new DeliverService();
			$this->ajaxReturn($ss->editDeliver($params));
		}
	}

	/**
	 * 删除配送公司档案
	 */
	public function deleteDeliver() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::SUPPLIER_DELETE)) {
				$this->ajaxReturn($this->noPermission("删除配送公司档案"));
				return;
			}

			$params = array(
				"id" => I("post.id")
			);
			$ss = new DeliverService();
			$this->ajaxReturn($ss->deleteDeliver($params));
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

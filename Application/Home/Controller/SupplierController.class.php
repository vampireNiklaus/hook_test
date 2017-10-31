<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\SupplierService;
use Home\Common\FIdConst;

/**
 * 供应商档案Controller
 *
 * @author Baoyu Li
 *        
 */
class SupplierController extends PSIBaseController {

	/**
	 * 供应商档案 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::SUPPLIER)) {
			$this->initVar();
			
			$this->assign("title", "供应商档案");
			$this->assign("pAddSupplier",
				$us->hasPermission(FIdConst::SUPPLIER_ADD) ? 1 : 0);
			$this->assign("pEditSupplier",
				$us->hasPermission(FIdConst::SUPPLIER_EDIT) ? 1 : 0);
			$this->assign("pDeleteSupplier",
				$us->hasPermission(FIdConst::SUPPLIER_DELETE) ? 1 : 0);
			$this->assign("pImportSupplier", $us->hasPermission(FIdConst::SUPPLIER_IMPORT) ? 1 : 0);
			$this->assign("pExportSupplier", $us->hasPermission(FIdConst::SUPPLIER_EXPORT) ? 1 : 0);
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Supplier/index");
		}
	}


	/**
	 * 供应商档案列表
	 */
	public function supplierList() {
		if (IS_POST) {
			$params = array(
					"name" => I("post.name"),
					"page" => I("post.page"),
					"start" => I("post.start"),
					"limit" => I("post.limit")
			);
			$ss = new SupplierService();
			$this->ajaxReturn($ss->supplierList($params));
		}
	}

	/**
	 * 新建或编辑供应商档案
	 */
	public function editSupplier() {
		if (IS_POST) {
			$us = new UserService();
			if (I("post.id")) {
				// 编辑供应商档案
				if (! $us->hasPermission(FIdConst::SUPPLIER_EDIT)) {
					$this->ajaxReturn($this->noPermission("编辑供应商档案"));
					return;
				}
			} else {
				// 新增供应商档案
				if (! $us->hasPermission(FIdConst::SUPPLIER_ADD)) {
					$this->ajaxReturn($this->noPermission("新增供应商档案"));
					return;
				}
			}
			
			$params = array(
					"id" => I("post.id"),
					"code" => I("post.code"),
					"name" => I("post.name"),
					"manager_name" => I("post.manager_name"),
					"manager_phone" => I("post.manager_phone"),
					"manager_mobile" => I("post.manager_mobile"),
					"neiqin_name" => I("post.neiqin_name"),
					"neiqin_phone" => I("post.neiqin_phone"),
					"neiqin_qq" => I("post.neiqin_qq"),
					"accountant_name" => I("post.accountant_name"),
					"accountant_qq" => I("post.accountant_qq"),
					"accountant_phone" => I("post.accountant_phone"),
					"company_email" => I("post.company_email"),
					"company_bankaccount" => I("post.company_bankaccount"),
					"company_address" => I("post.company_address"),
					"note" => I("post.note"),
					"company_postcode" => I("post.company_postcode"),
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
			$ss = new SupplierService();
			$this->ajaxReturn($ss->editSupplier($params));
		}
	}

	/**
	 * 删除供应商档案
	 */
	public function deleteSupplier() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::SUPPLIER_DELETE)) {
				$this->ajaxReturn($this->noPermission("删除供应商档案"));
				return;
			}
			
			$params = array(
					"id" => I("post.id")
			);
			$ss = new SupplierService();
			$this->ajaxReturn($ss->deleteSupplier($params));
		}
	}

	/**
	 * 供应商自定义字段查询
	 */
	public function queryData() {
		if (IS_POST) {
			$params = array(
				"queryKey" => I("post.queryKey")
			);
			$cs = new SupplierService();
			$this->ajaxReturn($cs->queryData($params));
		}
	}

}

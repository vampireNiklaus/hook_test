<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\BillingTypesService;
use Home\Common\FIdConst;
use Home\Service\BizlogService;

/**
 * 销售Controller
 *
 * @author Baoyu Li
 *        
 */
class BillingTypesController extends PSIBaseController {

	/**
	 * 销售 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::BILLING_TYPES)) {
			$this->initVar();
			
			$this->assign("title", "收支科目与结算方式");
			
			$this->assign("pAddBillTypes",
					$us->hasPermission(FIdConst::BILLING_TYPES_ITEM_ADD) ? 1 : 0);
			$this->assign("pEditBillTypes",
					$us->hasPermission(FIdConst::BILLING_TYPES_ITEM_EDIT) ? 1 : 0);
			$this->assign("pDeleteBillTypes",
					$us->hasPermission(FIdConst::BILLING_TYPES_ITEM_DELETE) ? 1 : 0);
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/BillingTypes/index");
		}
	}


	/**
	 * 获得销售列表
	 */
	public function listTypes() {
		if (IS_POST) {
			$params = array(
				"region_id" => I("post.region_id"),
				"types_name" => I("post.types_name"),
				"types_type" => I("post.types_type"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$gs = new BillingTypesService();
			$this->ajaxReturn($gs->typesList($params));
		}
	}

	/**
	 * 新增或编辑销售
	 */
	public function editType() {
		if (IS_POST) {
			$us = new UserService();
            $bls = new BizlogService();
			if (I("post.id")) {
				// 编辑销售
				if (! $us->hasPermission(FIdConst::BILLING_TYPES_ITEM_EDIT)) {
					$this->ajaxReturn($this->noPermission("编辑销售"));
					return;
				}
			} else {
				// 新增销售
				if (! $us->hasPermission(FIdConst::BILLING_TYPES_ITEM_ADD)) {
					$this->ajaxReturn($this->noPermission("新增销售"));
					return;
				}
			}
            $params = array(
                "type" => I("post.type"),
                "name" => I("post.name")
            );
            if(I("post.id")){
                $params['id'] = I("post.id");
                $bls->insertBizlog("新增类别:".$params["id"],"资金管理-收支科目与结算方式");
            }
			$gs = new BillingTypesService();
            $result = $gs->editType($params);
            if (I("post.id")) {
                $bls->insertBizlog("编辑类别:".$result["id"],"资金管理-收支科目与结算方式");
            }
			$this->ajaxReturn($result);
		}
	}

	/**
	 * 删除销售
	 */
	public function deleteType() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::BILLING_TYPES_ITEM_DELETE)) {
				$this->ajaxReturn($this->noPermission("删除销售"));
				return;
			}

			$params = array(
				"id" => I("post.id")
			);
			$gs = new BillingTypesService();
			$result = $gs->deleteType($params);
            $bls = new BizlogService();
            $bls->insertBizlog("删除类别:".$params["id"],"资金管理-收支科目与结算方式");
			$this->ajaxReturn($result);
		}
	}

	/**
	 * 销售自定义字段，查询数据
	 */
	public function queryData() {
		if (IS_POST) {
			$queryKey = I("post.queryKey");
			$gs = new BillingTypesService();
			$this->ajaxReturn($gs->queryData($queryKey));
		}
	}

}

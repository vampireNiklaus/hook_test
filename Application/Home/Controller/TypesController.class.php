<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\TypesService;
use Home\Common\FIdConst;

/**
 * 销售Controller
 *
 * @author Baoyu Li
 *        
 */
class TypesController extends PSIBaseController {

	/**
	 * 销售 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::CUSTOMER)) {
			$this->initVar();
			
			$this->assign("title", "业务员资料");
			
			$this->assign("pAddCategory", 
					$us->hasPermission(FIdConst::CUSTOMER_CATEGORY_ADD) ? 1 : 0);
			$this->assign("pEditCategory", 
					$us->hasPermission(FIdConst::CUSTOMER_CATEGORY_EDIT) ? 1 : 0);
			$this->assign("pDeleteCategory", 
					$us->hasPermission(FIdConst::CUSTOMER_CATEGORY_DELETE) ? 1 : 0);
			$this->assign("pAddCustomer", $us->hasPermission(FIdConst::CUSTOMER_ADD) ? 1 : 0);
			$this->assign("pEditCustomer", $us->hasPermission(FIdConst::CUSTOMER_EDIT) ? 1 : 0);
			$this->assign("pDeleteCustomer", $us->hasPermission(FIdConst::CUSTOMER_DELETE) ? 1 : 0);
			$this->assign("pImportCustomer", $us->hasPermission(FIdConst::CUSTOMER_IMPORT) ? 1 : 0);
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Types/index");
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
			$gs = new TypesService();
			$this->ajaxReturn($gs->typesList($params));
		}
	}

	/**
	 * 新增或编辑销售
	 */
	public function editType() {
		if (IS_POST) {
			$us = new UserService();
			if (I("post.id")) {
				// 编辑销售
				if (! $us->hasPermission(FIdConst::GOODS_EDIT)) {
					$this->ajaxReturn($this->noPermission("编辑销售"));
					return;
				}
			} else {
				// 新增销售
				if (! $us->hasPermission(FIdConst::GOODS_ADD)) {
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
			}
			$gs = new TypesService();
			$this->ajaxReturn($gs->editType($params));
		}
	}

	/**
	 * 删除销售
	 */
	public function deleteType() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::GOODS_DELETE)) {
				$this->ajaxReturn($this->noPermission("删除销售"));
				return;
			}

			$params = array(
				"id" => I("post.id")
			);
			$gs = new TypesService();
			$this->ajaxReturn($gs->deleteType($params));
		}
	}

	/**
	 * 销售自定义字段，查询数据
	 */
	public function queryData() {
		if (IS_POST) {
			$queryKey = I("post.queryKey");
			$gs = new TypesService();
			$this->ajaxReturn($gs->queryData($queryKey));
		}
	}

}

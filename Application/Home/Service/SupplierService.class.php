<?php

namespace Home\Service;

use Home\Service\IdGenService;
use Home\Service\BizlogService;
use Home\Common\FIdConst;

/**
 * 供应商档案Service
 *
 * @author Baoyu Li
 */
class SupplierService extends PSIBaseService {
	private $LOG_CATEGORY = "基础数据-供应商档案";

	/**
	 * 某个分类下的供应商档案列表
	 */
	public function supplierList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];

		unset($params['page']);
		unset($params['start']);
		unset($params['limit']);

		$supplier_db = M("info_supplier");
		import("ORG.Util.Page");
		$whereStr = $this->likeSearch($params);
		$all_data = $supplier_db->where($whereStr)->page($page,$limit)->select();
		
		return array(
				"supplierList" => $all_data,
				"totalCount" => count($supplier_db->select())
		);
	}


	/**
	 * 新建或编辑供应商档案
	 */
	public function editSupplier($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

        $bs = new BizlogService();

		$supplier_db = M("info_supplier");
		$queryString  = " name='".$params['name']."'";

		if($params['id']){
			//编辑
			if(count($supplier_db->where($queryString." and id<>".$params['id'])->select())>0){
				return $this->bad("该名称的供应商已经存在，请更换其他名称");
			}
			$supplier_db->save($params);
            $log = "修改配送公司{$params}";
        }else{
			//新建
			if(count($supplier_db->where($queryString)->select())>0){
				return $this->bad("该名称的供应商已经存在，请更换其他名称");
			}
			$params["creator_id"] = session("loginUserId");
			$params['create_time'] = time();
			$params['id'] = $supplier_db->add($params);
            $log = "新建配送公司{$params}";
        }
        $bs->insertBizlog($log, $this->LOG_CATEGORY);
        return $this->ok($params['id']);
	}

	/**
	 * 删除供应商
	 */
	public function deleteSupplier($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
		if($params['id']){
			$db = M("info_supplier");
			$data = $db->where($params)->select();
			if(!$data){
				return $this->bad("要删除的业务员信息不存在");
			}
			$result = $db->where($params)->delete();
			if($result){
				$log = "删除供应商信息： 业务员姓名：{$data['name']}";
				$bs = new BizlogService();
				$bs->insertBizlog($log, $this->LOG_CATEGORY);
			}
			return $this->ok();
		}
	}

	/**
	 * 供应商字段， 查询数据
	 */
	public function queryData($queryKey) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		if ($queryKey == null) {
			$queryKey = "";
		}

		$sql = "select *
				from info_supplier
				where (name like '%".$queryKey["queryKey"]."%' or code like '%".$queryKey["queryKey"]."%') ";
//		$queryParams = array();
//		$key = "%{$queryKey}%";
//		$queryParams[] = $key;
//		$queryParams[] = $key;
//		$queryParams[] = $key;
//
//		$ds = new DataOrgService();
//		$rs = $ds->buildSQL("1004-01", "info_employee");
//		if ($rs) {
//			$sql .= " and " . $rs[0];
//			$queryParams = array_merge($queryParams, $rs[1]);
//		}

//		$sql .= " order by id
//				limit 20";
		return M()->query($sql);
	}

}
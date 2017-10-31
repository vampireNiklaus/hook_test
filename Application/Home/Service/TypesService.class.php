<?php

namespace Home\Service;

use Home\Common\FIdConst;

/**
 * 业务员Service
 *
 * @author Baoyu Li
 */
class TypesService extends PSIBaseService {
	private $LOG_CATEGORY_HOSPITAL = "基础数据-资金类别条目";
	private $LOG_HOSPITAL_TYPE = "基础数据-资金类别条目";

	/**
	 * 返回所有资金类别条目
	 */
	public function typesList() {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$db = M("type_billing");
		$data = $db->select();


		return array(
			"typesList"=>$data,
			"totalCount"=>count($data)
		);
	}

	/**
	 * 新建或者编辑资金类别条目
	 */
	public function editType($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$id = $params["id"];
		$name = $params["name"];

		$db = M("type_billing");
		$db->startTrans();

		$log = null;

		if ($id) {
			// 编辑
			// 检查资金类别条目是否存在
			$db->save($params);
		} else {
			// 新增
			// 检查资金类别条目是否存在
			$params['id'] = $db->add($params);
		}

		// 记录业务日志
		if ($log) {
			$bs = new BizlogService();
			$bs->insertBizlog($log, $this->LOG_CATEGORY_UNIT);
		}

		$db->commit();

		return $this->ok($params['id']);
	}

	/**
	 * 删除资金类别条目
	 */
	public function deleteType($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$id = $params["id"];

		$db = M("type_billing");
		$db->startTrans();

		$data = $db->where($params)->select();
		if (!count($data)>0) {
			$db->rollback();
			return $this->bad("要删除的资金类别条目不存在");
		}
		$db->where($params)->delete();
		$db->commit();
		return $this->ok();
	}


	/**
	 * 资金类别条目字段，查询数据
	 */
	public function queryData($queryKey) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		if ($queryKey == null) {
			$queryKey = "";
		}
		if ($queryKey == null) {
			$queryKey = "";
		}

		$sql = "select *
				from type_billing
				where (type like '%".$queryKey["queryKey"]."%' or name like '%".$queryKey["queryKey"]."%') ";
		$sql .= " order by code ";
		return M()->query($sql);
	}

}
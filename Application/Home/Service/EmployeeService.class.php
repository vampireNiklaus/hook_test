<?php

namespace Home\Service;

use Home\Common\FIdConst;

/**
 * 业务员Service
 *
 * @author Baoyu Li
 */
class EmployeeService extends PSIBaseService {
	private $LOG_CATEGORY = "基本信息-业务员信息";

	public function editEmployee($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		$ps = new PinyinService();
		$py = $ps->toPY($params['name']);
		$params['pym'] = $py;
		$employee_db = D('info_employee');
		$queryString = " name='".$params['name']."'";
		if($params['id']){
			if(count($employee_db->where($queryString." and id<>".$params['id'])->select())>0){
				return $this->bad("该名称的业务员已经存在，请更换其他名称");
			}
			$employee_db->save($params);
		}else{
			if(count($employee_db->where($queryString)->select())>0){
				return $this->bad("该名称的业务员已经存在，请更换其他名称");
			}
			$params['id'] = $employee_db->add($params);
		}
		return $this->ok($params['id']);
	}
	
	public function listEmployee($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		$employee_db = M('info_employee');
		$page = $params['page'];
		$start = $params['start'];
		$limit = $params['limit'];

		unset($params['page']);
		unset($params['start']);
		unset($params['limit']);

		import("ORG.Util.Page");
		$whereStr = $this->likeSearch($params);

		$user = M('t_user');
		$all_hospital_view = $user->where('id = "'.session('loginUserId').'"')->find();
		if ($all_hospital_view['all_hospital_view'] != 1) {
			$employeesIDs = $this->employeeFilter();
			if (session('loginUserId') != FIdConst::ADMIN_USER_ID) {
				if (empty($employeesIDs)) {
					$all_data = [];
					$count = 0;
				} else {
					$whereStr = $whereStr." and id in (".$employeesIDs.")";
					$all_data = $employee_db->where($whereStr)->page($page,$limit)->select();
					$count = count($employee_db->where($whereStr)->select());
				}
			} else {
				$all_data = $employee_db->where($whereStr)->page($page,$limit)->select();
				$count = count($employee_db->where($whereStr)->select());
			}
		} else {
			$all_data = $employee_db->where($whereStr)->page($page,$limit)->select();
			$count = count($employee_db->where($whereStr)->select());
		}
		return array(
			"employeeList" => $all_data,
			"totalCount" => $count,
		);
	}

	public function deleteEmployee($params){
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$db = M("info_employee");
		$data = $db->where($params)->select();
		if(!$data){
			return $this->bad("要删除的业务员信息不存在");
		}
		$result = $db->where($params)->delete();
		if($result){
			$log = "删除业务员信息： 业务员姓名：{$data['name']}";
			$bs = new BizlogService();
			$bs->insertBizlog($log, $this->LOG_CATEGORY);
		}
		return $this->ok();
	}

	/**
	 * 业务员字段， 查询数据
	 */
	public function queryData($queryKey) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		if ($queryKey == null) {
			$queryKey = "";
		}

		$sql = "select *
				from info_employee
				where (code like '%".$queryKey["queryKey"]."%' or name like '%".$queryKey["queryKey"]."%' or pym like '%".$queryKey["queryKey"]."%') ";
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

//		$sql .= " order by code
//				limit 20";
		return M()->query($sql);
	}

}
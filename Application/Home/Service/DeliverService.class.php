<?php

namespace Home\Service;

use Home\Service\IdGenService;
use Home\Service\BizlogService;
use Home\Common\FIdConst;

/**
 * 配送公司档案Service
 *
 * @author Baoyu Li
 */
class DeliverService extends PSIBaseService {
	private $LOG_CATEGORY = "基础数据-配送公司档案";

	/**
	 * 某个分类下的配送公司档案列表
	 */
	public function deliverList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];

		unset($params['page']);
		unset($params['start']);
		unset($params['limit']);

		$deliver_db = M("info_deliver");
		import("ORG.Util.Page");
		$whereStr = $this->likeSearch($params);
		$all_data = $deliver_db->where($whereStr)->page($page,$limit)->select();

		return array(
			"deliverList" => $all_data,
			"totalCount" => count($deliver_db->select())
		);
	}


	/**
	 * 新建或编辑配送公司档案
	 */
	public function editDeliver($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
        $bs = new BizlogService();



		$deliver_db = M("info_deliver");
		$queryString  = " name='".$params['name']."'";
		if($params['id']){
			//编辑
			if(count($deliver_db->where($queryString." and id<>".$params['id'])->select())>0){
				return $this->bad("该名称的配送公司已经存在，请更换其他名称");
			}
			$deliver_db->save($params);
            $log = "编辑配送公司{$params}";
        }else{
			//新建
			if(count($deliver_db->where($queryString)->select())>0){
				return $this->bad("该名称的配送公司已经存在，请更换其他名称");
			}
			$params["creator_id"] = session("loginUserId");
			$now = time();
			$params['create_time'] = $now;
			$params['id'] = $deliver_db->add($params);
            $log = "新建配送公司{$params}";
        }
        $bs->insertBizlog($log, $this->LOG_CATEGORY);
        return $this->ok($params['id']);
	}

	/**
	 * 删除配送公司
	 */
	public function deleteDeliver($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
		if($params['id']){
			$db = M("info_deliver");
			$data = $db->where($params)->select();
			if(!$data){
				return $this->bad("要删除的配送公司信息不存在");
			}
			$result = $db->where($params)->delete();
			if($result){
				$log = "删除配送公司信息： 配送公司：{$data['name']}";
				$bs = new BizlogService();
				$bs->insertBizlog($log, $this->LOG_CATEGORY);
			}
			return $this->ok();
		}
	}

	/**
	 * 配送公司   查询数据
	 */
	public function queryData($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		if ($params == null) {
			$queryKey = "";
		}

		if($params['queryConditionType']==null||$params['queryConditionType'] == "") {
			//全部搜索，没有限制条件
			$sql = "select id deliver_id,name deliver_name,code deliver_code
					from info_deliver
					where (name like '%" . $params["queryKey"] . "%')";
		}else {
			//如果有限制条件查询，那么根据条件类型继续分类查询
			if($params['queryConditionType'] == FIdConst::DELIVER_QUERY_CONDITION_BY_DRUGID){
				$sql = "select *
					from info_drug2deliver
					where (deliver_name like '%".$params["queryKey"]."%') AND drug_id=".$params["queryConditionKey"];
			}else{
				//其他的限制方法查询继续添加

			}
		}



		$sql .= " order by id ";
		$all_data=M()->query($sql);
		return $all_data;
	}
}
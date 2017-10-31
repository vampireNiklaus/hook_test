<?php

namespace Home\Service;

use Home\Service\IdGenService;
use Home\Service\BizlogService;
use Home\Common\FIdConst;

/**
 * 配送公司档案Service
 *
 * @author wanbing.shi
 */
class DeliverAccountService extends PSIBaseService {
	private $LOG_CATEGORY = "基础数据-配送公司账号信息";

	/**
	 * 配送公司账号信息列表
	 */
	public function deliverAccountList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];

        unset ($params['page']);
		unset($params['start']);
		unset($params['limit']);

		$deliver_account_db = M("info_deliver_account");
		import("ORG.Util.Page");
		$whereStr = $this->likeSearch($params);
		$sql = $deliver_account_db->where($whereStr)->page($page,$limit)->fetchSql(true)->select();
        $all_data = $deliver_account_db->where($whereStr)->page($page,$limit)->select();
		return array(
			"deliverAccountList" => $all_data,
			"totalCount" => count($deliver_account_db->select())
		);
	}


	/**
	 * 新建或编辑配送公司档案
	 */
	public function editDeliverAccount($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
        $bs = new BizlogService();

		$deliver_account_db = M("info_deliver_account");
		if($params['id']){
			//编辑
            $count = $deliver_account_db->where("deliver_id=".$params['deliver_id']." AND username='".$params['username']."' AND id <>".$params['id'])->count();
            if($count >0){
                return $this->bad("该名称的配送公司账号已经存在，请更换其他名称");
            }
			$deliver_account_db->save($params);
            $log = "编辑配送公司账号{$params}";
        }else{
			//新建
            $count = $deliver_account_db->where("deliver_id=".$params['deliver_id']." AND username='".$params['username']."'")->count();
            if($count > 0){
                return $this->bad("该名称的配送公司账号已经存在，请更换其他名称");
            }
			$params["creator_id"] = session("loginUserId");
			$user = new UserService();
			$params['creator_name'] = $user->getLoginUserName();
			$now = time();
			$params['create_time'] = $now;
			$params['id'] = $deliver_account_db->add($params);
            $log = "新建配送公司账号{$params}";
        }
        $bs->insertBizlog($log, $this->LOG_CATEGORY);
        return $this->ok($params['id']);
	}

	/**
	 * 删除配送公司
	 */
	public function deleteDeliverAccount($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
		if($params['id']){
			$db = M("info_deliver_account");
			$data = $db->where($params)->select();
			if(!$data){
				return $this->bad("要删除的配送公司账号不存在");
			}
			$result = $db->where($params)->delete();
			if($result){
				$log = "删除配送公司{$data['deliver_name']}的账号";
				$bs = new BizlogService();
				$bs->insertBizlog($log, $this->LOG_CATEGORY);
			}
			return $this->ok();
		}
		return $this->bad("要删除的配送公司账号不存在");
	}

}
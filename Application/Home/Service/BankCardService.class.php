<?php

namespace Home\Service;

use Home\Service\IdGenService;
use Home\Service\BizlogService;
use Home\Common\FIdConst;

/**
 * 资金账户Service
 *
 * @author Baoyu Li
 */
class BankCardService extends PSIBaseService {
	private $LOG_CATEGORY = "基础数据-资金账户";

	/**
	 * 某个分类下的资金账户列表
	 */
	public function bankCardList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];

		unset($params['page']);
		unset($params['start']);
		unset($params['limit']);

		$bankCard_db = M("info_bankaccount");
		import("ORG.Util.Page");
		$whereStr = $this->likeSearch($params);
		$all_data = $bankCard_db->where($whereStr)->page($page,$limit)->select();
		
		return array(
				"bankCardList" => $all_data,
				"totalCount" => count($all_data)
		);
	}


	/**
	 * 新建或编辑资金账户
	 */
	public function editBankCard($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$bankCard_db = M("info_bankaccount");
		if($params['id']){
			//编辑
			$bankCard_db->save($params);
		}else{
			//新建
			$params['id'] = $bankCard_db->add($params);
		}

		return $this->ok($params['id']);
	}

	/**
	 * 删除资金账户
	 */
	public function deleteBankCard($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
		if($params['id']){
			$db = M("info_bankaccount");
			$data = $db->where($params)->select();
			if(!$data){
				return $this->bad("要删除的资金账户信息不存在");
			}
			$result = $db->where($params)->delete();
			if($result){
				$log = "删除资金账户信息： 资金账户姓名：{$data['account_name']}";
				$bs = new BizlogService();
				$bs->insertBizlog($log, $this->LOG_CATEGORY);
			}
			return $this->ok();
		}
	}


}
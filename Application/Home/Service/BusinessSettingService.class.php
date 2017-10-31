<?php

namespace Home\Service;

use Home\Service\IdGenService;
use Home\Service\BizlogService;
use Home\Common\FIdConst;
use Think\Exception;

/**
 * 资金账户Service
 *
 * @author RCG
 */
class BusinessSettingService extends PSIBaseService {
	private $LOG_CATEGORY = "库存管理";

	/**
	 * 库存条目列表
	 */
	public function employeeProfitAssignItemList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];

		unset($params['page']);
		unset($params['start']);
		unset($params['limit']);

		$profitAssign_db = M("view_drug_profit_assign");
		import("ORG.Util.Page");
		
		$whereStr = $this->likeSearch($params);
		$totalCount=$profitAssign_db->where($whereStr." and description='合作伙伴'")->count();
		$all_data = $profitAssign_db->where($whereStr." and description='合作伙伴'")->page($page,$limit)->select();
		return array(
				"employeeProfitAssignItemList" => $all_data,
				"totalCount" => $totalCount
		);
	}


	/**
	 * 库存调拨单列表
	 */
	public function stockTransList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];
		$stock_id=$params['stock_id'];

		unset($params['page']);
		unset($params['start']);
		unset($params['limit']);
		//
		$stock_db = M("info_stock");
		$stockTrans_db = M("bill_stock_trans");
		import("ORG.Util.Page");

		$whereStr='';
		if($stock_id){
			//根据id获取对应的信息
			$stock=$stock_db->where("id='".$stock_id."'")->field('drug_id,deliver_id,batch_num')->find();
			//拼凑查询语句
			$whereStr = "drug_id=".$stock['drug_id'].
				" AND batch_num='".$stock['batch_num']."'".
				" AND (in_deliver_id=".$stock['deliver_id']." OR out_deliver_id=".$stock['deliver_id'].")";
		}
		
		$all_data = $stockTrans_db
			->where($whereStr)
			->page($page,$limit)
			->select();

		//数据处理
		foreach ($all_data as $k=>$v){
			
		}

		return array(
			"stockTransList" => $all_data,
			"totalCount" => count($all_data)
		);
	}



	/**
 	* 编辑库存条目预警值
 	*/
	public function editEmployeeMonthAlarm($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$profitAssign_db = M("info_drug_profit_assign");
		$profitAssign_db->startTrans();
		try{
			if($params['id']){
				//更新预警值
				$profitAssign_db->where("id=".$params['id'])->setField("employee_alarm_month",$params['employee_alarm_month']);
			}else{
				//出错了
				return $this->ok("数据出错！");
			}
		}catch(Exception $e){
			$profitAssign_db->rollback();
			return $this->bad("数据出错！");
		}
		$profitAssign_db->commit();
		return $this->ok($params['id']);
	}

	/**
	 * 新建或编辑转账单
	 */
	public function editStockTrans($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$stockTrans_db = M("bill_stock_trans");
		if($params['id']){
			//编辑调拨单
			$stockTrans_db->where('id='.$params['id'])->save($params);
		}else{
			//添加调拨单
			$stockTrans_db->add($params);
		}

		return $this->ok($params['id']);
	}

	/**
	 * 修改转账单状态 审核与反审核操作
	 */
	public function stockTransStatus($params){
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$id = $params["id"];
		$type = $params["type"];
		$stock_db = M("info_stock");
		$trans_db = M("bill_stock_trans");
		//能修改的条件
		$trans=$trans_db->where('id='.$id)->find();
		$statusNow=$trans['status'];
		if($type=='no' && $statusNow==FIdConst::STOCK_TRANS_STATUS_2VERIFY){
			//审核不通过
			$trans_db->where('id='.$id)->save(array('status'=>FIdConst::STOCK_TRANS_STATUS_VERIFY_DENIED));
			return $this->ok($id);
		}else{
			$canChange=false;
			$toStatus=null;
			$out_id=0;//要转出的id
			$in_id=0;//要转入的id
			if($type=='yes'&& ($statusNow==FIdConst::STOCK_TRANS_STATUS_2VERIFY||FIdConst::STOCK_TRANS_STATUS_VERIFY_DENIED)){
				//审核通过
				//正常转出转入，转出的还是转出，转入的还是转入
				$out_id=$trans['out_deliver_id'];
				$in_id=$trans['in_deliver_id'];
				$toStatus=FIdConst::STOCK_TRANS_STATUS_VERIFIY_PASSED;
				$canChange=true;
			}elseif($type=='return'&& $statusNow==FIdConst::STOCK_TRANS_STATUS_VERIFIY_PASSED){
				//反审核
				//反转
				$out_id=$trans['in_deliver_id'];
				$in_id=$trans['out_deliver_id'];
				$toStatus=FIdConst::STOCK_TRANS_STATUS_VERIFY_DENIED;
				$canChange=true;
			}
			if(!$canChange) return false;
			//相应库存数量更改
			//判断要转出的库存剩余量是否足够
			$outStock=$stock_db
				->where(
					'drug_id='.$trans['drug_id'].
					' AND deliver_id='.$out_id.
					" AND batch_num='".$trans['batch_num']."'"
				)
				->find();
			//获取转出公司剩余库存量
			$outBatch=$outStock['amount'];
			//减去要转的量
			$outAmountNow=$outBatch-$trans['amount'];
			if($outAmountNow>=0){
				//可以转出
				$stock_db->where("id='".$outStock['id']."'")->setField('amount',$outAmountNow);
				//判断转入是否已经存在库存
				$inStock=$stock_db
					->where(
						'drug_id='.$trans['drug_id'].
						' AND deliver_id='.$in_id.
						" AND batch_num='".$trans['batch_num']."'"
					)
					->find();
				if($inStock==NULL){
					//不存在当前批号
					$data['drug_id']=$trans['drug_id'];
					$data['drug_name']=M('info_drug')->where('id='.$trans['drug_id'])->getField('common_name');
					$data['deliver_id']=$in_id;
					$data['deliver_name']=M('info_deliver')->where('id='.$in_id)->getField('name');
					$data['amount']=$trans['amount'];
					$data['id']=$trans['drug_id']."*".$in_id."*".$trans['batch_num'];
					$data['batch_num']=$trans['batch_num'];
					$stock_db->add($data);
				}else{
					//存在批号，获取已经有的库存量
					$inBatch=$inStock['amount'];
					$inAmountNow=$inBatch+$trans['amount'];
					//更新
					$stock_db->where("id='".$inStock['id']."'")->setField('amount',$inAmountNow);
				}

				$trans_db->where('id='.$id)->save(array('status'=>$toStatus));

			}else{
				//剩余库存量不足，无法转出
				return $this->bad('剩余库存量不足，无法转出');
			}

			return $this->ok($params['id']);
		}
	}

	/**
	 * 删除资金账户
	 */
	public function deleteBankAccount($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
		if($params['id']){
			$db = M("bank_io");
			$data = $db->where($params)->select();
			if(!$data){
				return $this->bad("要删除的资金账户信息不存在");
			}
			$ioCount=M('bank_io')
				->where('out_account_id='.$params['id'].' OR in_account_id='.$params['id'])
				->count();
			if($ioCount>0){
				return $this->bad('账户已被引用，无法删除！');
			}else{
				$result = $db->where($params)->delete();
				if($result){
					$log = "删除库存条目：{$data['account_name']}";
					$bs = new BizlogService();
					$bs->insertBizlog($log, $this->LOG_CATEGORY);
				}
				return $this->ok();
			}
		}
	}

	/**
	 * 删除资金账户
	 */
	public function deleteBankIO($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
		if($params['id']){
			$db = M("bank_io");
			$data = $db->where($params)->find();
			if(!$data){
				return $this->bad("要删除的转账单信息不存在");
			}
			if($data['status']!=1){
				$result = $db->where($params)->delete();
				if($result){
					$log = "删除转账单：{$data['out_account_id']}";
					$bs = new BizlogService();
					$bs->insertBizlog($log, $this->LOG_CATEGORY);
				}
				return $this->ok();
			}
		}
	}

	/**
	 * 库存条目字段， 查询数据
	 */
	public function queryData($queryKey) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		if ($queryKey == null) {
			$queryKey = "";
		}

		$sql = "select *
				from info_stock
				where (account_name like '%".$queryKey["queryKey"]."%' or account_num like '%".$queryKey["queryKey"]."%') ";
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

		$sql .= " order by id
				limit 20";
		return M()->query($sql);
	}
	
	public function getBatchList($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		$stock_db=M('info_stock');
		$all_data=$stock_db
			->where('drug_id='.$params['drug_id'].' AND deliver_id='.$params['deliver_id'])
			->field('batch_num')
			->select();
		return array(
			'all_data'=>$all_data
		);
	}

	/**产品代理协议
	 * @param $params
	 * @return array
	 */
	public function getProductAgencyList($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		$db=M('bill_product_agency');
		$all_data=$db
			->alias('pa')
			->join('info_drug AS idr ON pa.drug_id = idr.id')
			->field('pa.*,idr.common_name')
			->where("pa.bill_date like '%".$params['date']."%'")
			->select();
		return array(
			'productAgencyList'=>$all_data
		);
	}

	public function editProductAgency($params){
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$product_agency_db = M("bill_product_agency");
		$drug_db = M("info_drug");
		$drug = $drug_db->where('id='.$params['drug_id'])->field('manufacturer,guige')->find();
		$params['guige'] = $drug['guige'];
		$params['manufacturer'] = $drug['manufacturer'];
		if($params['id']){
			//编辑调拨单
			$product_agency_db->where('id='.$params['id'])->save($params);
		}else{
			//添加调拨单
			$product_agency_db->add($params);
		}

		return $this->ok($params['id']);
		
	}

	public function deleteProductAgency($params){
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
		$product_agency_db = M("bill_product_agency");
		$product_agency_db->where('id='.$params['id'])->delete();

		return $this->ok($params['id']);
	}

	/**
	 * 推广协议
	 * @param $params
	 * @return array
	 */
	public function getExpandAgencyList($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		$db=M('bill_promote_agency');
		$all_data=$db
			->where("drug_id =".$params['id'])
			->select();
		return array(
			'expandAgencyList'=>$all_data
		);
	}

	public function editExpandAgency($params){
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$product_agency_db = M("bill_promote_agency");
		$drug_db = M("info_drug");
		$drug = $drug_db->where('id='.$params['drug_id'])->field('manufacturer,guige')->find();
		$params['guige'] = $drug['guige'];
		$params['manufacturer'] = $drug['manufacturer'];
		if($params['id']){
			//编辑调拨单
			$product_agency_db->where('id='.$params['id'])->save($params);
		}else{
			//添加调拨单
			$product_agency_db->add($params);
		}

		return $this->ok($params['id']);

	}

	public function deleteExpandAgency($params){
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
		$product_agency_db = M("bill_promote_agency");
		$product_agency_db->where('id='.$params['id'])->delete();

		return $this->ok($params['id']);
	}


}
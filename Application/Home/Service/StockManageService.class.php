<?php

namespace Home\Service;

use Home\Service\IdGenService;
use Home\Service\BizlogService;
use Home\Common\FIdConst;
use Think\Exception;
use Think\Model;

/**
 * 资金账户Service
 *
 * @author RCG
 */
class StockManageService extends PSIBaseService {
	private $LOG_CATEGORY = "库存管理";

	/**
	 * 库存条目列表
	 */
	public function stockDetailItemList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$stockItem_db = M("info_stock");
		import("ORG.Util.Page");

		$all_data = $stockItem_db
			->alias('si')
			->join('info_drug AS idr ON si.drug_id = idr.id')
			->field('si.*,idr.guige,idr.manufacturer,idr.jldw')
			->where("drug_id =".$params['drug_id']." and deliver_id=".$params['deliver_id'])
			->select();

		return array(
				"stockDetailItemList" => $all_data,
		);
	}
	/**
	 * 库存条目列表
	 */
	public function stockSummaryItemList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];
		$drug_name = $params["drug_name"];
		$deliver_name = $params["deliver_name"];
		if (session('loginUserId') != FIdConst::ADMIN_USER_ID && session('loginType') != FIdConst::LOGIN_TYPE_STAFF) {
			$drugIDs = $this->conditionalFilter4Drug();
			$queryStr  = "SELECT
							`info_drug`.`guige` AS `guige`,
							`info_drug`.`jldw` AS `jldw`,
							`info_drug`.`manufacturer` AS `manufacturer`,
							`info_stock`.`drug_id` AS `drug_id`,
							`info_stock`.`drug_name` AS `drug_name`,
							`info_stock`.`deliver_id` AS `deliver_id`,
							`info_stock`.`deliver_name` AS `deliver_name`,
							sum(`info_stock`.`amount`) AS `sum_amount`,
							`info_stock`.`alarm_amount` AS `alarm_amount`
						FROM
							(
								`info_stock` JOIN `info_drug` on info_stock.drug_id = info_drug.id
							)  where info_stock.drug_name like '%".$drug_name."%' and info_stock.deliver_name like '%".$deliver_name."%' and
							info_stock.drug_id = '".$drugIDs."'
						GROUP BY
							`info_stock`.`drug_id`,
							`info_stock`.`deliver_id`";
		} else {
			$queryStr  = "SELECT
							`info_drug`.`guige` AS `guige`,
							`info_drug`.`jldw` AS `jldw`,
							`info_drug`.`manufacturer` AS `manufacturer`,
							`info_stock`.`drug_id` AS `drug_id`,
							`info_stock`.`drug_name` AS `drug_name`,
							`info_stock`.`deliver_id` AS `deliver_id`,
							`info_stock`.`deliver_name` AS `deliver_name`,
							sum(`info_stock`.`amount`) AS `sum_amount`,
							`info_stock`.`alarm_amount` AS `alarm_amount`
						FROM
							(
								`info_stock` JOIN `info_drug` on info_stock.drug_id = info_drug.id
							)  where info_stock.drug_name like '%".$drug_name."%' and info_stock.deliver_name like '%".$deliver_name."%'
						GROUP BY
							`info_stock`.`drug_id`,
							`info_stock`.`deliver_id`";
		}
		$pageStr = " LIMIT ".($page-1)*$limit.",".$limit;

		$model = new Model();
		$all_data = $model->query($queryStr.$pageStr);
		$totalCount = count($model->query($queryStr));

		return array(
				"stockSummaryItemList" => $all_data,
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
	public function editStockItemAlarm($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$stockItem_db = M("info_stock");
		$stockItem_db->startTrans();
		try{
			if($params['drug_id']&&$params['deliver_id']){
			$stockItem_db->where("drug_id=".$params['drug_id']." and deliver_id=".$params['deliver_id'])->setField("alarm_amount",$params['alarm_amount']);
			}else{
				//出错了
				return $this->ok("数据出错！");
			}
		}catch(Exception $e){
			$stockItem_db->rollback();
			return $this->bad("数据出错！");
		}
		$stockItem_db->commit();
		return $this->ok(1);
	}


    public function drugBrokenBillList($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        //首先获取入库之前的破损
        $selfStockSub_db = M('bill_self_stock_sub');

        import("ORG.Util.Page");
        $all_data = $selfStockSub_db
            ->alias('sss')
            ->join('info_drug AS idr ON idr.id=sss.drug_id')
            ->join('info_supplier AS isu ON isu.id=sss.supplier_id')
            ->join('info_deliver AS ide ON ide.id=sss.deliver_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND sss.bill_code like '%".$params['bill_code']."%' and is_broken=1")
            ->field('sss.*,sss.stock_num as amount,sss.deliver_id as stock_id,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer,isu.name supplier_name,
                ide.name stock_name')
            ->select();

        //数据处理
        foreach ($all_data as $k=>$v){
            $all_data[$k]['type'] = 0;
            switch ($v['status']){
                case 0:
                    $all_data[$k]['status_str']='<span style="color:red">未审核</span>';
                    break;
                case 1:
                    $all_data[$k]['status_str']='已审核';
                    break;
                case 2:
                    $all_data[$k]['status_str']='<span style="color:blue">未通过审核</span>';
                    break;
                case 4:
                    $all_data[$k]['status_str']='<span style="color:#795548">税票单被退回</span>';
                    break;
            }
            if($v['is_broken'] == 1){
                //破损单
                $all_data[$k]['status_str'] = $all_data[$k]['status_str'].'<span style="color:green">破损单</span>';
            }
        }


        //获取入库之后的破损
        $all_data2 = M("bill_stock_broken")
            ->alias('bsb')
            ->join('info_drug AS idr ON idr.id=bsb.drug_id')
            ->join('info_deliver AS ide ON ide.id=bsb.stock_id')
            ->field('bsb.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer,ide.name stock_name')
            ->select();
        //数据处理
        foreach ($all_data2 as $k=>$v){
            switch ($v['status']){
                case 0:
                    $all_data2[$k]['status_str']='<span style="color:red">未审核</span>';
                    break;
                case 1:
                    $all_data2[$k]['status_str']='已审核';
                    break;
                case 2:
                    $all_data2[$k]['status_str']='<span style="color:blue">未通过审核</span>';
                    break;
            }
            array_push($all_data,$all_data2[$k]);
        }

        return array(
            "brokenDrugList" => $all_data,
            "totalCount" => count($all_data)
        );
    }



    /**
 	* 编辑库存条目预警值
 	*/
	public function editStockBrokenBill($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
        $us = new UserService();
		$stockBroken_db = M("bill_stock_broken");
		$stockBroken_db->startTrans();
		try{
		    if($params['id']){
		        //编辑一个条目
                $count = M("info_stock")->where("drug_id=".$params['drug_id']." and deliver_id=".$params['stock_id']." and batch_num=".$params['batch_num'])->count();
                if($count>0){
                    $id = $stockBroken_db->where("id=".$params['id'])->save($params);
                }else{
                    return $this->bad("没有该品种在对应库存的批号品种，不允许添加");
                }
            }else{
		        //新增一个条目
                $params['create_time'] = time();
                $params['creator'] = $us->getLoginUserId();
                $params['type'] = FIdConst::STOCK_MANAGE_BROKEN_TYPE_ZHUIJIA;
                $id = $stockBroken_db->add($params);
            }
			$stockBroken_db->commit();
		}catch(Exception $e){
			$stockBroken_db->rollback();
			return $this->bad("数据出错！");
		}
		return $this->ok($id);
	}

	/**
 	* 删除库存条目预警值
 	*/
	public function deleteBrokenBillBill($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
		$stockBroken_db = M("bill_stock_broken");
		$stockBroken_db->startTrans();
		try{
		    if($params['id']){
		        //编辑一个条目
                $items = $stockBroken_db->where("id=".$params['id'])->select();
                if(count($items)>0){
                    if($items[0]['status'] == 1){
                        return $this->bad("已经审核的页面不能删除");
                    }else{
                        $id = $stockBroken_db->where("id=".$params['id'])->delete();
                        $stockBroken_db->commit();
                        return $this->ok($id);
                    }

                }
            }

        }catch(Exception $e){
			$stockBroken_db->rollback();
			return $this->bad("操作出错！");
		}
        return $this->bad("操作出错！");
    }

	/**
	 * 编辑库存批号信息
	 */
	public function editStockBatchItem($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$stockItem_db = M("info_stock");
		$stockItem_db->startTrans();
		try{
			if($params['id']){
				$stockItem_db->where("id='".$params['id']."'")->setField("amount",$params['amount']);
				$stockItem_db->where("id='".$params['id']."'")->setField("expire_time",$params['expire_time']);
                $stockItem_db->commit();
                return $this->ok($params['id']);
			}else{
				//出错了
				return $this->ok("数据出错！");
			}
		}catch(Exception $e){
			$stockItem_db->rollback();
			return $this->bad("数据出错！");
		}

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
			$db = M("info_stock");
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

    //入库之后的破损单的审核操作
    public function stockBrokenBillStatus($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $type = $params["type"];
        $bill_db = M('bill_stock_broken');
        $stock_db = M('info_stock');
        //能修改的条件
        $bill=$bill_db->where('id='.$id)->find();
        //当前状态
        $statusNow=$bill['status'];
        $bill_type=$bill['type'];
        $data=array();
        $date=date('Y-m-d');
        $data['verify_date']=$date;
        $data['verify_id']=session("loginUserId");
        $amount = $bill['amount'];
        try{
            if( ($type=='no' && $statusNow==FIdConst::STOCK_MANAGE_BROKEN_STATUS_2VERIFY)){
                //审核不通过，改变状态就好了
                $data['status']=FIdConst::STOCK_MANAGE_BROKEN_STATUS_VERIFY_DENIED;
            }

            if(($type=='return'&& $statusNow==FIdConst::STOCK_MANAGE_BROKEN_STATUS_VERIFY_PASS)){
                //反审核，数量回来
                $data['status']=FIdConst::STOCK_MANAGE_BROKEN_STATUS_VERIFY_DENIED;
                $stocks = $stock_db->where("drug_id=".$bill['drug_id']." and deliver_id=".$bill['stock_id']." and batch_num=".$bill['batch_num'])->select();
                if(count($stocks) !=1){
                    return $this->bad("同个品种，同一个配送公司里有同一个批号没有或者有大于一个的条目错误，请修改");
                }else{
                    $now_amount = $stocks[0]['amount']+$amount;
                    $stock_db->where("drug_id=".$bill['drug_id']." and deliver_id=".$bill['stock_id']." and batch_num=".$bill['batch_num'])->save(array("amount"=>$now_amount));
                    $id = $bill_db->where('id='.$id)->save($data);
                    $bill_db->commit();
                    $stock_db->commit();
                    return $this->ok($id);
                }
            }
            if($type=='yes'&& ($statusNow==FIdConst::STOCK_MANAGE_BROKEN_STATUS_2VERIFY
                    ||$statusNow==FIdConst::STOCK_MANAGE_BROKEN_STATUS_VERIFY_DENIED)){
                //审核通过，数量变化
                $data['status']=FIdConst::STOCK_MANAGE_BROKEN_STATUS_VERIFY_PASS;
                $stocks = $stock_db->where("drug_id=".$bill['drug_id']." and deliver_id=".$bill['stock_id']." and batch_num=".$bill['batch_num'])->select();
                if(count($stocks) !=1){
                    return $this->bad("同个品种，同一个配送公司里有同一个批号没有或者有大于一个的条目错误，请修改");
                }else{
                    $now_amount = $stocks[0]['amount']-$amount;
                    $stock_db->where("drug_id=".$bill['drug_id']." and deliver_id=".$bill['stock_id']." and batch_num=".$bill['batch_num'])->save(array("amount"=>$now_amount));
                    $id = $bill_db->where('id='.$id)->save($data);
                    $bill_db->commit();
                    $stock_db->commit();
                    return $this->ok($id);
                }
            }

        }catch (Exception $e){
            $bill_db->rollback();
            $stock_db->rollback();
            return $this->bad("操作错误");
        }

    }


}
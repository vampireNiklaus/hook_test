<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Home\Common\DemoConst;
use Home\Service\ImportService;
use Think\Exception;

/**
 * 业务员Service
 *
 * @author Baoyu Li
 */
class DailySellService extends PSIBaseService {
	private $LOG_CATEGORY_HOSPITAL = "基础数据-销售信息条目";
	private $LOG_HOSPITAL_TYPE = "基础数据-销售信息条目等级";

	/**
	 * 销售信息条目列表
	 */
	public function dailySellList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
        $us = new UserService();
//        $yewuHospitals = implode(",",$us->getLoginUserYeWuSetHospitalLists());

		$dailySell_db = null;
		$where = array();
		if($params['drug_id']!=""){
            $where['drug_id'] = array('eq',$params['drug_id']);
        }
		$where['employee_name'] = array('like',"%".$params['employee_name']."%");
		$where['hospital_name'] = array('like',"%".$params['hospital_name']."%");
		$where['sell_date'] = array('between',"".$params['sell_date_from'].",".$params['sell_date_to']);
		if($params['grid_type']==2){
			//查询新添加并且可以完全匹配的表格
			$dailySell_db = M('bill_daily_sell_temp');
			$where['status'] = array('eq',FIdConst::DAILY_SELL_STATUS_TEMP_MATCHED);
		}else if($params['grid_type']==3){
			//查询新添加信息不完整的的表格
			$dailySell_db = M('bill_daily_sell_temp');
			$where['status'] = array('eq',FIdConst::DAILY_SELL_STATUS_TEMP_UNMATCTHED);
		}else if($params['grid_type']==1){
			//已经入库的表格
			$dailySell_db = M('bill_daily_sell');
			$where['status'] = array('gt',1);
		}
        //对于普通的公司员工设置医院的查看权限
//        if($us->getLoginUserId() != $us->getAdminUserId()){
//            $where['hospital_id'] = array('in',$yewuHospitals);
//        }

        //对于普通的公司员工设置公司利润和业务员利润的查看信息
        if($us->getLoginUserId() != $us->getAdminUserId()&&!$us->hasPermission(FIdConst::DAILY_SELL_ITEM_VIEW_SECRET)){
            $where['employee_name'] = array("neq","公司");
        }


		$page = $params['page'];
		$limit = $params['limit'];

		import("ORG.Util.Page");


		$all_data = $dailySell_db->where($where)->page($page,$limit)->order('sell_date desc')->select();
        $count = $dailySell_db->where($where)->count();
        if($params['grid_type']==2){
            //查询新添加并且可以完全匹配的表格
            return array(
                "dailySellList4new" => $all_data,
                "totalCount4new" => $count
            );
        }else if($params['grid_type']==3){
            //查询新添加信息不完整的的表格
            return array(
                "dailySellList4unmatched" => $all_data,
                "totalCount4unmatched" => $count
            );
        }else if($params['grid_type']==1){
            //已经入库的表格
            return array(
                "dailySellList4confirmed" => $all_data,
                "totalCount4confirmed" => $count
            );
        }
	}

    public function dailySellList4Company($params) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $us = new UserService();
        $yewuHospitals = implode(",",$us->getLoginUserYeWuSetHospitalLists());

        $dailySell_db = null;
        $where = array();
        $where['drug_name'] = array('like',"%".$params['drug_name']."%");
        $where['employee_name'] = array("eq","公司");
        $where['hospital_name'] = array('like',"%".$params['hospital_name']."%");
        $where['sell_date'] = array('between',"".$params['sell_date_from'].",".$params['sell_date_to']);
        if($params['grid_type']==1){
            //查询新添加并且可以完全匹配的表格
            $dailySell_db = M('bill_daily_sell_temp');
            $where['status'] = array('eq','0');
        }else if($params['grid_type']==2){
            //查询新添加信息不完整的的表格
            $dailySell_db = M('bill_daily_sell_temp');
            $where['status'] = array('eq','1');
        }else if($params['grid_type']==3){
            //查询新添加并且可以完全匹配的表格
            $dailySell_db = M('bill_daily_sell');
            $where['status'] = array('gt','1');
        }
        //对于普通的公司员工设置医院的查看权限
        if($us->getLoginUserId() != $us->getAdminUserId()){
            $where['hospital_id'] = array('in',$yewuHospitals);
        }

        $page = $params['page'];
        $limit = $params['limit'];

        import("ORG.Util.Page");


        $all_data = $dailySell_db->where($where)->page($page,$limit)->select();
        return array(
            "dailySellList" => $all_data,
            "totalCount" => $dailySell_db->where($where)->count()
        );
    }

	/*
	 * 获取bill_daily_sell列表
	 */
	public function getEmployeeList4AddBusinessPayItem($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		$employee_id=$params['employee_id'];
		$eWhereStr='';
		if($employee_id){
			$eWhereStr=" AND employee_id=".$employee_id;
		}
		//当前月
		$now_month  =$params['now_date'];
		//当前月的范围
		$now_month_b=$now_month.'-01';
		$now_month_e=date('Y-m',strtotime($now_month." +1 month")).'-01';
		//前3个月
		$before_3month_b  = date('Y-m-01',strtotime($now_month." -3 month"));
		//后3个月截止日期
		$after_3month_e  = date('Y-m-01',strtotime($now_month." +4 month"));

		$dailySellModel=M('bill_daily_sell');
		//获取选定月份当月数据
		$count=$dailySellModel
			->field('employee_id,employee_name,convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money')
			->where("status=".FIdConst::DAILY_SELL_STATUS_CONFIRMED." AND sell_date>='".$now_month_b."' AND sell_date<'".$now_month_e."' and employee_name<>'公司' ")
			->group('employee_id')
			->count();
		$all_data=$dailySellModel
			->field('employee_id,employee_name,convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money')
			->where(
				"status=".FIdConst::DAILY_SELL_STATUS_CONFIRMED.
				" AND sell_date>='".$now_month_b.
				"' AND sell_date<'".$now_month_e."' and employee_name<>'公司' ".
				$eWhereStr)
			->group('employee_id')
			->select();
		//获取前三月未支付金额
		$before_3m_money=$dailySellModel
			->field('employee_id,employee_name,convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money')
			->where(
				"status=".FIdConst::DAILY_SELL_STATUS_CONFIRMED.
				" AND sell_date>='".$before_3month_b.
				"' AND sell_date<'".$now_month_b."' and employee_name<>'公司' ".
				$eWhereStr)
			->group('employee_id')
			->select();
		$before_3m_money=$this->makeArrKeyId($before_3m_money);
		//获取后三月未支付金额
		$after_3m_money=$dailySellModel
			->field('employee_id,employee_name,convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money')
			->where(
				"status=".FIdConst::DAILY_SELL_STATUS_CONFIRMED.
				" AND sell_date>='".$now_month_e.
				"' AND sell_date<'".$after_3month_e."' and employee_name<>'公司' ".
				$eWhereStr)
			->group('employee_id')
			->select();
		$after_3m_money=$this->makeArrKeyId($after_3m_money);
		
		//数据嵌入
		foreach ($all_data as $k=>$v){
			$all_data[$k]['before_3m_money']=$before_3m_money[$v['employee_id']]['pay_sum_money'];
			//对应前三月未支付的数据已经插入到结果中
			$before_3m_money[$v['employee_id']]['into_data']=true;
			$all_data[$k]['after_3m_money']=$after_3m_money[$v['employee_id']]['pay_sum_money'];
			$after_3m_money[$v['employee_id']]['into_data']=true;
			$all_data[$k]['now_date']=$now_month;
		}
		//如果$before_3m_money中的into_data不为true，说明该条信息还没有在all_data中
		foreach ($before_3m_money as $k2=>$v2){
			if(!$v2['into_data']){
				//新增一条数据插入all_data
				$v2['before_3m_money']=$v2['pay_sum_money'];
				$v2['pay_sum_money']=null;
				$v2['now_date']=$now_month;
				$all_data[]=$v2;
			}
		}
		//如果$after_3m_money中的into_data不为true，说明该条信息还没有在all_data中
		foreach ($after_3m_money as $k3=>$v3){
			if(!$v3['into_data']){
				$is_into=false;
				//先查找记录是否在上一步before循环时已经生成
				foreach ($all_data as $k4=>$v4){
					if($v3['employee_id']==$v4['employee_id']){
						//存在只需要更新下就可以了
						$all_data[$k4]['after_3m_money']=$v3['pay_sum_money'];
						$is_into=true;
					}
				}
				//不存在则新增一条数据插入all_data
				if(!$is_into){
					$v3['after_3m_money']=$v3['pay_sum_money'];
					$v3['pay_sum_money']=null;
					$v3['now_date']=$now_month;
					$all_data[]=$v3;
				}
			}
		}

		foreach( $all_data as $k=>$v){
			$all_data[$k]['pay_sum_money'] = (float)$all_data[$k]['pay_sum_money'];
			$all_data[$k]['after_3m_money'] = (float)$all_data[$k]['after_3m_money'];
			$all_data[$k]['before_3m_money'] = (float)$all_data[$k]['before_3m_money'];
		}

		return array(
			"dailySellList" => $all_data,
			"totalCount" => $count
		);
	}

	protected function makeArrKeyId($arr){
		$result=array();
		foreach ($arr as $k=>$v){
			$result[$v['employee_id']]=$v;
		}
		return $result;
	}

	//将数据的键变为医院药品
	protected function makeArrKeyDHE($arr){
		$result=array();
		foreach ($arr as $k=>$v){
			$keyStr=$v['hospital_id'].'|'.$v['drug_id'].'|'.$v['employee_des'];
			$result[$keyStr]=$v;
		}
		return $result;
	}

	/**
	 * 获取父表点击后的子表内容--直营结算
	 */
	public function getDailySellDetail($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		//业务员id
		$id=$params['id'];
		$date=$params['date'];
		//当前月的范围
		$date_b=$date.'-01';
		$date_e=date('Y-m',strtotime($date." +1 month")).'$-01';
		$search_date_to = $params['search_date_to'];
		$search_date_from = $params['search_date_from'];
		if($params['search_date_to']<$params['$search_date_from']){
			$search_date_to = $params['search_date_from'];
			$search_date_from = $params['search_date_to'];
		}
		//前3个月开始时间
		$before_3month_b  = date('Y-m-01',strtotime($date." -3 month"));
		//后3个月截止日期
		$after_3month_e  = date('Y-m-01',strtotime($date." +4 month"));
		//下月截至日期
		$after_1month_e  = date('Y-m-01',strtotime($date." +2 month"));

		$dailySellModel=M('bill_daily_sell');
//		$count=$dailySellModel
//			->where("status=".FIdConst::DAILY_SELL_STATUS_CONFIRMED." AND employee_id=".$id." AND sell_date>='".$search_date_from."' AND sell_date<'".$search_date_to."'")
//			->group('drug_id,hospital_id,employee_des')
//			->count();
		$all_data=$dailySellModel
			->where(
				"status=".FIdConst::DAILY_SELL_STATUS_CONFIRMED.
				" AND employee_id=".$id.
				" AND ((sell_date>='".$search_date_from.
				"' AND sell_date<='".$search_date_to."') or (sell_date>='".$date_b."' and sell_date<'".$date_e."'))")
			->field("*,GROUP_CONCAT(id) sell_id_list,convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money,sum(sell_amount) sell_amount,DATE_FORMAT(sell_date,'%Y-%m') sell_month")
			->group('drug_id,hospital_id,employee_des,employee_profit,sell_month')
			->select();
		$count =count($all_data);

		//获取其他需要填充的数据
		for($i = 0; $i<count($all_data);$i++) {
			$tempItem = $all_data[$i];
			$tempDrugId = $tempItem['drug_id'];
			$tempHospitalId = $tempItem['hospital_id'];
			$tempEmployeeDes = $tempItem['employee_des'];
			$tempEmployeeProfit = $tempItem['employee_profit'];
			$tempMonth = $tempItem['sell_month'].'-01';
			//获取前三月支付金额
			$before_3month_b = date('Y-m-01',strtotime($tempMonth." -3 month"));
			$before_3m_moneys=$dailySellModel
				->field('convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money')
				->where(
					"sell_date>='".$before_3month_b.
					"' AND sell_date<'".$tempMonth."'".
					" AND employee_id=".$id." and drug_id=".$tempDrugId." and hospital_id=".$tempHospitalId." and employee_des='".$tempEmployeeDes."'"." and employee_profit=".$tempEmployeeProfit)
				->select();
			if(count($before_3m_moneys)>0){
				$before_3m_money = $before_3m_moneys[0]['pay_sum_money'];
			}else{
				$before_3m_money = 0;
			}
//			$before_3m_money=$this->makeArrKeyDHE($before_3m_money);
			//获取后三月支付金额
			$after_3m_moneys=$dailySellModel
				->field('convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money')
				->where(
					"sell_date>='".$date_e.
					"' AND sell_date<'".$after_3month_e."'".
					" AND employee_id=".$id." and drug_id=".$tempDrugId." and hospital_id=".$tempHospitalId." and employee_des='".$tempEmployeeDes."'"." and employee_profit=".$tempEmployeeProfit)
				->select();
//			$after_3m_money=$this->makeArrKeyDHE($after_3m_money);
			if(count($after_3m_moneys)>0){
				$after_3m_money = $after_3m_moneys[0]['pay_sum_money'];
			}else{
				$after_3m_money = 0;
			}
			//获取下月支付金额和销量
			$after_1m_moneys=$dailySellModel
				->field('convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money,sum(sell_amount) sum_sell_amount')
				->where(
					"sell_date>='".$date_e.
					"' AND sell_date<'".$after_1month_e."'".
					" AND employee_id=".$id." and drug_id=".$tempDrugId." and hospital_id=".$tempHospitalId." and employee_des='".$tempEmployeeDes."'"." and employee_profit=".$tempEmployeeProfit)
				->select();
			if(count($after_1m_moneys)>0){
				$after_1m_money = $after_1m_moneys[0]['pay_sum_money'];
				$after_1m_amount = $after_1m_moneys[0]['sum_sell_amount'];
			}else{
				$after_1m_money = 0;
				$after_1m_amount = 0;
			}

			$all_data[$i]['before_3m_money']=(float)$before_3m_money;
			$all_data[$i]['after_3m_money']=(float)$after_3m_money;
			$all_data[$i]['next_amount']=(int)$after_1m_amount;
			$all_data[$i]['next_money']=(float)$after_1m_money;
			$all_data[$i]['pay_sum_money']=(float)$all_data[$i]['pay_sum_money'];
			$all_data[$i]['sell_amount']=(int)$all_data[$i]['sell_amount'];

//			$after_1m_money=$this->makeArrKeyDHE($after_1m_money);

			//数据嵌入
//			foreach ($all_data as $k=>$v){
//				$all_data[$k]['now_date']=$date;
//				$keyStr=$v['hospital_id'].'|'.$v['drug_id'].'|'.$v['employee_des'];
//				$all_data[$k]['before_3m_money']=$before_3m_money[$keyStr]['pay_sum_money'];
//				$all_data[$k]['after_3m_money']=$after_3m_money[$keyStr]['pay_sum_money'];
//				$all_data[$k]['next_amount']=$after_1m_money[$keyStr]['next_amount'];
//				$all_data[$k]['next_money']=$after_1m_money[$keyStr]['pay_sum_money'];
//			}
		}
		return array(
			"dailySellList" => $all_data,
			"totalCount" => $count
		);
	}

    /**
     * 获取父表点击后的子表内容--招商结算
     */
    public function getDailySellDetailByAgent($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        //代理商id
        $id=$params['id'];
        //通过代理商的id找到该协议的明细
        $protocolManage_db = M('info_protocol_manage');
        $dailySellModel = M('bill_daily_sell');
        $select_data = $protocolManage_db
            ->alias('ipm')
            ->join('info_protocol_detail as ipd on ipm.id=ipd.parent_protocol_id')
            ->where('ipm.agent_id='.$id)
//            ->where('ipm.agent_id=15')
//            ->fetchSql(true)
            ->field('ipd.hospital_name,ipd.drug_name')
            ->select();
        //通过筛选的数据连表bill_daily_sell获得流向数据
//        $db = M('bill_daily_sell');
//        $all_data = array();
//        foreach($select_data as $k=>$v){
//            $map['hospital_name'] = $v['hospital_name'];
//            $map['drug_name'] = $v['drug_name'];
//            $all_data = array_merge($all_data,$db->where($map)->select());
//        }
        $date=$params['date'];
        //当前月的范围
        $date_b=$date.'-01';
        $date_e=date('Y-m',strtotime($date." +1 month")).'-01';
        $search_date_to = $params['search_date_to'];
        $search_date_from = $params['search_date_from'];
        if($params['search_date_to']<$params['$search_date_from']){
            $search_date_to = $params['search_date_from'];
            $search_date_from = $params['search_date_to'];
        }
        //前3个月开始时间
        $before_3month_b  = date('Y-m-01',strtotime($date." -3 month"));
        //后3个月截止日期
        $after_3month_e  = date('Y-m-01',strtotime($date." +4 month"));
        //下月截至日期
        $after_1month_e  = date('Y-m-01',strtotime($date." +2 month"));

        $dailySellModel=M('bill_daily_sell');

//        $all_data=$dailySellModel
//            ->where(
//                "status=".FIdConst::DAILY_SELL_STATUS_CONFIRMED.
//                " AND employee_id=".$id.
//                " AND ((sell_date>='".$search_date_from.
//                "' AND sell_date<='".$search_date_to."') or (sell_date>='".$date_b."' and sell_date<'".$date_e."'))")
//            ->field("*,GROUP_CONCAT(id) sell_id_list,convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money,sum(sell_amount) sell_amount,DATE_FORMAT(sell_date,'%Y-%m') sell_month")
//            ->group('drug_id,hospital_id,employee_des,employee_profit,sell_month')
//            ->select();
        //通过筛选的数据连表bill_daily_sell获得流向数据
        $all_data = array();
        foreach($select_data as $k=>$v){
            $map['hospital_name'] = $v['hospital_name'];
            $map['drug_name'] = $v['drug_name'];
            $map['sell_date'] = array('BETWEEN',array($search_date_from,$search_date_to));
            $all_data = array_merge($all_data,$dailySellModel->where($map)->field("*,GROUP_CONCAT(id) sell_id_list,convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money,sum(sell_amount) sell_amount,DATE_FORMAT(sell_date,'%Y-%m') sell_month")->group('drug_id,hospital_id,employee_des,employee_profit,sell_month')->select());
        }
        $count =count($all_data);

        //获取其他需要填充的数据
        for($i = 0; $i<count($all_data);$i++) {
            $tempItem = $all_data[$i];
            $tempDrugId = $tempItem['drug_id'];
            $tempHospitalId = $tempItem['hospital_id'];
            $tempEmployeeDes = $tempItem['employee_des'];
            $tempEmployeeProfit = $tempItem['employee_profit'];
            $tempMonth = $tempItem['sell_month'].'-01';
            //获取前三月支付金额
            $before_3month_b = date('Y-m-01',strtotime($tempMonth." -3 month"));
            $before_3m_moneys=$dailySellModel
                ->field('convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money')
                ->where(
                    "sell_date>='".$before_3month_b.
                    "' AND sell_date<'".$tempMonth."'".
                    " AND employee_id=".$id." and drug_id=".$tempDrugId." and hospital_id=".$tempHospitalId." and employee_des='".$tempEmployeeDes."'"." and employee_profit=".$tempEmployeeProfit)
                ->select();
            if(count($before_3m_moneys)>0){
                $before_3m_money = $before_3m_moneys[0]['pay_sum_money'];
            }else{
                $before_3m_money = 0;
            }
            //			$before_3m_money=$this->makeArrKeyDHE($before_3m_money);
            //获取后三月支付金额
            $after_3m_moneys=$dailySellModel
                ->field('convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money')
                ->where(
                    "sell_date>='".$date_e.
                    "' AND sell_date<'".$after_3month_e."'".
                    " AND employee_id=".$id." and drug_id=".$tempDrugId." and hospital_id=".$tempHospitalId." and employee_des='".$tempEmployeeDes."'"." and employee_profit=".$tempEmployeeProfit)
                ->select();
            //			$after_3m_money=$this->makeArrKeyDHE($after_3m_money);
            if(count($after_3m_moneys)>0){
                $after_3m_money = $after_3m_moneys[0]['pay_sum_money'];
            }else{
                $after_3m_money = 0;
            }
            //获取下月支付金额和销量
            $after_1m_moneys=$dailySellModel
                ->field('convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money,sum(sell_amount) sum_sell_amount')
                ->where(
                    "sell_date>='".$date_e.
                    "' AND sell_date<'".$after_1month_e."'".
                    " AND employee_id=".$id." and drug_id=".$tempDrugId." and hospital_id=".$tempHospitalId." and employee_des='".$tempEmployeeDes."'"." and employee_profit=".$tempEmployeeProfit)
                ->select();
            if(count($after_1m_moneys)>0){
                $after_1m_money = $after_1m_moneys[0]['pay_sum_money'];
                $after_1m_amount = $after_1m_moneys[0]['sum_sell_amount'];
            }else{
                $after_1m_money = 0;
                $after_1m_amount = 0;
            }

            $all_data[$i]['before_3m_money']=(float)$before_3m_money;
            $all_data[$i]['after_3m_money']=(float)$after_3m_money;
            $all_data[$i]['next_amount']=(int)$after_1m_amount;
            $all_data[$i]['next_money']=(float)$after_1m_money;
            $all_data[$i]['pay_sum_money']=(float)$all_data[$i]['pay_sum_money'];
            $all_data[$i]['sell_amount']=(int)$all_data[$i]['sell_amount'];

        }
        return array(
            "dailySellList" => $all_data,
            "totalCount" => $count
        );
    }


	/**
	 * 获取父表点击后的子表内容
	 */
	public function getDailySellDetail4DeleHuikuan($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		//业务员id
		$drug_id=$params['drug_id'];

		$search_date_to = $params['search_date_to'];
		$search_date_from = $params['search_date_from'];
		if($params['search_date_to']<$params['$search_date_from']){
			$search_date_to = $params['search_date_from'];
			$search_date_from = $params['search_date_to'];
		}

		$dailySellModel=M('bill_daily_sell');

		$all_data=$dailySellModel
			->where(
				"huikuan_status=".FIdConst::DAILY_SELL_STATUS_DELE_HUIKUAN_INIT.
				" AND drug_id=".$drug_id." and employee_des='公司利润' ".
				" AND ((sell_date>='".$search_date_from.
				"' AND sell_date<='".$search_date_to."'))")
			->field("*,GROUP_CONCAT(id) sell_id_list,convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money,sum(sell_amount) sell_amount,DATE_FORMAT(sell_date,'%Y-%m') sell_month")
			->group('hospital_id,sell_month,batch_num')
			->select();
		$count =count($all_data);

		//获取其他需要填充的数据
		for($i = 0; $i<count($all_data);$i++) {

		}
		return array(
			"dailySellList" => $all_data,
			"totalCount" => $count
		);
	}

	/**
	 * 编辑操作，根据支付单id，获取对应dailySell列表
	 * @param $edit_id 
	 */
	public function getEditDailySellDetail($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		//实例化模型
		$dailySellModel=M('bill_daily_sell');
		$businessPayModel=M('bill_business_pay');

		$search_date_to = $params['search_date_to'];
		$search_date_from = $params['search_date_from'];
		if($params['search_date_to']<$params['$search_date_from']){
			$search_date_to = $params['search_date_from'];
			$search_date_from = $params['search_date_to'];
		}


		//获取待编辑的支付单信息
		$pay=$businessPayModel->where('id='.$params['edit_id'])->find();
		//获取支付的月份
		$date=$pay['pay_month'];
		//当前月的范围
		$date_b=$date.'-01';
		$date_e=date('Y-m',strtotime($date." +1 month")).'-01';
		$confirmedStatus = FIdConst::DAILY_SELL_STATUS_CONFIRMED;
		$count=$dailySellModel
			->count();
		$all_data=$dailySellModel
			->where("(status=".$confirmedStatus." AND employee_id=".$pay['employee_id']." AND sell_date>='".$search_date_from. "' AND sell_date<='".$search_date_to."') or paybill_id='".$params['edit_id']."'")
			->field("*,GROUP_CONCAT(id) sell_id_list,convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money,sum(sell_amount) sell_amount,DATE_FORMAT(sell_date,'%Y-%m') sell_month")
			->group('drug_id,hospital_id,employee_des,employee_profit,sell_month')
			->select();

		//返回数据
		return array(
			"dailySellList" => $all_data,
			"totalCount" => $count
		);
	}

    public function getEditDailySellDetailByAgent($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        //实例化模型
        $dailySellModel=M('bill_daily_sell');
        $investPayModel=M('bill_invest_pay');

        $search_date_to = $params['search_date_to'];
        $search_date_from = $params['search_date_from'];
        if($params['search_date_to']<$params['$search_date_from']){
            $search_date_to = $params['search_date_from'];
            $search_date_from = $params['search_date_to'];
        }


        //获取待编辑的支付单信息
        $pay=$investPayModel->where('id='.$params['edit_id'])->find();
        //获取支付的月份
        $date=$pay['pay_month'];
        //当前月的范围
        $date_b=$date.'-01';
        $date_e=date('Y-m',strtotime($date." +1 month")).'-01';
        $confirmedStatus = FIdConst::DAILY_SELL_STATUS_CONFIRMED;
        $count=$dailySellModel
            ->count();
        $select_id = explode(',',$pay['select_id']);
        $all_data = array();
        foreach($select_id as $k=>$v){
            $all_data = array_merge($all_data,$dailySellModel->where('id='.$v)
                ->where("(status=".$confirmedStatus." AND sell_date>='".$search_date_from. "' AND sell_date<='".$search_date_to."') or paybill_id='".$params['edit_id']."'")
                ->field("*,GROUP_CONCAT(id) sell_id_list,convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money,sum(sell_amount) sell_amount,DATE_FORMAT(sell_date,'%Y-%m') sell_month")
                ->group('drug_id,hospital_id,employee_des,employee_profit,sell_month')
                ->select())
                ;
        }


        //返回数据
        return array(
            "dailySellList" => $all_data,
            "totalCount" => $count
        );
    }


	/**
	 * 编辑操作，根据支付单id，获取对应dailySell列表，用于代销回款单
	 * @param $edit_id
	 */
	public function getEditDailySellDetail4Huikuan($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        //实例化模型
        $dailySellModel=M('bill_daily_sell');
        $dekeHuikuanModel=M('bill_dele_huikuan_sub');

        $search_date_to = $params['search_date_to'];
        $search_date_from = $params['search_date_from'];
        if($params['search_date_to']<$params['$search_date_from']){
            $search_date_to = $params['search_date_from'];
            $search_date_from = $params['search_date_to'];
        }


        //获取待编辑的回款单信息
        $huikuan_bill=$dekeHuikuanModel->where('id='.$params['edit_id'])->find();

        $count=$dailySellModel
            ->count();
        $all_data=$dailySellModel
            ->where("(drug_id=".$huikuan_bill['drug_id']." and huikuan_status=".FIdConst::DAILY_SELL_STATUS_DELE_HUIKUAN_INIT." AND employee_des='公司利润' AND sell_date>='".$search_date_from. "' AND sell_date<='".$search_date_to."') or huikuan_bill_code='".$huikuan_bill['bill_code']."'")
            ->field("*,GROUP_CONCAT(id) sell_id_list,sum(sell_amount) sell_amount,DATE_FORMAT(sell_date,'%Y-%m') sell_month")
            ->group('hospital_id,batch_num,sell_month')
            ->select();

        //返回数据
        return array(
            "dailySellList" => $all_data,
            "totalCount" => $count
        );
	}


	/*
	 * 根据区域id获取
	 */
	public function searchByAreaId($id,$page,$limit,&$result=array()){
		$re=M('bill_daily_sell')->where('region_id='.$id)->select();
		if(count($re)>0){
			$result=array_merge($result,$re);
		}
		$children=M('info_region')->where('parent_id='.$id)->select();
		if(count($children)>0){
			foreach ($children as $k=>$v){
				$this->searchByAreaId($v['id'],$page,$limit,$result);
			}
		}
		return $result;
	}

	public function  getAllSubDailySellList($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		$dailySell_db = M('bill_daily_sell');
		$page = $params['page'];
		$start = $params['start'];
		$limit = $params['limit'];

		unset($params['page']);
		unset($params['start']);
		unset($params['limit']);

		import("ORG.Util.Page");
		$whereStr = $this->likeSearch($params);



	}
	public function getBrandFullNameById($db, $brandId) {
		$sql = "select full_name from t_goods_brand where id = '%s' ";
		$data = $db->query($sql, $brandId);
		if ($data) {
			return $data[0]["full_name"];
		} else {
			return null;
		}
	}

	/**
	 * 新建或编辑销售信息条目
	 */
	public function editDailySell($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		$idService = new IdGenService();
		if($params['id']){
			//编辑条目
			$bill_status = (int)$params['status'];
			if($bill_status<2){
				$dailySell_db = D('bill_daily_sell_temp');
			}else if($bill_status==3||$bill_status==4){
				return $this->bad("已经付款的单据不可以再编辑");
			}else{
				$dailySell_db = D('bill_daily_sell');
			}

			$stock_db = M("info_stock");//库存表直接操作就好
			$dailySell_db->startTrans();

			try{
				/*
                 * 判断配送公司相关库存信息是否匹配，不匹配的话新建库存信息
                 * 得到新建的或者是匹配的库存的相关信息
                 *
                 */
				$drug2deliver_db = M("info_drug2deliver");
				$drug_db  = M("info_drug");
				if($params['drug_id']>0){
					$drug_infos = $drug_db->where("id=".$params['drug_id'])->select();
					if(count($drug_infos)==1){
						$drug_info = $drug_infos[0];
					}else{
						return $this->bad("找不到该药品");
					}
				}else{
					$drug_infos = $drug_db->where("common_name='".$params['drug_name']."' and manufacturer='".$params['drug_manufacture']."' and guige='".$params['drug_guige']."'")->select();
					if(count($drug_infos)==1){
						$drug_info = $drug_infos[0];
						$params['drug_id'] = $drug_info['id'];
					}else{
						return $this->bad("找不到该药品");
					}
				}

				$deliver_infos = M("info_deliver")->where("id=".$params['deliver_id'])->select();
				if(count($deliver_infos)==1){
					$deliver_info  = $deliver_infos[0];
				}else{
					return $this->bad("操作出错");
				}

				$drug2deliver_list = $drug2deliver_db->where(" drug_id=".$params['drug_id']." and deliver_id = ".$params['deliver_id'])->select();
				if(count($drug2deliver_list)<1){
					//更新药品和配送公司对应关系的json数组
//				$drug_info_list = $drug_db->where("id=".$params['drug_id'])->select();
//				$drug_info = $drug_info_list[0];
//				$drug_info_json = json_decode($drug_info['deliver_list'],true);
//				$drug_deliver_list = $drug_info_json['drug_deliverList'];
//				$drug_deliver_list[] = array(
//					"id"=>$params['deliver_id'],
//					"name"=>$params['deliver_name']
//				);
//				$drug_info_json = json_encode(array(
//					"drug_deliverList"=>$drug_deliver_list
//				));
//				//更新药品的deliver的json数组
//				$drug_db->where("id=".$params['drug_id'])->setField("deliver_list",$drug_info_json);
					return $this->bad("没有该药品对应的配送公司分配，请先分配配送公司再操作");
				}


				//药品---配送公司---批号   对应关系
				$stock_list = $stock_db->where(" drug_id=".$params['drug_id']." and deliver_id = ".$params['deliver_id']." and batch_num='".$params['batch_num']."'")->select();
				if(count($stock_list)<1){
					//找不到对应的记录
					$stock_id =  $stock_db->add(array(
						"drug_id"=>$params['drug_id'],
						"drug_name"=> $drug_info['common_name'],
						"deliver_id" =>$params['deliver_id'],
						"deliver_name"=>$deliver_info['name'],
						"batch_num"=>$params['batch_num'],
						"id"=>$params['drug_id']."*".$params['deliver_id']."*".$params['batch_num'],
					));
					$params['stock_id'] = $stock_id['id'];
				}else {
					$stock = $stock_list[0];
					$stock_id = $stock['id'];
				}

				$params['stock_id'] = $stock_id;
				$params['operate_info'] = $dailySell_db->where("id=".$params['id'])->getField("operate_info").$this->getOperateInfo("编辑");
				$dailySell_db->save($params);
			}catch( Exception $e ) {
				$dailySell_db->rollback();
				return $this->bad("保存出错");
			}
			$dailySell_db->commit();
			return $this->ok($params['id']);
		}else{
			//新增一个条目
			$dailySell_db = D('bill_daily_sell_temp');
			$dailySell_db->startTrans();
			try{
				$params['status'] = FIdConst::DAILY_SELL_STATUS_TEMP_UNMATCTHED;
				$params['create_time'] = time();
				$params['creator_id'] = session("loginUserId");
				$params['bill_code'] = $idService->newId();
				$params['operate_info'] = $this->getOperateInfo("新建");
				$params['id'] = $dailySell_db->add($params);
			}catch(Exception $e){
				$dailySell_db->rollback();
				return $this->bad("操作出错！");
			}
			$dailySell_db->commit();
			return $this->ok($params['id']);
		}


	}


	/**
	 * 修改销售条目提成
	 */
	public function updateDailySellProfit($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		$idService = new IdGenService();
        $inData = json_decode(html_entity_decode($params['inData']),true);
		if($inData['ids']){
			//编辑条目
            $temp_db  = M("bill_daily_sell");
            $temp_db->startTrans();
			try{
                for( $i = 0;$i<count($inData['ids']);$i++){
                    $data['employee_profit'] = $inData['profit'];
                    $temp_db->where("id=".$inData['ids'][$i])->save($data);
                }
                $temp_db->commit();
                return $this->ok(count($inData['ids']));
			}catch( Exception $e ) {
                $temp_db->rollback();
				return $this->bad("保存出错");
			}
		}
	}

	/**
	 * 删除销售信息条目
	 */
	public function deleteDailySell($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
		$temp_db = M("bill_daily_sell_temp");
		$db = M("bill_daily_sell");

		$list = json_decode(html_entity_decode($params['list']),true);
		if(count($list)<1){
			return $this->bad("操作错误");
		}

		$temp_db->startTrans();
		$db->startTrans();
		try{
			foreach ($list as $item) {
				if($item['status']<=FIdConst::DAILY_SELL_STATUS_TEMP_UNMATCTHED){
					$temp_db->where("id=".$item['id'])->delete();
				}else{
					$db->where("id=".$item['id'])->delete();
				}
		}
		}catch (Exception $e){
			$temp_db->rollback();
			$db->rollback();
		}
		$temp_db->commit();
		$db->commit();

		return $this->ok();
	}

	/**
	 * 销售信息条目字段，查询数据
	 */
	public function queryData($queryKey) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		if ($queryKey == null) {
			$queryKey = "";
		}

		$key = "%{$queryKey}%";

		$sql = "select g.id, g.code, g.name, g.spec, u.name as unit_name
				from t_goods g, t_goods_unit u
				where (g.unit_id = u.id)
				and (g.code like '%s' or g.name like '%s' or g.py like '%s'
					or g.spec like '%s' or g.spec_py like '%s') ";
		$queryParams = array();
		$queryParams[] = $key;
		$queryParams[] = $key;
		$queryParams[] = $key;
		$queryParams[] = $key;
		$queryParams[] = $key;

		$ds = new DataOrgService();
		$rs = $ds->buildSQL("1001-01", "g");
		if ($rs) {
			$sql .= " and " . $rs[0];
			$queryParams = array_merge($queryParams, $rs[1]);
		}

		$sql .= " order by g.code
				limit 20";
		$data = M()->query($sql, $queryParams);
		$result = array();
		foreach ( $data as $i => $v ) {
			$result[$i]["id"] = $v["id"];
			$result[$i]["code"] = $v["code"];
			$result[$i]["name"] = $v["name"];
			$result[$i]["spec"] = $v["spec"];
			$result[$i]["unitName"] = $v["unit_name"];
		}

		return $result;
	}

	/**
	 * 销售信息条目字段，查询数据
	 *
	 * @param unknown $queryKey
	 */
	public function queryDataWithSalePrice($queryKey) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		if ($queryKey == null) {
			$queryKey = "";
		}

		$key = "%{$queryKey}%";

		$sql = "select g.id, g.code, g.name, g.spec, u.name as unit_name, g.sale_price, g.memo
				from t_goods g, t_goods_unit u
				where (g.unit_id = u.id)
				and (g.code like '%s' or g.name like '%s' or g.py like '%s'
					or g.spec like '%s' or g.spec_py like '%s') ";

		$queryParams = array();
		$queryParams[] = $key;
		$queryParams[] = $key;
		$queryParams[] = $key;
		$queryParams[] = $key;
		$queryParams[] = $key;

		$ds = new DataOrgService();
		$rs = $ds->buildSQL("1001-01", "g");
		if ($rs) {
			$sql .= " and " . $rs[0];
			$queryParams = array_merge($queryParams, $rs[1]);
		}

		$sql .= " order by g.code
				limit 20";
		$data = M()->query($sql, $queryParams);
		$result = array();
		foreach ( $data as $i => $v ) {
			$result[$i]["id"] = $v["id"];
			$result[$i]["code"] = $v["code"];
			$result[$i]["name"] = $v["name"];
			$result[$i]["spec"] = $v["spec"];
			$result[$i]["unitName"] = $v["unit_name"];
			$result[$i]["salePrice"] = $v["sale_price"];
			$result[$i]["memo"] = $v["memo"];
		}

		return $result;
	}

	/**
	 * 销售信息条目字段，查询数据
	 */
	public function queryDataWithPurchasePrice($queryKey) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		if ($queryKey == null) {
			$queryKey = "";
		}

		$key = "%{$queryKey}%";

		$sql = "select g.id, g.code, g.name, g.spec, u.name as unit_name, g.purchase_price, g.memo
				from t_goods g, t_goods_unit u
				where (g.unit_id = u.id)
				and (g.code like '%s' or g.name like '%s' or g.py like '%s'
					or g.spec like '%s' or g.spec_py like '%s') ";

		$queryParams = array();
		$queryParams[] = $key;
		$queryParams[] = $key;
		$queryParams[] = $key;
		$queryParams[] = $key;
		$queryParams[] = $key;

		$ds = new DataOrgService();
		$rs = $ds->buildSQL("1001-01", "g");
		if ($rs) {
			$sql .= " and " . $rs[0];
			$queryParams = array_merge($queryParams, $rs[1]);
		}

		$sql .= " order by g.code
				limit 20";
		$data = M()->query($sql, $queryParams);
		$result = array();
		foreach ( $data as $i => $v ) {
			$result[$i]["id"] = $v["id"];
			$result[$i]["code"] = $v["code"];
			$result[$i]["name"] = $v["name"];
			$result[$i]["spec"] = $v["spec"];
			$result[$i]["unitName"] = $v["unit_name"];
			$result[$i]["purchasePrice"] = $v["purchase_price"] == 0 ? null : $v["purchase_price"];
			$result[$i]["memo"] = $v["memo"];
		}

		return $result;
	}

	/**
	 * 获得某个销售信息条目的详情
	 */
	public function getDailySellInfo($id, $regionId) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		$dailySell_db = M("bill_daily_sell");
		$region_db = M("info_region");
		$params = array(
			"id"=>$id
		);
		$dailySell_data  = $dailySell_db->where($params)->select();
		$params['id'] = $regionId;
		$region_info = $region_db->where($params)->select();

		$result = $dailySell_data[0];
		$result['region_id'] = $region_info[0]['id'];
		$result['region_name'] = $region_info[0]['region_name'];
		return $result;

	}

	/**
	 * 获得某个销售信息条目的安全库存列表
	 */
	public function goodsSafetyInventoryList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$id = $params["id"];

		$result = array();

		$db = M();
		$sql = "select u.name
				from t_goods g, t_goods_unit u
				where g.id = '%s' and g.unit_id = u.id";
		$data = $db->query($sql, $id);
		if (! $data) {
			return $result;
		}
		$goodsTypeName = $data[0]["name"];

		$sql = "select w.id as warehouse_id, w.code as warehouse_code, w.name as warehouse_name,
					s.safety_inventory, s.inventory_upper
				from t_warehouse w
				left join t_goods_si s
				on w.id = s.warehouse_id and s.goods_id = '%s'
				where w.inited = 1 ";
		$queryParams = array();
		$queryParams[] = $id;
		$ds = new DataOrgService();
		$rs = $ds->buildSQL(FIdConst::HOSPITAL, "w");
		if ($rs) {
			$sql .= " and " . $rs[0];
			$queryParams = array_merge($queryParams, $rs[1]);
		}
		$sql .= " order by w.code";
		$data = $db->query($sql, $queryParams);
		$r = array();
		foreach ( $data as $i => $v ) {
			$r[$i]["warehouseId"] = $v["warehouse_id"];
			$r[$i]["warehouseCode"] = $v["warehouse_code"];
			$r[$i]["warehouseName"] = $v["warehouse_name"];
			$r[$i]["safetyInventory"] = $v["safety_inventory"];
			$r[$i]["inventoryUpper"] = $v["inventory_upper"];
			$r[$i]["unitName"] = $goodsTypeName;
		}

		foreach ( $r as $i => $v ) {
			$sql = "select balance_count
					from t_inventory
					where warehouse_id = '%s' and goods_id = '%s' ";
			$data = $db->query($sql, $v["warehouseId"], $id);
			if (! $data) {
				$result[$i]["inventoryCount"] = 0;
			} else {
				$result[$i]["inventoryCount"] = $data[0]["balance_count"];
			}

			$result[$i]["warehouseCode"] = $v["warehouseCode"];
			$result[$i]["warehouseName"] = $v["warehouseName"];
			$result[$i]["safetyInventory"] = $v["safetyInventory"];
			$result[$i]["inventoryUpper"] = $v["inventoryUpper"];
			$result[$i]["unitName"] = $goodsTypeName;
		}

		return $result;
	}

	/**
	 * 获得某个销售信息条目安全库存的详情
	 */
	public function siInfo($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$id = $params["id"];

		$result = array();

		$db = M();
		$sql = "select u.name
				from t_goods g, t_goods_unit u
				where g.id = '%s' and g.unit_id = u.id";
		$data = $db->query($sql, $id);
		if (! $data) {
			return $result;
		}
		$goodsTypeName = $data[0]["name"];

		$sql = "select w.id as warehouse_id, w.code as warehouse_code,
					w.name as warehouse_name,
					s.safety_inventory, s.inventory_upper
				from t_warehouse w
				left join t_goods_si s
				on w.id = s.warehouse_id and s.goods_id = '%s'
				where w.inited = 1 ";
		$queryParams = array();
		$queryParams[] = $id;

		$ds = new DataOrgService();
		$rs = $ds->buildSQL(FIdConst::HOSPITAL, "w");
		if ($rs) {
			$sql .= " and " . $rs[0];
			$queryParams = array_merge($queryParams, $rs[1]);
		}

		$sql .= " order by w.code ";
		$data = $db->query($sql, $queryParams);
		foreach ( $data as $i => $v ) {
			$result[$i]["warehouseId"] = $v["warehouse_id"];
			$result[$i]["warehouseCode"] = $v["warehouse_code"];
			$result[$i]["warehouseName"] = $v["warehouse_name"];
			$result[$i]["safetyInventory"] = $v["safety_inventory"] ? $v["safety_inventory"] : 0;
			$result[$i]["inventoryUpper"] = $v["inventory_upper"] ? $v["inventory_upper"] : 0;
			$result[$i]["unitName"] = $goodsTypeName;
		}

		return $result;
	}

	/**
	 * 设置销售信息条目的安全
	 */
	public function editSafetyInventory($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$json = $params["jsonStr"];
		$bill = json_decode(html_entity_decode($json), true);
		if ($bill == null) {
			return $this->bad("传入的参数错误，不是正确的JSON格式");
		}

		$db = M();

		$id = $bill["id"];
		$items = $bill["items"];

		$idGen = new IdGenService();

		$db->startTrans();

		$sql = "select code, name, spec from t_goods where id = '%s'";
		$data = $db->query($sql, $id);
		if (! $data) {
			$db->rollback();
			return $this->bad("销售信息条目不存在，无法设置销售信息条目安全库存");
		}
		$goodsCode = $data[0]["code"];
		$goodsName = $data[0]["name"];
		$goodsSpec = $data[0]["spec"];

		$sql = "delete from t_goods_si where goods_id = '%s' ";
		$rc = $db->execute($sql, $id);
		if ($rc === false) {
			$db->rollback();
			return $this->sqlError(__LINE__);
		}

		foreach ( $items as $v ) {
			$warehouseId = $v["warehouseId"];
			$si = $v["si"];
			if (! $si) {
				$si = 0;
			}
			if ($si < 0) {
				$si = 0;
			}
			$upper = $v["invUpper"];
			if (! $upper) {
				$upper = 0;
			}
			if ($upper < 0) {
				$upper = 0;
			}
			$sql = "insert into t_goods_si(id, goods_id, warehouse_id, safety_inventory, inventory_upper)
						values ('%s', '%s', '%s', %d, %d)";
			$rc = $db->execute($sql, $idGen->newId(), $id, $warehouseId, $si, $upper);
			if ($rc === false) {
				$db->rollback();
				return $this->sqlError(__LINE__);
			}
		}

		$bs = new BizlogService();
		$log = "为销售信息条目[$goodsCode $goodsName $goodsSpec]设置安全库存";
		$bs->insertBizlog($log, $this->LOG_CATEGORY_HOSPITAL);

		$db->commit();

		return $this->ok();
	}

	/**
	 * 通过条形码查询销售信息条目信息, 销售出库单使用
	 */
	public function queryDailySellInfoByBarcode($params) {
		$barcode = $params["barcode"];

		$result = array();

		$db = M();
		$sql = "select g.id, g.code, g.name, g.spec, g.sale_price, u.name as unit_name
				from t_goods g, t_goods_unit u
				where g.bar_code = '%s' and g.unit_id = u.id ";
		$data = $db->query($sql, $barcode);

		if (! $data) {
			$result["success"] = false;
			$result["msg"] = "条码为[{$barcode}]的销售信息条目不存在";
		} else {
			$result["success"] = true;
			$result["id"] = $data[0]["id"];
			$result["code"] = $data[0]["code"];
			$result["name"] = $data[0]["name"];
			$result["spec"] = $data[0]["spec"];
			$result["salePrice"] = $data[0]["sale_price"];
			$result["unitName"] = $data[0]["unit_name"];
		}

		return $result;
	}

	/**
	 * 通过条形码查询销售信息条目信息, 采购入库单使用
	 */
	public function queryDailySellInfoByBarcodeForPW($params) {
		$barcode = $params["barcode"];

		$result = array();

		$db = M();
		$sql = "select g.id, g.code, g.name, g.spec, g.purchase_price, u.name as unit_name
				from t_goods g, t_goods_unit u
				where g.bar_code = '%s' and g.unit_id = u.id ";
		$data = $db->query($sql, $barcode);

		if (! $data) {
			$result["success"] = false;
			$result["msg"] = "条码为[{$barcode}]的销售信息条目不存在";
		} else {
			$result["success"] = true;
			$result["id"] = $data[0]["id"];
			$result["code"] = $data[0]["code"];
			$result["name"] = $data[0]["name"];
			$result["spec"] = $data[0]["spec"];
			$result["purchasePrice"] = $data[0]["purchase_price"];
			$result["unitName"] = $data[0]["unit_name"];
		}

		return $result;
	}

	/**
	 * 查询销售信息条目种类总数
	 */
	public function getTotalDailySellCount($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$dailySell_db = M("bill_daily_sell");
		$data = $dailySell_db->where($params)->select();
		$result["cnt"] = count($data);
		return $result;
	}

	/**
	 * 获得所有的品牌
	 */
	public function allBrands() {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$result = array();
		$sql = "select id, name, full_name
				from t_goods_brand b
				where (parent_id is null)
				";
		$queryParam = array();
		$ds = new DataOrgService();
		$rs = $ds->buildSQL(FIdConst::HOSPITAL_BRAND, "b");
		if ($rs) {
			$sql .= " and " . $rs[0];
			$queryParam = array_merge($queryParam, $rs[1]);
		}

		$sql .= " order by name";

		$db = M();
		$data = $db->query($sql, $queryParam);
		$result = array();
		foreach ( $data as $i => $v ) {
			$id = $v["id"];
			$result[$i]["id"] = $id;
			$result[$i]["text"] = $v["name"];
			$fullName = $v["full_name"];
			if (! $fullName) {
				$fullName = $v["name"];
			}
			$result[$i]["fullName"] = $fullName;

			$children = $this->allBrandsInternal($db, $id, $rs);

			$result[$i]["children"] = $children;
			$result[$i]["leaf"] = count($children) == 0;
			$result[$i]["expanded"] = true;
		}

		return $result;
	}

	private function allBrandsInternal($db, $parentId, $rs) {
		$result = array();
		$sql = "select id, name, full_name
				from t_goods_brand b
				where (parent_id = '%s')
				";
		$queryParam = array();
		$queryParam[] = $parentId;
		if ($rs) {
			$sql .= " and " . $rs[0];
			$queryParam = array_merge($queryParam, $rs[1]);
		}

		$sql .= " order by name";
		$data = $db->query($sql, $queryParam);
		foreach ( $data as $i => $v ) {
			$id = $v["id"];
			$result[$i]["id"] = $v["id"];
			$result[$i]["text"] = $v["name"];
			$fullName = $v["full_name"];
			if (! $fullName) {
				$fullName = $v["name"];
			}
			$result[$i]["fullName"] = $fullName;

			$children = $this->allBrandsInternal($db, $id, $rs); // 自身递归调用

			$result[$i]["children"] = $children;
			$result[$i]["leaf"] = count($children) == 0;
			$result[$i]["expanded"] = true;
		}

		return $result;
	}

	/**
	 * 新增或编辑销售信息条目品牌
	 */
	public function editBrand($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$id = $params["id"];
		$name = $params["name"];
		$parentId = $params["parentId"];

		$db = M();
		$db->startTrans();

		$log = null;

		$us = new UserService();
		$dataOrg = $us->getLoginUserDataOrg();
		$companyId = $us->getCompanyId();

		if ($id) {
			// 编辑品牌

			// 检查品牌是否存在
			$sql = "select name
					from t_goods_brand
					where id = '%s' ";
			$data = $db->query($sql, $id);
			if (! $data) {
				$db->rollback();
				return $this->bad("要编辑的品牌不存在");
			}
			if ($parentId) {
				// 检查上级品牌是否存在
				$sql = "select full_name
						from t_goods_brand
						where id = '%s' ";
				$data = $db->query($sql, $parentId);
				if (! data) {
					$db->rollback();
					return $this->bad("选择的上级品牌不存在");
				}
				$parentFullName = $data[0]["full_name"];

				// 上级品牌不能是自身
				if ($parentId == $id) {
					$db->rollback();
					return $this->bad("上级品牌不能是自身");
				}

				// 检查下级品牌不能是作为上级品牌
				$tempParentId = $parentId;
				while ( $tempParentId != null ) {
					$sql = "select parent_id
							from t_goods_brand
							where id = '%s' ";
					$data = $db->query($sql, $tempParentId);
					if ($data) {
						$tempParentId = $data[0]["parent_id"];
					} else {
						$tempParentId = null;
					}

					if ($tempParentId == $id) {
						$db->rollback();
						return $this->bad("下级品牌不能作为上级品牌");
					}
				}
			}
			if ($parentId) {
				$fullName = $parentFullName . "\\" . $name;
				$sql = "update t_goods_brand
							set name = '%s', parent_id = '%s', full_name = '%s'
							where id = '%s' ";
				$rc = $db->execute($sql, $name, $parentId, $fullName, $id);
				if ($rc === false) {
					$db->rollback();
					return $this->sqlError(__LINE__);
				}
			} else {
				$sql = "update t_goods_brand
							set name = '%s', parent_id = null, full_name = '%s'
							where id = '%s' ";
				$rc = $db->execute($sql, $name, $name, $id);
				if ($rc === false) {
					$db->rollback();
					return $this->sqlError(__LINE__);
				}
			}

			// 同步下级品牌的full_name
			$this->updateSubBrandsFullName($db, $id);

			$log = "编辑销售信息条目品牌[$name]";
		} else {
			// 新增品牌

			// 检查上级品牌是否存在
			$fullName = $name;
			if ($parentId) {
				$sql = "select full_name
						from t_goods_brand
						where id = '%s' ";
				$data = $db->query($sql, $parentId);
				if (! $data) {
					$db->rollback();
					return $this->bad("所选择的上级销售信息条目品牌不存在");
				}
				$fullName = $data[0]["full_name"] . "\\" . $name;
			}

			$idGen = new IdGenService();
			$id = $idGen->newId($db);

			if ($parentId) {
				$sql = "insert into t_goods_brand(id, name, full_name, parent_id, data_org, company_id)
						values ('%s', '%s', '%s', '%s', '%s', '%s')";
				$rc = $db->execute($sql, $id, $name, $fullName, $parentId, $dataOrg, $companyId);
				if ($rc === false) {
					$db->rollback();
					return $this->sqlError(__LINE__);
				}
			} else {
				$sql = "insert into t_goods_brand(id, name, full_name, parent_id, data_org, company_id)
						values ('%s', '%s', '%s', null, '%s', '%s')";
				$rc = $db->execute($sql, $id, $name, $fullName, $dataOrg, $companyId);
				if ($rc === false) {
					$db->rollback();
					return $this->sqlError(__LINE__);
				}
			}

			$log = "新增销售信息条目品牌[$name]";
		}

		// 记录业务日志
		if ($log) {
			$bs = new BizlogService();
			$bs->insertBizlog($log, $this->LOG_CATEGORY_BRAND);
		}

		$db->commit();

		return $this->ok($id);
	}

	private function updateSubBrandsFullName($db, $parentId) {
		$sql = "select full_name from t_goods_brand where id = '%s' ";
		$data = $db->query($sql, $parentId);
		if (! $data) {
			return;
		}

		$parentFullName = $data[0]["full_name"];
		$sql = "select id, name
				from t_goods_brand
				where parent_id = '%s' ";
		$data = $db->query($sql, $parentId);
		foreach ( $data as $i => $v ) {
			$id = $v["id"];
			$fullName = $parentFullName . "\\" . $v["name"];
			$sql = "update t_goods_brand
					set full_name = '%s'
					where id = '%s' ";
			$db->execute($sql, $fullName, $id);

			// 递归调用自身
			$this->updateSubBrandsFullName($db, $id);
		}
	}

	/**
	 * 获得某个品牌的上级品牌全称
	 */
	public function brandParentName($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$result = array();

		$id = $params["id"];

		$db = M();
		$sql = "select name, parent_id
				from t_goods_brand
				where id = '%s' ";
		$data = $db->query($sql, $id);
		if (! $data) {
			return $result;
		}

		$result["name"] = $data[0]["name"];
		$parentId = $data[0]["parent_id"];
		$result["parentBrandId"] = $parentId;
		if ($parentId) {
			$sql = "select full_name
					from t_goods_brand
					where id = '%s' ";
			$data = $db->query($sql, $parentId);
			if ($data) {
				$result["parentBrandName"] = $data[0]["full_name"];
			} else {
				$result["parentBrandId"] = null;
				$result["parentBrandName"] = null;
			}
		} else {
			$result["parentBrandName"] = null;
		}

		return $result;
	}

	/**
	 * 删除销售信息条目品牌
	 */
	public function deleteBrand($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}

		$id = $params["id"];

		$db = M();
		$db->startTrans();

		$sql = "select full_name from t_goods_brand where id = '%s' ";
		$data = $db->query($sql, $id);
		if (! $data) {
			$db->rollback();
			return $this->bad("要删除的品牌不存在");
		}
		$fullName = $data[0]["full_name"];

		$sql = "select count(*) as cnt from t_goods
				where brand_id = '%s' ";
		$data = $db->query($sql, $id);
		$cnt = $data[0]["cnt"];
		if ($cnt > 0) {
			$db->rollback();
			return $this->bad("品牌[$fullName]已经在销售信息条目中使用，不能删除");
		}

		$sql = "select count(*) as cnt from t_goods_brand where parent_id = '%s' ";
		$data = $db->query($sql, $id);
		$cnt = $data[0]["cnt"];
		if ($cnt > 0) {
			$db->rollback();
			return $this->bad("品牌[$fullName]还有子品牌，所以不能被删除");
		}

		$sql = "delete from t_goods_brand where id = '%s' ";
		$rc = $db->execute($sql, $id);
		if ($rc === false) {
			$db->rollback();
			return $this->sqlError(__LINE__);
		}

		$log = "删除销售信息条目品牌[$fullName]";
		$bs = new BizlogService();
		$bs->insertBizlog($log, $this->LOG_CATEGORY_BRAND);

		$db->commit();

		return $this->ok();
	}

	/**
	 * 销售信息条目构成
	 */
	public function goodsBOMList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$dao = new DailySellBomDAO();
		return $dao->goodsBOMList($params);
	}


	/*
	 * 根据要紧的id获取对应的医院分配信息
	 *
	 * */

	public  function afterDrugSelected($params){
		if($params == null||count($params)==0){
			return ;
		}
		$drug_id = $params['drug_id'];
		$drug2hosDB = M('info_drug2hospital');
		$hospitalLists = $drug2hosDB->where("drug_id=".$params['drug_id'])->field("hospital_id,hospital_name")->select();
		$stock_info  = M("info_stock");
		$deliverList = $stock_info->where("drug_id=".$drug_id)->field("deliver_id,deliver_name")->select();
		$batchList = $stock_info->where("drug_id=".$drug_id)->field("deliver_id,batch_num")->select();
		return array(
			"hospitalList"=>$hospitalLists,
			"deliverList"=>$deliverList,
			"batchList"=>$batchList
		);
	}


	/*
	 * 测试自动抓取流向功能
	 *
	 */



    public  function onAutoFetchDailySells($params){
        if($params == null||count($params)==0){
            return ;
        }




    }




}
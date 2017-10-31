<?php

namespace Home\Service;

/**
 * 报表Service
 *
 * @author RCG
 */
class YeWuYuanService extends PSIBaseService {

	/**
	 * 根据日期范围查询daily_sell
	 */
	public function dailySellItemsQueryData($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];


		$daily_db = M("bill_daily_sell");
		import("ORG.Util.Page");

		//获取业务员用户id
		$employee_id=session("loginUserId");
		//获取开始时间
		$dtFrom=$params['dtFrom'];
		//获取截止时间
		$dtTo=$params['dtTo'];

		$count =$daily_db
			->where("sell_date >='".$dtFrom."' AND sell_date <='".$dtTo."' AND employee_id=".$employee_id." and drug_name like '%".$params['drug_name']."%'")
			->count();
		$all_data = $daily_db
			->where("sell_date >='".$dtFrom."' AND sell_date <='".$dtTo."' AND employee_id=".$employee_id." and drug_name like '%".$params['drug_name']."%'")
			->page($page,$limit)
			->select();
		for( $i = 0; $i<count($all_data);$i++){
			$all_data[$i]['sum_money'] = (float)$all_data[$i]['employee_profit']*(float)$all_data[$i]['sell_amount'];
			$all_data[$i]['sell_amount'] = (float)$all_data[$i]['sell_amount'];
		}
		return array(
			"all_data" => $all_data,
			"totalCount" => $count
		);
	}

	/**
	 * 根据日期范围查询销售报表
	 */
	public function sellReportQueryData($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

//		$page = $params["page"];
//		$start = $params["start"];
//		$limit = $params["limit"];


		$daily_db_view = M("sell_report_query_data_by_month");
		//获取业务员用户id
		$employee_id=session("loginUserId");

		$all_data = $daily_db_view->where("sell_year ='".$params['date']."' AND employee_id=".$employee_id." AND employee_des like '%".$params['employee_des']."%'")->select();
		foreach($all_data as $k=>$v){
			$all_data[$k]['01_month'] = (int)$all_data[$k]['01_month'];
			$all_data[$k]['02_month'] = (int)$all_data[$k]['02_month'];
			$all_data[$k]['03_month'] = (int)$all_data[$k]['03_month'];
			$all_data[$k]['04_month'] = (int)$all_data[$k]['04_month'];
			$all_data[$k]['05_month'] = (int)$all_data[$k]['05_month'];
			$all_data[$k]['06_month'] = (int)$all_data[$k]['06_month'];
			$all_data[$k]['07_month'] = (int)$all_data[$k]['07_month'];
			$all_data[$k]['08_month'] = (int)$all_data[$k]['08_month'];
			$all_data[$k]['09_month'] = (int)$all_data[$k]['09_month'];
			$all_data[$k]['10_month'] = (int)$all_data[$k]['10_month'];
			$all_data[$k]['11_month'] = (int)$all_data[$k]['11_month'];
			$all_data[$k]['12_month'] = (int)$all_data[$k]['12_month'];
		}
		return array(
			"all_data" => $all_data,
			"totalCount" => count($all_data)
		);
	}

	public function paymentInfoQueryData($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];

		$daily_db = M("bill_business_pay");
		//获取业务员用户id
		$employee_id=session("loginUserId");
		//获取开始时间
		$year_s=$params['date'].'-01';
		$year_e=($params['date']+1).'-01';

		$count = $daily_db
			->where("pay_month >='".$year_s."' AND pay_month <'".$year_e."' AND employee_id=".$employee_id)
			->count();
		$all_data = $daily_db
			->where("pay_month >='".$year_s."' AND pay_month <'".$year_e."' AND employee_id=".$employee_id)
			->page($page,$limit)
			->select();

		return array(
			"all_data" => $all_data,
			"totalCount" => $count
		);
	}

}
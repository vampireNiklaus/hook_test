<?php

namespace Home\Service;
use Home\Common\FIdConst;

/**
 * 销售报表Service
 *
 * @author Baoyu Li
 */
class ReportService extends PSIBaseService {
	/**
 * 根据日期,药品查询销售总表
 */
	public function sellReportSummaryQueryData($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];
		import("ORG.Util.Page");

		if($params['drug_id']){
			$drug_infos = M("info_drug")->where("id=".$params['drug_id'])->select();
            $count = count($drug_infos);
		}else{
            $whereStr = '';
            if (session("loginUserId") != FIdConst::ADMIN_USER_ID) {
                $conditionalFilter4Drug = $this->conditionalFilter4Drug();
                $whereStr = $whereStr."id in(".$conditionalFilter4Drug.")";
            }
			$drug_infos = M("info_drug")->where($whereStr)->page($page,$limit)->select();
            $count = M('info_drug')->count();
		}

		$all_data = array(

		);
		foreach ($drug_infos as $drug_info) {
			$sell_datas = M("bill_daily_sell")->where(" drug_id=".$drug_info['id']." and sell_date between '".$params['date']."-01-01' and '".$params['date']."-12-31' and employee_name='公司'")->select();
			$inn_data = array(
				"drug_id"=>$drug_info['id'],
				"drug_name"=>$drug_info['common_name'],
				"drug_guige"=>$drug_info['guige'],
				"drug_manufacture"=>$drug_info['manufacturer'],
				"01_month"=>0,
				"02_month"=>0,
				"03_month"=>0,
				"04_month"=>0,
				"05_month"=>0,
				"06_month"=>0,
				"07_month"=>0,
				"08_month"=>0,
				"09_month"=>0,
				"10_month"=>0,
				"11_month"=>0,
				"12_month"=>0,
				"sum_year"=>0,
			);
			foreach ($sell_datas as $sell_data) {
				$month = date("m",strtotime($sell_data['sell_date']));
				$inn_data[$month."_month"] += $sell_data['sell_amount'];
				$inn_data["sum_year"] += $sell_data['sell_amount'];
			}
			$all_data[] = $inn_data;
			unset($sell_datas);
			unset($inn_data);
		}
		return array(
			"allData" => $all_data,
			"totalCount" => $count
		);
	}

	/**
	 * 根据地区与药品相关信息查询数据
	 */
	public function sellReportRegionSortQueryData($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
        if($params['drug_id'] == ""){
            return $this->bad("请首先选择品种");
        }
//		$page = $params["page"];
//		$start = $params["start"];
//		$limit = $params["limit"];

		$hospitalTypes = json_decode(html_entity_decode($params['hospital_type']),true);

		$daily_sell_full_view = M("bill_daily_sell_full");
        if (in_array("全选",$hospitalTypes)){
			$all_data = $daily_sell_full_view->where(" sell_date between '".$params['date']."-01-01' and '".$params['date']."-12-31' AND drug_id=".$params['drug_id']." and employee_name='公司'")->select();
		}else{
			$map['hospital_type'] = array('in',$hospitalTypes);
			$all_data = $daily_sell_full_view->where(" sell_date between '".$params['date']."-01-01' and '".$params['date']."-12-31' AND drug_id=".$params['drug_id']." and employee_name='公司'")->where($map)->select();
		}
		if(count($all_data)>0) {
			$all_data0 = $all_data[0];
			$drug_name = $all_data0['drug_name'];
			$drug_guige = $all_data0['drug_guige'];
			$drug_manufacture = $all_data0['drug_manufacture'];
			$employee_des = $all_data0['employee_des'];
			$employee_profit = $all_data0['employee_profit'];
            if($params['if_by_region'] == "是"){
                $region = M("info_region")->where("id=" . $params['region_id'])->find();
                $region_name = $region['region_name'];
                $returnArray = array();
                //通过region_id获取该region_id下的所有的下一级别的地区。
                $subRegions = M("info_region")->where("parent_id=" . $params['region_id'])->select();
            }

			if($params['if_by_region'] == "是" && count($subRegions)>0){
				//按照地区查询，并且没有到县这一级别
				foreach ($subRegions as $regionItem) {
					$regionItemId = $regionItem['id'];
					$regionItemHospitals = $this->searchByAreaId($regionItemId);
					$tempInnerArray = array(
						"01_month" => 0,
						"02_month" => 0,
						"03_month" => 0,
						"04_month" => 0,
						"05_month" => 0,
						"06_month" => 0,
						"07_month" => 0,
						"08_month" => 0,
						"09_month" => 0,
						"10_month" => 0,
						"11_month" => 0,
						"12_month" => 0,
						"sum_year" => 0
					);
					foreach ($regionItemHospitals as $regionItemHospital) {
						foreach ($all_data as $dataItem) {
							if ($dataItem['hospital_id'] == $regionItemHospital['id']) {
								$month = date("m",strtotime($dataItem['sell_date']));
								$tempInnerArray[$month."_month"] += $dataItem['sell_amount'];
								$tempInnerArray["sum_year"] += $dataItem['sell_amount'];
							}
						}
					}
					$tempArray = array(
						"region_name" => $regionItem['region_name'],
						"region_id" => $regionItem['id'],
						"drug_id" => $params['drug_id'],
						"drug_name" => $drug_name,
						"drug_guige" => $drug_guige,
						"drug_manufacture" => $drug_manufacture,
						"employee_des" => $employee_des,
						"employee_profit" => $employee_profit,
						"01_month" => $tempInnerArray['01_month'],
						"02_month" => $tempInnerArray['02_month'],
						"03_month" => $tempInnerArray['03_month'],
						"04_month" => $tempInnerArray['04_month'],
						"05_month" => $tempInnerArray['05_month'],
						"06_month" => $tempInnerArray['06_month'],
						"07_month" => $tempInnerArray['07_month'],
						"08_month" => $tempInnerArray['08_month'],
						"09_month" => $tempInnerArray['09_month'],
						"10_month" => $tempInnerArray['10_month'],
						"11_month" => $tempInnerArray['11_month'],
						"12_month" => $tempInnerArray['12_month'],
						"sum_year" => $tempInnerArray['sum_year'],
					);
					$returnArray[] = $tempArray;
				}
			}else{
                if($params['if_by_region'] == "否"){
                    $regionItemHospitals = M("info_hospital")->select();
                }else{
                    //到了县这一级别的时候，直接显示对应的医院
                    $regionItemHospitals = $this->searchByAreaId($params['region_id']);
                }

				$returnArray = array();
				foreach($regionItemHospitals as $hospitalItem){
					$tempInnerArray = array(
						"01_month" => 0,
						"02_month" => 0,
						"03_month" => 0,
						"04_month" => 0,
						"05_month" => 0,
						"06_month" => 0,
						"07_month" => 0,
						"08_month" => 0,
						"09_month" => 0,
						"10_month" => 0,
						"11_month" => 0,
						"12_month" => 0,
						"sum_year" => 0
					);
					$tempInnerArray['region_name'] = $region_name;
					$tempInnerArray['drug_name'] = $drug_name;
					$tempInnerArray['drug_guige'] = $drug_guige;
					$tempInnerArray['drug_manufacture'] = $drug_manufacture;
					$tempInnerArray['employee_des'] = $employee_des;
					$tempInnerArray['employee_profit'] = $employee_profit;
					$tempInnerArray['hospital_name'] = $hospitalItem['hospital_name'];
					foreach($all_data as $all_data_item){
						if($hospitalItem['id']==$all_data_item['hospital_id']){
							$month = date("m",strtotime($all_data_item['sell_date']));
							$tempInnerArray[$month."_month"] += $all_data_item['sell_amount'];
							$tempInnerArray["sum_year"] += $all_data_item['sell_amount'];
						}
					}
					if($tempInnerArray['sum_year']!=0){
						$returnArray[] = $tempInnerArray;
					}
					unset($tempInnerArray);
				}
			}
		}else{
			$returnArray[] = array();
		}

		for($i=0;$i<count($returnArray);$i++){
			unset($returnArray[$i]['employee_profit']);
		}
		return array(
			"allData" => $returnArray,
			"totalCount" => count($returnArray)
		);
	}

    /**
	 * 根据地区与药品相关信息查询数据
	 */
	public function getProductIODetailList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

        if($params['drug_id']!=''&&$params['drug_id']!=null){
            $drugs = M("info_drug")->where("id=".$params['drug_id'])->page($params['page'],$params['limit'])->select();
        }else{
            $drugs = M("info_drug")->page($params['page'],$params['limit'])->select();
//            return $this->bad("请先选择一个品种");
        }
        $count = count($drugs);

        $date_start = $params['date']."-01";
        $date_end = date('Y-m-d', strtotime("$date_start +1 month -1 day"));

        $pre_date_start = date('Y-m-d', strtotime("$date_start -1 month"));
        $pre_date_end = date('Y-m-d', strtotime("$pre_date_start +1 month -1 day"));

        $returnData = [];
        //数据结构元
        $innerData['drug_name'] = '';
        $innerData['yewu_date'] = '';
        $innerData['goods_in'] = '';
        $innerData['shangye_huikuan'] = '';
        $innerData['other_in'] = '';
        $innerData['yewu_pay'] = '';
        $innerData['manage_pay'] = '';
        $innerData['goods_out'] = '';
        $innerData['guarantee_pay'] = '';
        $innerData['tax_pay'] = '';
        $innerData['other_yewu_out'] = '';
        $innerData['bussiness_rebate'] = '';
        $innerData['office_pay'] = '';
        $innerData['remain_sum'] = '';
        $innerData['note'] = '';

        for( $i = 0; $i<count($drugs);$i++){
            $drug_id = $drugs[$i]['id'];
            $drug_info = $drugs[$i];
            unset($innerData);
            unset($innerSumData);
            $innerData = [];
            $innerSumData = [];
            //首先计算上个月的结存
            $innerData['drug_name'] = $drug_info['common_name'];
            $innerData['yewu_date'] = '上月结存';
            $innerData['goods_in'] = 0;
            $innerSumData['goods_in'] =$innerData['goods_in'];

            $innerData['shangye_huikuan'] = M("bill_self_huikuan_sub")->where("drug_id=".$drug_id." and status=1 and bill_date <'".$date_start."'")->getField("sum(sum_kaipiao_money)");
            $innerData['shangye_huikuan'] = $innerData['shangye_huikuan'] == null? 0: $innerData['shangye_huikuan'];
            $innerSumData['shangye_huikuan'] =$innerData['shangye_huikuan'];


            $innerData['other_in'] = M("bill_extra")->where("bill_type='收入' and drug_id=".$drug_id." and status = 1 and yewu_date < '".$date_start."'")->getField("sum(money)");
            $innerData['other_in'] = $innerData['other_in'] == null? 0: $innerData['other_in'];
            $innerSumData['other_in'] =$innerData['other_in'];

            $innerData['yewu_pay'] = M("bill_daily_sell")->where("drug_id=".$drug_id." and sell_date<'".$date_start."' and if_paid = 1 and employee_des!='管理员' and employee_des!='公司利润'")->getField("sum(employee_profit*sell_amount)");
            $innerData['yewu_pay'] = $innerData['yewu_pay'] == null? 0: $innerData['yewu_pay'];
            $innerSumData['yewu_pay'] =$innerData['yewu_pay'];

            $innerData['manage_pay'] =  M("bill_daily_sell")->where("drug_id=".$drug_id." and sell_date<'".$date_start."' and if_paid = 1 and employee_des='管理员'")->getField("sum(employee_profit*sell_amount)");;
            $innerData['manage_pay'] = $innerData['manage_pay'] == null? 0: $innerData['manage_pay'];
            $innerSumData['manage_pay'] =$innerData['manage_pay'];

            $innerData['goods_out'] = M("bill_self_pay")->where("drug_id=".$drug_id." and status = ".FIdConst::SELF_PAY_STATUS_VERIFY_PASSED." and yewu_date< '".$date_start."'")->getField("sum(sum_pay_money)");
            $innerData['goods_out'] = $innerData['goods_out'] == null? 0: $innerData['goods_out'];
            $innerSumData['goods_out'] =$innerData['goods_out'];


            $innerData['guarantee_pay'] = 0;
            $innerSumData['guarantee_pay'] =$innerData['guarantee_pay'];


            $innerData['tax_pay'] = M("bill_self_tax_sub")->where("drug_id=".$drug_id." and status=".FIdConst::SELF_PAY_STATUS_VERIFY_PASSED." and yewu_date<'".$date_start."'")->getField("sum(sum_tax_money)");;
            $innerData['tax_pay'] = $innerData['tax_pay'] == null? 0: $innerData['tax_pay'];
            $innerSumData['tax_pay'] =$innerData['tax_pay'];


            $innerData['other_yewu_out'] = M("bill_extra")->where("bill_type='支出' and drug_id=".$drug_id." and status = 1 and yewu_date < '".$date_start."'")->getField("sum(money)");;
            $innerData['other_yewu_out'] = $innerData['other_yewu_out'] == null? 0: $innerData['other_yewu_out'];
            $innerSumData['other_yewu_out'] =$innerData['other_yewu_out'];


            $innerData['bussiness_rebate'] = 0;
            $innerSumData['bussiness_rebate'] =$innerData['bussiness_rebate'];

            $innerData['office_pay'] = 0;
            $innerSumData['office_pay'] =$innerData['office_pay'];


            $innerData['remain_sum'] = $innerData['goods_in']+$innerData['shangye_huikuan']+$innerData['other_in']-$innerData['yewu_pay']-$innerData['manage_pay']-$innerData['goods_out']
                                        -$innerData['guarantee_pay']-$innerData['tax_pay']-$innerData['other_yewu_out']-$innerData['bussiness_rebate']-$innerData['office_pay'];
            $innerSumData['remain_sum'] =$innerData['remain_sum'];

            foreach ($innerData as $key=>$value){
                if($key!='remain_sum'&&$key!='drug_name'&&$key!='yewu_date'&&$value!=0){
                    $innerData[$key] = number_format($value,3);
                }
            }
            $innerData['note'] = '';
            $returnData[] = $innerData;
            //再计算本月的每个条目相关
            for($temp_date = date('Y-m-d', strtotime("$date_start"));$temp_date<$date_end;$temp_date = date('Y-m-d', strtotime("$temp_date +1 day"))){
                $innerData['drug_name'] = $drug_info['common_name'];
                $innerData['yewu_date'] = $temp_date;
                $innerData['goods_in'] = 0;
                $innerSumData['goods_in'] +=$innerData['goods_in'];

                $innerData['shangye_huikuan'] = M("bill_self_huikuan_sub")->where("drug_id=".$drug_id." and status=1 and bill_date ='".$temp_date."'")->getField("sum(sum_kaipiao_money)");
                $innerData['shangye_huikuan'] = $innerData['shangye_huikuan'] == null? 0: $innerData['shangye_huikuan'];
                $innerSumData['shangye_huikuan'] +=$innerData['shangye_huikuan'];


                $innerData['other_in'] = M("bill_extra")->where("bill_type='收入' and drug_id=".$drug_id." and status = 1 and yewu_date = '".$temp_date."'")->getField("sum(money)");
                $innerData['other_in'] = $innerData['other_in'] == null? 0: $innerData['other_in'];
                $innerSumData['other_in'] +=$innerData['other_in'];

                $innerData['yewu_pay'] = M("bill_daily_sell")->where("drug_id=".$drug_id." and sell_date='".$temp_date."' and if_paid = 1 and employee_des!='管理员' and employee_des!='公司利润'")->getField("sum(employee_profit*sell_amount)");
                $innerData['yewu_pay'] = $innerData['yewu_pay'] == null? 0: $innerData['yewu_pay'];
                $innerSumData['yewu_pay'] +=$innerData['yewu_pay'];

                $innerData['manage_pay'] =  M("bill_daily_sell")->where("drug_id=".$drug_id." and sell_date='".$temp_date."' and if_paid = 1 and employee_des='管理员'")->getField("sum(employee_profit*sell_amount)");;
                $innerData['manage_pay'] = $innerData['manage_pay'] == null? 0: $innerData['manage_pay'];
                $innerSumData['manage_pay'] +=$innerData['manage_pay'];

                $innerData['goods_out'] = M("bill_self_pay")->where("drug_id=".$drug_id." and status = ".FIdConst::SELF_PAY_STATUS_VERIFY_PASSED." and yewu_date= '".$temp_date."'")->getField("sum(sum_pay_money)");
                $innerData['goods_out'] = $innerData['goods_out'] == null? 0: $innerData['goods_out'];
                $innerSumData['goods_out'] +=$innerData['goods_out'];


                $innerData['guarantee_pay'] = 0;
                $innerSumData['guarantee_pay'] +=$innerData['guarantee_pay'];


                $innerData['tax_pay'] = M("bill_self_tax_sub")->where("drug_id=".$drug_id." and status=".FIdConst::SELF_PAY_STATUS_VERIFY_PASSED." and yewu_date ='".$temp_date."'")->getField("sum(sum_tax_money)");;
                $innerData['tax_pay'] = $innerData['tax_pay'] == null? 0: $innerData['tax_pay'];
                $innerSumData['tax_pay'] +=$innerData['tax_pay'];


                $innerData['other_yewu_out'] = M("bill_extra")->where("bill_type='支出' and drug_id=".$drug_id." and status = 1 and yewu_date = '".$temp_date."'")->getField("sum(money)");;
                $innerData['other_yewu_out'] = $innerData['other_yewu_out'] == null? 0: $innerData['other_yewu_out'];
                $innerSumData['other_yewu_out'] +=$innerData['other_yewu_out'];


                $innerData['bussiness_rebate'] = 0;
                $innerSumData['bussiness_rebate'] +=$innerData['bussiness_rebate'];

                $innerData['office_pay'] = 0;
                $innerSumData['office_pay'] +=$innerData['office_pay'];


                $innerData['remain_sum'] = $innerData['goods_in']+$innerData['shangye_huikuan']+$innerData['other_in']-$innerData['yewu_pay']-$innerData['manage_pay']-$innerData['goods_out']
                    -$innerData['guarantee_pay']-$innerData['tax_pay']-$innerData['other_yewu_out']-$innerData['bussiness_rebate']-$innerData['office_pay'];
                $innerSumData['remain_sum'] +=$innerData['remain_sum'];
                $innerData['note'] = '';
                foreach ($innerData as $key=>$value){
                    if($key!='remain_sum'&&$key!='note'&&$key!='drug_name'&&$key!='yewu_date'&&$value!=0){
                        $innerData[$key] = number_format($value,3);
                        $returnData[] = $innerData;
                        break;
                    }
                }
            }
            //最后计算汇总的值
            $innerSumData['drug_name'] = $drug_info['common_name'];
            $innerSumData['yewu_date'] = '合计';
            $returnData[] = $innerSumData;
            $innerData = [];
            $returnData[] = $innerData;
            $returnData[] = $innerData;
        }

		return array(
			"productIODetailList" => $returnData,
			"totalCount" => $count
		);
	}



	/**
	 * 根据品种与日期查询产品进销汇总表
	 */
	public function getProductJinXiaoSumList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

        if($params['drug_id']!=''&&$params['drug_id']!=null){
            $drugs = M("info_drug")->where("id=".$params['drug_id'])->page($params['page'],$params['limit'])->select();
        }else{
            $drugs = M("info_drug")->page($params['page'],$params['limit'])->select();
        }
        $count = count($drugs);

        $date_start = $params['date_s']."-01";
        $date_end = $params['date_e']."-01";

//        $pre_date_start = date('Y-m-d', strtotime("$date_start -1 month"));
//        $pre_date_end = date('Y-m-d', strtotime("$pre_date_start +1 month -1 day"));

        $returnData = [];
        //数据结构元
        $innerData['drug_name'] = '';
        $innerData['yewu_date'] = '';
        $innerData['qichu_amount'] = '';
        $innerData['qichu_stock_money'] = '';
        $innerData['jinhuo_amount'] = '';
        $innerData['jinhuo_huokuan'] = '';
        $innerData['xkfh_money'] = '';
        $innerData['xkfh_amount'] = '';
        $innerData['fahuo_amount'] = '';
        $innerData['fahuo_money'] = '';
        $innerData['qimo_amount'] = '';
        $innerData['qimo_stock_money'] = '';
        $innerData['note'] = '';
        $innerSumData = [];

        for( $i = 0; $i<count($drugs);$i++){
            for($temp_date_s = $date_start;$temp_date_s<=$date_end;$temp_date_s = date('Y-m-d', strtotime("$temp_date_s +1 month")))
            {
                $temp_date_e = date('Y-m-d', strtotime("$temp_date_s +1 month -1 day"));
                $drug_id = $drugs[$i]['id'];
                $drug_info = $drugs[$i];
                $innerData = [];
                $innerSumData = [];
                //首先计算上个月的结存
                $innerData['drug_name'] = $drug_info['common_name'];
                $innerData['yewu_date'] = '截止日期'.$temp_date_s;
                $qichu = M("bill_self_stock_sub")->where("drug_id=".$drug_id." and status=1 and instock_date <'".$temp_date_s."'")->field("sum(stock_num) sum_amount,sum(stock_num*kaipiao_unit_price) sum_money")->select();
                $innerData['qichu_amount'] = $qichu[0]==null?0:$qichu[0]['sum_amount'];
                $innerData['qichu_stock_money'] = $qichu[0]==null?0:$qichu[0]['sum_money'];

                $innerSumData['qichu_amount'] += $innerData['qichu_amount'];
                $innerSumData['qichu_stock_money'] += $innerData['qichu_stock_money'];

                $jinhuo = M("bill_self_pay")->where("drug_id=".$drug_id." and status=".FIdConst::SELF_PAY_STATUS_VERIFY_PASSED." and yewu_date between '".$temp_date_s."' and '".$temp_date_e."'")->field("sum(pay_amount) sum_amount,sum(sum_pay_money) sum_money")->select();
                $innerData['jinhuo_amount'] = $jinhuo[0]==null?0:$jinhuo[0]['sum_amount'];
                $innerData['jinhuo_huokuan'] = $jinhuo[0]==null?0:$jinhuo[0]['sum_money'];

                $innerSumData['jinhuo_amount'] += $innerData['jinhuo_amount'];
                $innerSumData['jinhuo_huokuan'] += $innerData['jinhuo_huokuan'];

                $innerData['xkfh_amount'] = 0;
                $innerData['xkfh_money'] = 0;

                $innerSumData['xkfh_amount'] += $innerData['xkfh_amount'];
                $innerSumData['xkfh_money'] += $innerData['xkfh_money'];


                $kaipiaoInfo = M("bill_self_stock_kaipiao_sub")->where("status=1 and drug_id=".$drugs[$i]['id'])->group("drug_id,kaipiao_unit_price,batch_num")->field('kaipiao_unit_price,batch_num')->select();
                $fahuo = M("bill_daily_sell")->where("drug_id=".$drug_id."  and sell_date between '".$temp_date_s."' and '".$temp_date_e."' and employee_des='公司利润'")->field("employee_profit,batch_num,sell_amount")->select();
                foreach ($fahuo as $key=>$value){
                    $innerData['fahuo_amount'] += $value['sell_amount'];
                    $innerSumData['fahuo_amount'] +=$innerData['fahuo_amount'];
                    foreach($kaipiaoInfo as $s=>$item){
                        if($item['batch_num'] == $value['batch_num']){
                            $innerData['fahuo_money'] += $value['sell_amount']*$item['kaipiao_unit_price'];
                            $innerSumData['fahuo_money'] +=$innerData['fahuo_money'];
                        }
                    }
                }

                $innerData['qimo_amount'] = $innerData['qichu_amount'] + $innerData['jinhuo_amount']-$innerData['fahuo_amount'];
                $innerData['qimo_stock_money'] = $innerData['qichu_stock_money'] + $innerData['jinhuo_huokuan'] - $innerData['fahuo_money'];
                $innerSumData['qimo_amount'] += $innerData['qimo_amount'];
                $innerSumData['qimo_stock_money'] += $innerData['qimo_stock_money'];

                $innerData['note'] = '';
                $returnData[] = $innerData;
            }


            //最后计算汇总的值
            $innerSumData['drug_name'] = $drug_info['common_name'];
            $innerSumData['yewu_date'] = '合计';
            $returnData[] = $innerSumData;
            $innerData = [];
            $returnData[] = $innerData;
            $returnData[] = $innerData;
        }

		return array(
			"productJinXiaoSumList" => $returnData,
			"totalCount" => $count
		);
	}


	/**
	 * 根据品种与日期查询产品应收账款明细
	 */
	public function getProduct2ReceiveMoneyList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

        if($params['drug_id']!=''&&$params['drug_id']!=null){
            $drugs = M("info_drug")->where("id=".$params['drug_id'])->page($params['page'],$params['limit'])->select();
        }else{
            $drugs = M("info_drug")->page($params['page'],$params['limit'])->select();
        }
        $count = count($drugs);

        $date_start = $params['date']."-01";
        $date_end = date('Y-m-d', strtotime("$date_start +1 month -1 day"));
        $date_end_pre = date('Y-m-d', strtotime("$date_start -1 day"));
        $date_now = date("y-m-d",time());
        if(date('Y-m-d', strtotime("$date_now +1 month -1 day"))<$date_end){
            return $this->bad("日期只能选择当前月份或者当前月份之前的月份");
        }


//        $pre_date_start = date('Y-m-d', strtotime("$date_start -1 month"));
//        $pre_date_end = date('Y-m-d', strtotime("$pre_date_start +1 month -1 day"));

        $returnData = [];
        //数据结构元
        $innerData['drug_name'] = '';
        $innerData['deliver'] = '';
        $innerData['end_should_receive_amount'] = '';
        $innerData['end_should_receive__money'] = '';
        $innerData['puhuo_amount'] = '';
        $innerData['puhuo_unitprice'] = '';
        $innerData['puhuo_sum_money'] = '';
        $innerData['huikuan_amount'] = '';
        $innerData['huikuan_sum_money'] = '';
        $innerData['month_end_should_amount'] = '';
        $innerData['month_end_should_sum_money'] = '';
        $innerData['note'] = '';
        $innerSumData = [];

        for( $i = 0; $i<count($drugs);$i++){
            //品种，配送公司，批号，和价格的对应
            $deliverInStockInfo = M("bill_self_stock_sub")->where("status=1 and drug_id=".$drugs[$i]['id'])->group("drug_id,deliver_id,batch_num")->field('drug_id,deliver_id,kaipiao_unit_price,batch_num')->select();
            //品种，配送公司，批号和库存数量的对应
            $deliverBatchs =M("info_stock")->where("drug_id=".$drugs[$i]['id'])->group("batch_num,deliver_id")->field("deliver_id,deliver_name,batch_num,amount")->select();
            //品种，配送公司的对应
            $deliverItems =M("info_stock")->where("drug_id=".$drugs[$i]['id'])->group("deliver_id")->field("deliver_name,deliver_id")->select();
            $preMonthDeliverBatchs = M("info_stock_daily_record")->where("drug_id=".$drugs[$i]['id']." and record_date='".$date_end_pre."'")->group("batch_num,deliver_id")->field("deliver_id,deliver_name,batch_num,amount")->select();
            foreach ($deliverItems as $deliverItem) {
                $innerData['drug_name'] = $drugs[$i]['common_name'];
                $innerData['deliver'] = $deliverItem['deliver_name'];
                $deliver_id = $deliverItem['deliver_id'];
                //得到了品种和对应的配送公司，然后就可以进行组合查询了
                //一个品种，一个库存，同一个批号的价格一样，一定要记住这一点！！

                $end_should_receive_amount = 0;
                $end_should_receive__money = 0;
                //首先计算末应收账款
                $puhuo_amount = 0;
                $puhuo_unitprice = 0;
                $puhuo_sum_money = 0;
                foreach ($deliverBatchs as $deliverBatch) {
                    if($deliverBatch['deliver_id'] == $deliver_id){
                        $batch_num = $deliverBatch['batch_num'];
                        foreach ($deliverInStockInfo as $item){
                            if($item['deliver_id'] == $deliver_id &&$item['batch_num'] == $deliverBatch['batch_num']){
                                $kaipiaoPrice = $item['kaipiao_unit_price'];
                                $end_should_receive_amount +=$deliverBatch['amount'];
                                $end_should_receive__money +=$deliverBatch['amount']*$kaipiaoPrice;
                                break;
                            }
                        }
                    }
                }
                $innerData['end_should_receive_amount'] = $end_should_receive_amount;
                $innerSumData['end_should_receive_amount'] += $end_should_receive_amount;

                $innerData['end_should_receive__money'] = $end_should_receive__money;
                $innerSumData['end_should_receive__money'] += $end_should_receive__money;

                //本月范围内的铺货
                $pays = M("bill_self_pay")->where("drug_id=".$drugs[$i]['id']." and status=1 and yewu_date between '".$date_start."' and'".$date_end."'")->field("sum(sum_pay_money),sum(pay_amount)")->select();
                $innerData['puhuo_amount'] = $pays[0]['pay_amount'];
                $innerSumData['puhuo_amount'] += $pays[0]['pay_amount'];
                $innerData['puhuo_unitprice'] = 0;
                $innerSumData['puhuo_unitprice'] += 0;
                $innerData['puhuo_sum_money'] = $pays[0]['sum_pay_money'];
                $innerSumData['puhuo_sum_money'] += $pays[0]['sum_pay_money'];

                //本月范围内的回款
                $huikuanInfo = M("bill_self_huikuan_sub")->where("drug_id=".$drugs[$i]['id']." and status=1 and deliver_id=".$deliver_id." and bill_date between '".$date_start."' and '".$date_end."'")->field("sum(sum_kaipiao_money),sum(huikuan_num)")->select();
                $innerData['huikuan_amount'] = $huikuanInfo[0]['huikuan_num'];
                $innerSumData['huikuan_amount'] += $huikuanInfo['huikuan_num'];
                $innerData['huikuan_sum_money'] = $huikuanInfo[0]['sum_kaipiao_money'];
                $innerSumData['huikuan_sum_money'] += $huikuanInfo['sum_kaipiao_money'];

                $innerData['month_end_should_amount'] = $innerData['end_should_receive_amount']+$innerData['puhuo_amount']-$innerData['huikuan_amount'];
                $innerSumData['month_end_should_amount'] += $innerData['month_end_should_amount'];
                $innerData['month_end_should_sum_money'] =$innerData['end_should_receive__money']+$innerData['puhuo_sum_money']-$innerData['huikuan_sum_money'];
                $innerSumData['month_end_should_sum_money'] =$innerData['month_end_should_sum_money'];
                $innerData['note'] = '';
            }

            //最后计算汇总的值
            $innerSumData['drug_name'] ='合计';
            $innerSumData['deliver'] = '汇总';
            $returnData[] = $innerSumData;
            $innerData = [];
            $returnData[] = $innerData;
            $returnData[] = $innerData;
        }

		return array(
			"product2ReceiveMoneyList" => $returnData,
			"totalCount" => $count
		);
	}


	/**
	 * 根据品种与日期查询产品铺货利润表
	 */
	public function getProductPuHuoProfitList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

        if($params['drug_id']!=''&&$params['drug_id']!=null){
            $drugs = M("info_drug")->where("id=".$params['drug_id'])->page($params['page'],$params['limit'])->select();
        }else{
            $drugs = M("info_drug")->page($params['page'],$params['limit'])->select();
        }
        $count = count($drugs);

        $date_start = $params['date']."-01";
        $date_end = date('Y-m-d', strtotime("$date_start +1 month -1 day"));
        $date_end_pre = date('Y-m-d', strtotime("$date_start -1 day"));
        $date_now = date("y-m-d",time());
//        if(date('Y-m-d', strtotime("$date_now +1 month -1 day"))<$date_end){
//            return $this->bad("日期只能选择当前月份或者当前月份之前的月份");
//        }


//        $pre_date_start = date('Y-m-d', strtotime("$date_start -1 month"));
//        $pre_date_end = date('Y-m-d', strtotime("$pre_date_start +1 month -1 day"));

        $returnData = [];
        //数据结构元
        $innerData['drug_name'] = '';
        $innerData['date_month'] = '';
        $innerData['sell_amount'] = '';
        $innerData['sell_unit_price'] = '';
        $innerData['sell_sum_money'] = '';
        $innerData['buy_amount'] = '';
        $innerData['buy_unit_price'] = '';
        $innerData['buy_sum_money'] = '';
        $innerData['price_gap'] = '';
        $innerData['tax_sum_money'] = '';
        $innerData['other_out'] = '';
        $innerData['gross_profit'] = '';
        $innerData['note'] = '';
        $innerSumData = [];

        for( $i = 0; $i<count($drugs);$i++){
            //不同配送公司的不同批号的销售数量
            $sellItems = M("bill_daily_sell")->where("sell_date<='".$date_end."' and drug_id=".$drugs[$i]['id'])->group("deliver_id,batch_num")->field('deliver_id,sum(sell_amount),batch_num')->select();
            //配送公司列表
            $sellDelivers = M("bill_daily_sell")->where("sell_date<='".$date_end."' and drug_id=".$drugs[$i]['id'])->group("deliver_id")->field('deliver_id')->select();
            //不同配送公司，不同批号的开票的价格
            $deliverInStockInfo = M("bill_self_stock_sub")->where("status=1 and drug_id=".$drugs[$i]['id'])->group("deliver_id,batch_num")->field('deliver_id,kaipiao_unit_price,batch_num')->select();

            $innerData['drug_name'] = $drugs[$i]['common_name'];
            $innerData['date_month'] ="截至".$params['date'];
            foreach ($sellDelivers as $sellDeliver){
                //计算该配送公司之下的所有的批号的数量和金额
                $deliver = $sellDeliver['deliver_id'];
                foreach ($sellItems as $sellItem) {
                    if($sellItem['deliver_id'] == $deliver){
                        $batch_num = $sellItems['batch_num'];
                        $innerData['sell_amount'] +=$sellItem['sell_amount'];
                        $innerSumData['sell_amount'] +=$innerData['sell_amount'];
                        foreach ($deliverInStockInfo as $batchPrice){
                            if($batchPrice['deliver_id'] == $deliver && $batchPrice['batch_num'] == $batch_num){
                                $kaipiaoPrice = $batchPrice['kaipiao_unit_price'];
                                $innerData['sell_sum_money'] +=$kaipiaoPrice*$sellItem['sell_amount'];
                                $innerSumData['sell_sum_money'] +=$innerData['sell_sum_money'];
                                $innerData['sell_unit_price'] = $kaipiaoPrice;
                                $innerSumData['sell_unit_price'] = $kaipiaoPrice;
                                break;
                            }
                        }
                    }
                }
            }

            //采购的列表
            $buys = M("bill_self_pay")->where("yewu_date<='".$date_end."' and status=".FIdConst::SELF_PAY_STATUS_VERIFY_PASSED." and drug_id=".$drugs[$i]['id'])->field('sum(pay_amount) buy_amount,sum(sum_pay_money) buy_sum_money,avg(unit_price) per_price')->select();
            $innerData['buy_amount'] = $buys[0]['buy_amount'];
            $innerSumData['buy_amount'] += $buys['buy_amount'];
            $innerData['buy_unit_price'] = $buys[0]['per_price'];
//            $innerSumData['buy_unit_price'] += $buys['per_price'];
            $innerData['buy_sum_money'] = $buys[0]['buy_sum_money'];
            $innerSumData['buy_sum_money'] += $buys['buy_sum_money'];

            $innerData['price_gap'] = $innerData['sell_sum_money']- $innerData['buy_sum_money'];
            $innerSumData['price_gap'] += $innerData['price_gap'];

            //税金计算
            $tax = M("bill_self_tax_sub")->where("yewu_date<='".$date_end."' and status=".FIdConst::SELF_TAX_STATUS_VERIFY_PASSED." and drug_id=".$drugs[$i]['id'])->getField('sum(sum_tax_money)');
            $innerData['tax_sum_money'] = $tax;
            $innerSumData['tax_sum_money'] += $tax;


            //其他支出
            $otherOut = M("bill_extra")->where("yewu_date<='".$date_end."' and type_name='支出' and status=1 and drug_id=".$drugs[$i]['id'])->getField('sum(money)');
            $innerData['other_out'] = $otherOut['money'];
            $innerSumData['other_out'] += $otherOut['money'];
            $innerData['gross_profit'] = $innerData['sell_sum_money']-$innerData['buy_sum_money']-$innerData['tax_sum_money']-$innerData['other_out'];
            $innerSumData['gross_profit'] += $innerData['gross_profit'];
            $returnData[] = $innerData;
            //最后计算汇总的值
            $innerSumData['drug_name'] ='合计';
            $innerSumData['deliver'] = '汇总';
            $returnData[] = $innerSumData;
            $innerData = [];
            $returnData[] = $innerData;
            $returnData[] = $innerData;
        }

		return array(
			"productPuHuoProfitList" => $returnData,
			"totalCount" => $count
		);
	}


	/**
	 * 医院业务情况报表分析
	 */
	public function sellReportHospitalBusinessQueryData($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];
		$region_id = $params['region_id'];
		import("ORG.Util.Page");
		if($params['analyse_type'] == "已进院分析"){
			var_dump(1);
			$hospital_business_view = M("report_hospital_business_analyse");
			var_dump(2);
			$all_data = $hospital_business_view->where(" start_date between '".$params['date']."-01' and '".$params['date']."-31' AND drug_id =".$params['drug_id'])->page($page,$limit)->select();
			var_dump(3);
			var_dump($all_data);
			$total_count = $hospital_business_view->where("start_date between '".$params['date']."-01' and '".$params['date']."-31' AND drug_id =".$params['drug_id'])->count();
			var_dump($total_count);
		}elseif($params['analyse_type'] == "未进院分析"){
			$drug_infos = M("info_drug")->where("id = ".$params['drug_id'])->select();
			$drug_info = $drug_infos[0];
			$all_hospitals = M("info_drug2hospital")
				->where("drug_id = ".$params['drug_id'])
				->select();
			$all_data = array();
			for($i = 0;$i<count($all_hospitals);$i++){
				$sell_count = 0;
				$sell_count = M("bill_daily_sell")->where(" drug_id=".$params['drug_id']." and hospital_id=".$all_hospitals[$i]["hospital_id"])->count()
					+  M("bill_daily_sell_temp")->where(" drug_id=".$params['drug_id']." and hospital_id=".$all_hospitals[$i]["hospital_id"])->count();
				if($sell_count>0){
					unset($all_hospitals[$i]);
				}else{
				$all_data[]= array(
					"hospital_name"=>$all_hospitals[$i]['hospital_name'],
					"drug_name"=>$drug_info['common_name'],
					"drug_guige"=>$drug_info['guige'],
					"drug_manufacture"=>$drug_info['manufacturer']
				);
				}
			}
			$total_count = count($all_data);
		}
		return array(
			"allData" => $all_data,
			"totalCount" =>$total_count
		);
	}


	/**
	 * 滞销分析情况
	 */
	public function sellReportUnsalableQueryData($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

        if($params['drug_id'] == ""){
            return $this->bad("请首先选择药品！");
        }

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];


		import("ORG.Util.Page");

		$sell_datas = M("bill_daily_sell")->where(" drug_id=".$params['drug_id']." and sell_date between '".$params['date']."-01-01' and '".$params['date']."-12-31'")->select();
		$employees = M("view_drug_profit_assign")->where(" drug_id=".$params['drug_id'])->page($page,$limit)->select();
		$all_datas = array();
		foreach ($employees as $employee) {
			$employee_item = array(
				"employee_name"=>$employee['employee_name'],
				"employee_des"=>$employee['description'],
				"drug_guige"=>$employee['drug_guige'],
				"drug_name"=>$employee['drug_name'],
				"drug_manufacturer"=>$employee['drug_manufacturer'],
				"hospital_name"=>$employee['hospital_name'],
				"employee_alarm_month"=>$employee['employee_alarm_month'],
				"01_month" => 0,
				"02_month" => 0,
				"03_month" => 0,
				"04_month" => 0,
				"05_month" => 0,
				"06_month" => 0,
				"07_month" => 0,
				"08_month" => 0,
				"09_month" => 0,
				"10_month" => 0,
				"11_month" => 0,
				"12_month" => 0,
				"sum_year" => 0
			);
			for($i=0;$i<count($sell_datas);$i++){
				$sell_data = $sell_datas[$i];
				if($sell_data['hospital_id']==$employee['hospital_id']&&
					$sell_data['employee_id']==$employee['employee_id']){
					$month = date("m",strtotime($sell_data['sell_date']));
					$employee_item[$month."_month"] += $sell_data['sell_amount'];
					$employee_item["sum_year"] += $sell_data['sell_amount'];
//					unset($sell_datas[$i]);
				}
			}
			$all_datas[] = $employee_item;
		}


//		$unsablable_view = M("report_sell_unsalable");
//		$all_data = $unsablable_view->where("sell_year='".$params['date']."' AND drug_id =".$params['drug_id'])->page($page,$limit)->select();
//		$totalCount = $unsablable_view->where("sell_year='".$params['date']."' AND drug_id =".$params['drug_id'])->count();

		return array(
			"allData" => $all_datas,
			"totalCount" => M("info_drug_profit_assign")->where(" drug_id=".$params['drug_id'])->page($page,$limit)->count()
		);
	}

	/**
	 * 销售毛利情况
	 */
	public function sellReportGrossProfitQueryData($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];


		import("ORG.Util.Page");

		$sell_datas = M("bill_daily_sell_full")->where(" sell_date between '".$params['date']."-01' and '".$params['date']."-31' and employee_name='公司' ")->select();
		$drugs = M("info_drug")->page($page,$limit)->select();
		$all_data = array();
		foreach($drugs as $drug){
			$drug_item = array(
				"drug_name"=>$drug['common_name'],
				"drug_guige"=>$drug['guige'],
				"drug_manufacturer"=>$drug['manufacturer'],
				"amount"=>0,
				"saleroom"=>0,
				"gross_profit"=>0,
				"gross_rate"=>0,
			);
			foreach ($sell_datas as $sell_data) {
				if($sell_data['drug_id']==$drug['id']){
					$drug_item['amount'] +=$sell_data['sell_amount'];
					$drug_item['gross_profit'] +=$sell_data['employee_profit']* $sell_data['sell_amount'];

				}
			}
			if($drug_item['amount']>0){
				$drug_item['saleroom'] = $drug['bid_price']*$drug_item['amount'];
				$drug_item['gross_rate'] = round($drug_item['gross_profit']/$drug_item['saleroom'],4)*100 ."%";
			}
			$all_data[] = $drug_item;
		}
		return array(
			"allData" => $all_data,
			"totalCount" => M("info_drug")->count()
		);
	}

	/*业务员报表分析*/
	/**
	 * 根据日期范围查询销售报表
	 */
	public function sellReportQueryData($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];
		$daily_db_view = M("sell_report_query_data_by_month");
		$drug_profit = M("info_drug_profit_assign");
		//获取业务员用户id
		$all_data = $daily_db_view->where("sell_year ='".$params['date']."' and employee_name like '%".$params['employee_name']."%'")->page($page,$limit)->select();
		for($i=0;$i<count($all_data);$i++){
			unset($all_data[$i]['employee_profit']);
		}

        foreach ($all_data as $k => $v) {
            $drug_profit_data = $drug_profit->where('employee_id = '.$v['employee_id'].' and drug_id = '.$v['drug_id'])->find();
            $all_data[$k]['employee_alarm_month'] = $drug_profit_data['employee_alarm_month'];
        }
		return array(
			"all_data" => $all_data,
			"totalCount" =>$daily_db_view->where("sell_year ='".$params['date']."' and employee_name like '%".$params['employee_name']."%'")->count()
		);
	}



	/*业务员支付报表*/
	public function paymentInfoQueryData($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];

		$daily_db = M("view_bill_business_pay_full");
		//获取开始时间
		$year_s=$params['date'].'-01';
		$year_e=($params['date']+1).'-01';

		$count = $daily_db
			->where("pay_month >='".$year_s."' AND pay_month <'".$year_e."' AND employee_name like'%".$params['employee_name']."%'")
			->count();
		$all_data = $daily_db
			->where("pay_month >='".$year_s."' AND pay_month <'".$year_e."' AND employee_name like'%".$params['employee_name']."%'")
			->page($page,$limit)
			->select();

		return array(
			"all_data" => $all_data,
			"totalCount" => $count
		);
	}


	/*进销存总表*/
	public function jinXiaoCunMainQueryData($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];
		if($params['searchType'] == '按月查询'){
			$dateString  = " between '".$params['date']."-01' and '".$params['date']."-31' ";
			$pre_date = date("Y-m-d",strtotime($params['date']."-01 -1 day"));

			$this_date = date("	Y-m-d",time())< date("Y-m-d",strtotime($params['date']."-01 +1 month -1 day"))?
				date("Y-m-d",time()):date("Y-m-d",strtotime($params['date']."-01 +1 month -1 day"));
		}elseif($params['searchType'] == '按年查询'){
			$dateString  = " between '".$params['date']."-01-01' and '".$params['date']."-12-31' ";
			$pre_date = date("Y-m-d",strtotime($params['date']."-01-01 -1 day"));
			$this_date = date("	Y-m-d",time())< date("Y-m-d",strtotime($params['date']."-12-31 +1 day"))?
				date("Y-m-d",time()):date("Y-m-d",strtotime($params['date']."-12-31"));
		}
		$all_data = array();

		$drugs = M("info_drug")->where("common_name like '%".$params['drug_name']."%'")->page($page,$limit)->select();

        foreach($drugs as $k => $drugItem){
            //返回到前端的元数据
            $innerTemp = array(
                "drug_id"=>$drugItem['id'],
                "drug_name"=>$drugItem['common_name'],
                "drug_guige"=>$drugItem['guige'],
                "drug_manufacturer"=>$drugItem['manufacturer'],
                "drug_jx"=>$drugItem['jx'],
                "pre_amount"=>0,
                "pre_money"=>0,
                "this_instock_amount"=>0,
                "this_instock_money"=>0,
                "this_sell_amount"=>0,
                "this_sell_money"=>0,
                "this_amount"=>0,
                "this_money"=>0
            );
            $drug_id = $drugItem['id'];

            //获取本周期内部的入库的信息
            /*这里的入库是指只要已经付款购买的都算作是入库的*/
            if($drugItem['is_self'] ==1){
                //自销药品进货单
                $bills_instock = M("bill_self_pay")->where("status = ".FIdConst::SELF_PAY_STATUS_VERIFY_PASSED." and drug_id=".$drug_id." and yewu_date ".$dateString)->field('pay_amount,sum_pay_money')->select();
                foreach($bills_instock as $inStockItem){
                    $innerTemp['this_instock_amount'] +=$inStockItem['pay_amount'];
                    $innerTemp['this_instock_money'] += $inStockItem['sum_pay_money'];
                }
            }elseif($drug_id['is_self'] == 0){
                //代销药品进货单
                $bills_instock = M("bill_dele_purchase")->where("status=1 and drug_id=".$drug_id." and buy_date".$dateString)->field('stock_num')->select();
                foreach($bills_instock as $inStockItem){
                    $innerTemp['this_instock_amount'] +=$inStockItem['stock_num'];
                }
                $innerTemp['this_instock_money'] = $innerTemp['this_instock_amount'] * $drugItem['base_price'];
            }

            //获取本周期内部的所有的销售的信息
            $sell_datas = M("bill_daily_sell")->where("drug_id=".$drug_id." and employee_name='公司' and sell_date ".$dateString)->field('sell_amount')->select();
            foreach($sell_datas as $sell_data){
                $innerTemp['this_sell_amount'] += $sell_data['sell_amount'];
            }
            $innerTemp['this_sell_money'] = $innerTemp['this_sell_amount']*$drugItem['base_price'];

            //从库存日记录中获取某个日期库存值
            $pre_amount = M('view_drug_stock_daily_record')->where("drug_id=".$drug_id." and record_date='".$pre_date."'")->getField('amount');
            $innerTemp['pre_money'] =$pre_amount*$drugItem['base_price'];

            $this_amount = M('view_drug_stock_daily_record')->where(" drug_id=".$drug_id." and record_date='".$this_date."'")->getField('amount');
            $innerTemp['this_money'] =$this_amount*$drugItem['base_price'];

            $all_data[] = $innerTemp;
        }
		return array(
			"all_data" => $all_data,
			"totalCount" => M("info_drug")->page($page,$limit)->count()
		);
	}
	/*进销存总表*/
	public function jinXiaoCunSellQueryData($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];
		$all_data = M("bill_daily_sell")
			->where(" drug_name like '%".$params['drug_name']."%' and employee_name like '%".$params['employee_name'].
				"%' and sell_date between '".$params['dateFrom']."' and '".$params['dateTo']."'")
			->page($page,$limit)
			->select();


		return array(
			"all_data" => $all_data,
			"totalCount" => M("bill_daily_sell")
				->where(" drug_name like '%".$params['drug_name']."%' and employee_name like '%".$params['employee_name'].
					"%' and sell_date between '".$params['dateFrom']."' and '".$params['dateTo']."'")
				->count()
		);
	}

	/*进货详情表表*/
	public function jinXiaoCunInStockQueryData($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];
		$all_data = array();
		$drugs = array();
		if($params['drug_id']){
			$drug = M("info_drug")->where("id=".$params['drug_id'])->find();
			$drugs[] = $drug;
		}else{
			$drugs = M("info_drug")->select();
		}
		$totalCount = 0;
		foreach($drugs as $drug){
			if($drug['is_self'] == 1){
				//自销药品
				$inStockItems = M("bill_self_stock_sub")
					->alias("stock")
					->join("info_drug on stock.drug_id = info_drug.id")
					->join(" info_deliver on stock.deliver_id = info_deliver.id")
					->join(" info_supplier on stock.supplier_id = info_supplier.id")
					->where( "stock.drug_id=".$drug['id']." and stock.instock_date between '".$params['dateFrom']."' and '".$params['dateTo']."'")
					->field(" info_drug.common_name as drug_name, info_drug.guige as drug_guige,info_drug.manufacturer as drug_manufacturer,
					info_deliver.name as deliver_name,info_supplier.name as supplier_name,stock.instock_date,stock.stock_num as amount,stock.batch_num")
					->page($page,$limit/2)
					->select();
				$totalCount += M("bill_self_stock_sub")
					->alias("stock")
					->join("info_drug on stock.drug_id = info_drug.id")
					->join(" info_deliver on stock.deliver_id = info_deliver.id")
					->join(" info_supplier on stock.supplier_id = info_supplier.id")
					->where( "stock.drug_id=".$drug['id']." and stock.instock_date between '".$params['dateFrom']."' and '".$params['dateTo']."'")
					->field(" info_drug.common_name as drug_name, info_drug.guige as drug_guige,info_drug.manufacturer as drug_manufacturer,
					info_deliver.name as deliver_name,info_supplier.name as supplier_name,stock.instock_date,stock.stock_num as amount,stock.batch_num")
					->count();
			}else{
				//代销药品
				$inStockItems = M("bill_dele_purchase")
					->alias("stock")
					->join("info_drug on stock.drug_id = info_drug.id")
					->join(" info_deliver on stock.deliver_id = info_deliver.id")
					->join(" info_supplier on stock.supplier_id = info_supplier.id")
					->where( "stock.drug_id=".$drug['id']." and stock.instock_date between '".$params['dateFrom']."' and '".$params['dateTo']."'")
					->field(" info_drug.common_name as drug_name, info_drug.guige as drug_guige,info_drug.manufacturer as drug_manufacturer,
					info_deliver.name as deliver_name,info_supplier.name as supplier_name,stock.instock_date,stock.buy_amount as amount,stock.batch_num")
					->page($page,$limit/2)
					->select();
				$totalCount += M("bill_dele_purchase")
					->alias("stock")
					->join("info_drug on stock.drug_id = info_drug.id")
					->join(" info_deliver on stock.deliver_id = info_deliver.id")
					->join(" info_supplier on stock.supplier_id = info_supplier.id")
					->where( "stock.drug_id=".$drug['id']." and stock.instock_date between '".$params['dateFrom']."' and '".$params['dateTo']."'")
					->field(" info_drug.common_name as drug_name, info_drug.guige as drug_guige,info_drug.manufacturer as drug_manufacturer,
					info_deliver.name as deliver_name,info_supplier.name as supplier_name,stock.instock_date,stock.buy_amount as amount,stock.batch_num")
					->count();
			}
			foreach($inStockItems as $item){
				$all_data[] = $item;
			}
			unset($inStockItems);
		}

		return array(
			"all_data" => $all_data,
			"totalCount" => $totalCount
		);
	}


	public function searchByAreaId($id,$page,$limit,&$result=array()){
		$re=M('info_hospital')->where('region_id='.$id)->select();
		if(count($re)>0){
			$result=array_merge($result,$re);
//			if(count($result)>($page+1)*$limit)
//				return $result;
		}
		$children=M('info_region')->where('parent_id='.$id)->select();
		if(count($children)>0){
			foreach ($children as $k=>$v){
				$this->searchByAreaId($v['id'],$page,$limit,$result);
			}
		}
		return $result;
	}

	/**
	 * 产品代理协议报表
	 * @param $params
	 * @return array
	 */
	public function getProductAgencyList($params){
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}

		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];

		$db=M('bill_product_agency');
		$drug_infos=$db
			->alias('pa')
			->join('info_drug AS idr ON pa.drug_id = idr.id')
			->field('pa.*,idr.common_name,idr.is_self')
			->where("pa.bill_date like '%".$params['date']."%'")
			->select();
		foreach ($drug_infos as $drug_info) {
			//这里employee_name是否应该是公司
			$sell_datas = M("bill_daily_sell")->where(" drug_id=".$drug_info['drug_id']." and sell_date between '".$params['date']."-01-01' and '".$params['date']."-12-31' and employee_name='公司'")->select();

			//在这判断是自销还是代销
			if($drug_info['is_self']==1){
				//自销，获取自销采购单中的信息
				$buy_datas = M("bill_self_stock_sub")
                    ->where(" drug_id=".$drug_info['drug_id']." and status=".FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED." and instock_date between '".$params['date']."-01-01' and '".$params['date']."-12-31'")
                    ->field('instock_date buy_date,stock_num buy_amount')
                    ->select();
			}elseif($drug_info['is_self']==0){
				//代销
				$buy_datas = M("bill_dele_purchase")
					->where(" drug_id=".$drug_info['drug_id']." and status=".FIdConst::DELE_PURCHASE_STATUS_VERIFIY_PASSED." and buy_date between '".$params['date']."-01-01' and '".$params['date']."-12-31'")
					->field('buy_date,buy_amount')
					->select();
			}

			$inn_data = array(
				"drug_id"=>$drug_info['drug_id'],
				"common_name"=>$drug_info['common_name'],
				"guige"=>$drug_info['guige'],
				"manufacturer"=>$drug_info['manufacturer'],
				"protocol_time"=>$drug_info['protocol_time'],
				"bill_date"=>$drug_info['bill_date'],
				"amount"=>$drug_info['amount'],
				"earnest_money"=>$drug_info['earnest_money'],
				"01_month_sell"=>0,
				"02_month_sell"=>0,
				"03_month_sell"=>0,
				"04_month_sell"=>0,
				"05_month_sell"=>0,
				"06_month_sell"=>0,
				"07_month_sell"=>0,
				"08_month_sell"=>0,
				"09_month_sell"=>0,
				"10_month_sell"=>0,
				"11_month_sell"=>0,
				"12_month_sell"=>0,
				"sum_sell"=>0,

				"01_month_buy"=>0,
				"02_month_buy"=>0,
				"03_month_buy"=>0,
				"04_month_buy"=>0,
				"05_month_buy"=>0,
				"06_month_buy"=>0,
				"07_month_buy"=>0,
				"08_month_buy"=>0,
				"09_month_buy"=>0,
				"10_month_buy"=>0,
				"11_month_buy"=>0,
				"12_month_buy"=>0,
				"sum_buy"=>0,
			);
			foreach ($sell_datas as $sell_data) {
				$month = date("m",strtotime($sell_data['sell_date']));
				$inn_data[$month."_month_sell"] += $sell_data['sell_amount'];
				$inn_data["sum_sell"] += $sell_data['sell_amount'];
			}
			$inn_data['need_amount']=$inn_data['amount']-$inn_data["sum_sell"];
			$inn_data['sell_rate']=(round($inn_data["sum_sell"]/$inn_data['amount'],4)*100).'%';
			foreach ($buy_datas as $buy_data) {
				$month = date("m",strtotime($buy_data['buy_date']));
				$inn_data[$month."_month_buy"] += $buy_data['buy_amount'];
				$inn_data["sum_buy"] += $buy_data['buy_amount'];
			}
			$inn_data['buy_rate']=(round($inn_data["sum_buy"]/$inn_data['amount'],4)*100).'%';

			$all_data[] = $inn_data;
			unset($sell_datas);
			unset($inn_data);
		}

		return array(
			"productAgencyList" => $all_data,
//			"totalCount" => $cnt
		);
	}


}
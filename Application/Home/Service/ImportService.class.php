<?php

namespace Home\Service;

use Think\Exception;
use Home\Common\FIdConst;

require __DIR__ . '/../Common/Excel/PHPExcel/IOFactory.php';

/**
 * PHPExcel文件 Service
 *
 * @author Baoyu Li
 */
class ImportService extends PSIBaseService {
	/**
	 * 医院信息导入Service
	 * @author huxinlu
	 * @param $params
	 * @return array
	 * @throws \PHPExcel_Exception
	 * @throws \PHPExcel_Reader_Exception
	 */
    public function importHospitalFromExcelFile($params) {
        $dataFile = $params["datafile"];
        $ext = $params["ext"];
        $message = "";
        $success = true;
        $result = array(
            "msg" => $message,
            "success" => $success
        );
        if (! $dataFile || ! $ext)
            return $result;

        $inputFileType = 'Excel5';
        if ($ext == 'xlsx')
            $inputFileType = 'Excel2007';

        // 设置php服务器可用内存，上传较大文件时可能会用到
        ini_set('memory_limit', '1024M');
        //        ini_set('max_execution_time', 300); // 300 seconds = 5 minutes
        set_time_limit(0);
        $objReader = \PHPExcel_IOFactory::createReader($inputFileType);
        // 设置只读，可取消类似"3.08E-05"之类自动转换的数据格式，避免写库失败
        $objReader->setReadDataOnly(true);

        $region_db = M('info_region');

        $hospital_db = M("info_hospital_temp");

        $if_match = true;
        $duplicate = "";

        try {
            // 载入文件
            $objPHPExcel = $objReader->load($dataFile);
            // 获取表中的第一个工作表
            $currentSheet = $objPHPExcel->getSheet(0);
            // 获取总行数
            $allRow = $currentSheet->getHighestRow();

            // 如果没有数据行，直接返回
            if ($allRow < 2)
                return $result;

			//转换拼音码
			$ps = new PinyinService();

			$hospital_db->startTrans();

            /**
             * 单元格定义
             * A
             * B
             * C
             * D
             * E
             * F
             */
            // 从第2行获取数据
            for($currentRow = 2; $currentRow <= $allRow; $currentRow ++) {
                // 数据坐标
                $index_hospital_code = 'A' . $currentRow;
                $index_hospital_name = 'B' . $currentRow;
                $index_hospital_city = 'C' . $currentRow;
				$index_hospital_country = 'D' . $currentRow;
				$index_hospital_type = 'E' . $currentRow;


                // 读取到的数据，保存到数组$arr中
				$hospital_city = $currentSheet->getCell($index_hospital_city)->getValue();
				$hospital_country = $currentSheet->getCell($index_hospital_country)->getValue();
				if (!empty($hospital_city) && $hospital_country) {
                    $region_1 = $region_db->where('region_name = "'.$hospital_city.'"')->find();//地区详情
                    $region_2 = $region_db->where('region_name = "'.$hospital_country.'" and parent_id = "'.$region_1['id'].'"')->find();//地区详情


                    $data['hospital_code'] = $currentSheet->getCell($index_hospital_code)->getValue();
                    $data['hospital_name'] = $currentSheet->getCell($index_hospital_name)->getValue();
                    $data['hospital_type'] = $currentSheet->getCell($index_hospital_type)->getValue();
                    $data['pym'] = $ps->toPY($data['hospital_name']);
                    $data['city'] = $hospital_city;
                    $data['country'] = $hospital_country;
                    $data['region_id'] = $region_2['id'];

                    $result = $hospital_db->where('hospital_code ="'.$data['hospital_code'].'" or hospital_name = "'.$data['hospital_name'].'"')->select();
                    if(count($result)) {
                        $if_match = false;
                        $duplicate = $duplicate.$currentRow.",";

                    }else {
                        $hospital_db->add($data);
                    }
                }
            }
			$hospital_service = new HospitalService();
			$hospital_service->importRegion2Hospital();
        } catch ( Exception $e ) {
            $hospital_db->rollback();
            $success = false;
            $message = $e;
        }
        if($if_match) {
            $hospital_db->commit();
        }else {
            $hospital_db->rollback();
            $success = false;
            $duplicate = substr($duplicate, 0, -1);
            $message = $duplicate."行数据重复";
        }
        $result = array(
            "msg" => $message,
            "success" => $success
        );
        return $result;
    }

	/**
	 * 销售报表导入Service
	 *
	 * @param
	 *        	$params
	 * @return array
	 * @throws \PHPExcel_Exception
	 */
	public function importDailySellFromExcelFile($params) {
		$idService =  new IdGenService();
		$dataFile = $params["datafile"];
		$ext = $params["ext"];
		$message = "";
		$success = true;
		$result = array(
			"msg" => $message,
			"success" => $success
		);
		if (! $dataFile || ! $ext)
			return $result;

		$inputFileType = 'Excel5';
		if ($ext == 'xlsx')
			$inputFileType = 'Excel2007';

        $sql_unmatched = "INSERT INTO __TABLE__(bill_code, employee_id, employee_des, employee_profit,".
                         "employee_name, drug_id, drug_name, drug_guige, drug_manufacture, hospital_id, hospital_name,".
                         "stock_id, deliver_id, deliver_name, batch_num, sell_amount, sell_date, create_time, creator_id,".
                         "note, if_paid, pay_time, paybill_id, status, expire_time) VALUES";

        $sql_confirmed = "INSERT INTO __TABLE__(bill_code, employee_id, employee_des, employee_profit,".
                         "employee_name, drug_id, drug_name, drug_guige, drug_manufacture, hospital_id, hospital_name,".
                         "stock_id, deliver_id, deliver_name, batch_num, sell_amount, sell_date, create_time, creator_id,".
                         "note, if_paid, pay_time, paybill_id, status, expire_time) VALUES";

        $daily_sell_db = M("bill_daily_sell_temp");
        $daily_db = M("bill_daily_sell");
        $stock_db = M("info_stock");

		// 设置php服务器可用内存，上传较大文件时可能会用到
		ini_set('memory_limit', '1024M');
		set_time_limit(0);
//		ini_set('max_execution_time', 300); // 300 seconds = 5 minutes
		$objReader = \PHPExcel_IOFactory::createReader($inputFileType);
		// 设置只读，可取消类似"3.08E-05"之类自动转换的数据格式，避免写库失败
		$objReader->setReadDataOnly(true);
		try {
			// 载入文件
			$objPHPExcel = $objReader->load($dataFile);
			// 获取表中的第一个工作表
			$currentSheet = $objPHPExcel->getSheet(0);
			// 获取总行数
			$allRow = $currentSheet->getHighestRow();

			// 如果没有数据行，直接返回
			if ($allRow < 2)
				return $result;

            $initialData = array(
                "bill_code"=>"",
                "employee_id"=>"",
                "employee_des"=>"",
                "employee_profit"=>"",
                "employee_name"=>"",
                "drug_id"=>"",
                "drug_name"=>"",
                "drug_guige"=>"",
                "drug_manufacture"=>"",
                "hospital_id"=>"",
                "hospital_name"=>"",
                "stock_id"=>"",
                "deliver_id"=>"",
                "deliver_name"=>"",
                "batch_num"=>"",
                "sell_amount"=>"",
                "sell_date"=>"",
                "create_time"=>time(),
                "creator_id"=>session("loginUserId"),
                "note"=>"",
                "if_paid"=>0,
                "pay_time"=> "",
                "paybill_id"=>"",
                "status"=>0,
                "expire_time"=>""
            );//待插入数据

            $inData = array();

			$hospitals = M("info_hospital")->select(); // 将医院缓存，以免频繁访问数据库
			$drugs = M("info_drug")->select(); // 将药品缓存，以免频繁访问数据库
			$drugProfitAssign = M("info_drugProfitAssign")->select(); // 将药品利润分配缓存，以免频繁访问数据库
			$delivers = M("info_deliver")->select(); // 将配送公司缓存，以免频繁访问数据库
			$employees = M("info_employee")->select();



			$stock_db->startTrans();
			$daily_sell_db->startTrans();
			/**
			 * 单元格定义
			 * A
			 * B
			 * C
			 * D
			 * E
			 * F
			 * G
			 * H
			 * I
			 */
			// 从第2行获取数据
			for($currentRow = 2; $currentRow <= $allRow; $currentRow ++) {

			    $ifMatched = true;
			    $inData =  $initialData;

				// 读取到的数据，保存到数组$arr中
				$inData['hospital_name'] = $currentSheet->getCell('A' . $currentRow)->getValue();
				$inData['drug_name'] = $currentSheet->getCell('B' . $currentRow)->getValue();
				$inData['drug_guige'] = $currentSheet->getCell('C' . $currentRow)->getValue();
				$inData['drug_manufacture'] = $currentSheet->getCell('D' . $currentRow)->getValue();
				$inData['sell_amount'] = $currentSheet->getCell('E' . $currentRow)->getValue();
				$sell_date = $currentSheet->getCell('F' . $currentRow)->getValue();

				if($currentSheet->getCell('F' . $currentRow)->getDataType()==\PHPExcel_Cell_DataType::TYPE_NUMERIC){
					$date = gmdate("Y-m-d",intval((($sell_date - 25569) * 3600 * 24)));
				} else {
					$date = date("Y-m-d",strtotime($sell_date));
				}
				$inData['sell_date'] = $date;

				$inData['deliver_name'] = $currentSheet->getCell('G' . $currentRow)->getValue();
				$inData['batch_num'] = $currentSheet->getCell('H' . $currentRow)->getValue();
				$expire_time = $currentSheet->getCell('I' . $currentRow)->getValue();

				if($currentSheet->getCell('I' . $currentRow)->getDataType()==\PHPExcel_Cell_DataType::TYPE_NUMERIC){
					$expire_date = gmdate("Y-m-d",intval((($expire_time - 25569) * 3600 * 24)));
				} else {
					$expire_date = date("Y-m-d",strtotime($expire_time));
				}
				$inData['expire_time'] = $expire_date;

                $inData['note'] = $currentSheet->getCell('J' . $currentRow)->getValue();

				$sourceCode = $idService->newId();
				//一条excel销售条目可生成系统多条销售条目，这种1对多的关系在bill_code里体现出来。单据格式为  “父条目/子条目”

				$ifMatched = true;
				$msg = "";

				$hospital_info = $this->getHospitalInfoByName($inData['hospital_name'],$hospitals);
				$drug_info = $this->getDrugInfoByNameGuigeManu($inData['drug_name'],$inData['drug_guige'],$inData['drug_manufacture'],$drugs);
				$deliver_info = $this->getDeliverInfoByName($inData['deliver_name'],$delivers);

				if($hospital_info){
					$inData['hospital_id'] = $hospital_info['id'];
				}else{
					$ifMatched = false;
					$msg= $msg."系统无该医院信息/";
				}

				if($drug_info){
					$inData['drug_id'] = $drug_info['id'];
				}else{
					$ifMatched = false;
					$msg= $msg."系统无该药品信息/";
				}

				if($deliver_info){
					$inData['deliver_id'] = $deliver_info['id'];
				}else{
					$ifMatched = false;
					$msg= $msg."系统无该供应商信息/";
				}

				if($inData['batch_num'] == ""){
					$ifMatched = false;
					$msg= $msg."批号为空/";
				}

				//寻找库存信息
                $stock_info = [];
				if($drug_info&&$deliver_info&&$inData['batch_num']!=""){
					$stock_info = $this->getStockInfo($drug_info['id'],$deliver_info['id'],$inData['batch_num']);
					if($stock_info==false){
						$msg= $msg."没有该批号药品的库存条目/";
					}else {
                        $inData['stock_id'] = $stock_info['id'];
                    }
				}


				if($ifMatched){
					//判断第一步，该药品是否在该医院销售
					$drug2hospitalList = $this->getDrug2HospitalList($hospital_info['id'],$drug_info['id']);
					if(count($drug2hospitalList)>0){
						/*
						 * 判断第二步，该药品和医院对应关系下是否有具体的业务人员的提成分配。这个时候不需要对库存进行更新设置
						 *如果已经有了提成分配，那么直接生成单条的记录，如果没有的话，那么利润全部归为公司的
						*/
						$profitAssignList = $this->getProfitAssignList($inData['drug_id'],$inData['hospital_id'],$drugProfitAssign);
                        $profit_assign = $drug_info['bid_price'];
						if(count($profitAssignList)>0){
							foreach ($profitAssignList as $item) {
								$inData['employee_id'] = $item['employee_id'];
								$inData['employee_des'] = $item['description'];
								$inData['employee_profit'] = $item['profit_assign'];
								$profit_assign = $profit_assign - $inData['employee_profit'];
								$employeeInfo = $this->getEmployeeInfoById($item['employee_id'],$employees);
								if($employeeInfo){
									$inData['employee_name'] = $employeeInfo['name'];
								}
								$inData['bill_code'] = $sourceCode."/".$idService->newId();
//								$inData['status'] = FIdConst::DAILY_SELL_STATUS_TEMP_MATCHED;
                                $inData['status'] = FIdConst::DAILY_SELL_STATUS_CONFIRMED;
								if($inData['employee_profit'] == ""){
									$inData['employee_profit'] = 0;
								}

								$tmp = "";
								foreach ($inData as $v) {
                                    $tmp = $tmp."'".$v."',";
                                }
                                $sql_confirmed = $sql_confirmed."(".substr($tmp, 0 , -1)."),";
							}

                            $inData['employee_id'] = -1;
                            $inData['employee_des'] = "公司利润";
                            $inData['employee_profit'] = $profit_assign;
                            $inData['employee_name'] = "公司";
                            $inData['bill_code'] = $sourceCode."/".$idService->newId();
                            $inData['status'] = FIdConst::DAILY_SELL_STATUS_TEMP_MATCHED;
                            $inData['note'] = $inData['note']."公司条目：父单单号".$sourceCode;

                            $tmp = "";
                            foreach ($inData as $v) {
                                $tmp = $tmp."'".$v."',";
                            }
                            $sql_confirmed = $sql_confirmed."(".substr($tmp, 0 , -1)."),";


                            //更新库存记录值
                            $stock_item = $stock_info[0];
                            $stock_item['amount'] = $stock_item['amount'] - $inData['sell_amount'];
                            $stock_item['operate_info'] = $this->getOperateInfo("excel导入销售条目");
                            $stock_db->save($stock_item);

						}else{
                            $ifMatched = false;
                            $msg = $msg."没有药品到医院的业务提成分配";
                        }

					}else{
						//该药品没有在这个医院的分配情况
						$ifMatched = false;
						$msg = $msg."没有药品到医院的分配";
					}
				}

				if(!$ifMatched) {
                    $inData['bill_code'] = $sourceCode;
                    $inData['status'] = FIdConst::DAILY_SELL_STATUS_TEMP_UNMATCTHED;
                    $inData['note'] = $msg;

                    $tmp = "";
                    foreach ($inData as $v) {
                        $tmp = $tmp."'".$v."',";
                    }
                    $sql_unmatched = $sql_unmatched."(".substr($tmp, 0 , -1)."),";
                }
			}
		} catch ( Exception $e ) {
			$success = false;
			$message = "导入失败";
			$stock_db->rollback();
            $result = array(
                "msg" => $message,
                "success" => $success
            );
            return $result;
        }

        $sql_confirmed = substr($sql_confirmed, 0 , -1);
        $sql_unmatched = substr($sql_unmatched, 0 , -1);
		try {
            $daily_db->execute($sql_confirmed);
            $daily_sell_db->execute($sql_unmatched);
        } catch (Exception $e) {
		    $success = false;
		    $message = "导入失败";
            $daily_db->rollback();
            $daily_sell_db->rollback();
		    $stock_db->rollback();
            $result = array(
                "msg" => $message,
                "success" => $success
            );
            return $result;
        }


		$stock_db->commit();
		$daily_sell_db->commit();
		$daily_db->commit();

		$result = array(
			"msg" => $message,
			"success" => $success
		);
		return $result;
	}


	/**
	 * 业务员报表导入Service
	 *
	 * @param
	 *        	$params
	 * @return array
	 * @throws \PHPExcel_Exception
	 */
	public function importEmployeeFromExcelFile($params) {
		$dataFile = $params["datafile"];
		$ext = $params["ext"];
		$message = "";
		$success = true;
		$result = array(
			"msg" => $message,
			"success" => $success
		);
		if (! $dataFile || ! $ext)
			return $result;

		$inputFileType = 'Excel5';
		if ($ext == 'xlsx')
			$inputFileType = 'Excel2007';

		// 设置php服务器可用内存，上传较大文件时可能会用到
		ini_set('memory_limit', '1024M');
		ini_set('max_execution_time', 300); // 300 seconds = 5 minutes
		$objReader = \PHPExcel_IOFactory::createReader($inputFileType);
		// 设置只读，可取消类似"3.08E-05"之类自动转换的数据格式，避免写库失败
		$objReader->setReadDataOnly(true);
		try {
			// 载入文件
			$objPHPExcel = $objReader->load($dataFile);
			// 获取表中的第一个工作表
			$currentSheet = $objPHPExcel->getSheet(0);
			// 获取总行数
			$allRow = $currentSheet->getHighestRow();

			// 如果没有数据行，直接返回
			if ($allRow < 2)
				return $result;

			$ps = new PinyinService();

			$employee_db = M("info_employee");
			$employee_db->startTrans();
			/**
			 * 单元格定义
			 * A
			 * B
			 * C
			 * D
			 * E
			 * F
			 * G
			 * H
			 * I
			 * J
			 * K
			 */
			// 从第2行获取数据
			$data = [];
			for($currentRow = 2; $currentRow <= $allRow; $currentRow ++) {
				// 数据坐标
				$index_name = 'A' . $currentRow;
				$index_code = 'B' . $currentRow;
				$index_bank_card= 'C' . $currentRow;
				$index_phone = 'D' . $currentRow;
				$index_QQ = 'E' . $currentRow;
				$index_email = 'F' . $currentRow;
				$index_address = 'G' . $currentRow;
				$index_remark = 'H' . $currentRow;
				$index_if_employee = 'I' . $currentRow;
				$index_if_quit = 'J' . $currentRow;


				// 读取到的数据，保存到数组$arr中
				$data['name'] = $currentSheet->getCell($index_name)->getValue();
				$data['code'] = $currentSheet->getCell($index_code)->getValue();
				$data['bank_account'] = $currentSheet->getCell($index_bank_card)->getValue();
				$data['phone'] = $currentSheet->getCell($index_phone)->getValue();
				$data['qq'] = $currentSheet->getCell($index_QQ)->getValue();
				$data['email']= $currentSheet->getCell($index_email)->getValue();
				$data['address'] = $currentSheet->getCell($index_address)->getValue();
				$data['note'] = $currentSheet->getCell($index_remark)->getValue();
				$is_employee = $currentSheet->getCell($index_if_employee)->getValue();
				$is_off_job = $currentSheet->getCell($index_if_quit)->getValue();

				$data['pym'] = $ps->toPY($data['name']);
				$data['client_user_name'] = $data['name'].$data['pym'];
				$data['creator_id'] = session("loginUserId");
				$data['create_time'] = time();
				$data['login_enable'] = 1;
				$data['client_password'] = '123456';

				//是否是业务员
				if ($is_employee == '是') {
					$data['is_employee'] = 1;
				} else {
					$data['is_employee'] = 0;
				}

				//是否离职
				if ($is_off_job == '是') {
					$data['is_off_job'] = 1;
				} else {
					$data['is_off_job'] = 0;
				}

				$employee_db->add($data);
			}
		} catch ( Exception $e ) {
			$success = false;
			$message = $e;
			$employee_db->rollback();
		}
		$employee_db->commit();
		$result = array(
			"msg" => $message,
			"success" => $success
		);
		return $result;
	}

    /**
     * 代理商信息导入Service
     *
     * @author qianwenwei
     * @param $params
     * @return array
     *
     */
    public function importAgentFromExcelFile($params) {
        $dataFile = $params["datafile"];
        $ext = $params["ext"];
        $message = "";
        $success = true;
        $result = array(
            "msg" => $message,
            "success" => $success
        );
        if (! $dataFile || ! $ext)
            return $result;

        $inputFileType = 'Excel5';
        if ($ext == 'xlsx')
            $inputFileType = 'Excel2007';

        // 设置php服务器可用内存，上传较大文件时可能会用到
        ini_set('memory_limit', '1024M');
        ini_set('max_execution_time', 300); // 300 seconds = 5 minutes
        $objReader = \PHPExcel_IOFactory::createReader($inputFileType);
        // 设置只读，可取消类似"3.08E-05"之类自动转换的数据格式，避免写库失败
        $objReader->setReadDataOnly(true);
        try {
            // 载入文件
            $objPHPExcel = $objReader->load($dataFile);
            // 获取表中的第一个工作表
            $currentSheet = $objPHPExcel->getSheet(0);
            // 获取总行数
            $allRow = $currentSheet->getHighestRow();

            // 如果没有数据行，直接返回
            if ($allRow < 2)
                return $result;

            $ps = new PinyinService();

            $agent_db = M("info_agent");
            $agent_db->startTrans();
            /**
             * 单元格定义
             * A
             * B
             * C
             * D
             * E
             * F
             * G
             * H
             * I
             * J
             * K
             */
            // 从第2行获取数据
            $data = [];
            for($currentRow = 2; $currentRow <= $allRow; $currentRow ++) {
                // 数据坐标
                $index_code = 'A' . $currentRow;
                $index_agent_name = 'B' . $currentRow;
                $index_region= 'C' . $currentRow;
                $index_address = 'D' . $currentRow;
                $index_duty_employee = 'E' . $currentRow;
                $index_link_name = 'F' . $currentRow;
                $index_mobile_phone = 'G' . $currentRow;
                $index_telephone = 'H' . $currentRow;
                $index_fax = 'I' . $currentRow;
                $index_qq = 'J' . $currentRow;
                $index_email = 'K' . $currentRow;
                $index_id_card = 'L' . $currentRow;
                $index_gender = 'M' . $currentRow;
                $index_payment_way = 'N' . $currentRow;
                $index_bank_account = 'O' . $currentRow;
                $index_creator_id = 'P' . $currentRow;
                $index_create_time = 'Q' . $currentRow;
                $index_note = 'R' . $currentRow;


                // 读取到的数据，保存到数组$arr中
                $data['code'] = $currentSheet->getCell($index_code)->getValue();
                $data['agent_name'] = $currentSheet->getCell($index_agent_name)->getValue();
                $data['region'] = $currentSheet->getCell($index_region)->getValue();
                $data['address'] = $currentSheet->getCell($index_address)->getValue();
                $data['duty_employee'] = $currentSheet->getCell($index_duty_employee)->getValue();
                $data['link_name']= $currentSheet->getCell($index_link_name)->getValue();
                $data['mobile_phone'] = $currentSheet->getCell($index_mobile_phone)->getValue();
                $data['telephone'] = $currentSheet->getCell($index_telephone)->getValue();
                $data['fax'] = $currentSheet->getCell($index_fax)->getValue();
                $data['qq'] = $currentSheet->getCell($index_qq)->getValue();
                $data['email'] = $currentSheet->getCell($index_email)->getValue();
                $data['id_card'] = $currentSheet->getCell($index_id_card)->getValue();
                $data['gender'] = $currentSheet->getCell($index_gender)->getValue();
                $data['payment_way'] = $currentSheet->getCell($index_payment_way)->getValue();
                $data['bank_account'] = $currentSheet->getCell($index_bank_account)->getValue();
                $data['creator_id'] = $currentSheet->getCell($index_creator_id)->getValue();
                $data['create_time'] = $currentSheet->getCell($index_create_time)->getValue();
                $data['note'] = $currentSheet->getCell($index_note)->getValue();


                $agent_db->add($data);
            }
        } catch ( Exception $e ) {
            $success = false;
            $message = $e;
            $agent_db->rollback();
        }
        $agent_db->commit();
        $result = array(
            "msg" => $message,
            "success" => $success
        );
        return $result;
    }

	/*临时销售表格的数据导入到正式表格*/
    public  function confirmItems2official($params){
        if($params['inData']==''||$params==null){
            return $this->bad("参数错误");
        }
        $message = "";
        $success = true;

        //$sql = "INSERT INTO __TABLE__(bill_code, employee_id, employee_des, employee_profit,".
        //    "employee_name, drug_id, drug_name, drug_guige, drug_manufacture, hospital_id, hospital_name,".
        //    "stock_id, deliver_id, deliver_name, batch_num, sell_amount, sell_date, create_time, creator_id,".
        //    "note, if_paid, pay_time, paybill_id, status, expire_time) VALUES";

        $inDatas = json_decode(html_entity_decode($params['inData']),true);
        $inItems = $inDatas['inData'];
        $daily_sell_db = M("bill_daily_sell_temp");
        $daily_db = M('bill_daily_sell');

        $stock_db = M("info_stock");
        $stock_db->startTrans();
        $daily_sell_db->startTrans();
        $daily_db->startTrans();

        $bs = new BizlogService();
        $idService = new IdGenService();
        $hospitals = M("info_hospital")->select(); // 将医院缓存，以免频繁访问数据库
        $drugs = M("info_drug")->select(); // 将药品缓存，以免频繁访问数据库
        $drugs2hospital = M("info_drug2hospital")->select(); // 将药品与医院的分配关系缓存，以免频繁访问数据库
        $drugProfitAssign = M("info_drugProfitAssign")->select(); // 将药品利润分配缓存，以免频繁访问数据库
        $delivers = M("info_deliver")->select(); // 将配送公司缓存，以免频繁访问数据库
        $employees = M("info_employee")->select();


        try{
            foreach ($inItems as $id){
                $tempItems = M("bill_daily_sell_temp")->where("id=".$id)->select();
                $sourceCode = $idService->newId();
                if(count($tempItems)!=1){
                    continue;
                }
                $item = $tempItems[0];
                unset($item['id']);
                if($item['status'] == FIdConst::DAILY_SELL_STATUS_TEMP_MATCHED) {
                    $item['status'] = FIdConst::DAILY_SELL_STATUS_CONFIRMED;
                    $daily_sell_db->where("id=".$id)->delete();
                    $daily_db->add($item);
                }elseif($item['status'] == FIdConst::DAILY_SELL_STATUS_TEMP_UNMATCTHED){
                    //未匹配的信息首先检验信息是否已经补全，如果补全才进行上一步的操作，如果没有那么保留这个状态
                    $ifMatched = true;
                    $msg = "";
                    // 如果为空则直接读取下一条记录
                    if (! $item['hospital_name'] || ! $item['drug_name'] || ! $item['deliver_name'])
                        continue;

                    if(!$item['hospital_id']) {
                        $hospital_info = $this->getHospitalInfoByName($item['hospital_name'],$hospitals);

                        if($hospital_info){
                            $inData['hospital_id'] = $hospital_info['id'];
                        }else{
                            $ifMatched = false;
                            $msg= $msg."系统无该医院信息/";
                        }
                    }

                    if(!$item['drug_id']) {
                        $drug_info = $this->getDrugInfoByNameGuigeManu($item['drug_name'],$item['drug_guige'],$item['drug_manufacture'],$drugs);
                        if($drug_info){
                            $inData['drug_id'] = $drug_info['id'];
                        }else{
                            $ifMatched = false;
                            $msg= $msg."系统无该药品信息/";
                        }
                    }

                    if(!$item['deliver_id']) {
                        $deliver_info = $this->getDeliverInfoByName($item['deliver_name'],$delivers);
                        if($deliver_info){
                            $inData['deliver_id'] = $deliver_info['id'];
                        }else{
                            $ifMatched = false;
                            $msg= $msg."系统无该供应商信息/";
                        }
                    }


                    if($item['batch_num'] == ""){
                        $ifMatched = false;
                        $msg= $msg."批号为空/";
                    }

                    $stock_info = [];
                    if(!$item['stock_id']) {
                        //寻找库存信息
                        if($item['drug_id']&&$item['deliver_id']&&$item['batch_num']!=""){
                            $stock_info = $this->getStockInfo($item['drug_id'],$item['deliver_id'],$item['batch_num']);
                            if($stock_info==false){
                                $msg= $msg."没有该批号药品的库存条目/";
                            }else {
                                $item['stock_id'] = $stock_info['id'];
                            }
                        }
                    }

                    if($ifMatched){
                        //判断第一步，该药品是否在该医院销售
                        $drug2hospitalList = $this->getDrug2HospitalList($item['hospital_id'],$item['drug_id']);
                        if(count($drug2hospitalList)>0){
                            /*
                             * 判断第二步，该药品和医院对应关系下是否有具体的业务人员的提成分配。这个时候不需要对库存进行更新设置
                             *如果已经有了提成分配，那么直接生成单条的记录，如果没有的话，那么利润全部归为公司的
                            */
                            $profitAssignList = $this->getProfitAssignList($item['drug_id'],$item['hospital_id'],$drugProfitAssign);
                            $profit_assign = $item['bid_price'];
                            if(count($profitAssignList)>0){
                                foreach ($profitAssignList as $index) {
                                    $item['employee_id'] = $index['employee_id'];
                                    $item['employee_des'] = $index['description'];
                                    $item['employee_profit'] = $index['profit_assign'];
                                    $profit_assign = $profit_assign - $item['employee_profit'];
                                    $employeeInfo = $this->getEmployeeInfoById($index['employee_id'],$employees);
                                    if($employeeInfo){
                                        $item['employee_name'] = $employeeInfo['name'];
                                    }
                                    $item['bill_code'] = $sourceCode."/".$idService->newId();
                                    $item['status'] = FIdConst::DAILY_SELL_STATUS_CONFIRMED;

                                    if($item['employee_profit'] == ""){
                                        $item['employee_profit'] = 0;
                                    }

                                    unset($item['id']);
                                    unset($item['operate_info']);

                                    //$tmp = "";
                                    //foreach ($item as $v) {
                                    //    $tmp = $tmp."'".$v."',";
                                    //}
                                    //$sql = $sql."(".substr($tmp, 0 , -1)."),";
                                    $daily_db->add($item);
                                }

                                $item['employee_id'] = -1;
                                $item['employee_des'] = "公司利润";
                                $item['employee_profit'] = $profit_assign;
                                $item['employee_name'] = "公司";
                                $item['bill_code'] = $sourceCode."/".$idService->newId();
                                $item['status'] = FIdConst::DAILY_SELL_STATUS_CONFIRMED;
                                $item['note'] = "公司条目：父单单号".$sourceCode;

                                //$tmp = "";
                                //foreach ($item as $v) {
                                //    $tmp = $tmp."'".$v."',";
                                //}
                                $daily_db->add($item);
                                //$sql = $sql."(".substr($tmp, 0 , -1)."),";

                                $daily_sell_db->where("id=".$id)->delete();

                                //更新库存记录值
                                $stock_item = $stock_info[0];
                                $stock_item['amount'] = $stock_item['amount'] - $item['sell_amount'];
                                $stock_item['operate_info'] = $this->getOperateInfo("excel导入销售条目");
                                $stock_db->save($stock_item);

                            }else{
                                $ifMatched = false;
                                $msg = $msg."没有药品到医院的业务提成分配";
                            }

                        }else{
                            //该药品没有在这个医院的分配情况
                            $ifMatched = false;
                            $msg = $msg."没有药品到医院的分配";
                        }
                    }

                    if(!$ifMatched) {
                        $item['note'] = $msg;
                        $daily_sell_db->save($item);

                        //$tmp = "";
                        //foreach ($item as $v) {
                        //    $tmp = $tmp."'".$v."',";
                        //}
                        //$sql = $sql."(".substr($tmp, 0 , -1)."),";
                    }
                }
            }
        }catch (Exception $e){
            $success = false;
            $message = "补全失败";
            $stock_db->rollback();
            $daily_sell_db->rollback();
            $daily_db->rollback();
            $result = array(
                "msg" => $message,
                "success" => $success
            );
            return $result;
        }
        //$sql = substr($sql, 0 , -1);
        // try {
        //     $daily_sell_db->execute($sql);
        // } catch (Exception $e) {
        //     $success = false;
        //     $message = "导入失败";
        //     $daily_sell_db->rollback();
        //     $stock_db->rollback();
        //     $result = array(
        //         "msg" => $message,
        //         "success" => $success
        //     );
        //     return $result;
        // }


        $stock_db->commit();
        $daily_sell_db->commit();
        $daily_db->commit();
        $result = array(
            "msg" => $message,
            "success" => $success
        );
        return $result;
    }


    /**
     * 药品信息导入Service
     * @param $params
     * @return array
     * @throws \PHPExcel_Exception
     */
    public function importDrugAssignFromExcelFile($params) {
        $dataFile = $params["datafile"];
        $ext = $params["ext"];
        $message = "";
        $success = true;
        $result = array(
            "msg" => $message,
            "success" => $success
        );
        if (! $dataFile || ! $ext)
            return $result;

        $inputFileType = 'Excel5';
        if ($ext == 'xlsx')
            $inputFileType = 'Excel2007';

        // 设置php服务器可用内存，上传较大文件时可能会用到
        ini_set('memory_limit', '1024M');
		set_time_limit(0);
     //   ini_set('max_execution_time', 300); // 300 seconds = 5 minutes
        $objReader = \PHPExcel_IOFactory::createReader($inputFileType);
        // 设置只读，可取消类似"3.08E-05"之类自动转换的数据格式，避免写库失败
        $objReader->setReadDataOnly(true);

        $drug2hosp_db = M('info_drug2hospital');
        $drug_profit_db = M('info_drug_profit_assign');

        try {
            // 载入文件
            $objPHPExcel = $objReader->load($dataFile);
            // 获取表中的第一个工作表
            $currentSheet = $objPHPExcel->getSheet(0);
            // 获取总行数
            $allRow = $currentSheet->getHighestRow();

            // 如果没有数据行，直接返回
            if ($allRow < 2)
                return $result;

            $drug_db = M('info_drug');
            $hospital_db = M('info_hospital');
            $employee_db = M('info_employee');

            $drug2hosp_db->startTrans();
            $drug_profit_db->startTrans();



            $data_tmp = [];
            $data_profit = [];
            // 从第2行获取数据
			for($currentRow = 2; $currentRow <= $allRow; $currentRow ++) {
                // 数据坐标
                $index_bid_price = 'A' . $currentRow;
                $index_drug_name  = 'B' . $currentRow;
                $index_guige = 'C' . $currentRow;
                $index_manu = 'D' . $currentRow;
                $index_hospital_name = 'E' . $currentRow;
                $index_description = 'F' . $currentRow;
                $index_employee_name = 'G' . $currentRow;
                $index_profit = 'H' . $currentRow;
                $index_note = 'I' . $currentRow;


                // 读取到的数据，保存到数组$arr中
                $bid_price = $currentSheet->getCell($index_bid_price)->getValue();
                $drug_name = $currentSheet->getCell($index_drug_name)->getValue();
                $hospital_name = $currentSheet->getCell($index_hospital_name)->getValue();
                $description = $currentSheet->getCell($index_description)->getValue();
                $employee_name = $currentSheet->getCell($index_employee_name)->getValue();
                $profit = $currentSheet->getCell($index_profit)->getValue();
                $note = $currentSheet->getCell($index_note)->getValue();
                $guige = $currentSheet->getCell($index_guige)->getValue();
                $manu_name = $currentSheet->getCell($index_manu)->getValue();

                $drug_id = $drug_db->where("common_name = '%s' and guige = '%s' and manufacturer = '%s'", array($drug_name, $guige, $manu_name))->cache(true, 1200)->getField('id');
                $hospital_id = $hospital_db->where("hospital_name = '%s'", $hospital_name)->cache(true, 1200)->getField('id');

				$drug2hos_id = $drug2hosp_db->where("drug_id='%s' and hospital_id='%s'", array($drug_id,$hospital_id))->getField('id');
				$employee_id = $employee_db->where("name='%s'", $employee_name)->cache(true, 1200)->getField('id');

				if($drug2hos_id == null)
                {
                    $data_tmp = [];
                    $data_profit = [];
                    $data_tmp['drug_id'] = $drug_id;
                    $data_tmp['drug_name'] = $drug_name;
                    $data_tmp['hospital_id'] = $hospital_id;
                    $data_tmp['hospital_name'] = $hospital_name;
                    $data_tmp['create_time'] = time();
                    $data_tmp['creator_id'] = session("loginUserId");
                    $data_tmp['company_profit'] = '0';

                    $data_profit['drug2hos_id'] = $drug2hosp_db->add($data_tmp);

                    $data_profit['description'] = $description;
                    $data_profit['employee_name'] = $employee_name;
                    $data_profit['employee_id'] = $employee_id;
                    if(!strpos($profit, '%')) {
                        $data_profit['profit_assign'] = $profit;
                    } else {
                        $profit_tmp = strstr($profit, '%', true);
                        $data_profit['profit_assign'] = (float)$profit_tmp/100*$bid_price;
                    }
                    $data_profit['drug_id'] = $drug_id;
                    $data_profit['drug_name'] = $drug_name;
                    $data_profit['hospital_id'] = $hospital_id;
                    $data_profit['hospital_name'] = $hospital_name;
                    $data_profit['note'] = $note;
                    $data_profit['creator_id'] = session("loginUserId");
                    $data_profit['create_time'] = time();
                    $data_profit['employee_alarm_month'] = '0';

                    $drug_profit_db->add($data_profit);

                }else {
                    $data_profit = [];
                    $data_profit['drug2hos_id'] = $drug2hos_id;
                    $data_profit['description'] = $description;
                    $data_profit['employee_name'] = $employee_name;
                    $data_profit['employee_id'] = $employee_id;
                    if(!strpos($profit, '%')) {
                        $data_profit['profit_assign'] = $profit;
                    } else {
                        $profit_tmp = strstr($profit, '%', true);
						$data_profit['rate'] = $profit_tmp;
                        $data_profit['profit_assign'] = (float)$profit_tmp/100*$bid_price;
                    }
                    $data_profit['drug_id'] = $drug_id;
                    $data_profit['drug_name'] = $drug_name;
                    $data_profit['hospital_id'] = $hospital_id;
                    $data_profit['hospital_name'] = $hospital_name;
                    $data_profit['note'] = $note;
                    $data_profit['creator_id'] = session("loginUserId");
                    $data_profit['create_time'] = time();
                    $data_profit['employee_alarm_month'] = '0';

                    $drug_profit_db->add($data_profit);
                }
            }
        } catch ( Exception $e ) {
            $drug_profit_db->rollback();
            $drug2hosp_db->rollback();
            return array(
                "msg" => $message,
                "success" => false
            );
        }
        $drug_profit_db->commit();
        $drug2hosp_db->commit();
        return array(
            "msg" => $message,
            "success" => $success
        );
    }


	/**
	 * 药品信息导入Service
	 * @param $params
	 * @return array
	 * @throws \PHPExcel_Exception
	 */
	public function importDrugFromExcelFile($params) {
		$dataFile = $params["datafile"];
		$ext = $params["ext"];
		$message = "";
		$success = true;
		$result = array(
			"msg" => $message,
			"success" => $success
		);
		if (! $dataFile || ! $ext)
			return $result;

		$inputFileType = 'Excel5';
		if ($ext == 'xlsx')
			$inputFileType = 'Excel2007';

		// 设置php服务器可用内存，上传较大文件时可能会用到
		ini_set('memory_limit', '1024M');
		ini_set('max_execution_time', 300); // 300 seconds = 5 minutes
		$objReader = \PHPExcel_IOFactory::createReader($inputFileType);
		// 设置只读，可取消类似"3.08E-05"之类自动转换的数据格式，避免写库失败
		$objReader->setReadDataOnly(true);
		try {
			// 载入文件
			$objPHPExcel = $objReader->load($dataFile);
			// 获取表中的第一个工作表
			$currentSheet = $objPHPExcel->getSheet(0);
			// 获取总行数
			$allRow = $currentSheet->getHighestRow();

			// 如果没有数据行，直接返回
			if ($allRow < 2)
				return $result;

			$drug_db = M("info_drug");

			$data = [];
			// 从第2行获取数据
			for($currentRow = 2; $currentRow <= $allRow; $currentRow ++) {
				// 数据坐标
				$index_drug_code = 'A' . $currentRow;
				$index_common_name  = 'B' . $currentRow;
				$index_goods_name = 'C' . $currentRow;
				$index_jx = 'D' . $currentRow;
				$index_guige = 'E' . $currentRow;
				$index_jldw = 'F' . $currentRow;
				$index_manufacturer = 'G' . $currentRow;
				$index_bid_type = 'H' . $currentRow;
				$index_bid_price = 'I' . $currentRow;
				$index_retail_price = 'J' . $currentRow;
				$index_kaipiao_price = 'K' . $currentRow;
				$index_tax_price = 'L' . $currentRow;
				$index_base_price = 'M' . $currentRow;
				$index_other_price = 'N' . $currentRow;
				$index_profit = 'O' . $currentRow;
				$index_is_self = 'P' . $currentRow;
				$index_is_new = 'Q' . $currentRow;
				$index_disable = 'R' . $currentRow;
				$index_medicare_code_province = 'S' . $currentRow;
				$index_medicare_code_country = 'T' . $currentRow;
				$index_protocol_region = 'U' . $currentRow;
				$index_business_license_code = 'V' . $currentRow;
				$index_business_license_expire_time = 'W' . $currentRow;
				$index_gmp_code = 'X' . $currentRow;
				$index_expire_time = 'Y' . $currentRow;


				// 读取到的数据，保存到数组$arr中
				$data['drug_code'] = $currentSheet->getCell($index_drug_code)->getValue();
				$data['common_name'] = $currentSheet->getCell($index_common_name)->getValue();
				$data['goods_name'] = $currentSheet->getCell($index_goods_name)->getValue();
				$data['jx'] = $currentSheet->getCell($index_jx)->getValue();
				$data['guige'] = $currentSheet->getCell($index_guige)->getValue();
				$data['jldw'] = $currentSheet->getCell($index_jldw)->getValue();
				$data['manufacturer'] = $currentSheet->getCell($index_manufacturer)->getValue();
				$data['bid_type'] = $currentSheet->getCell($index_bid_type)->getValue();
				$data['bid_price'] = $currentSheet->getCell($index_bid_price)->getValue();
				$data['retail_price'] = $currentSheet->getCell($index_retail_price)->getValue();
				$data['kaipiao_price'] = $currentSheet->getCell($index_kaipiao_price)->getValue();
				$data['tax_price'] = $currentSheet->getCell($index_tax_price)->getValue();
				$data['base_price'] = $currentSheet->getCell($index_base_price)->getValue();
				$data['other_price'] = $currentSheet->getCell($index_other_price)->getValue();
				$data['profit'] = $currentSheet->getCell($index_profit)->getValue();
				$data['is_self'] = $currentSheet->getCell($index_is_self)->getValue();
				$data['is_new'] = $currentSheet->getCell($index_is_new)->getValue();
				$data['disable'] = $currentSheet->getCell($index_disable)->getValue();
				$data['medicare_code_province'] = $currentSheet->getCell($index_medicare_code_province)->getValue();
				$data['medicare_code_country'] = $currentSheet->getCell($index_medicare_code_country)->getValue();
				$data['protocol_region'] = $currentSheet->getCell($index_protocol_region)->getValue();
				$data['business_license_code'] = $currentSheet->getCell($index_business_license_code)->getValue();
				$data['business_license_code'] = $currentSheet->getCell($index_business_license_expire_time)->getValue();
				$data['gmp_code'] = $currentSheet->getCell($index_gmp_code)->getValue();
				$data['expire_time'] = $currentSheet->getCell($index_expire_time)->getValue();
				$data['creator_id'] = session("loginUserId");
				$data['create_time'] = time();

				$drug_db->add($data);
			}
		} catch ( Exception $e ) {
			$success = false;
			$message = $e;
			$result = array(
				"msg" => $message,
				"success" => $success
			);
			return $result;
		}
		$result = array(
			"msg" => $message,
			"success" => $success
		);
		return $result;
	}



	public function getHospitalInfoByName($name,$hospitalList){
		foreach ($hospitalList as $item) {
			if($item['hospital_name'] == $name)
				return $item;
		}
		return false;
	}


	public function getDrugInfoByNameGuigeManu($drug_common_name,$drug_guige,$drug_manufacturer,$drugList){
		foreach ($drugList as $item) {
			if($item['common_name'] == $drug_common_name&&$item['guige'] == $drug_guige
				&&$item['manufacturer'] == $drug_manufacturer)
				return $item;
		}
		return false;
	}

	public function getDeliverInfoByName($name,$deliverList){
		foreach ($deliverList as $item) {
			if($item['name'] == $name)
				return $item;
		}
		return false;
	}

	public function getEmployeeInfoById($id,$employeeList){
		foreach ($employeeList as $item) {
			if($item['id'] == $id)
				return $item;
		}
		return false;
	}


	public function getProfitAssignList($drug_id,$hospital_id,$profitAssignList){
		$profitAssignLists2 = array();

        foreach ($profitAssignList as $item) {
            if($item['drug_id'] == $drug_id && $item['hospital_id'] == $hospital_id)
                $profitAssignLists2[] = $item;
        }
        if(count($profitAssignLists2)){
            return $profitAssignLists2;
        }
		return false;
	}

	public function getEmployeeInfo($employee_id,$employees){
		foreach ($employees as $item) {
			if($item['employee_id'] == $employee_id)
				return $item;
		}
		return false;
	}

	public function getEmployeeInfoByName($name,$employees){
		foreach ($employees as $item) {
			if($item['name'] == $name)
				return $item;
		}
		return false;
	}


	public function getDrug2DeliverInfo($drug_id,$deliver_id,$batch_num,$drug2deliverList){
		foreach ($drug2deliverList as $item) {
			if($item['drug_id'] == $drug_id&&$item['deliver_id'] == $deliver_id&&$item['batch_num'] == $batch_num)
				return $item;
		}
		return false;
	}

	public  function getDrug2HospitalList($hospital_id,$drug_id){
		return M("info_drug2hospital")->where(' drug_id='.$drug_id." and hospital_id=".$hospital_id)->select();
	}

	public function  getStockInfo($drug_id,$deliver_id,$batch_num){
		$stockInfo =  M("info_stock")->where(" drug_id=".$drug_id." and deliver_id=".$deliver_id." and batch_num ='".$batch_num."'")->select();
		if(count($stockInfo)==1){
			return $stockInfo[0];
		}else{
			return false;
		}
	}

    public function importDailySellFromExcelMatchParams($excel_params, $index_params, $additional_params_fixed, $deliver_name) {
        $idService =  new IdGenService();
        $dataFile = $excel_params["datafile"];
        $ext = $excel_params["ext"];
        $message = "";
        $success = true;
        $result = array(
            "msg" => $message,
            "success" => $success
        );
        if (! $dataFile || ! $ext)
            return $result;

        $inputFileType = 'Excel5';
        if ($ext == 'xlsx')
            $inputFileType = 'Excel2007';

        $sql = "INSERT INTO __TABLE__(bill_code, employee_id, employee_des, employee_profit,".
            "employee_name, drug_id, drug_name, drug_guige, drug_manufacture, hospital_id, hospital_name,".
            "stock_id, deliver_id, deliver_name, batch_num, sell_amount, sell_date, create_time, creator_id,".
            "note, if_paid, pay_time, paybill_id, status, expire_time) VALUES";

        $daily_sell_db = M("bill_daily_sell_temp");

        $stock_db = M("info_stock");

        $drug_array = array();
        $success_count = 0;
        $fail_count = 0;
        $total_count = 0;


        // 设置php服务器可用内存，上传较大文件时可能会用到
        ini_set('memory_limit', '1024M');
        set_time_limit(0);
//		ini_set('max_execution_time', 300); // 300 seconds = 5 minutes
        $objReader = \PHPExcel_IOFactory::createReader($inputFileType);
        // 设置只读，可取消类似"3.08E-05"之类自动转换的数据格式，避免写库失败
        $objReader->setReadDataOnly(true);
        try {
            // 载入文件
            $objPHPExcel = $objReader->load($dataFile);
            // 获取表中的第一个工作表
            $currentSheet = $objPHPExcel->getSheet(0);
            // 获取总行数
            $allRow = $currentSheet->getHighestRow();

            // 如果没有数据行，直接返回
            if ($allRow < 2)
                return $result;

            $total_count = $allRow - 1;

            $initialData = array(
                "bill_code"=>"",
                "employee_id"=>"",
                "employee_des"=>"",
                "employee_profit"=>"",
                "employee_name"=>"",
                "drug_id"=>"",
                "drug_name"=>"",
                "drug_guige"=>"",
                "drug_manufacture"=>"",
                "hospital_id"=>"",
                "hospital_name"=>"",
                "stock_id"=>"",
                "deliver_id"=>"",
                "deliver_name"=>"",
                "batch_num"=>"",
                "sell_amount"=>"",
                "sell_date"=>"",
                "create_time"=>time(),
                "creator_id"=>session("loginUserId"),
                "note"=>"",
                "if_paid"=>0,
                "pay_time"=> "",
                "paybill_id"=>"",
                "status"=>0,
                "expire_time"=>""
            );//待插入数据



            $hospitals = M("info_hospital")->select(); // 将医院缓存，以免频繁访问数据库
            $drugs = M("info_drug")->select(); // 将药品缓存，以免频繁访问数据库
            $drugProfitAssign = M("info_drugProfitAssign")->select(); // 将药品利润分配缓存，以免频繁访问数据库
            $delivers = M("info_deliver")->select(); // 将配送公司缓存，以免频繁访问数据库
            $employees = M("info_employee")->select();

            $stock_db->startTrans();
            $daily_sell_db->startTrans();


            /**
             * 单元格定义
             * A
             * B
             * C
             * D
             * E
             * F
             * G
             * H
             * I
             */
            // 从第2行获取数据
            for($currentRow = 2; $currentRow <= $allRow; $currentRow ++) {

                $inData =  $initialData;

                foreach ($index_params as $key => $index_param) {
                    $inData[$key] = $currentSheet->getCell($index_param.$currentRow)->getValue();
                }
                if(count($additional_params_fixed) != 0) {
                    foreach ($additional_params_fixed as $key => $item) {
                        $inData[$key] = $item;
                    }
                }

                $sourceCode = $idService->newId();
                //一条excel销售条目可生成系统多条销售条目，这种1对多的关系在bill_code里体现出来。单据格式为  “父条目/子条目”

                $ifMatched = true;
                $msg = "";

                $hospital_info = $this->getHospitalInfoByName($inData['hospital_name'],$hospitals);
                $drug_info = $this->getDrugInfoByNameGuigeManu($inData['drug_name'],$inData['drug_guige'],$inData['drug_manufacture'],$drugs);
                $deliver_info = $this->getDeliverInfoByName($inData['deliver_name'],$delivers);


                if($hospital_info){
                    $inData['hospital_id'] = $hospital_info['id'];
                }else{
                    $ifMatched = false;
                    $msg= $msg."系统无该医院信息/";
                }

                if($drug_info){
                    $inData['drug_id'] = $drug_info['id'];
                    $inData['drug_name'] = $drug_info['drug_name'];
                    $inData['drug_guige'] = $drug_info['drug_guige'];
                    $inData['drug_manufacture'] = $drug_info['drug_manufacture'];
                }else{
                    $ifMatched = false;
                    $msg= $msg."系统无该药品信息/";
                }

                $drug_array[] = $inData['drug_name'];

                if($deliver_info){
                    $inData['deliver_id'] = $deliver_info['id'];
                }else{
                    $ifMatched = false;
                    $msg= $msg."系统无该供应商信息/";
                }

                if($inData['batch_num'] == ""){
                    $ifMatched = false;
                    $msg= $msg."批号为空/";
                }

                //寻找库存信息
                $stock_info = [];
                if($drug_info&&$deliver_info&&$inData['batch_num']!=""){
                    $stock_info = $this->getStockInfo($drug_info['id'],$deliver_info['id'],$inData['batch_num']);
                    if($stock_info==false){
                        $msg= $msg."没有该批号药品的库存条目/";
                    }else {
                        $inData['stock_id'] = $stock_info['id'];
                    }
                }


                if($ifMatched){
                    //判断第一步，该药品是否在该医院销售
                    $drug2hospitalList = $this->getDrug2HospitalList($hospital_info['id'],$drug_info['id']);
                    if(count($drug2hospitalList)>0){
                        /*
                         * 判断第二步，该药品和医院对应关系下是否有具体的业务人员的提成分配。这个时候不需要对库存进行更新设置
                         *如果已经有了提成分配，那么直接生成单条的记录，如果没有的话，那么利润全部归为公司的
                        */
                        $profitAssignList = $this->getProfitAssignList($inData['drug_id'],$inData['hospital_id'],$drugProfitAssign);
                        $profit_assign = $drug_info['bid_price'];
                        if(count($profitAssignList)>0){
                            foreach ($profitAssignList as $item) {
                                $inData['employee_id'] = $item['employee_id'];
                                $inData['employee_des'] = $item['description'];
                                $inData['employee_profit'] = $item['profit_assign'];
                                $profit_assign = $profit_assign - $inData['employee_profit'];
                                $employeeInfo = $this->getEmployeeInfoById($item['employee_id'],$employees);
                                if($employeeInfo){
                                    $inData['employee_name'] = $employeeInfo['name'];
                                }
                                $inData['bill_code'] = $sourceCode."/".$idService->newId();
                                $inData['status'] = FIdConst::DAILY_SELL_STATUS_TEMP_MATCHED;

                                if($inData['employee_profit'] == ""){
                                    $inData['employee_profit'] = 0;
                                }

                                $tmp = "";
                                foreach ($inData as $v) {
                                    $tmp = $tmp."'".$v."',";
                                }
                                $sql = $sql."(".substr($tmp, 0 , -1)."),";
                            }

                            $inData['employee_id'] = -1;
                            $inData['employee_des'] = "公司利润";
                            $inData['employee_profit'] = $profit_assign;
                            $inData['employee_name'] = "公司";
                            $inData['bill_code'] = $sourceCode."/".$idService->newId();
                            $inData['status'] = FIdConst::DAILY_SELL_STATUS_TEMP_MATCHED;
                            $inData['note'] = $inData['note']."公司条目：父单单号".$sourceCode;

                            $tmp = "";
                            foreach ($inData as $v) {
                                $tmp = $tmp."'".$v."',";
                            }
                            $sql = $sql."(".substr($tmp, 0 , -1)."),";


                            //更新库存记录值
                            $stock_item = $stock_info[0];
                            $stock_item['amount'] = $stock_item['amount'] - $inData['sell_amount'];
                            $stock_item['operate_info'] = $this->getOperateInfo("excel导入销售条目");
                            $stock_db->save($stock_item);

                        }else{
                            $ifMatched = false;
                            $msg = $msg."没有药品到医院的业务提成分配";
                        }

                    }else{
                        //该药品没有在这个医院的分配情况
                        $ifMatched = false;
                        $msg = $msg."没有药品到医院的分配";
                    }
                }

                if(!$ifMatched) {
                    $inData['bill_code'] = $sourceCode;
                    $inData['status'] = FIdConst::DAILY_SELL_STATUS_TEMP_UNMATCTHED;
                    $inData['note'] = $msg;

                    $tmp = "";
                    foreach ($inData as $v) {
                        $tmp = $tmp."'".$v."',";
                    }
                    $sql = $sql."(".substr($tmp, 0 , -1)."),";
                }
                if($ifMatched) {
                    $success_count ++;
                }else {
                    $fail_count ++;
                }
            }
        } catch ( Exception $e ) {
            $success = false;
            $message = "导入失败";
            $stock_db->rollback();
            $result = array(
                "msg" => $message,
                "success" => $success
            );
            return $result;
        }

        $sql = substr($sql, 0 , -1);
        try {
            $daily_sell_db->execute($sql);

            $record_data = array(
                'deliver_name' => $deliver_name,
                'fetch_time' => time(),
                'fetch_status' => "已抓取",
                'drug_num' => count(array_unique($drug_array)),
                'total_count' => $total_count,
                'success_count' => $success_count,
                'fail_count' => $fail_count,
                'fetch_person' => session('loginUserId')
            );

        } catch (Exception $e) {
            $success = false;
            $message = "导入失败";
            $daily_sell_db->rollback();
            $stock_db->rollback();
            $result = array(
                "msg" => $message,
                "success" => $success
            );
            return $result;
        }


        $stock_db->commit();
        $daily_sell_db->commit();

        $result = array(
            "msg" => $message,
            "success" => true
        );
        return $result;
    }

}
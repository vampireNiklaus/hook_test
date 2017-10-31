<?php

namespace Home\Service;

use Think\Exception;
use Home\Common\FIdConst;
require __DIR__ . '/../Common/Excel/PHPExcel/IOFactory.php';
require __DIR__ . '/../Common/Excel/PHPExcel.php';
/**
 * PHPExcel文件 Service
 *
 * @author Baoyu Li
 */
class ExportService extends PSIBaseService {

	/**
	 * 业务支付单导出Service
	 *
	 * @param
	 *        	$params
	 * @return array
	 * @throws \PHPExcel_Exception
	 */
	public function exportBusinessPay($params) {
		$dailySell_db = M('bill_business_pay');

		$count=$dailySell_db
			->alias('ds')
			->join('info_employee AS ie ON ds.employee_id=ie.id')
			->field('ds.*,ie.name employee_name')
            ->where('ds.status='.FIdConst::BUSINESS_PAY_STATUS_TOPAY)
			->count();
		$all_data = $dailySell_db
			->alias('ds')
			->join('info_employee AS ie ON ds.employee_id=ie.id')
			->join('info_bank_account AS ib ON ds.pay_account_id=ib.id')
			->field('ds.*,ie.name employee_name,ie.bank_account employee_bank_account,ib.account_name pay_account_name,ib.account_num pay_account_num')
            ->where('ds.status='.FIdConst::BUSINESS_PAY_STATUS_TOPAY)
			->select();

		error_reporting(E_ALL);
		date_default_timezone_set('Asia/Shanghai');
		include_once('../Common/Excel/PHPExcel.php');
		$objPHPExcel = new \PHPExcel;

		/*以下是一些设置 ，什么作者  标题啊之类的*/
		$objPHPExcel->getProperties()->setCreator("业务支付单")
			->setLastModifiedBy("lbyzju")
			->setTitle("业务支付单数据EXCEL导出")
			->setSubject("数据EXCEL导出")
			->setDescription("备份数据")
			->setKeywords("excel")
			->setCategory("result file");
		/*以下就是对处理Excel里的数据， 横着取数据，主要是这一步，其他基本都不要改*/
		//首先写表头
		$objPHPExcel->setActiveSheetIndex(0)

			//Excel的第A列，uid是你查出数组的键值，下面以此类推
			->setCellValue('A1', "状态")
			->setCellValue('B1', "单据编号")
			->setCellValue('C1', "业务员")
			->setCellValue('D1', "待支付金额")
			->setCellValue('E1', "支付账户")
			->setCellValue('F1', "银行卡号")
			->setCellValue('G1', "所支付月份")
			->setCellValue('H1', "业务员银行卡账号");
		foreach($all_data as $k => $v){
			$num=$k+2;
			$objPHPExcel->setActiveSheetIndex(0)

				//Excel的第A列，uid是你查出数组的键值，下面以此类推
				->setCellValue('A'.$num, $v['status']==0?"待确认":"已审核")
				->setCellValue('B'.$num, $v['bill_code'])
				->setCellValue('C'.$num, $v['employee_name'])
				->setCellValue('D'.$num, $v['pay_amount'])
				->setCellValue('E'.$num, $v['pay_account_name'])
				->setCellValue('F'.$num, $v['pay_account_num'])
				->setCellValue('G'.$num, $v['pay_month'])
				->setCellValue('H'.$num, $v['employee_bank_account']);
            }

		$objPHPExcel->getActiveSheet()->setTitle('业务支付单');
		$objPHPExcel->setActiveSheetIndex(0);
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment;filename="'."业务支付单".time().'.xls"');
		header('Cache-Control: max-age=0');
		$objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
		$objWriter->save('php://output');
		exit;
	}

	/**
	 * 库存详情条目导出Service
	 *
	 * @param
	 *        	$params
	 * @return array
	 * @throws \PHPExcel_Exception
	 */
	public function exportStockDetailItem($params) {
		$db = M('info_stock');

		$count=$db
            ->where()
			->count();
		$all_data = $db
			->select();

		error_reporting(E_ALL);
		date_default_timezone_set('Asia/Shanghai');
		include_once('../Common/Excel/PHPExcel.php');
		$objPHPExcel = new \PHPExcel;

		/*以下是一些设置 ，什么作者  标题啊之类的*/
		$objPHPExcel->getProperties()->setCreator("库存详情条目")
			->setLastModifiedBy("lbyzju")
			->setTitle("库存详情条目")
			->setSubject("数据EXCEL导出")
			->setDescription("备份数据")
			->setKeywords("excel")
			->setCategory("result file");
		/*以下就是对处理Excel里的数据， 横着取数据，主要是这一步，其他基本都不要改*/
		//首先写表头
		$objPHPExcel->setActiveSheetIndex(0)

			//Excel的第A列，uid是你查出数组的键值，下面以此类推
			->setCellValue('A1', "药品名称")
			->setCellValue('B1', "配送公司")
			->setCellValue('C1', "批号")
			->setCellValue('D1', "有效期")
			->setCellValue('E1', "当前数量")
			->setCellValue('F1', "预警值")
			->setCellValue('G1', "操作详情");
		foreach($all_data as $k => $v){
			$num=$k+2;
			$objPHPExcel->setActiveSheetIndex(0)

				//Excel的第A列，uid是你查出数组的键值，下面以此类推
				->setCellValue('A'.$num, $v['drug_name'])
				->setCellValue('B'.$num, $v['deliver_name'])
				->setCellValue('C'.$num, $v['batch_num'])
				->setCellValue('D'.$num, $v['expire_time'])
				->setCellValue('E'.$num, $v['amount'])
				->setCellValue('F'.$num, $v['alarm_amount'])
				->setCellValue('G'.$num, $v['operate_info']);
            }

		$objPHPExcel->getActiveSheet()->setTitle('库存详情');
		$objPHPExcel->setActiveSheetIndex(0);
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment;filename="'."库存详情".time().'.xls"');
		header('Cache-Control: max-age=0');
		$objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
		$objWriter->save('php://output');
		exit;
	}

	/**
	 * 业务员信息导出Service
	 *
	 * @param
	 *        	$params
	 * @return array
	 * @throws \PHPExcel_Exception
	 */
	public function exportEmployeeInfo($params) {
		$employee_db = M('info_employee');

		$count=$employee_db
			->count();

		$all_data = $employee_db
			->select();

		error_reporting(E_ALL);
		date_default_timezone_set('Asia/Shanghai');
		include_once('../Common/Excel/PHPExcel.php');
		$objPHPExcel = new \PHPExcel;

		/*以下是一些设置 ，什么作者  标题啊之类的*/
		$objPHPExcel->getProperties()->setCreator("业务员信息")
			->setLastModifiedBy("lbyzju")
			->setTitle("业务员信息EXCEL导出")
			->setSubject("数据EXCEL导出")
			->setDescription("备份数据")
			->setKeywords("excel")
			->setCategory("result file");
		/*以下就是对处理Excel里的数据， 横着取数据，主要是这一步，其他基本都不要改*/
		//首先写表头
		$objPHPExcel->setActiveSheetIndex(0)

			//Excel的第A列，uid是你查出数组的键值，下面以此类推
			->setCellValue('A1', "姓名")
			->setCellValue('B1', "银行账号")
			->setCellValue('C1', "手机")
			->setCellValue('D1', "qq")
			->setCellValue('E1', "邮箱")
			->setCellValue('F1', "地址")
			->setCellValue('G1', "备注")
			->setCellValue('H1', "是否是业务员")
			->setCellValue('I1', "是否离职")
			->setCellValue('J1', "客户端能否登录");
		foreach($all_data as $k => $v){
			$num=$k+2;
			$objPHPExcel->setActiveSheetIndex(0)

				//Excel的第A列，uid是你查出数组的键值，下面以此类推
				->setCellValue('A'.$num, $v['name'])
				->setCellValue('B'.$num, $v['bank_account'])
				->setCellValue('C'.$num, $v['phone'])
				->setCellValue('D'.$num, $v['qq'])
				->setCellValue('E'.$num, $v['email'])
				->setCellValue('F'.$num, $v['address'])
				->setCellValue('G'.$num, $v['note'])
				->setCellValue('H'.$num, $v['is_employee']==0? "否":"是")
				->setCellValue('I'.$num, $v['is_off_job']==0? "否":"是")
				->setCellValue('J'.$num, $v['login_enable']==0? "否":"是");
		}

		$objPHPExcel->getActiveSheet()->setTitle('业务员信息');
		$objPHPExcel->setActiveSheetIndex(0);
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment;filename="'."业务员信息".time().'.xls"');
		header('Cache-Control: max-age=0');
		$objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
		$objWriter->save('php://output');
		exit;
	}

	/**
	 * 销售信息导出Service
	 *
	 * @param
	 *        	$params
	 * @return array
	 * @throws \PHPExcel_Exception
	 */
	public function exportDailySell($params) {
		$db = M('bill_daily_sell');
		$db_temp = M('bill_daily_sell_temp');
		$exportTypes = json_decode(html_entity_decode($params['types']),true);
		$all_data = array();
		foreach($exportTypes as $typeItem){
			if($typeItem == 0){
				$whereStr = " sell_date between '".$params['date_from']."' and '".$params['date_to']."' and employee_name='公司' and status=0";
				$thisDb = $db_temp;
			}elseif($typeItem==1){
				$whereStr = " sell_date between '".$params['date_from']."' and '".$params['date_to']."' and status = 1";
				$thisDb = $db_temp;
			}else{
				$whereStr = " sell_date between '".$params['date_from']."' and '".$params['date_to']."' and employee_name='公司' and status=".$typeItem;
				$thisDb = $db;
			}
			$thisData = $thisDb->where($whereStr)->select();
			foreach($thisData as $itemData){
				array_push($all_data,$itemData);
			}
		}

		error_reporting(E_ALL);
		date_default_timezone_set('Asia/Shanghai');
		include_once('../Common/Excel/PHPExcel.php');
		$objPHPExcel = new \PHPExcel;

		/*以下是一些设置 ，什么作者  标题啊之类的*/
		$objPHPExcel->getProperties()->setCreator("销售信息")
			->setLastModifiedBy("lbyzju")
			->setTitle("销售信息EXCEL导出")
			->setSubject("数据EXCEL导出")
			->setDescription("备份数据")
			->setKeywords("excel")
			->setCategory("result file");
		/*以下就是对处理Excel里的数据， 横着取数据，主要是这一步，其他基本都不要改*/
		//首先写表头
		$objPHPExcel->setActiveSheetIndex(0)

			//Excel的第A列，uid是你查出数组的键值，下面以此类推
			->setCellValue('A1', "客户名称")
			->setCellValue('B1', "商品名称")
			->setCellValue('C1', "规格")
			->setCellValue('D1', "生产厂家")
			->setCellValue('E1', "销售数量")
			->setCellValue('F1', "销售日期")
			->setCellValue('G1', "配送公司")
			->setCellValue('H1', "批号")
			->setCellValue('I1', "有效期")
			->setCellValue('J1', "状态")
			->setCellValue('K1', "备注");
		foreach($all_data as $k => $v){
			$num=$k+2;
			$objPHPExcel->setActiveSheetIndex(0)

				//Excel的第A列，uid是你查出数组的键值，下面以此类推
				->setCellValue('A'.$num, $v['hospital_name'])
				->setCellValue('B'.$num, $v['drug_name'])
				->setCellValue('C'.$num, $v['drug_guige'])
				->setCellValue('D'.$num, $v['drug_manufacture'])
				->setCellValue('E'.$num, $v['sell_amount'])
				->setCellValue('F'.$num, $v['sell_date'])
				->setCellValue('G'.$num, $v['deliver_name'])
				->setCellValue('H'.$num, $v['batch_num'])
				->setCellValue('I'.$num, $v['expire_time'])
				->setCellValue('J'.$num, $this->getDailySellStatus($v['status']))
				->setCellValue('K'.$num, $v['note']);
		}

		$objPHPExcel->getActiveSheet()->setTitle('销售信息');
		$objPHPExcel->setActiveSheetIndex(0);
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment;filename="'."销售信息".time().'.xls"');
		header('Cache-Control: max-age=0');
		$objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
		$objWriter->save('php://output');
		exit;
	}

	public  function  getDailySellStatus($status){
		if($status == 0){
			return "新增已匹配";
		}
		if($status == 1){
			return "新增未匹配";
		}
		if($status == 2){
			return "已确认未编辑";
		}
		if($status == 3){
			return "待支付";
		}
		if($status == 4){
			return "已支付";
		}
		if($status == 5){
			return "已冻结";
		}
	}

}
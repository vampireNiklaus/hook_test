<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Home\Service\ExportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\BusinessPayService;
use Home\Common\FIdConst;
use Home\Service\SMSService;
use Home\Service\BizlogService;

/**
 * 销售Controller
 *
 * @author Baoyu Li
 *        
 */
class BusinessPayController extends PSIBaseController {

	/**
	 * 销售 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::BUSINESS_PAY)) {
			$this->initVar();
			
			$this->assign("title", "业务支付");

			$this->assign("pAddBusinessPay", $us->hasPermission(FIdConst::BUSINESS_PAY_ADD) ? 1 : 0);
			$this->assign("pEditBusinessPay", $us->hasPermission(FIdConst::BUSINESS_PAY_EDIT) ? 1 : 0);
			$this->assign("pDeleteBusinessPay", $us->hasPermission(FIdConst::BUSINESS_PAY_DELETE) ? 1 : 0);
			$this->assign("pImportBusinessPay", $us->hasPermission(FIdConst::BUSINESS_PAY_IMPORT_EXCEL) ? 1 : 0);
			$this->assign("pExportBusinessPay", $us->hasPermission(FIdConst::BUSINESS_PAY_EXPORT_EXCEL) ? 1 : 0);
			$this->assign("pVerifyBusinessPay", $us->hasPermission(FIdConst::BUSINESS_PAY_VERIFY) ? 1 : 0);
			$this->assign("pRevertVerifyBusinessPay", $us->hasPermission(FIdConst::BUSINESS_PAY_REVERT_VERIFY) ? 1 : 0);
			$this->assign("pBusinessPaySearch", $us->hasPermission(FIdConst::BUSINESS_PAY_SEARCH) ? 1 : 0);
			$this->assign("pViewBusinessPayDetail", $us->hasPermission(FIdConst::BUSINESS_PAY_VIEW_DETAIL) ? 1 : 0);

			$this->display();
		} else {
			$this->gotoLoginPage("/Home/BusinessPay/index");
		}
	}


	/**
	 * 获得销售列表
	 */
	public function getAggregatePayItemGrid() {
		if (IS_POST) {
			$params = array(
				"region_id" => I("post.region_id"),
				"hospital_name" => I("post.hospital_name"),
				"hospital_type" => I("post.hospital_type"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$gs = new BusinessPayService();
			$this->ajaxReturn($gs->getAggregatePayItemGrid($params));
		}
	}

	/**
	 * 新增或编辑销售
	 */
	public function editBusinessPay() {
		if (IS_POST) {
			$us = new UserService();
            $bls = new BizlogService();
            $logstr = "";
			if (I("post.edit_id")) {
				// 编辑销售
				if (! $us->hasPermission(FIdConst::BUSINESS_PAY_EDIT)) {
					$this->ajaxReturn($this->noPermission("编辑销售"));
					return;
				}
                $logstr = "编辑销售业务支付条目:";
			} else {
				// 新增销售
				if (! $us->hasPermission(FIdConst::BUSINESS_PAY_ADD)) {
					$this->ajaxReturn($this->noPermission("新增销售"));
					return;
				}
                $logstr = "新增销售业务支付条目:";
			}

			$params = array();
			$params['select']=array();
			foreach ($_POST as $k=>$v){
				if(substr($k,0,7)=='select_'){
					$arr=explode(',',$v);
					$params['select']=array_merge($params['select'],$arr);
				}
			}
			$params['account_id']=I('post.account_id');
			$params['bill_date']=I('post.bill_date');
			$params['pay_month']=I('post.pay_month');
			$params['edit_id']=I('post.edit_id');
			$gs = new BusinessPayService();

			$result = $gs->editBusinessPay($params);
            $logstr .= $result["id"];
            $bls->insertBizlog($logstr);

			$this->ajaxReturn($result);
		}
	}

	/**
	 * 获取新添加未确认的业务支付记录
	 */
	public function getNewBusinessPay() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::BUSINESS_PAY)) {
				$this->ajaxReturn($this->noPermission("查看业务支付单"));
				return;
			}
			$params = array(
				"employee_name" => I("post.employee_name"),
				"status" => I("post.status"),
				"bill_date_from" => I("post.bill_date_from"),
				"bill_date_to" => I("post.bill_date_to")
			);
			$gs = new BusinessPayService();
			$this->ajaxReturn($gs->getNewBusinessPay($params));
		}
	}

	/**
	 *根据businessPay的id获取对应的dailySell
	 **/
	public function getDailySellById() {
		if (IS_POST) {
			$us = new UserService();
			if($us->getLoginType()==FIdConst::LOGIN_TYPE_STAFF){
				//公司员工查看
				if (! $us->hasPermission(FIdConst::BUSINESS_PAY_VIEW_DETAIL)) {
					$this->ajaxReturn($this->noPermission("查看业务支付单关联的销售单"));
					return;
				}
			}else{
				//公司合作伙伴访问

			}
			$id=substr(I('post.id'),2);
			$gs = new BusinessPayService();
			$this->ajaxReturn($gs->getDailySellById($id));
		}
	}

	/**
	 * 删除支付单
	 */
	public function deleteBusinessPay() {
		if (IS_POST) {
            $bls = new BizlogService();
			$list = json_decode($_POST['list']);
			$gs = new BusinessPayService();
            $logstr = "删除销售业务支付条目:".implode(",",$list);
            $bls->insertBizlog($logstr);
			$this->ajaxReturn($gs->deleteBusinessPay($list));
		}
	}

	/**
	 * 审核与反审核
	 */
	public function businessPayStatus(){
		if (IS_POST) {
			$list = json_decode($_POST['list']);
			$type = I('post.type');
			//日志处理
            $bls = new BizlogService();
			if (strcmp($type,"yes")==0) {
                $bls->insertBizlog("业务支付审核:".implode(",",$list));
            } else {
                $bls->insertBizlog("业务支付反审核:".implode(",",$list));
            }
			$sms_enable = I('post.sms_enable');
			$gs = new BusinessPayService();
			$this->ajaxReturn($gs->businessPayStatus($list,$type,$sms_enable));
		}
	}


	/**
	 * 通过Excel导出销售单
	 */
	public function exportBusinessPay() {

		$us = new UserService();
		if (! $us->hasPermission(FIdConst::BUSINESS_PAY_EXPORT_EXCEL)) {
			$this->ajaxReturn($this->noPermission("导出excel"));
			return;
		}
		$exs = new ExportService();
		$exs->exportBusinessPay();
	}


}

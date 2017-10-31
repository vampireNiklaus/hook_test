<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Home\Service\ExportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\DirectPayService;
use Home\Common\FIdConst;
use Home\Service\SMSService;
use Home\Service\BizlogService;

/**
 * 销售Controller
 *
 * @author Baoyu Li
 *        
 */
class DirectPayController extends PSIBaseController {

	/**
	 * 销售 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::DIRECT_PAY)) {
			$this->initVar();
			
			$this->assign("title", "直营结算");

			$this->assign("pAddDirectPay", $us->hasPermission(FIdConst::DIRECT_PAY_ADD) ? 1 : 0);
			$this->assign("pEditDirectPay", $us->hasPermission(FIdConst::DIRECT_PAY_EDIT) ? 1 : 0);
			$this->assign("pDeleteDirectPay", $us->hasPermission(FIdConst::DIRECT_PAY_DELETE) ? 1 : 0);
			$this->assign("pImportDirectPay", $us->hasPermission(FIdConst::DIRECT_PAY_IMPORT_EXCEL) ? 1 : 0);
			$this->assign("pExportDirectPay", $us->hasPermission(FIdConst::DIRECT_PAY_EXPORT_EXCEL) ? 1 : 0);
			$this->assign("pVerifyDirectPay", $us->hasPermission(FIdConst::DIRECT_PAY_VERIFY) ? 1 : 0);
			$this->assign("pRevertVerifyDirectPay", $us->hasPermission(FIdConst::DIRECT_PAY_REVERT_VERIFY) ? 1 : 0);
			$this->assign("pDirectPaySearch", $us->hasPermission(FIdConst::DIRECT_PAY_SEARCH) ? 1 : 0);
			$this->assign("pViewDirectPayDetail", $us->hasPermission(FIdConst::DIRECT_PAY_VIEW_DETAIL) ? 1 : 0);

			$this->display();
		} else {
			$this->gotoLoginPage("/Home/DirectPay/index");
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
			$gs = new DirectPayService();
			$this->ajaxReturn($gs->getAggregatePayItemGrid($params));
		}
	}

	/**
	 * 新增或编辑销售
	 */
	public function editDirectPay() {
		if (IS_POST) {
			$us = new UserService();
            $bls = new BizlogService();
            $logstr = "";
			if (I("post.edit_id")) {
				// 编辑销售
				if (! $us->hasPermission(FIdConst::DIRECT_PAY_EDIT)) {
					$this->ajaxReturn($this->noPermission("编辑销售"));
					return;
				}
                $logstr = "编辑销售直营结算条目:";
			} else {
				// 新增销售
				if (! $us->hasPermission(FIdConst::DIRECT_PAY_ADD)) {
					$this->ajaxReturn($this->noPermission("新增销售"));
					return;
				}
                $logstr = "新增销售直营结算条目:";
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
			$gs = new DirectPayService();

			$result = $gs->editDirectPay($params);
            $logstr .= $result["id"];
            $bls->insertBizlog($logstr);

			$this->ajaxReturn($result);
		}
	}

	/**
	 * 获取新添加未确认的直营结算记录
	 */
	public function getNewDirectPay() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::DIRECT_PAY)) {
				$this->ajaxReturn($this->noPermission("查看直营结算单"));
				return;
			}
			$params = array(
				"employee_name" => I("post.employee_name"),
				"status" => I("post.status"),
				"bill_date_from" => I("post.bill_date_from"),
				"bill_date_to" => I("post.bill_date_to")
			);
			$gs = new DirectPayService();
			$this->ajaxReturn($gs->getNewDirectPay($params));
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
				if (! $us->hasPermission(FIdConst::DIRECT_PAY_VIEW_DETAIL)) {
					$this->ajaxReturn($this->noPermission("查看直营结算单关联的销售单"));
					return;
				}
			}else{
				//公司合作伙伴访问

			}
			$id=substr(I('post.id'),2);
			$gs = new DirectPayService();
			$this->ajaxReturn($gs->getDailySellById($id));
		}
	}

	/**
	 * 删除支付单
	 */
	public function deleteDirectPay() {
		if (IS_POST) {
            $bls = new BizlogService();
			$list = json_decode($_POST['list']);
			$gs = new DirectPayService();
            $logstr = "删除销售直营结算条目:".implode(",",$list);
            $bls->insertBizlog($logstr);
			$this->ajaxReturn($gs->deleteDirectPay($list));
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
                $bls->insertBizlog("直营结算审核:".implode(",",$list));
            } else {
                $bls->insertBizlog("直营结算反审核:".implode(",",$list));
            }
			$sms_enable = I('post.sms_enable');
			$gs = new DirectPayService();
			$this->ajaxReturn($gs->businessPayStatus($list,$type,$sms_enable));
		}
	}


	/**
	 * 通过Excel导出销售单
	 */
	public function exportDirectPay() {

		$us = new UserService();
		if (! $us->hasPermission(FIdConst::DIRECT_PAY_EXPORT_EXCEL)) {
			$this->ajaxReturn($this->noPermission("导出excel"));
			return;
		}
		$exs = new ExportService();
		$exs->exportDirectPay();
	}


}

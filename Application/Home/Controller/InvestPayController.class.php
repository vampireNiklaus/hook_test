<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Home\Service\ExportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\InvestPayService;
use Home\Common\FIdConst;
use Home\Service\SMSService;
use Home\Service\BizlogService;

/**
 * 销售Controller
 *
 * @author Baoyu Li
 *        
 */
class InvestPayController extends PSIBaseController {

	/**
	 * 销售 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::INVEST_PAY)) {
			$this->initVar();
			
			$this->assign("title", "招商结算");

			$this->assign("pAddInvestPay", $us->hasPermission(FIdConst::INVEST_PAY_ADD) ? 1 : 0);
			$this->assign("pEditInvestPay", $us->hasPermission(FIdConst::INVEST_PAY_EDIT) ? 1 : 0);
			$this->assign("pDeleteInvestPay", $us->hasPermission(FIdConst::INVEST_PAY_DELETE) ? 1 : 0);
			$this->assign("pImportInvestPay", $us->hasPermission(FIdConst::INVEST_PAY_IMPORT_EXCEL) ? 1 : 0);
			$this->assign("pExportInvestPay", $us->hasPermission(FIdConst::INVEST_PAY_EXPORT_EXCEL) ? 1 : 0);
			$this->assign("pVerifyInvestPay", $us->hasPermission(FIdConst::INVEST_PAY_VERIFY) ? 1 : 0);
			$this->assign("pRevertVerifyInvestPay", $us->hasPermission(FIdConst::INVEST_PAY_REVERT_VERIFY) ? 1 : 0);
			$this->assign("pInvestPaySearch", $us->hasPermission(FIdConst::INVEST_PAY_SEARCH) ? 1 : 0);
			$this->assign("pViewInvestPayDetail", $us->hasPermission(FIdConst::INVEST_PAY_VIEW_DETAIL) ? 1 : 0);

			$this->display();
		} else {
			$this->gotoLoginPage("/Home/InvestPay/index");
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
			$gs = new InvestPayService();
			$this->ajaxReturn($gs->getAggregatePayItemGrid($params));
		}
	}

	/**
	 * 新增或编辑招商结算
	 */
	public function editInvestPay() {
		if (IS_POST) {
			$us = new UserService();
            $bls = new BizlogService();
            $logstr = "";
			if (I("post.edit_id")) {
				// 编辑销售
				if (! $us->hasPermission(FIdConst::INVEST_PAY_EDIT)) {
					$this->ajaxReturn($this->noPermission("编辑销售"));
					return;
				}
                $logstr = "编辑销售招商结算条目:";
			} else {
				// 新增销售
				if (! $us->hasPermission(FIdConst::INVEST_PAY_ADD)) {
					$this->ajaxReturn($this->noPermission("新增销售"));
					return;
				}
                $logstr = "新增招商结算条目:";
			}

			$params = array();
			$params['select']=array();
			foreach ($_POST as $k=>$v){
				if(substr($k,0,7)=='select_'){
					$arr=explode(',',$v);
					$params['select']=array_merge($params['select'],$arr);
				}
			}
			$params['agent_id']= I('post.agent_id');
			$params['account_id']=I('post.account_id');
			$params['bill_date']=I('post.bill_date');
			$params['pay_month']=I('post.pay_month');
			$params['edit_id']=I('post.edit_id');
			$gs = new InvestPayService();

			$result = $gs->editInvestPay($params);
            $logstr .= $result["id"];
            $bls->insertBizlog($logstr);

			$this->ajaxReturn($result);
		}
	}

	/**
	 * 获取新添加未确认的招商结算记录
	 */
	public function getNewInvestPay() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::INVEST_PAY)) {
				$this->ajaxReturn($this->noPermission("查看招商结算单"));
				return;
			}
			$params = array(
				"agent_name" => I("post.agent_name"),
				"status" => I("post.status"),
				"bill_date_from" => I("post.bill_date_from"),
				"bill_date_to" => I("post.bill_date_to")
			);
			$gs = new InvestPayService();
			$this->ajaxReturn($gs->getNewInvestPay($params));
		}
	}

	/**
	 *根据investPay的id获取对应的dailySell
	 **/
	public function getDailySellById() {
		if (IS_POST) {
			$us = new UserService();
			if($us->getLoginType()==FIdConst::LOGIN_TYPE_STAFF){
				//公司员工查看
				if (! $us->hasPermission(FIdConst::INVEST_PAY_VIEW_DETAIL)) {
					$this->ajaxReturn($this->noPermission("查看招商结算单关联的招商协议单"));
					return;
				}
			}else{
				//公司合作伙伴访问

			}
			$id=substr(I('post.id'),2);
			$gs = new InvestPayService();
			$this->ajaxReturn($gs->getDailySellById($id));
		}
	}

	/**
	 * 删除支付单
	 */
	public function deleteInvestPay() {
		if (IS_POST) {
            $bls = new BizlogService();
			$list = json_decode($_POST['list']);
			$gs = new InvestPayService();
            $logstr = "删除销售招商结算条目:".implode(",",$list);
            $bls->insertBizlog($logstr);
			$this->ajaxReturn($gs->deleteInvestPay($list));
		}
	}

	/**
	 * 审核与反审核
	 */
	public function investPayStatus(){
		if (IS_POST) {
			$list = json_decode($_POST['list']);
			$type = I('post.type');
			//日志处理
            $bls = new BizlogService();
			if (strcmp($type,"yes")==0) {
                $bls->insertBizlog("招商结算审核:".implode(",",$list));
            } else {
                $bls->insertBizlog("招商结算反审核:".implode(",",$list));
            }
			$sms_enable = I('post.sms_enable');
			$gs = new InvestPayService();
			$this->ajaxReturn($gs->investPayStatus($list,$type,$sms_enable));
		}
	}


	/**
	 * 通过Excel导出销售单
	 */
	public function exportInvestPay() {

		$us = new UserService();
		if (! $us->hasPermission(FIdConst::INVEST_PAY_EXPORT_EXCEL)) {
			$this->ajaxReturn($this->noPermission("导出excel"));
			return;
		}
		$exs = new ExportService();
		$exs->exportInvestPay();
	}


}

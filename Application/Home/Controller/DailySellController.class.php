<?php

namespace Home\Controller;

use Home\Service\FetchDailySellService;
use Home\Service\ImportService;
use Home\Service\ExportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\DailySellService;
use Home\Common\FIdConst;
use Home\Service\BizlogService;

/**
 * 销售Controller
 *
 * @author Baoyu Li
 *        
 */
class DailySellController extends PSIBaseController {

	/**
	 * 销售 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::SELL_MANAGE)) {
			$this->initVar();
			
			$this->assign("title", "销售流向管理");
			
			$this->assign("pAddDailySellItem",
					$us->hasPermission(FIdConst::DAILY_SELL_ITEM_ADD) ? 1 : 0);
			$this->assign("pDeleteDailySellItem",
					$us->hasPermission(FIdConst::DAILY_SELL_ITEM_DELETE) ? 1 : 0);
			$this->assign("pImportDailySellItem", $us->hasPermission(FIdConst::DAILY_SELL_ITEM_IMPORT) ? 1 : 0);
			$this->assign("pExportDailySellItem", $us->hasPermission(FIdConst::DAILY_SELL_ITEM_EXPORT) ? 1 : 0);
			$this->assign("pDeleteDailySellItem", $us->hasPermission(FIdConst::DAILY_SELL_ITEM_DELETE) ? 1 : 0);
			$this->assign("pConfirmMatchedDailySellItem", $us->hasPermission(FIdConst::DAILY_SELL_ITEM_CONFIRM_MATCHED) ? 1 : 0);
			$this->assign("pConfirmUnMatchedDailySellItem", $us->hasPermission(FIdConst::DAILY_SELL_ITEM_CONFIRM_UNMATCHED) ? 1 : 0);
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/DailySell/index");
		}
	}

	/**
	 * 获得销售列表
	 */
	public function dailySellList() {
		if (IS_POST) {
			$params = array(
				"grid_type" => I("post.grid_type"), //具体的要查询的哪一个表格
				"sell_date_from" => I("post.sell_date_from"),
				"sell_date_to" => I("post.sell_date_to"),
				"drug_id" => I("post.drug_id"),
				"hospital_name" => I("post.hospital_name"),
				"employee_name" => I("post.employee_name"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);

			$gs = new DailySellService();
			$this->ajaxReturn($gs->dailySellList($params));
		}
	}

    public function dailySellList4Company() {
        if (IS_POST) {
            $params = array(
                "grid_type" => I("post.grid_type"), //具体的要查询的哪一个表格
                "sell_date_from" => I("post.sell_date_from"),
                "sell_date_to" => I("post.sell_date_to"),
                "drug_name" => I("post.drug_name"),
                "hospital_name" => I("post.hospital_name"),
                "employee_name" => I("post.employee_name"),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );

            $gs = new DailySellService();
            $this->ajaxReturn($gs->dailySellList4Company($params));
        }
    }

	//业务支付，获取汇总表
	public function getEmployeeList4AddBusinessPayItem(){
		if (IS_POST) {
			$params["employee_id"] = I("post.employee_id");
			$params["now_date"] = I("post.date");//当前月份日期
			$edit_id= I("post.edit_id");//当前月份日期
			
			$gs = new DailySellService();
			if($edit_id==""){
                $result = $gs->getEmployeeList4AddBusinessPayItem($params);
				$this->ajaxReturn($result);
			}
		}
	}
	//点击汇总表中的一项，获取对应信息--直营结算
	public function getDailySellDetail(){
		if (IS_POST) {
			$params = array(
				"id" => I("post.id"), //具体的要查询的业务员id
				"date" => I("post.date")
			);
			$params["search_date_to"] = I("post.search_date_to");//查询范围终止日期
			$params["search_date_from"] = I("post.search_date_from");//查询范围终止日期
			$gs = new DailySellService();
			$this->ajaxReturn($gs->getDailySellDetail($params));
		}
	}

    //点击汇总表中的一项，获取对应信息--招商结算
    public function getDailySellDetailByAgent(){
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"), //具体的要查询的代理商id
                "date" => I("post.date")
            );
            $params["search_date_to"] = I("post.search_date_to");//查询范围终止日期
            $params["search_date_from"] = I("post.search_date_from");//查询范围终止日期
            $gs = new DailySellService();
            $this->ajaxReturn($gs->getDailySellDetailByAgent($params));
        }
    }

	//点击汇总表中的一项，获取对应信息
	public function getDailySellDetail4DeleHuikuan(){
		if (IS_POST) {
			$params = array(
				"drug_id" => I("post.drug_id"), //具体的要查询的业务员id
			);
			$params["search_date_to"] = I("post.search_date_to");//查询范围终止日期
			$params["search_date_from"] = I("post.search_date_from");//查询范围终止日期
			$gs = new DailySellService();
			$this->ajaxReturn($gs->getDailySellDetail4DeleHuikuan($params));
		}
	}

	//编辑支付单时获取对应子单信息--自营结算
	public function getEditDailySellDetail(){
		if (IS_POST) {
			$params = array(
					"edit_id" => I("post.edit_id")
			);
			$gs = new DailySellService();
			$params["search_date_to"] = I("post.search_date_to");//查询范围终止日期
			$params["search_date_from"] = I("post.search_date_from");//查询范围终止日期
			$this->ajaxReturn($gs->getEditDailySellDetail($params));
		}
	}

    //编辑支付单时获取对应子单信息--招商结算
    public function getEditDailySellDetailByAgent(){
        if (IS_POST) {
            $params = array(
                "edit_id" => I("post.edit_id")
            );
            $gs = new DailySellService();
            $params["search_date_to"] = I("post.search_date_to");//查询范围终止日期
            $params["search_date_from"] = I("post.search_date_from");//查询范围终止日期
            $this->ajaxReturn($gs->getEditDailySellDetail($params));
        }
    }

	//编辑支付单时获取对应子单信息
	public function getEditDailySellDetail4Huikuan(){
		if (IS_POST) {
			$params = array(
					"edit_id" => I("post.edit_id")
			);
			$gs = new DailySellService();
			$params["search_date_to"] = I("post.search_date_to");//查询范围终止日期
			$params["search_date_from"] = I("post.search_date_from");//查询范围终止日期
			$this->ajaxReturn($gs->getEditDailySellDetail4Huikuan($params));
		}
	}
	
	/**
	 * 新增或编辑销售
	 */
	public function editDailySell() {
		if (IS_POST) {
			$us = new UserService();
            $bls = new BizlogService();
			if (I("post.id")) {
				// 编辑销售
				if (! $us->hasPermission(FIdConst::DAILY_SELL_ITEM_EDIT)) {
					$this->ajaxReturn($this->noPermission("编辑销售"));
					return;
				}
			} else {
				// 新增销售
				if (! $us->hasPermission(FIdConst::DAILY_SELL_ITEM_ADD)) {
					$this->ajaxReturn($this->noPermission("新增销售"));
					return;
				}
			}
			//获取post进来的参数。
			$params = array(
				"bill_code" => I("post.bill_code"),
				"employee_id" => I("post.employee_id"),
				"employee_des" => I("post.employee_des"),
				"employee_profit" => I("post.employee_profit"),
				"employee_name" => I("post.employee_name"),
				"drug_id" => I("post.drug_id"),
				"drug_name" => I("post.drug_name"),
				"drug_guige" => I("post.drug_guige"),
				"drug_manufacture" => I("post.drug_manufacture"),
				"hospital_id" => I("post.hospital_id"),
				"hospital_name" => I("post.hospital_name"),
				"stock_id" => I("post.stock_id"),
				"deliver_id" => I("post.deliver_id"),
				"deliver_name" => I("post.deliver_name"),
				"batch_num" => I("post.batch_num"),
				"sell_amount" => I("post.sell_amount"),
				"sell_date" => I("post.sell_date"),
				"create_time" => I("post.create_time"),
				"creator_id" => I("post.creator_id"),
				"note" => I("post.note"),
				"if_paid" => I("post.if_paid"),
				"pay_time" => I("post.pay_time"),
				"paybill_id" => I("post.paybill_id"),
				"status" => I("post.status"),
				"expire_time" => I("post.expire_time"),
			);
			if( I("post.id")){
				$params['id'] = I("post.id");
			}
			$gs = new DailySellService();
            $result = $gs->editDailySell($params);
            if (I("post.id")) {
                $bls->insertBizlog("编辑销售条目:".$result["id"],"业务流程管理-销售管理");
            } else {
                $bls->insertBizlog("新增销售条目:".$result["id"],"业务流程管理-销售管理");
            }
			$this->ajaxReturn($result);
		}
	}

	/**
	 * 新增或编辑销售
	 */
	public function updateDailySellProfit() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::DAILY_SELL_ITEM_MODIFY_PROFIT)) {
					$this->ajaxReturn($this->noPermission("修改业务提成"));
                    $bls = new BizlogService();
                    $bls->insertBizlog("修改业务提成:","业务流程管理-销售管理");
					return;
            }
			//获取post进来的参数。
			$params = array(
				"inData" => I("post.inData"),
			);
            $gs = new DailySellService();
            $result = $gs->updateDailySellProfit($params);
			$this->ajaxReturn($result);
		}
	}


	/**
	 * 删除销售
	 */
	public function deleteDailySellItems() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::DAILY_SELL_ITEM_DELETE)) {
				$this->ajaxReturn($this->noPermission("删除销售"));
				return;
			}

            $params = array(
                "list" => I("post.list")
            );
            $gs = new DailySellService();
            $this->ajaxReturn($gs->deleteDailySell($params));
		}
	}

	/**
	 * 销售自定义字段，查询数据
	 */
	public function queryData() {
		if (IS_POST) {
			$queryKey = I("post.queryKey");
			$gs = new DailySellService();
			$this->ajaxReturn($gs->queryData($queryKey));
		}
	}


	/**
	 * 销售报表导入
	 */
	public function import(){
		if (IS_POST){
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::DAILY_SELL_ITEM_IMPORT)) {
				$this->ajaxReturn($this->noPermission("导入商品"));
				return;
			}

			$upload = new \Think\Upload();

			// 允许上传的文件后缀
			$upload->exts = array(
				'xls',
				'xlsx'
			);

			// 保存路径
			$upload->savePath = '/DailySell/';

			// 先上传文件
			$fileInfo = $upload->uploadOne($_FILES['data_file']);
			if (! $fileInfo) {
				$this->ajaxReturn(
					array(
						"msg" => $upload->getError(),
						"success" => false
					));
			} else {
				$uploadFileFullPath = './Uploads' . $fileInfo['savepath'] . $fileInfo['savename']; // 获取上传到服务器文件路径
				$uploadFileExt = $fileInfo['ext']; // 上传文件扩展名

				$params = array(
					"datafile" => $uploadFileFullPath,
					"ext" => $uploadFileExt
				);
				$ims = new ImportService();
                $bls = new BizlogService();
                $bls->insertBizlog("导入销售列表:","业务流程管理-销售管理");
				$this->ajaxReturn($ims->importDailySellFromExcelFile($params));
			}
		}
	}


	/*手动新增销售条目信息的时候当已经选择了药品，那么接下来进一步
的获取对应的可选的
	医院和配送公司的信息
	*/

	public function  afterDrugSelected(){
		if(IS_POST){
			$params = array(
				"drug_id" => I("post.drug_id")
			);
			$gs = new DailySellService();
			$this->ajaxReturn($gs->afterDrugSelected($params));
		}
	}

	/*
	 *确认临时表的数据到正式表
	 * */
	public function  confirmItems2official(){
		if(IS_POST){
			$params = array(
				"inData" => I("post.inData")
			);
			$ims = new ImportService();
			$this->ajaxReturn($ims->confirmItems2official($params));
		}
	}

	/*导出销售信息*/
	public function  exportDailySell(){
		$us = new UserService();
		if (! $us->hasPermission(FIdConst::DAILY_SELL_ITEM_EXPORT)) {
			$this->ajaxReturn($this->noPermission("导出业务员excel"));
			return;
		}
		$params = array(
			"date_from" => I("get.date_from"),
			"date_to" => I("get.date_to"),
			"types" => I("get.types")
		);

		$exs = new ExportService();
		$exs->exportDailySell($params);
	}
    /*自动抓取销售流向*/
	public function onAutoFetchDailySells(){
        $us = new UserService();
        if (! $us->hasPermission(FIdConst::DAILY_SELL_ITEM_EXPORT)) {
            $this->ajaxReturn($this->noPermission("导出业务员excel"));
            return;
        }
        $params = array(
            "date_from" => I("get.date_from"),
            "date_to" => I("get.date_to"),
            "types" => I("get.types")
        );

        $exs = new DailySellService();
        $exs->onAutoFetchDailySells($params);
    }

    public function autoFetchDailySells() {
        $params = array(
            "deliver_account_id" => I("post.deliver_account_id"),
            "date_from" => I("post.date_from"),
            "date_to" => I("post.date_to")
        );
        $exs = new FetchDailySellService();
        $this->ajaxReturn($exs->autoFetchDailySells($params));
    }
}

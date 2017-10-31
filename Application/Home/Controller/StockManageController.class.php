<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Think\Controller;
use Home\Service\ExportService;
use Home\Service\UserService;
use Home\Service\StockManageService;
use Home\Common\FIdConst;
use Home\Service\BizlogService;

/**
 * 库存调拨单Controller
 *
 * @author RCG
 *
 */
class StockManageController extends PSIBaseController {

    /**
     * 库存调拨单 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::STOCK_MANAGE)) {
            $this->initVar();

            $this->assign("title", "库存调拨单");

            $this->assign("pAddStockTrans",
                $us->hasPermission(FIdConst::STOCK_MANAGE_ADD_STOCK_TRANS) ? 1 : 0);
            $this->assign("pEditStockTrans",
                $us->hasPermission(FIdConst::STOCK_MANAGE_EDIT_STOCK_TRANS) ? 1 : 0);
            $this->assign("pDeleteStockTrans",$us->hasPermission(FIdConst::STOCK_MANAGE_DELETE_STOCK_TRANS) ? 1 : 0);
            $this->assign("pVerifyStockTrans",$us->hasPermission(FIdConst::STOCK_MANAGE_VERIFY_TRANS) ? 1 : 0);
            $this->assign("pRevertVerifyStockTrans",$us->hasPermission(FIdConst::STOCK_MANAGE_REVERT_VERIFY_TRANS) ? 1 : 0);
            $this->assign("pEditStockAlarm", $us->hasPermission(FIdConst::STOCK_MANAGE_EDIT_ALARM) ? 1 : 0);
            $this->assign("pEditStockBatch", $us->hasPermission(FIdConst::STOCK_MANAGE_EDIT_BATCH) ? 1 : 0);
            $this->assign("pViewStockMetaInfo", $us->hasPermission(FIdConst::STOCK_MANAGE_BASIC) ? 1 : 0);
            $this->assign("pDrugBrokenBill", $us->hasPermission(FIdConst::STOCK_MANAGE_BASIC) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/StockManage/index");
        }
    }
    /**
     * 编辑库存条目预警值
     */
    public function editStockItemAlarm(){
        //权限检查
        $us = new UserService();
        if (I("post.id")) {
            // 编辑库存条目
            if (!$us->hasPermission(FIdConst::STOCK_MANAGE_EDIT_ALARM)) {
                $this->ajaxReturn($this->noPermission("编辑库存预警条目"));
                return;
            }
        }

        $params = array(
            "drug_id" => I("post.drug_id"),
            "deliver_id" => I("post.deliver_id"),
            "alarm_amount" => I("post.alarm_amount")
        );
        $gs = new StockManageService();
        $bls = new BizlogService();
        $bls->insertBizlog("修改库存预警值:".$params["drug_id"],"库存管理-库存管理");
        $this->ajaxReturn($gs->editStockItemAlarm($params));

    }


    /**
     * 编辑库存条目预警值
     */
    public function editStockBrokenBill(){
        //权限检查
        $us = new UserService();
            // 编辑库存破损条目
        if (!$us->hasPermission(FIdConst::STOCK_MANAGE_BROKEN_EDIT)) {
            $this->ajaxReturn($this->noPermission("编辑库存破损条目"));
            return;
        }


        $params = array(
            "drug_id" => I("post.drug_id"),
            "id" => I("post.id"),
            "stock_id" => I("post.stock_id"),
            "amount" => I("post.amount"),
            "batch_num" => I("post.batch_num"),
            "status" => I("post.status"),
            "type" => I("post.type"),
            "note" => I("post.note"),
        );
        $gs = new StockManageService();
        $bls = new BizlogService();
        $bls->insertBizlog("编辑库存破损单:".$params["id"],"库存管理-库存破损单管理");
        $this->ajaxReturn($gs->editStockBrokenBill($params));

    }

    /**
     * 删除库存破损条目
     */
    public function deleteBrokenBillBill(){
        //权限检查
        $us = new UserService();
            // 编辑库存破损条目
        if (!$us->hasPermission(FIdConst::STOCK_MANAGE_BROKEN_DELETE)) {
            $this->ajaxReturn($this->noPermission("删除库存破损条目"));
            return;
        }


        $params = array(
            "id" => I("post.id"),
        );
        $gs = new StockManageService();
        $bls = new BizlogService();
        $bls->insertBizlog("删除库存破损单:".$params["id"],"库存管理-库存破损单管理");
        $this->ajaxReturn($gs->deleteBrokenBillBill($params));

    }


    /**
     * 获取入库破损单： 分为两部分，入配送公司之前的破损和已经入配送公司之后的破损
     */
    public function drugBrokenBillList() {
        if (IS_POST) {
            $ps = new StockManageService();
            $params = array(

            );
            $this->ajaxReturn($ps->drugBrokenBillList($params));
        }
    }



    /**
     * 编辑库存条目预警值
     */
    public function editStockBatchItem(){
        //权限检查
        $us = new UserService();
        if (I("post.id")) {
            // 编辑库存条目
            if (!$us->hasPermission(FIdConst::STOCK_MANAGE_EDIT_BATCH)) {
                $this->ajaxReturn($this->noPermission("编辑库存批号信息"));
                return;
            }
        }

        $params = array(
            "id" => I("post.id"),
            "amount" => I("post.amount"),
            "expire_time" => I("post.expire_time"),
        );
        $gs = new StockManageService();
        $bls = new BizlogService();
        $bls->insertBizlog("修改批号信息:".$params["id"],"库存管理-库存管理");
        $this->ajaxReturn($gs->editStockBatchItem($params));

    }


    /**
     * 编辑转账单
     */
    public function editStockTrans(){
//        //权限检查
//        $us = new UserService();
//        if (I("post.id")) {
//            // 编辑库存条目
//            if (! $us->hasPermission(FIdConst::BANK_ACCOUNT_EDIT)) {
//                $this->ajaxReturn($this->noPermission("编辑库存条目"));
//                return;
//            }
//        } else {
//            // 新增库存条目
//            if (! $us->hasPermission(FIdConst::BANK_ACCOUNT_ADD)) {
//                $this->ajaxReturn($this->noPermission("新增库存条目"));
//                return;
//            }
//        }
        $params = array(
            "id" => I("post.id"),
            "drug_id" => I("post.drug_id"),
            "drug_name" => I("post.drug_name"),
            "out_deliver_id" => I("post.out_deliver_id"),
            "in_deliver_id" => I("post.in_deliver_id"),
            "out_deliver_name" => I("post.out_deliver_name"),
            "in_deliver_name" => I("post.in_deliver_name"),
            "supplier_id" => I("post.supplier_id"),
            "supplier_name" => I("post.supplier_name"),
            "amount" => I("post.amount"),
            "batch_num" => I("post.batch_num"),
            "purpose" => I("post.purpose"),
//            "piaoju_code" => I("post.piaoju_code"),
            "allot_date" => I("post.allot_date"),
//            "danju_code" => I("post.danju_code"),
            "danju_code" => "KCDBD".date(YmdHis),
            "create_time" => time(),
            "creator_id" => session("loginUserId"),
            "note" => I("post.note"),
            "bill_code" => "STTR".time(),
        );
        $gs = new StockManageService();
        //添加操作日志
        $bls = new BizlogService();
        $result = $gs->editStockTrans($params);
        if ($params["id"]){
            $bls->insertBizlog("编辑库存调拨单:".$params["id"],"库存管理-库存管理");
        } else {
            $bls->insertBizlog("新增库存调拨单:".$result["id"],"库存管理-库存管理");
        }
        $this->ajaxReturn($result);
    }

    /**
     * 删除库存条目
     */
    public function deleteStock(){
        if(IS_POST){
            $es = new StockManageService();
            if(I("post.id")){
                $params["id"] = I("post.id");
            }
            $this->ajaxReturn($es->deleteStock($params));
        }
    }
    /**
     * 删除转账单
     */
    public function deleteStockTrans(){
        if(IS_POST){
            $es = new StockManageService();
            if(I("post.id")){
                $params["id"] = I("post.id");
            }
            $result = $es->deleteStockTrans($params);
            $bls = new BizlogService();
            $bls->insertBizlog("删除库存调拨单:".$result["id"],"库存管理-库存管理");
            $this->ajaxReturn($result);
        }
    }

    /**
     * 获得库存条目列表
     */
    public function stockSummaryItemList() {
        if (IS_POST) {
            $params = array(
                "drug_name"=>I("post.drug_name"),
                "deliver_name"=>I("post.deliver_name"),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $cs = new StockManageService();
            $this->ajaxReturn($cs->stockSummaryItemList($params));
        }
    }
    /**
     * 获得库存条目列表
     */
    public function stockDetailItemList() {
        if (IS_POST) {
            $params = array(
                "drug_id"=>I("post.drug_id"),
                "deliver_id"=>I("post.deliver_id")
            );
            $cs = new StockManageService();
            $this->ajaxReturn($cs->stockDetailItemList($params));
        }
    }


    /**
     * 获得转账单列表
     */
    public function stockTransList() {
        if (IS_POST) {
            $params = array(
                "stock_id"=>I("stock_id"),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $cs = new StockManageService();
            $this->ajaxReturn($cs->stockTransList($params));
        }
    }


    /**
     * 审核转账单
     */
    public function stockTransStatus(){
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type")
            );
            $ps = new StockManageService();
            $bls = new BizlogService();
            if (strcmp($params["type"],"yes") == 0) {
                $bls->insertBizlog("审核:".$params["id"],"库存管理-库存管理");
            } else {
                $bls->insertBizlog("反审核:".$params["id"],"库存管理-库存管理");
            }
            $this->ajaxReturn($ps->stockTransStatus($params));
        }
    }
    
    
    
    /**
     * 库存条目自定义字段，查询账户
     */
    public function queryData() {
        if (IS_POST) {
            $params = array(
                "queryKey" => I("post.queryKey")
            );
            $cs = new StockManageService();
            $this->ajaxReturn($cs->queryData($params));
        }
    }

    /**
     * 获得某个自销采购单的信息
     */
    public function customerInfo() {
        if (IS_POST) {
            $params = array(
                "id" => I("post.id")
            );
            $cs = new CustomerService();
            $this->ajaxReturn($cs->customerInfo($params));
        }
    }

    /**
     * 通过Excel导入自销采购单资料
     */
    public function import() {
        if (IS_POST) {
            $us = new UserService();
            if (! $us->hasPermission(FIdConst::CUSTOMER_IMPORT)) {
                $this->ajaxReturn($this->noPermission("导入自销采购单"));
                return;
            }

            $upload = new \Think\Upload();

            // 允许上传的文件后缀
            $upload->exts = array(
                'xls',
                'xlsx'
            );

            // 保存路径
            $upload->savePath = '/Customer/';

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
                $cs = new ImportService();
                $this->ajaxReturn($cs->importCustomerFromExcelFile($params));
            }
        }
    }

    public function getBatchList(){
        if(IS_POST){
            $es = new StockManageService();
            if(I("post.drug_id")&&I("post.deliver_id")){
                $params["drug_id"] = I("post.drug_id");
                $params["deliver_id"] = I("post.deliver_id");
                $this->ajaxReturn($es->getBatchList($params));
            }
        }
    }


    /**
     * 通过Excel导出销售单
     */
    public function exportStockDetailItem() {

        $us = new UserService();
//        if (! $us->hasPermission(FIdConst::BUSINESS_PAY_EXPORT_EXCEL)) {
//            $this->ajaxReturn($this->noPermission("导出excel"));
//            return;
//        }
        $exs = new ExportService();
        $exs->exportStockDetailItem();
    }


    /*入库之后的破损单的审核操作*/
    public function stockBrokenBillStatus(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::STOCK_MANAGE_BROKEN_VERIFY))return false;
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type")
            );
            $bls = new BizlogService();
            if (strcmp($params["type"],"yes") == 0) {
                $bls->insertBizlog("入库后库存破损单-审核:".$params["id"],"库存管理-破损管理");
            } else {
                $bls->insertBizlog("入库后库存破损单-反审核:".$params["id"],"库存管理-破损管理");
            }
            $ps = new StockManageService();
            $this->ajaxReturn($ps->stockBrokenBillStatus($params));
        }
    }

}

<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\BankDepositService;
use Home\Common\FIdConst;
use Home\Service\BizlogService;

/**
 * 银行存取款Controller
 *
 * @author RCG
 *
 */
class BankDepositController extends PSIBaseController {

    /**
     * 银行存取款 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::SELF_PURCHASE)) {
            $this->initVar();

            $this->assign("title", "银行存取款");

            $this->assign("pAddCategory",
                $us->hasPermission(FIdConst::CUSTOMER_CATEGORY_ADD) ? 1 : 0);
            $this->assign("pEditCategory",
                $us->hasPermission(FIdConst::CUSTOMER_CATEGORY_EDIT) ? 1 : 0);
            $this->assign("pDeleteCategory",
                $us->hasPermission(FIdConst::CUSTOMER_CATEGORY_DELETE) ? 1 : 0);
            $this->assign("pAddCustomer", $us->hasPermission(FIdConst::CUSTOMER_ADD) ? 1 : 0);
            $this->assign("pEditCustomer", $us->hasPermission(FIdConst::CUSTOMER_EDIT) ? 1 : 0);
            $this->assign("pDeleteCustomer", $us->hasPermission(FIdConst::CUSTOMER_DELETE) ? 1 : 0);
            $this->assign("pImportCustomer", $us->hasPermission(FIdConst::CUSTOMER_IMPORT) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/BankDeposit/index");
        }
    }
    /**
     * 编辑银行账户
     */
    public function editBankAccount(){
//        //权限检查
//        $us = new UserService();
//        if (I("post.id")) {
//            // 编辑银行账户
//            if (! $us->hasPermission(FIdConst::BANK_ACCOUNT_EDIT)) {
//                $this->ajaxReturn($this->noPermission("编辑银行账户"));
//                return;
//            }
//        } else {
//            // 新增银行账户
//            if (! $us->hasPermission(FIdConst::BANK_ACCOUNT_ADD)) {
//                $this->ajaxReturn($this->noPermission("新增银行账户"));
//                return;
//            }
//        }

        $params = array(
            "id" => I("post.id"),
            "account_name" => I("post.account_name"),
            "account_num" => I("post.account_num"),
            "bank_name" => I("post.bank_name"),
            "init_money" => I("post.init_money"),
            "now_money" => I("post.now_money"),
            "is_cash" => I("post.is_cash"),
            "disabled" => I("post.disabled")
        );
        $gs = new BankDepositService();
        $result = $gs->editBankAccount($params);
        $bls = new BizlogService();
        if ($params["id"]) {
            $bls->insertBizlog("资金管理-银行存取款-编辑银行账户:".$params["id"]);
        } else {
            $bls->insertBizlog("资金管理-银行存取款-新增银行账户:".$result["id"]);
        }
        $this->ajaxReturn($result);

    }
    /**
     * 编辑转账单
     */
    public function editBankIO(){
//        //权限检查
//        $us = new UserService();
//        if (I("post.id")) {
//            // 编辑银行账户
//            if (! $us->hasPermission(FIdConst::BANK_ACCOUNT_EDIT)) {
//                $this->ajaxReturn($this->noPermission("编辑银行账户"));
//                return;
//            }
//        } else {
//            // 新增银行账户
//            if (! $us->hasPermission(FIdConst::BANK_ACCOUNT_ADD)) {
//                $this->ajaxReturn($this->noPermission("新增银行账户"));
//                return;
//            }
//        }
        if(IS_POST){
            $params = array(
                "id" => I("post.id"),
                "out_account_id" => I("post.out_account_id"),
                "in_account_id" => I("post.in_account_id"),
                "amount" => I("post.amount"),
                "purpose" => I("post.purpose"),
                "piaoju_code" => I("post.piaoju_code"),
                "danju_code" => I("post.danju_code"),
                "create_time" => date('Y-m-d',time()),
                "creator_id" => session("loginUserId"),
                "note" => I("post.note")
            );
            $gs = new BankDepositService();
            $result = $gs->editBankIO($params);
            $bls = new BizlogService();
            if ($params["id"]) {
                $bls->insertBizlog("资金管理-银行存取款-编辑转账单:".$params["id"]);
            } else {
                $bls->insertBizlog("资金管理-银行存取款-新增转账单:".$result["id"]);
            }
            $this->ajaxReturn($result);
        }


    }

    /**
     * 删除银行账户
     */
    public function deleteBankAccount(){
        if(IS_POST){
            $es = new BankDepositService();
            if(I("post.id")){
                $params["id"] = I("post.id");
            }
            $bls = new BizlogService();
            $bls->insertBizlog("资金管理-银行存取款-删除银行账户:".$params["id"]);
            $this->ajaxReturn($es->deleteBankAccount($params));
        }
    }
    /**
     * 删除转账单
     */
    public function deleteBankIO(){
        if(IS_POST){
            $es = new BankDepositService();
            if(I("post.id")){
                $params["id"] = I("post.id");
            }
            $bls = new BizlogService();
            $bls->insertBizlog("资金管理-银行存取款-删除转账单:".$params["id"]);
            $this->ajaxReturn($es->deleteBankIO($params));
        }
    }

    /**
     * 获得银行账户列表
     */
    public function bankAccountList() {
        if (IS_POST) {
            $params = array(
                "account_name"=>I("post.account_name"),
                "account_num"=>I("post.account_num"),

                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $cs = new BankDepositService();
            $this->ajaxReturn($cs->bankAccountList($params));
        }
    }

    /**
     * 获得银行账户流水明细
     */
    public function bankIODetaillList() {
        if (IS_POST) {
            $params = array(
                "bankcard_id"=>I("post.bankcard_id"),
                "date_from"=>I("post.date_from"),
                "date_to"=>I("post.date_to"),

                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $bs = new BankDepositService();
            $this->ajaxReturn($bs->bankIODetaillList($params));
        }
    }
    /**
     * 获得转账单列表
     */
    public function bankIOList() {
        if (IS_POST) {
            $params = array(
                "account_id"=>I("account_id"),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $cs = new BankDepositService();
            $this->ajaxReturn($cs->bankIOList($params));
        }
    }


    /**
     * 审核转账单
     */
    public function IOstatus(){
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type"),
                "verifier_id" => session("loginUserId"),
            );
            $ps = new BankDepositService();
            $result = $ps->IOstatus($params);
            $bls = new BizlogService();
            if(strcmp($params["type"],"yes") == 0){
                $bls->insertBizlog("资金管理-银行存取款-审核:".$params["id"]);
            } else {
                $bls->insertBizlog("资金管理-银行存取款-反审核:".$params["id"]);
            }
            $this->ajaxReturn($result);
        }
    }
    
    
    
    /**
     * 银行账户自定义字段，查询账户
     */
    public function queryData() {
        if (IS_POST) {
            $params = array(
                "queryKey" => I("post.queryKey")
            );
            $cs = new BankDepositService();
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
}

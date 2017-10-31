<?php
/**
 * User: RCG
 * Date: 2016/6/30 0030
 * Time: 11:30
 */

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\CapitalManageService;
use Home\Common\FIdConst;
use Home\Service\BizlogService;

/**
 * 业务配置Controller
 *
 * @author RCG
 *
 */
class CapitalManageController extends PSIBaseController {

    /**
     * 业务配置 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::ACCOUNT_MANAGE)) {
            $this->initVar();

            $this->assign("title", "账款管理");
            //其他收支单
            $this->assign("pExtraBill", $us->hasPermission(FIdConst::EXTRA_BILL) ? 1 : 0);
            $this->assign("pExtraBillAdd", $us->hasPermission(FIdConst::EXTRA_BILL_ADD) ? 1 : 0);
            $this->assign("pExtraBillEdit", $us->hasPermission(FIdConst::EXTRA_BILL_EDIT) ? 1 : 0);
            $this->assign("pExtraBillDelete", $us->hasPermission(FIdConst::EXTRA_BILL_DELETE) ? 1 : 0);
            $this->assign("pExtraBillVerify", $us->hasPermission(FIdConst::EXTRA_BILL_VERIFY) ? 1 : 0);
            $this->assign("pExtraBillVerifyReturn", $us->hasPermission(FIdConst::EXTRA_BILL_VERIFY_RETURN) ? 1 : 0);
            //应收应付款单
            $this->assign("pReceiptAndPayBill", $us->hasPermission(FIdConst::RECEIPT_AND_PAY_BILL) ? 1 : 0);
            $this->assign("pReceiptAndPayBillAdd", $us->hasPermission(FIdConst::RECEIPT_AND_PAY_BILL_ADD) ? 1 : 0);
            $this->assign("pReceiptAndPayBillEdit", $us->hasPermission(FIdConst::RECEIPT_AND_PAY_BILL_EDIT) ? 1 : 0);
            $this->assign("pReceiptAndPayBillDelete", $us->hasPermission(FIdConst::RECEIPT_AND_PAY_BILL_DELETE) ? 1 : 0);
            $this->assign("pReceiptAndPayBillVerify", $us->hasPermission(FIdConst::RECEIPT_AND_PAY_BILL_VERIFY) ? 1 : 0);
            $this->assign("pReceiptAndPayBillVerifyReturn", $us->hasPermission(FIdConst::RECEIPT_AND_PAY_BILL_VERIFY_RETURN) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/CapitalManage/index");
        }
    }

    /**
     * 获取其他收入支出单列表
     */
    public function getExtraBillList(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::EXTRA_BILL))return false;
        if(IS_POST){
            $es = new CapitalManageService();
            $params["type"] = I("post.type")?I("post.type"):'';
            $this->ajaxReturn($es->getExtraBillList($params));
        }
    }
    /**
     * 添加-编辑其他收入支出单
     */
    public function editExtraBill(){
        $us = new UserService();
        if(IS_POST){
            $es = new CapitalManageService();
            $params = array(
                "type_id" => I("post.type_id"),
                "money" => I("post.money"),
                "note" => I("post.note"),
                "bank_account_id" => I("post.bank_account_id"),
                "bank_account_name" => I("post.bank_account_name"),
                "bank_account_num" => I("post.bank_account_num"),
                "drug_id" => I("post.drug_id"),
                "yewu_date" => I("post.yewu_date"),
            );
            $bls = new BizlogService();
            if(I("post.id")){
                if(!$us->hasPermission(FIdConst::EXTRA_BILL_EDIT)) return false;
                $params["id"] = I("id");
                $bls->insertBizlog("其他收入支出单-编辑收入支出单:".$params["id"],"资金管理-账款管理");
            }else{
                if(!$us->hasPermission(FIdConst::EXTRA_BILL_ADD)) return false;
                $bls->insertBizlog("其他收入支出单-新增收入支出单:".$params["id"],"资金管理-账款管理");
            }
            $this->ajaxReturn($es->editExtraBill($params));
        }
    }
    /**
     * 删除其他收入支出单
     */
    public function deleteExtraBill(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::EXTRA_BILL_DELETE))return false;
        if(IS_POST){
            $es = new CapitalManageService();
            if(I("post.id")){
                $params["id"] = I("id");
                $bls = new BizlogService();
                $bls->insertBizlog("其他收入支出单-删除收入支出单:".$params["id"]);
                $this->ajaxReturn($es->deleteExtraBill($params));
            }
        }
    }

    public function extraBillStatus(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::EXTRA_BILL_VERIFY))return false;
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type")
            );
            $bls = new BizlogService();
            if (strcmp($params["type"],"yes") == 0) {
                $bls->insertBizlog("其他收入支出单-审核:".$params["id"],"资金管理-账款管理");
            } else {
                $bls->insertBizlog("其他收入支出单-反审核:".$params["id"],"资金管理-账款管理");
            }
            $ps = new CapitalManageService();
            $this->ajaxReturn($ps->extraBillStatus($params));
        }
    }

    /**
     * 添加-编辑应收应付单
     */
    public function editReceiptPayBill(){
        $us = new UserService();
        if(IS_POST){
            $es = new CapitalManageService();
            $params = array(
                "type_id" => I("post.type_id"),
                "money" => I("post.money"),
                "note" => I("post.note"),
            );
            $bls = new BizlogService();
            $result = $es->editReceiptPayBill($params);
            if(I("post.id")){
                if(!$us->hasPermission(FIdConst::RECEIPT_AND_PAY_BILL_EDIT))return false;
                $params["id"] = I("id");
                $bls->insertBizlog("应收应付账款单-编辑应收应付账款单:".$params["id"],"资金管理-账款管理");
            }else{
                if(!$us->hasPermission(FIdConst::RECEIPT_AND_PAY_BILL_ADD))return false;
                $bls->insertBizlog("应收应付账款单-新增应收应付账款单","资金管理-账款管理");
            }
            $this->ajaxReturn($result);
        }
    }

    /**
     * 获取应收应付单列表
     */
    public function getReceiptPayBillList(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::RECEIPT_AND_PAY_BILL))return false;
        if(IS_POST){
            $es = new CapitalManageService();
            $params["date"] = I("post.date");
            $this->ajaxReturn($es->getReceiptPayBillList($params));
        }
    }

    /**
     * 删除应收应付单
     */
    public function deleteReceiptPayBill(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::RECEIPT_AND_PAY_BILL_DELETE))return false;
        if(IS_POST){
            $es = new CapitalManageService();
            if(I("post.id")){
                $params["id"] = I("id");
                $bls = new BizlogService();
                $bls->insertBizlog("应收应付账款单-删除应收应付账款单:".$params["id"],"资金管理-账款管理");
                $this->ajaxReturn($es->deleteReceiptPayBill($params));
            }
        }
    }

    public function receiptPayBillStatus(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::EXTRA_BILL_VERIFY))return false;
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type")
            );
            $bls = new BizlogService();
            if (strcmp($params["type"],"yes") == 0) {
                $bls->insertBizlog("应收应付账款单-审核:".$params["id"],"资金管理-账款管理");
            } else {
                $bls->insertBizlog("应收应付账款单-反审核:".$params["id"],"资金管理-账款管理");
            }
            $ps = new CapitalManageService();
            $this->ajaxReturn($ps->receiptPayBillStatus($params));
        }
    }
}

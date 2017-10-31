<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\SelfPurchaseService;
use Home\Common\FIdConst;

/**
 * 自销采购单Controller
 *
 * @author RCG
 *
 */
class SelfPurchaseController extends PSIBaseController {

    /**
     * 自销采购单 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::SELF_PURCHASE)) {
            $this->initVar();

            $this->assign("title", "过票 - 自销采购单");

            $this->assign("pAddSelfPurchaseBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BILL_ADD) ? 1 : 0);
            $this->assign("pEditSelfPurchaseBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BILL_EDIT) ? 1 : 0);
            $this->assign("pDeleteSelfPurchaseBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BILL_DELETE) ? 1 : 0);
            $this->assign("pImportSelfPurchaseBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BILL_IMPORT) ? 1 : 0);
            $this->assign("pExportSelfPurchaseBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BILL_EXPORT) ? 1 : 0);
            $this->assign("pVerifySelfPurchaseBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BILL_VERIFY) ? 1 : 0);
            $this->assign("pRevertVerifySelfPurchaseBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BILL_REVERT_VERIFY) ? 1 : 0);
            $this->display();
        } else {
            $this->gotoLoginPage("/Home/SelfPurchase/index");
        }
    }
    /**
     * 新增或编辑自销采购单
     */
    public function editSelfPurchase(){
        if(IS_POST){
            $es = new SelfPurchaseService();
            $params = array(
                "drug_id" => I("post.drug_id"),
                "supplier_id" => I("post.supplier_id"),
                "kpgs_id" => I("post.kpgs_id"),
                "buy_amount" => I("post.buy_amount"),
                "buy_date" => I("post.buy_date"),
                "kaidan_date" => I("post.kaidan_date"),
                "kaidan_bill_code" => I("post.kaidan_bill_code"),
                "note" => I("post.note"),
                "per_price" => I("post.base_price"),
            );
            if(I("post.id")){
                $params["id"] = I("post.id");
            }
            $this->ajaxReturn($es->editSelfPurchase($params));
        }

    }
    /**
     * 查询自销采购单列表
     */
    public function listSelfPurchase(){
        if(IS_POST){
            $es = new SelfPurchaseService();
            $params = array(
                //此处添加要查询的字段
                "common_name"=>I('post.common_name'),
                "bill_code"=>I('post.bill_code'),
                "status"=>I('post.status'),
                "page" => I("post.page"),
                "start" => 	I("post.start"),
                "limit"=> 	I("post.limit")
            );
            $this->ajaxReturn($es->listSelfPurchase($params));
        }
}

    /**
     * 删除自销采购单
     */
    public function deleteSelfPurchase(){
        if(IS_POST){
            $es = new SelfPurchaseService();
            if(I("post.id")){
                $id = I("post.id");
            }
            $this->ajaxReturn($es->deleteSelfPurchase($id));
        }
    }

    /**
     * 获得自销采购单列表
     */
    public function customerList() {
        if (IS_POST) {
            $params = array(
                "categoryId" => I("post.categoryId"),
                "code" => I("post.code"),
                "name" => I("post.name"),
                "address" => I("post.address"),
                "contact" => I("post.contact"),
                "mobile" => I("post.mobile"),
                "tel" => I("post.tel"),
                "qq" => I("post.qq"),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $cs = new CustomerService();
            $this->ajaxReturn($cs->customerList($params));
        }
    }

    /**
     * 自销采购单自定义字段，查询自销采购单
     */
    public function queryData() {
        if (IS_POST) {
            $params = array(
                "queryKey" => I("post.queryKey")
            );
            $cs = new CustomerService();
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

    /**
     * 审核自销采购单
     */
    public function selfPurchaseStatus(){
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type")
            );

            $ps = new SelfPurchaseService();
            $this->ajaxReturn($ps->selfPurchaseStatus($params));
        }
    }
}

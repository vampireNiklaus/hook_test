<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\DelePurchaseService;
use Home\Common\FIdConst;

/**
 * 代销采购单Controller
 *
 * @author RCG
 *
 */
class DelePurchaseController extends PSIBaseController {

    /**
     * 代销采购单 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::DELE_PURCHASE)) {
            $this->initVar();

            $this->assign("title", "代销采购单");

            $this->assign("pAddDelePurchaseBill",$us->hasPermission(FIdConst::DELE_PURCHASE_BILL_ADD) ? 1 : 0);
            $this->assign("pEditDelePurchaseBill",$us->hasPermission(FIdConst::DELE_PURCHASE_BILL_EDIT) ? 1 : 0);
            $this->assign("pDeleteDelePurchaseBill",$us->hasPermission(FIdConst::DELE_PURCHASE_BILL_DELETE) ? 1 : 0);
            $this->assign("pImportDelePurchaseBill", $us->hasPermission(FIdConst::DELE_PURCHASE_BILL_IMPORT) ? 1 : 0);
            $this->assign("pExportDelePurchaseBill", $us->hasPermission(FIdConst::DELE_PURCHASE_BILL_EXPORT) ? 1 : 0);
            $this->assign("pVerifyDelePurchaseBill", $us->hasPermission(FIdConst::DELE_PURCHASE_BILL_VERIFY) ? 1 : 0);
            $this->assign("pRevertVerifyDelePurchaseBill", $us->hasPermission(FIdConst::DELE_PURCHASE_BILL_REVERT_VERIFY) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/DelePurchase/index");
        }
    }
    /**
     * 编辑代销采购单
     */
    public function editDelePurchase(){
        if(IS_POST){
            $es = new DelePurchaseService();
            $params = array(
                "drug_id" => I("post.drug_id"),
                "deliver_id" => I("post.deliver_id"),
                "supplier_id" => I("post.supplier_id"),
                "buy_amount" => I("post.buy_amount"),
                "batch_num" => I("post.batch_num"),
                "buy_date" => I("post.buy_date"),
                "kaidan_date" => I("post.kaidan_date"),
//                "kaidan_bill_code" => I("post.kaidan_bill_code"),
                "note" => I("post.note"),
            );
            if(I("post.id")){
                $params["id"] = I("id");
            }
            $this->ajaxReturn($es->editDelePurchase($params));
        }

    }
    /**
     * 查询代销采购单列表
     */
    public function listDelePurchase(){
        if(IS_POST){
            $es = new DelePurchaseService();
            $params = array(
                //此处添加要查询的字段
                "common_name"=>I('post.common_name'),
                "bill_code"=>I('post.bill_code'),

                "page" => I("post.page"),
                "start" => 	I("post.start"),
                "limit"=> 	I("post.limit")
            );
            $this->ajaxReturn($es->listDelePurchase($params));
        }
    }

    /**
     * 删除代销采购单
     */
    public function deleteDelePurchase(){
        if(IS_POST){
            $es = new DelePurchaseService();
            if(I("post.id")){
                $id = I("post.id");
            }
            $this->ajaxReturn($es->deleteDelePurchase($id));
        }
    }

    /**
     * 获得代销采购单列表
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
     * 代销采购单自定义字段，查询代销采购单
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
     * 获得某个代销采购单的信息
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
     * 通过Excel导入代销采购单资料
     */
    public function import() {
        if (IS_POST) {
            $us = new UserService();
            if (! $us->hasPermission(FIdConst::CUSTOMER_IMPORT)) {
                $this->ajaxReturn($this->noPermission("导入代销采购单"));
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
     * 审核代销采购单
     */
    public function delePurchaseStatus(){
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type")
            );

            $ps = new DelePurchaseService();
            $this->ajaxReturn($ps->delePurchaseStatus($params));
        }
    }
}

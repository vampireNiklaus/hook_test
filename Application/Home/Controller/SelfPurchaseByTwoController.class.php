<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\SelfPurchaseByTwoService;
use Home\Common\FIdConst;

/**
 * 自销采购单Controller
 *
 * @author RCG
 *
 */
class SelfPurchaseByTwoController extends PSIBaseController {

    /**
     * 自销采购单 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::SELF_PURCHASE_BY_TWO)) {
            $this->initVar();

            $this->assign("title", "两票制 - 自销采购单");

            $this->assign("pAddSelfPurchaseByTwoBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BY_TWO_BILL_ADD) ? 1 : 0);
            $this->assign("pEditSelfPurchaseByTwoBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BY_TWO_BILL_EDIT) ? 1 : 0);
            $this->assign("pDeleteSelfPurchaseByTwoBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BY_TWO_BILL_DELETE) ? 1 : 0);
            $this->assign("pImportSelfPurchaseByTwoBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BY_TWO_BILL_IMPORT) ? 1 : 0);
            $this->assign("pExportSelfPurchaseByTwoBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BY_TWO_BILL_EXPORT) ? 1 : 0);
            $this->assign("pVerifySelfPurchaseByTwoBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BY_TWO_BILL_VERIFY) ? 1 : 0);
            $this->assign("pRevertVerifySelfPurchaseByTwoBill", $us->hasPermission(FIdConst::SELF_PURCHASE_BY_TWO_BILL_REVERT_VERIFY) ? 1 : 0);
            $this->display();
        } else {
            $this->gotoLoginPage("/Home/SelfPurchaseByTwo/index");
        }
    }
    /**
     * 编辑自销采购单
     */
    public function editSelfPurchaseByTwo(){
        if(IS_POST){
            $es = new SelfPurchaseByTwoService();
            $params = array(
                "drug_id" => I("post.drug_id"),
                "supplier_id" => I("post.supplier_id"),
                "buy_amount" => I("post.buy_amount"),
                "base_price" => I("post.base_price"),
                "sum_pay" => I("post.sum_pay"),
                "huikuan_pay" => I("post.huikuan_pay"),
                "tax_unit_price" => I("post.tax_unit_price"),
                "kaipiao_unit_price" => I("post.kaipiao_unit_price"),
                "huikuan_way" => I("post.huikuan_way"),
                "buy_date" => I("post.buy_date"),
                "kaidan_date" => I("post.kaidan_date"),
                "huikuan_deadline" =>I("post.huikuan_deadline"),
                "kaidan_bill_code" => I("post.kaidan_bill_code"),
                "note" => I("post.note"),
            );
            if(I("post.id")){
                $params["id"] = I("id");
            }
            $this->ajaxReturn($es->editSelfPurchaseByTwo($params));
        }

    }
    /**
     * 查询自销采购单列表
     */
    public function listSelfPurchaseByTwo(){
        if(IS_POST){
            $es = new SelfPurchaseByTwoService();
            $params = array(
                //此处添加要查询的字段
                "common_name"=>I('post.common_name'),
                "bill_code"=>I('post.bill_code'),
                "status"=>I('post.status'),
                "page" => I("post.page"),
                "start" => 	I("post.start"),
                "limit"=> 	I("post.limit")
            );
            $this->ajaxReturn($es->listSelfPurchaseByTwo($params));
        }
}

    /**
     * 删除自销采购单
     */
    public function deleteSelfPurchaseByTwo(){
        if(IS_POST){
            $es = new SelfPurchaseByTwoService();
            if(I("post.id")){
                $id = I("post.id");
            }
            $this->ajaxReturn($es->deleteSelfPurchaseByTwo($id));
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

            $ps = new SelfPurchaseByTwoService();
            $this->ajaxReturn($ps->selfPurchaseStatus($params));
        }
    }
}

<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\BusinessSettingService;
use Home\Common\FIdConst;

/**
 * 业务配置Controller
 *
 * @author RCG
 *
 */
class BusinessSettingController extends PSIBaseController {

    /**
     * 业务配置 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::BUSINESS_SETTING)) {
            $this->initVar();

            $this->assign("title", "业务配置");

            $this->assign("pProductAgency", $us->hasPermission(FIdConst::BUSINESS_SETTING_PRODUCT_AGENCY) ? 1 : 0);
            $this->assign("pProductAgencyAdd", $us->hasPermission(FIdConst::BUSINESS_SETTING_PRODUCT_AGENCY_ADD) ? 1 : 0);
            $this->assign("pProductAgencyEdit", $us->hasPermission(FIdConst::BUSINESS_SETTING_PRODUCT_AGENCY_EDIT) ? 1 : 0);
            $this->assign("pProductAgencyDelete", $us->hasPermission(FIdConst::BUSINESS_SETTING_PRODUCT_AGENCY_DELETE) ? 1 : 0);
            $this->assign("pPromoteAgency", $us->hasPermission(FIdConst::BUSINESS_SETTING_PROMOTE_AGENCY) ? 1 : 0);
            $this->assign("pPromoteAgencyAdd", $us->hasPermission(FIdConst::BUSINESS_SETTING_PROMOTE_AGENCY_ADD) ? 1 : 0);
            $this->assign("pPromoteAgencyEdit", $us->hasPermission(FIdConst::BUSINESS_SETTING_PROMOTE_AGENCY_EDIT) ? 1 : 0);
            $this->assign("pPromoteAgencyDelete", $us->hasPermission(FIdConst::BUSINESS_SETTING_PROMOTE_AGENCY_DELETE) ? 1 : 0);

            /*业务员销量预警值*/
            $this->assign("pPromoteAgencyDelete", $us->hasPermission(FIdConst::BUSINESS_SETTING_MONTH_SELL_VIEW) ? 1 : 0);
            $this->assign("pPromoteAgencyDelete", $us->hasPermission(FIdConst::BUSINESS_SETTING_MONTH_SELL_ALARM_EDIT) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/BusinessSetting/index");
        }
    }
    /**
     * 编辑库存条目预警值
     */
    public function editEmployeeMonthAlarm(){
        //权限检查
        $us = new UserService();
        if (I("post.id")) {
            // 编辑库存条目
            if (!$us->hasPermission(FIdConst::EMPLOYEE_MONTH_SELL_ALARM_EDIT)) {
                $this->ajaxReturn($this->noPermission("编辑业务员月销量预警值"));
                return;
            }
        }

        $params = array(
            "id" => I("post.id"),
            "employee_alarm_month" => I("post.employee_alarm_month"),
        );
        $gs = new BusinessSettingService();
        $this->ajaxReturn($gs->editEmployeeMonthAlarm($params));

    }



    /**
     * 获得库存条目列表
     */
    public function employeeProfitAssignItemList() {
        if (IS_POST) {
            $params = array(
                "employee_name "=>I("post.employee_name"),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $cs = new BusinessSettingService();
            $this->ajaxReturn($cs->employeeProfitAssignItemList($params));
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
            $cs = new BusinessSettingService();
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

            $ps = new BusinessSettingService();
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
            $cs = new BusinessSettingService();
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
            $es = new BusinessSettingService();
            if(I("post.drug_id")&&I("post.deliver_id")){
                $params["drug_id"] = I("post.drug_id");
                $params["deliver_id"] = I("post.deliver_id");
                $this->ajaxReturn($es->getBatchList($params));
            }
        }
    }


    /**
     * 获取产品代理协议列表
     */
    public function getProductAgencyList(){
        if(IS_POST){
            $es = new BusinessSettingService();
            $params["date"] = I("post.date");
            $this->ajaxReturn($es->getProductAgencyList($params));
        }
    }
    /**
     * 添加-编辑产品代理协议
     */
    public function editProductAgency(){
        if(IS_POST){
            $es = new BusinessSettingService();
            $params = array(
                "drug_id" => I("post.drug_id"),
                "earnest_money" => I("post.earnest_money"),
                "amount" => I("post.amount"),
                "bill_date" => I("post.bill_date"),
                "protocol_time" => I("post.protocol_time"),
                "note" => I("post.note"),
            );
            if(I("post.id")){
                $params["id"] = I("id");
            }
            $this->ajaxReturn($es->editProductAgency($params));
        }
    }
    /**
     * 删除产品代理协议
     */
    public function deleteProductAgency(){
        if(IS_POST){
            $es = new BusinessSettingService();
            if(I("post.id")){
                $params["id"] = I("id");
            }
            $this->ajaxReturn($es->deleteProductAgency($params));
        }
    }

    /**
     * 获取推广协议列表
     */
    public function getExpandAgencyList(){
        if(IS_POST){
            $es = new BusinessSettingService();
            $params["id"] = I("post.id");
            $this->ajaxReturn($es->getExpandAgencyList($params));
        }
    }
    /**
     * 添加-编辑推广协议
     */
    public function editExpandAgency(){
        if(IS_POST){
            $es = new BusinessSettingService();
            $params = array(
                "drug_id" => I("post.drug_id"),
                "drug_name" => I("post.drug_name"),
                "code" => I("post.code"),
                "employee_id" => I("post.employee_id"),
                "employee_name" => I("post.employee_name"),
                "region_id" => I("post.region_id"),
                "region_name" => I("post.region_name"),
                "earnest_money" => I("post.earnest_money"),
                "earnest_detail" => I("post.earnest_detail"),
                "earnest_date" => I("post.earnest_date"),
                "phone_num" => I("post.phone_num"),
                "bill_detail" => I("post.bill_detail"),
                "expand_money" => I("post.expand_money"),
                "agency_date" => I("post.agency_date"),
                "note" => I("post.note"),
            );
            if(I("post.id")){
                $params["id"] = I("id");
            }
            $this->ajaxReturn($es->editExpandAgency($params));
        }
    }
    /**
     * 删除推广协议
     */
    public function deleteExpandAgency(){
        if(IS_POST){
            $es = new BusinessSettingService();
            if(I("post.id")){
                $params["id"] = I("id");
            }
            $this->ajaxReturn($es->deleteExpandAgency($params));
        }
    }
}

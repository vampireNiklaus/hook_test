<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\ProtocolManageService;
use Home\Common\FIdConst;

/**
 * 协议管理Controller
 *
 * @author RCG
 *
 */
class ProtocolManageController extends PSIBaseController {

    /**
     * 协议管理 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::PROTOCOL_MANAGE)) {
            $this->initVar();

            $this->assign("title", "协议管理");

            $this->assign("pAddProtocolManage", $us->hasPermission(FIdConst::PROTOCOL_MANAGE_ADD) ? 1 : 0);
            $this->assign("pEditProtocolManage", $us->hasPermission(FIdConst::PROTOCOL_MANAGE_EDIT) ? 1 : 0);
            $this->assign("pDeleteProtocolManage", $us->hasPermission(FIdConst::PROTOCOL_MANAGE_DELETE) ? 1 : 0);
            $this->assign("pImportProtocolManage", $us->hasPermission(FIdConst::PROTOCOL_MANAGE_IMPORT) ? 1 : 0);
            $this->assign("pExportProtocolManage", $us->hasPermission(FIdConst::PROTOCOL_MANAGE_EXPORT) ? 1 : 0);
            $this->assign("pVerifyProtocolManage", $us->hasPermission(FIdConst::PROTOCOL_MANAGE_VERIFY) ? 1 : 0);
            $this->assign("pRevertVerifyProtocolManage", $us->hasPermission(FIdConst::PROTOCOL_MANAGE_REVERT_VERIFY) ? 1 : 0);
            $this->display();
        } else {
            $this->gotoLoginPage("/Home/ProtocolManage/index");
        }
    }
    /**
     * 编辑协议明细
     */
    public function editProtocolDetailManage(){
        if(IS_POST){
            $es = new ProtocolManageService();
            $params = array(
                "parent_protocol_id" => I("post.parent_protocol_id"),
                "region" => I("post.region"),
                "hospital_id" => I("hospital_id"),
                "drug_id" => I("post.drug_id"),
                "cash_deposit" => I("post.cash_deposit"),
                "agent_name" => I("post.agent_name"),
                "protocol_amount" => I("post.protocol_amount"),
                "bidding_price" => I("post.bidding_price"),
                "commission" => I("post.commission"),
                "cover_business" => I("post.cover_business"),
                "flow_type" => I("post.flow_type"),
                "zs_employee" => I("post.zs_employee"),
                "zs_commission" => I("post.zs_commission"),
                "develop_time" => I("post.develop_time"),
                "execute_date" => I("post.execute_date"),
                "start_date" => I("post.start_date"),
                "end_date" => I("post.end_date"),
                "note" => I("post.note"),
            );
            if(I("post.id")){
                $params["id"] = I("id");
            }
            $this->ajaxReturn($es->editProtocolDetailManage($params));
        }

    }

    /**
     * 新增或编辑父协议、子协议管理
     */
    public function editProtocolParentManage(){
        if(IS_POST){
            $es = new ProtocolManageService();
            $params = array(
                "itemDatas" => I("post.itemDatas"),
            );
            $this->ajaxReturn($es->editProtocolParentManage($params));
        }

    }
    /**
     * 查询协议管理列表
     */
    public function listProtocolManage(){
        if(IS_POST){
            $es = new ProtocolManageService();
            $params = array(
                //此处添加要查询的字段
                "protocol_number"=>I('post.protocol_number'),
                "agent_name"=>I('post.agent_name'),
                "status"=>I('post.status'),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($es->listProtocolManage($params));
        }
    }


    /**
     * 查询已经通过审核的管理列表
     */
    public function getAgentList4AddInvestPayItem(){
        if (IS_POST) {
            $params["agent_id"] = I("post.agent_id");
            $params["now_date"] = I("post.date");//当前月份日期
            $edit_id= I("post.edit_id");//当前月份日期

            $gs = new ProtocolManageService();
            if($edit_id==""){
                $result = $gs->getAgentList4AddInvestPayItem($params);
                $this->ajaxReturn($result);
            }
        }
    }

    /**
     * 查询协议明细列表
     */
    public function getEditInvestProtocolDetail(){
        if(IS_POST){
            $es = new ProtocolManageService();
            $params = array(
                //此处添加要查询的字段
                "parent_id"=>I('post.parent_id')
            );
            $this->ajaxReturn($es->getEditInvestProtocolDetail($params));
        }
    }


    /**
     * 删除协议管理
     */
    public function deleteProtocolManage(){
        if(IS_POST){
            $es = new ProtocolManageService();
            $params = array(
                //此处添加要查询的字段
                "id"=>I('post.id')
            );
            $this->ajaxReturn($es->deleteProtocolManage($params));
        }
    }

    /**
     * 删除协议明细列表
     */
    public function deleteProtocolDetailItem(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_PROFIT_ASSGIN_DELETE)){
            $this->ajaxReturn($this->noPermission("没有操作权限"));
            return;
        }
        if(IS_POST){
            $es = new ProtocolManageService();
            if(I("post.id")){
                $params["id"] = I("post.id");
            }
            $this->ajaxReturn($es->deleteProtocolDetailItem($params));
        }
    }

    /**
     * 协议管理自定义字段，查询协议管理
     */
    public function queryData() {
        if (IS_POST) {
            $params = array(
                "queryKey" => I("post.queryKey")
            );
            $cs = new ProtocolManageService();
            $this->ajaxReturn($cs->queryData($params));
        }
    }

//    /**
//     * 获得某个协议管理的信息
//     */
//    public function customerInfo() {
//        if (IS_POST) {
//            $params = array(
//                "id" => I("post.id")
//            );
//            $cs = new CustomerService();
//            $this->ajaxReturn($cs->customerInfo($params));
//        }
//    }

    /**
     * 通过Excel导入协议管理资料
     */
    public function import() {
        if (IS_POST) {
            $us = new UserService();
            if (! $us->hasPermission(FIdConst::CUSTOMER_IMPORT)) {
                $this->ajaxReturn($this->noPermission("导入协议管理"));
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
     * 审核协议管理
     */
    public function protocolManageStatus(){
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type")
            );

            $ps = new ProtocolManageService();
            $this->ajaxReturn($ps->protocolManageStatus($params));
        }
    }
}

<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\DeleHuikuanService;
use Home\Common\FIdConst;
use Home\Service\BizlogService;

/**
 * 回款Controller
 *
 * @author RCG
 *
 */
class DeleHuikuanController extends PSIBaseController {


    /**
     * 回款单 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::DELE_HUIKUAN)) {
            $this->initVar();

            $this->assign("title", "佣金--回款单");

            $this->assign("pEditDeleHuikuanBill",$us->hasPermission(FIdConst::DELE_HUIKUAN_BILL_EDIT) ? 1 : 0);
            $this->assign("pDeleteDeleHuikuanBill",$us->hasPermission(FIdConst::DELE_HUIKUAN_BILL_DELETE) ? 1 : 0);
            $this->assign("pImportDeleHuikuanBill", $us->hasPermission(FIdConst::DELE_HUIKUAN_BILL_IMPORT) ? 1 : 0);
            $this->assign("pExportDeleHuikuanBill", $us->hasPermission(FIdConst::DELE_HUIKUAN_BILL_EXPORT) ? 1 : 0);
            $this->assign("pVerifyDeleHuikuanBill", $us->hasPermission(FIdConst::DELE_HUIKUAN_BILL_VERIFY) ? 1 : 0);
            $this->assign("pRevertVerifyDeleHuikuanBill", $us->hasPermission(FIdConst::DELE_HUIKUAN_BILL_REVERT_VERIFY) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/DeleHuikuan/index");
        }
    }

    /**
     * 获得未编辑回款单列表
     */
    public function listDeleHuikuanUnEdit() {
        if (IS_POST) {
            $ps = new DeleHuikuanService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listDeleHuikuanUnEdit($params));
        }
    }

    /**
     * 获得已编辑回款单列表
     */
    public function listDeleHuikuanEdit() {
        if (IS_POST) {
            $ps = new DeleHuikuanService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit"),
                "drug_id" => I("post.drug_id"),
                "status" => I("post.status"),
                "bill_date_from" => I("post.bill_date_from"),
                "bill_date_to" => I("post.bill_date_to")
            );
            $this->ajaxReturn($ps->listDeleHuikuanEdit($params));
        }
    }


    /**
     *回款单根据单号获取内部的销售单据详情
     **/
    public function getDeleHuikuanInnerDetailById() {
        if (IS_POST) {
            $us = new UserService();
            if($us->getLoginType()==FIdConst::LOGIN_TYPE_STAFF){
                //公司员工查看
                if (! $us->hasPermission(FIdConst::DELE_HUIKUAN_BILL_EDIT)) {
                    $this->ajaxReturn($this->noPermission("查看回款单相关信息"));
                    return;
                }
            }else{
                //公司合作伙伴访问

            }
            $id=substr(I('post.id'),2);
            $gs = new DeleHuikuanService();
            $this->ajaxReturn($gs->getDeleHuikuanInnerDetailById($id));
        }
    }


    /**
     * 新增或编辑代销回款单
     */
    public function editDeleHuikuan() {
        if (IS_POST) {
            $params['id'] = I("post.id");
            $params['parent_id'] = I("post.parent_id");
            $params['huikuan_num'] = I("post.huikuan_num");
            $params['huikuan_code'] = I("post.huikuan_code");
            $params['bill_date'] = I("post.bill_date");
            $params['huikuan_account'] = I("post.huikuan_account_id");
            $params['note'] = I("post.note");
            $ps = new DeleHuikuanService();
            $this->ajaxReturn($ps->editDeleHuikuan($params));
        }
    }


    /**
     * 从代销销售单生成回款单
     */
    public function editDeleHuikuanFromDailySell() {
        if (IS_POST) {
            $us = new UserService();

            if (! $us->hasPermission(FIdConst::DELE_HUIKUAN_BILL_EDIT)) {
                $this->ajaxReturn($this->noPermission("编辑回款单"));
                return;
            }


            $params = array();
            $selectors = json_decode(html_entity_decode(I('post.selectors')),true);
            $params['select_count'] = $selectors['select_count'];
            if($params['select_count']<1){
                $this->ajaxReturn($this->noPermission("至少选择一个条目编辑"));
            }
            for($i=0;$i<$params['select_count'] ;$i++){
                $params['select_'.$i] = $selectors['select_'.$i];
            }
//            $params['select']=array();
//            foreach ($_POST as $k=>$v){
//                if(substr($k,0,7)=='select_'){
//                    $arr=explode(',',$v);
//                    $params['select']=array_merge($params['select'],$arr);
//                }
//            }
            $params['account_id']=I('post.account_id');
            $params['bill_date']=I('post.bill_date');
            $params['edit_id']=I('post.edit_id');
            $params['drug_id']=I('post.drug_id');
            $gs = new DeleHuikuanService();
            $result = $gs->editDeleHuikuanFromDailySell($params);
            $bls = new BizlogService();
            if ($params["edit_id"]) {
                $bls->insertBizlog("编辑代销回款条目:".$result["id"],"业务流程管理-代销-代销回款单");
            } else {
                $bls->insertBizlog("新增代销回款条目:".$result["id"],"业务流程管理-代销-代销回款单");
            }
            $this->ajaxReturn($result);
        }
    }


    /**
     * 审核代销回款单
     */
//    public function deleHuikuanStatus(){
//        if (IS_POST) {
//            $params = array(
//                "id" => I("post.id"),
//                "type" => I("post.type")
//            );
//
//            $ps = new DeleHuikuanService();
//            $this->ajaxReturn($ps->deleHuikuanStatus($params));
//        }
//    }

    /**
     * 审核代销回款单
     */
    public function deleHuikuanStatus(){
        if (IS_POST) {
            $params = array(
                "list" => json_decode(html_entity_decode(I("post.list")), true),
                "type" => I("post.type")
            );
            $bls = new BizlogService();
            $ps = new DeleHuikuanService();
            if (strcmp($params["type"],"yes")) {
                $bls->insertBizlog("审核:".implode(",",$params["list"]),"业务流程管理-代销-代销回款单");
            } else {
                $bls->insertBizlog("反审核:".implode(",",$params["list"]),"业务流程管理-代销-代销回款单");
            }
            $this->ajaxReturn($ps->deleHuikuanStatus($params));
        }
    }

    public function getHuikuanAmount()
    {
        if (IS_POST) {
            $id = I("post.id");
            $ps = new DeleHuikuanService();
            $this->ajaxReturn($ps->getHuikuanAmount($id));
        }
    }

    /**
     * 删除回款单
     */
    public function deleteDeleHuikuan() {
        if (IS_POST) {
            $list = json_decode(html_entity_decode(I("post.list")), true);
            $ps = new DeleHuikuanService();
            $bls = new BizlogService();
            $bls->insertBizlog("删除代销回款条目:".implode(",",$list),"业务流程管理-代销-代销回款单");
            $this->ajaxReturn($ps->deleteDeleHuikuan($list));
        }
    }


}
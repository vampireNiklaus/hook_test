<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\SelfHuikuanService;
use Home\Common\FIdConst;

/**
 * 回款Controller
 *
 * @author RCG
 *
 */
class SelfHuikuanController extends PSIBaseController {


    /**
     * 回款单 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::SELF_HUIKUAN)) {
            $this->initVar();

            $this->assign("title", "过票 - 自销回款单");

            $this->assign("pEditSelfHuikuanBill",$us->hasPermission(FIdConst::SELF_HUIKUAN_BILL_EDIT) ? 1 : 0);
            $this->assign("pDeleteSelfHuikuanBill",$us->hasPermission(FIdConst::SELF_HUIKUAN_BILL_DELETE) ? 1 : 0);
            $this->assign("pImportSelfHuikuanBill", $us->hasPermission(FIdConst::SELF_HUIKUAN_BILL_IMPORT) ? 1 : 0);
            $this->assign("pExportSelfHuikuanBill", $us->hasPermission(FIdConst::SELF_HUIKUAN_BILL_EXPORT) ? 1 : 0);
            $this->assign("pVerifySelfHuikuanBill", $us->hasPermission(FIdConst::SELF_HUIKUAN_BILL_VERIFY) ? 1 : 0);
            $this->assign("pRevertVerifySelfHuikuanBill", $us->hasPermission(FIdConst::SELF_HUIKUAN_BILL_REVERT_VERIFY) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/SelfHuikuan/index");
        }
    }

    /**
     * 获得未编辑回款单列表
     */
    public function listSelfHuikuanUnEdit() {
        if (IS_POST) {
            $ps = new SelfHuikuanService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listSelfHuikuanUnEdit($params));
        }
    }

    /**
     * 获得已编辑回款单列表
     */
    public function listSelfHuikuanEdit() {
        if (IS_POST) {
            $ps = new SelfHuikuanService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listSelfHuikuanEdit($params));
        }
    }

    /**
     * 新增或编辑自销回款单
     */
    public function editSelfHuikuan() {
        if (IS_POST) {
            $params['id'] = I("post.id");
            $params['parent_id'] = I("post.parent_id");
            $params['huikuan_num'] = I("post.huikuan_num");
            $params['kaipiao_unit_price'] = I("post.kaipiao_unit_price");
            $params['sum_kaipiao_money'] = I("post.sum_kaipiao_money");
            $params['huikuan_code'] = I("post.huikuan_code");
            $params['bill_date'] = I("post.bill_date");
            $params['huikuan_account'] = I("post.huikuan_account_id");
            $params['note'] = I("post.note");
            $ps = new SelfHuikuanService();
            $this->ajaxReturn($ps->editSelfHuikuan($params));
        }
    }

    /**
     * 审核自销回款单
     */
    public function selfHuikuanStatus(){
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type")
            );

            $ps = new SelfHuikuanService();
            $this->ajaxReturn($ps->selfHuikuanStatus($params));
        }
    }

    public function getHuikuanAmount()
    {
        if (IS_POST) {
            $id = I("post.id");
            $ps = new SelfHuikuanService();
            $this->ajaxReturn($ps->getHuikuanAmount($id));
        }
    }

    /**
     * 删除回款单
     */
    public function deleteSelfHuikuan() {
        if (IS_POST) {
            $id = I("post.id");
            $isSub = I("post.parent_id")!=''?true:false;
            $ps = new SelfHuikuanService();
            $this->ajaxReturn($ps->deleteSelfHuikuan($id,$isSub));
        }
    }


}
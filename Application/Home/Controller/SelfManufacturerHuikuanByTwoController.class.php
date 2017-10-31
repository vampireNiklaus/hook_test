<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\SelfManufacturerHuikuanByTwoService;
use Home\Common\FIdConst;

/**
 * 回款Controller
 *
 * @author RCG
 *
 */
class SelfManufacturerHuikuanByTwoController extends PSIBaseController {


    /**
     * 回款单 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::SELF_MANUFACTURER_HUIKUAN_BY_TWO)) {
            $this->initVar();

            $this->assign("title", "两票制 - 厂家回款单");

            $this->assign("pEditSelfManufacturerHuikuanByTwoBill",$us->hasPermission(FIdConst::SELF_MANUFACTURER_HUIKUAN_BY_TWO_BILL_EDIT) ? 1 : 0);
            $this->assign("pDeleteSelfManufacturerHuikuanByTwoBill",$us->hasPermission(FIdConst::SELF_MANUFACTURER_HUIKUAN_BY_TWO_BILL_DELETE) ? 1 : 0);
            $this->assign("pImportSelfManufacturerHuikuanByTwoBill", $us->hasPermission(FIdConst::SELF_MANUFACTURER_HUIKUAN_BY_TWO_BILL_IMPORT) ? 1 : 0);
            $this->assign("pExportSelfManufacturerHuikuanByTwoBill", $us->hasPermission(FIdConst::SELF_MANUFACTURER_HUIKUAN_BY_TWO_BILL_EXPORT) ? 1 : 0);
            $this->assign("pVerifySelfManufacturerHuikuanByTwoBill", $us->hasPermission(FIdConst::SELF_MANUFACTURER_HUIKUAN_BY_TWO_BILL_VERIFY) ? 1 : 0);
            $this->assign("pRevertVerifySelfManufacturerHuikuanByTwoBill", $us->hasPermission(FIdConst::SELF_MANUFACTURER_HUIKUAN_BY_TWO_BILL_REVERT_VERIFY) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/SelfManufacturerHuikuanByTwo/index");
        }
    }

    /**
     * 获得未编辑回款单列表
     */
    public function listSelfManufacturerHuikuanByTwoUnEdit() {
        if (IS_POST) {
            $ps = new SelfManufacturerHuikuanByTwoService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listSelfManufacturerHuikuanByTwoUnEdit($params));
        }
    }

    /**
     * 获得已编辑回款单列表
     */
    public function listSelfManufacturerHuikuanByTwoEdit() {
        if (IS_POST) {
            $ps = new SelfManufacturerHuikuanByTwoService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listSelfManufacturerHuikuanByTwoEdit($params));
        }
    }

    /**
     * 新增或编辑自销回款单
     */
    public function editSelfManufacturerHuikuanByTwo() {
        if (IS_POST) {
            $params['id'] = I("post.id");
            $params['parent_id'] = I("post.parent_id");
            $params['huikuan_num'] = I("post.huikuan_num");
            $params['huikuan_money'] = I("post.huikuan_money");
            $params['huikuan_code'] = I("post.huikuan_code");
            $params['bill_date'] = I("post.bill_date");
            $params['huikuan_account'] = I("post.huikuan_account_id");
            $params['note'] = I("post.note");
            $ps = new SelfManufacturerHuikuanByTwoService();
            $this->ajaxReturn($ps->editSelfManufacturerHuikuanByTwo($params));
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

            $ps = new SelfManufacturerHuikuanByTwoService();
            $this->ajaxReturn($ps->selfHuikuanStatus($params));
        }
    }

    public function getHuikuanAmount()
    {
        if (IS_POST) {
            $id = I("post.id");
            $ps = new SelfManufacturerHuikuanByTwoService();
            $this->ajaxReturn($ps->getHuikuanAmount($id));
        }
    }

    /**
     * 删除回款单
     */
    public function deleteSelfManufacturerHuikuanByTwo() {
        if (IS_POST) {
            $id = I("post.id");
            $isSub = I("post.parent_id")!=''?true:false;
            $ps = new SelfManufacturerHuikuanByTwoService();
            $this->ajaxReturn($ps->deleteSelfManufacturerHuikuanByTwo($id,$isSub));
        }
    }


}
<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\SelfTaxService;
use Home\Common\FIdConst;

/**
 * 税票Controller
 *
 * @author RCG
 *
 */
class SelfTaxController extends PSIBaseController {


    /**
     * 税票单 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::SELF_TAX)) {
            $this->initVar();

            $this->assign("title", "过票 - 自销税票单");

            $this->assign("pEditSelfTaxBill",$us->hasPermission(FIdConst::SELF_TAX_BILL_EDIT) ? 1 : 0);
            $this->assign("pDeleteSelfTaxBill",$us->hasPermission(FIdConst::SELF_TAX_BILL_DELETE) ? 1 : 0);
            $this->assign("pImportSelfTaxBill", $us->hasPermission(FIdConst::SELF_TAX_BILL_IMPORT) ? 1 : 0);
            $this->assign("pExportSelfTaxBill", $us->hasPermission(FIdConst::SELF_TAX_BILL_EXPORT) ? 1 : 0);
            $this->assign("pVerifySelfTaxBill", $us->hasPermission(FIdConst::SELF_TAX_BILL_VERIFY) ? 1 : 0);
            $this->assign("pRevertVerifySelfTaxBill", $us->hasPermission(FIdConst::SELF_TAX_BILL_REVERT_VERIFY) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/SelfTax/index");
        }
    }

    /**
     * 获得未编辑税票单列表
     */
    public function listSelfTaxUnEdit() {
        if (IS_POST) {
            $ps = new SelfTaxService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listSelfTaxUnEdit($params));
        }
    }

    /**
     * 获得已编辑税票单列表
     */
    public function listSelfTaxEdit() {
        if (IS_POST) {
            $ps = new SelfTaxService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listSelfTaxEdit($params));
        }
    }

    /**
     * 新增或编辑自销税票单
     */
    public function editSelfTax() {
        if (IS_POST) {
            $params['id'] = I("post.id");
            $params['parent_id'] = I("post.parent_id");
            $params['kaipiao_num'] = I("post.kaipiao_num");
            $params['tax_danju_code'] = I("post.tax_danju_code");
            $params['tax_shuipiao_code'] = I("post.tax_shuipiao_code");
            $params['yewu_date'] = I("post.yewu_date");
            $params['taxbill_create_date'] = I("post.taxbill_create_date");
            $params['pay_account'] = I("post.pay_account_id");
            $params['note'] = I("post.note");
            $params['kaipiao_unit_price'] = I("post.kaipiao_unit_price");
            $params['sum_kaipiao_money'] = I("post.sum_kaipiao_money");
            $params['tax_unit_price'] = I("post.tax_unit_price");
            $params['sum_tax_money'] = I("post.sum_tax_money");
            $isParent=I('post.isParent')==1?true:false;
            $isFund=I('post.isFund')==1?true:false;
            $ps = new SelfTaxService();
            $this->ajaxReturn($ps->editSelfTax($params,$isParent,$isFund));
        }
    }

    /**
     * 审核自销税票单
     */
    public function selfTaxStatus(){
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type")
            );

            $ps = new SelfTaxService();
            $this->ajaxReturn($ps->selfTaxStatus($params));
        }
    }

    public function getTaxAmount()
    {
        if (IS_POST) {
            $id = I("post.id");
            $ps = new SelfTaxService();
            $this->ajaxReturn($ps->getTaxAmount($id));
        }
    }

    /**
     * 删除税票单
     */
    public function deleteSelfTax() {
        if (IS_POST) {
            $id = I("post.id");
            $isSub = I("post.parent_id")!=''?true:false;
            $ps = new SelfTaxService();
            $this->ajaxReturn($ps->deleteSelfTax($id,$isSub));
        }
    }


}
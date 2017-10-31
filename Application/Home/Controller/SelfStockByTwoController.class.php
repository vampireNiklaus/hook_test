<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\SelfStockByTwoService;
use Home\Common\FIdConst;

/**
 * 入库Controller
 *
 * @author RCG
 *
 */
class SelfStockByTwoController extends PSIBaseController {


    /**
     * 入库单 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::SELF_STOCK_BY_TWO)) {
            $this->initVar();

            $this->assign("title", "两票制 - 自销入配送公司单");

            $this->assign("pEditSelfWarehouseBill",$us->hasPermission(FIdConst::SELF_STOCK_BY_TWO_BILL_EDIT) ? 1 : 0);
            $this->assign("pDeleteSelfWarehouseBill",$us->hasPermission(FIdConst::SELF_STOCK_BY_TWO_BILL_DELETE) ? 1 : 0);
            $this->assign("pImportSelfWarehouseBill", $us->hasPermission(FIdConst::SELF_STOCK_BY_TWO_BILL_IMPORT) ? 1 : 0);
            $this->assign("pExportSelfWarehouseBill", $us->hasPermission(FIdConst::SELF_STOCK_BY_TWO_BILL_EXPORT) ? 1 : 0);
            $this->assign("pVerifySelfWarehouseBill", $us->hasPermission(FIdConst::SELF_STOCK_BY_TWO_BILL_VERIFY) ? 1 : 0);
            $this->assign("pRevertVerifySelfWarehouseBill", $us->hasPermission(FIdConst::SELF_STOCK_BY_TWO_BILL_REVERT_VERIFY) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/SelfStockByTwo/index");
        }
    }

    /**
     * 获得未编辑入库单列表
     */
    public function listSelfStockByTwoUnEdit() {
        if (IS_POST) {
            $ps = new SelfStockByTwoService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listSelfStockByTwoUnEdit($params));
        }
    }

    /**
     * 获得已编辑入库单列表
     */
    public function listSelfStockByTwoEdit() {
        if (IS_POST) {
            $ps = new SelfStockByTwoService();
            $params = array(
                "status" => I("post.status"),
                "deliver_name" => I("post.deliver_name"),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listSelfStockByTwoEdit($params));
        }
    }

    /**
     * 获取入库破损单
     */
    public function drugBrokenBillList() {
        if (IS_POST) {
            $ps = new SelfStockByTwoService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->drugBrokenBillList($params));
        }
    }

    /**
     * 新增或编辑采购入库单
     */
    public function editSelfStockByTwo() {
        if (IS_POST) {
            $params['id'] = I("post.id");
            $params['parent_id'] = I("post.parent_id");
            $params['stock_num'] = I("post.stock_num");
            $params['instock_date'] = I("post.instock_date");
            $params['deliver_id'] = I("post.deliver_id");
            $params['batch_num'] = I("post.batch_num");
            $params['validity'] = I("post.validity");
            $params['note'] = I("post.note");
            $params['is_broken'] = I("post.is_broken");
            $params['batch_num'] = I("post.batch_num");
            $params['tax_shuipiao_code'] = I("post.tax_shuipiao_code");
            $ps = new SelfStockByTwoService();
            $this->ajaxReturn($ps->editSelfStockByTwo($params));
        }
    }

    /**
     * 审核自销入库单
     */
    public function selfStockStatus(){
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type")
            );

            $ps = new SelfStockByTwoService();
            $this->ajaxReturn($ps->selfStockStatus($params));
        }
    }

    public function getStockAmount()
    {
        if (IS_POST) {
            $id = I("post.id");
            $ps = new SelfStockByTwoService();
            $this->ajaxReturn($ps->getStockAmount($id));
        }
    }

    /**
     * 删除入库单
     */
    public function deleteSelfStockByTwo() {
        if (IS_POST) {
            $id = I("post.id");
            $isSub = I("post.parent_id")!=''?true:false;
            $ps = new SelfStockByTwoService();
            $this->ajaxReturn($ps->deleteSelfStockByTwo($id,$isSub));
        }
    }


}
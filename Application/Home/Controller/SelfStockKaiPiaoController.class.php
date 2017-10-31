<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\SelfStockKaiPiaoService;
use Home\Common\FIdConst;

/**
 * 入库Controller
 *
 * @author RCG
 *
 */
class SelfStockKaiPiaoController extends PSIBaseController {


    /**
     * 入库单 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::SELF_STOCK)) {
            $this->initVar();

            $this->assign("title", "过票 - 自销入开票公司");

            $this->assign("pViewSelfWarehouseInKaiPiaoBill",$us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_VIEW) ? 1 : 0);
            $this->assign("pEditSelfWarehouseInKaiPiaoBill",$us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_EDIT) ? 1 : 0);
            $this->assign("pDeleteSelfWarehouseInKaiPiaoBill",$us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_DELETE) ? 1 : 0);
            $this->assign("pImportSelfWarehouseInKaiPiaoBill", $us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_IMPORT) ? 1 : 0);
            $this->assign("pExportSelfWarehouseInKaiPiaoBill", $us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_EXPORT) ? 1 : 0);
            $this->assign("pVerifySelfWarehouseInKaiPiaoBill", $us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_VERIFY) ? 1 : 0);
            $this->assign("pRevertVerifySelfWarehouseInKaiPiaoBill", $us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_REVERT_VERIFY) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/SelfStock/index");
        }
    }

    /**
     * 获得未编辑入库单列表
     */
    public function listSelfStockKaiPiaoUnEdit() {
        if (IS_POST) {
            $ps = new SelfStockKaiPiaoService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listSelfStockKaiPiaoUnEdit($params));
        }
    }

    /**
     * 获得已编辑入库单列表
     */
    public function listSelfStockKaiPiaoEdit() {
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_VIEW)){
            $this->ajaxReturn($this->noPermission("没有操作权限"));
            return;
        }
        if (IS_POST) {
            $ps = new SelfStockKaiPiaoService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listSelfStockKaiPiaoEdit($params));
        }
    }

    /**
     * 新增或编辑采购入库单
     */
    public function editSelfStockKaiPiao() {
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_EDIT)){
            $this->ajaxReturn($this->noPermission("没有操作权限"));
            return;
        }
        if (IS_POST) {
            $params['id'] = I("post.id");
            $params['parent_id'] = I("post.parent_id");
            $params['stock_amount'] = I("post.stock_amount");
            $params['kaipiao_unit_price'] = I("post.kaipiao_unit_price");
            $params['instock_date'] = I("post.instock_date");
            $params['outstock_date'] = I("post.outstock_date");
            $params['supplier_id'] = I("post.supplier_id");
            $params['supplier_name'] = I("post.supplier_name");
            $params['batch_num'] = I("post.batch_num");
            $params['validity'] = I("post.validity");
            $params['buy_date'] = I("post.buy_date");
            $params['note'] = I("post.note");
            $ps = new SelfStockKaiPiaoService();
            $this->ajaxReturn($ps->editSelfStockKaiPiao($params));
        }
    }

    /**
     * 审核自销入库单
     */
    public function selfStockStatus(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_VERIFY)|| !$us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_REVERT_VERIFY)){
            $this->ajaxReturn($this->noPermission("没有操作权限"));
            return;
        }
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type")
            );

            $ps = new SelfStockKaiPiaoService();
            $this->ajaxReturn($ps->selfStockKaiPiaoStatus($params));
        }
    }

    public function getStockAmount()
    {
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_VIEW)){
            $this->ajaxReturn($this->noPermission("没有操作权限"));
            return;
        }
        if (IS_POST) {
            $id = I("post.id");
            $ps = new SelfStockKaiPiaoService();
            $this->ajaxReturn($ps->getStockAmount($id));
        }
    }

    /**
     * 删除入库单
     */
    public function deleteSelfStockKaiPiao() {
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::SELF_WAREHOUSE_IN_KAIPIAO_BILL_DELETE)){
            $this->ajaxReturn($this->noPermission("没有操作权限"));
            return;
        }
        if (IS_POST) {
            $id = I("post.id");
            $isSub = I("post.parent_id")!=''?true:false;
            $ps = new SelfStockKaiPiaoService();
            $this->ajaxReturn($ps->deleteSelfStockKaiPiao($id,$isSub));
        }
    }


}
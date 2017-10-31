<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\SelfStockService;
use Home\Common\FIdConst;

/**
 * 入库Controller
 *
 * @author RCG
 *
 */
class SelfStockController extends PSIBaseController {


    /**
     * 入库单 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::SELF_STOCK)) {
            $this->initVar();

            $this->assign("title", "过票 - 自销入配送公司单");

            $this->assign("pEditSelfWarehouseBill",$us->hasPermission(FIdConst::SELF_WAREHOUSE_BILL_EDIT) ? 1 : 0);
            $this->assign("pDeleteSelfWarehouseBill",$us->hasPermission(FIdConst::SELF_WAREHOUSE_BILL_DELETE) ? 1 : 0);
            $this->assign("pImportSelfWarehouseBill", $us->hasPermission(FIdConst::SELF_WAREHOUSE_BILL_IMPORT) ? 1 : 0);
            $this->assign("pExportSelfWarehouseBill", $us->hasPermission(FIdConst::SELF_WAREHOUSE_BILL_EXPORT) ? 1 : 0);
            $this->assign("pVerifySelfWarehouseBill", $us->hasPermission(FIdConst::SELF_WAREHOUSE_BILL_VERIFY) ? 1 : 0);
            $this->assign("pRevertVerifySelfWarehouseBill", $us->hasPermission(FIdConst::SELF_WAREHOUSE_BILL_REVERT_VERIFY) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/SelfStock/index");
        }
    }

    /**
     * 获得未编辑入库单列表
     */
    public function listSelfStockUnEdit() {
        if (IS_POST) {
            $ps = new SelfStockService();
            $params = array(
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listSelfStockUnEdit($params));
        }
    }

    /**
     * 获得已编辑入库单列表
     */
    public function listSelfStockEdit() {
        if (IS_POST) {
            $ps = new SelfStockService();
            $params = array(
                "status" => I("post.status"),
                "deliver_name" => I("post.deliver_name"),
                "page" => I("post.page"),
                "start" => I("post.start"),
                "limit" => I("post.limit")
            );
            $this->ajaxReturn($ps->listSelfStockEdit($params));
        }
    }


    /**
     * 新增或编辑采购入库单
     */
    public function editSelfStock() {
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
            $ps = new SelfStockService();
            $this->ajaxReturn($ps->editSelfStock($params));
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

            $ps = new SelfStockService();
            $this->ajaxReturn($ps->selfStockStatus($params));
        }
    }

    public function getStockAmount()
    {
        if (IS_POST) {
            $id = I("post.id");
            $ps = new SelfStockService();
            $this->ajaxReturn($ps->getStockAmount($id));
        }
    }

    /**
     * 删除入库单
     */
    public function deleteSelfStock() {
        if (IS_POST) {
            $id = I("post.id");
            $isSub = I("post.parent_id")!=''?true:false;
            $ps = new SelfStockService();
            $this->ajaxReturn($ps->deleteSelfStock($id,$isSub));
        }
    }


}
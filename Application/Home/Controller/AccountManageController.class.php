<?php
/**
 * User: RCG
 * Date: 2016/6/30 0030
 * Time: 11:30
 */

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\AccountManageService;
use Home\Common\FIdConst;

/**
 * 业务配置Controller
 *
 * @author RCG
 *
 */
class AccountManageController extends PSIBaseController {

    /**
     * 业务配置 - 主页面
     */
    public function index() {
        $us = new UserService();

        if ($us->hasPermission(FIdConst::ACCOUNT_MANAGE)) {
            $this->initVar();

            $this->assign("title", "账款管理");

            $this->assign("pExtraBill", $us->hasPermission(FIdConst::EXTRA_BILL) ? 1 : 0);
            $this->assign("pExtraBillAdd", $us->hasPermission(FIdConst::EXTRA_BILL_ADD) ? 1 : 0);
            $this->assign("pExtraBillEdit", $us->hasPermission(FIdConst::EXTRA_BILL_EDIT) ? 1 : 0);
            $this->assign("pExtraBillDelete", $us->hasPermission(FIdConst::EXTRA_BILL_DELETE) ? 1 : 0);
            $this->assign("pExtraBillVerify", $us->hasPermission(FIdConst::EXTRA_BILL_VERIFY) ? 1 : 0);
            $this->assign("pExtraBillVerifyReturn", $us->hasPermission(FIdConst::EXTRA_BILL_VERIFY_RETURN) ? 1 : 0);

            $this->display();
        } else {
            $this->gotoLoginPage("/Home/AccountManage/index");
        }
    }

    /**
     * 获取其他收入支出单列表
     */
    public function getExtraBillList(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::EXTRA_BILL))return false;
        if(IS_POST){
            $es = new AccountManageService();
            $params["date"] = I("post.date");
            $this->ajaxReturn($es->getExtraBillList($params));
        }
    }
    /**
     * 添加-编辑其他收入支出单
     */
    public function editExtraBill(){
        $us = new UserService();
        if(IS_POST){
            $es = new AccountManageService();
            $params = array(
                "type_id" => I("post.type_id"),
                "money" => I("post.money"),
                "note" => I("post.note"),
            );
            if(I("post.id")){
                if(!$us->hasPermission(FIdConst::EXTRA_BILL_EDIT))return false;
                $params["id"] = I("id");
            }else{
                if(!$us->hasPermission(FIdConst::EXTRA_BILL_ADD))return false;
            }
            $this->ajaxReturn($es->editExtraBill($params));
        }
    }
    /**
     * 删除其他收入支出单
     */
    public function deleteExtraBill(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::EXTRA_BILL_DELETE))return false;
        if(IS_POST){
            $es = new AccountManageService();
            if(I("post.id")){
                $params["id"] = I("id");
                $this->ajaxReturn($es->deleteExtraBill($params));
            }
        }
    }

    public function extraBillStatus(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::EXTRA_BILL_VERIFY))return false;
        if (IS_POST) {
            $params = array(
                "id" => I("post.id"),
                "type" => I("post.type")
            );

            $ps = new AccountManageService();
            $this->ajaxReturn($ps->extraBillStatus($params));
        }
    }
}

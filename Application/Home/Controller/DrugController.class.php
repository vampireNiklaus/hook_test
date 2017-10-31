<?php

namespace Home\Controller;

use Think\Controller;
use Home\Service\UserService;
use Home\Service\DrugService;
use Home\Common\FIdConst;
use Home\Service\ImportService;

/**
 * 药品类别档案Controller
 *
 * @author Baoyu Li
 *
 */
class DrugController extends PSIBaseController
{

    /**
     * 药品类别档案 - 主页面
     */
    public function index(){
        $us = new UserService();
        if($us->hasPermission(FIdConst::DRUG_BASIC_INFO)) {
            $this->initVar();

            $this->assign("title","药品类别档案");

            $this->assign("pAddDrugCategory",$us->hasPermission(FIdConst::DRUG_CATEGORY_ADD) ? 1 : 0);
            $this->assign("pEditDrugCategory",$us->hasPermission(FIdConst::DRUG_CATEGORY_EDIT) ? 1 : 0);
            $this->assign("pDeleteDrugCategory",$us->hasPermission(FIdConst::DRUG_CATEGORY_DELETE) ? 1 : 0);
            $this->assign("pImportDrugCategory",$us->hasPermission(FIdConst::DRUG_CATEGORY_IMPORT) ? 1 : 0);
            $this->assign("pImportDrugAssign",$us->hasPermission(FIdConst::DRUG_CATEGORY_ASSIGN_IMPORT) ? 1 : 0);
            $this->assign("pAddDrugAssign",$us->hasPermission(FIdConst::DRUG_CATEGORY_HOSPITAL_ASSGIN_ADD) ? 1 : 0);
            $this->assign("pDeleteDrugAssign",$us->hasPermission(FIdConst::DRUG_CATEGORY_HOSPITAL_ASSGIN_DELETE) ? 1 : 0);
            $this->assign("pAddDrugProfitAssign",$us->hasPermission(FIdConst::DRUG_CATEGORY_PROFIT_ASSGIN_ADD) ? 1 : 0);
            $this->assign("pDeleteDrugProfitAssign",$us->hasPermission(FIdConst::DRUG_CATEGORY_PROFIT_ASSGIN_DELETE) ? 1 : 0);
            $this->assign("pEditDrugProfitAssign",$us->hasPermission(FIdConst::DRUG_CATEGORY_PROFIT_ASSGIN_EDIT) ? 1 : 0);
            $this->assign("pViewDrugSecretInfo",$us->hasPermission(FIdConst::DRUG_CATEGORY_VIEW_SECRET) ? 1 : 0);
            $this->assign("pViewCompanyProfitAssign",$us->hasPermission(FIdConst::DRUG_CATEGORY_VIEW_COMPANY_PA) ? 1 : 0);
            $this->assign("pViewEmployeeProfitAssign",$us->hasPermission(FIdConst::DRUG_CATEGORY_VIEW_EMPLOYEE_PA) ? 1 : 0);
            $this->display();
        } else {
            $this->gotoLoginPage("/Home/Drug/index");
        }
    }


    /**
     * 药品类别分类
     */
    public function editDrugCategory(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_VIEW_ALL)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $params = array(
                "drug_code"                    => I("post.drug_code"),
                "name"                         => I("post.name"),
                "drug_code"                    => I("drug_code"),
                "common_name"                  => I("common_name"),
                "jx"                           => I("jx"),
                "goods_name"                   => I("goods_name"),
                "guige"                        => I("guige"),
                "jldw"                         => I("jldw"),
                "manufacturer"                 => I("manufacturer"),
                "bid_price"                    => I("bid_price"),
                "retail_price"                 => I("retail_price"),
                "pym"                          => I("pym"),
                "bid_type"                     => I("bid_type"),
                "kaipiao_price"                => I("kaipiao_price"),
                "tax_price"                    => I("tax_price"),
                "base_price"                   => I("base_price"),
                "other_price"                  => I("other_price"),
                "profit"                       => I("profit"),
                "is_new"                       => I("is_new"),
                "disabled"                     => I("disabled"),
                "is_self"                      => I("is_self"),
                "medicare_code_province"       => I("medicare_code_province"),
                "medicare_code_country"        => I("medicare_code_country"),
                "approval_code"                => I("approval_code"),
                "protocol_region"              => I("protocol_region"),
                "business_license_code"        => I("business_license_code"),
                "business_license_expire_time" => I("business_license_expire_time"),
                "gmp_code"                     => I("gmp_code"),
                "gmp_expire_time"              => I("gmp_expire_time"),
                "qs_code"                      => I("qs_code"),
                "qs_expire_time"               => I("qs_expire_time"),
                "client_code"                  => I("client_code"),
                "client_expire_time"           => I("client_expire_time"),
                "creator_id"                   => I("creator_id"),
                "create_time"                  => I("create_time"),
                "deliver_list"                 => html_entity_decode(I("deliver_list")),
                "supplier_list"                => html_entity_decode(I("supplier_list")),
                "delegate_list"                => html_entity_decode(I("delegate_list")),
            );
            if(I("post.id")) {
                $params["id"] = I("post.id");
            }
            $ss = new DrugService();
            $this->ajaxReturn($ss->editDrugCategory($params));
        }
    }

    /**
     * 药品类别分类----增加分配医院
     */
    public function addHospitalAssign(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_HOSPITAL_ASSGIN_ADD)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $params = array(
                "itemDatas" => I("post.itemDatas"),
                "drugData"  => I("post.drugData")
            );
            $ss     = new DrugService();
            $this->ajaxReturn($ss->addHospitalAssign($params));
        }
    }

    /**
     * 药品利润分配----增加分配信息
     */
    public function updateHospitalProfit(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_PROFIT_ASSGIN_EDIT)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $params = array("inData" => I("post.inData"));
            $ss     = new DrugService();
            $this->ajaxReturn($ss->addProfitAssignDetailItem($params));
        }
    }

    /**
     * 药品利润分配----增加分配信息
     */
    public function addProfitAssignDetailItem(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_PROFIT_ASSGIN_ADD)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $params = array("inData" => I("post.inData"));
            $ss     = new DrugService();
            $this->ajaxReturn($ss->addProfitAssignDetailItem($params));
        }
    }


    /**
     * 药品利润分配----公司利润编辑
     */
    public function editCompanyProfitAssign(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_PROFIT_ASSGIN_EDIT)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $params = array(
                "id"             => I("post.id"),
                "company_profit" => I("post.company_profit")
            );
            $ss     = new DrugService();
            $this->ajaxReturn($ss->editCompanyProfitAssign($params));
        }
    }


    /**
     * 药品到供应公司
     */
    public function addDrug2SupplierItem(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_EDIT)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $params = array(
                "drug_name"     => I("post.drug_name"),
                "drug_id"       => I("post.drug_id"),
                "supplier_id"   => I("post.supplier_id"),
                "supplier_name" => I("post.supplier_name"),
                "id"            => I("post.id")
            );
            $ss     = new DrugService();
            $this->ajaxReturn($ss->addDrug2SupplierItem($params));
        }
    }


    /**
     * 药品到配送公司
     */
    public function addDrug2DeliverItem(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_EDIT)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $params = array(
                "drug_name"    => I("post.drug_name"),
                "drug_id"      => I("post.drug_id"),
                "deliver_id"   => I("post.deliver_id"),
                "deliver_name" => I("post.deliver_name"),
                "id"           => I("post.id")
            );
            $ss     = new DrugService();
            $this->ajaxReturn($ss->addDrug2DeliverItem($params));
        }
    }

    /**
     * 药品到代理商
     */
    public function addDrug2DelegateItem(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_EDIT)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $params = array(
                "drug_name"     => I("post.drug_name"),
                "drug_id"       => I("post.drug_id"),
                "delegate_id"   => I("post.delegate_id"),
                "delegate_name" => I("post.delegate_name"),
                "id"            => I("post.id")
            );
            $ss     = new DrugService();
            $this->ajaxReturn($ss->addDrug2DelegateItem($params));
        }
    }


    //	/**
    //	 * 药品到供应公司
    //	 */
    //	public function addDrug2SupplierItem() {
    //        $us = new UserService();
    //        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_EDIT)){
    //            $this->ajaxReturn($this->noPermission("没有操作权限"));
    //            return;
    //        }
    //		if (IS_POST) {
    //			$params = array(
    //				"inData" =>I("post.inData")
    //			);
    //			$ss = new DrugService();
    //			$this->ajaxReturn($ss->addDrug2SupplierItem($params));
    //		}
    //	}

    //	/**
    //	 * 药品到代理商
    //	 */
    //	public function addDrug2DelegateItem() {
    //        $us = new UserService();
    //        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_EDIT)){
    //            $this->ajaxReturn($this->noPermission("没有操作权限"));
    //            return;
    //        }
    //		if (IS_POST) {
    //			$params = array(
    //				"inData" =>I("post.inData")
    //			);
    //			$ss = new DrugService();
    //			$this->ajaxReturn($ss->addDrug2DelegateItem($params));
    //		}
    //	}


    /**
     * 删除药品提成分配
     */
    public function deleteDrugProfitAssignItem(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_PROFIT_ASSGIN_DELETE)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $es = new DrugService();
            if(I("post.id")) {
                $params["id"] = I("post.id");
            }
            $this->ajaxReturn($es->deleteDrugProfitAssignItem($params));
        }
    }

    /**
     * 删除药品供应
     */
    public function deleteDrug2SupplierItem(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_EDIT)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $es = new DrugService();
            if(I("post.id")) {
                $params["id"] = I("post.id");
            }
            $this->ajaxReturn($es->deleteDrug2SupplierItem($params));
        }
    }

    /**
     * 删除药品配送
     */
    public function deleteDrug2DeliverItem(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_EDIT)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $es = new DrugService();
            if(I("post.id")) {
                $params["id"] = I("post.id");
            }
            $this->ajaxReturn($es->deleteDrug2DeliverItem($params));
        }
    }

    /**
     * 删除药品代理
     */
    public function deleteDrug2DelegateItem(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_EDIT)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $es = new DrugService();
            if(I("post.id")) {
                $params["id"] = I("post.id");
            }
            $this->ajaxReturn($es->deleteDrug2DelegateItem($params));
        }
    }

    /**
     * 删除医院分配
     */
    public function deleteDrugAssignHospitalItem(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_HOSPITAL_ASSGIN_DELETE)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $es = new DrugService();
            if(I("post.id")) {
                $params["id"] = I("post.id");
            }
            $this->ajaxReturn($es->deleteDrugAssignHospitalItem($params));
        }
    }

    public function drugCategoryList(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_BASIC_INFO)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        $ss = new DrugService();
        if(IS_POST) {
            $params = array(
                "common_name" => I("post.common_name"),
                "page"        => I("post.page"),
                "start"       => I("post.start"),
                "limit"       => I("post.limit")
            );
            $result = $ss->drugCategoryList($params);
            if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_VIEW_SECRET)) {
                $len = count($result["drugCategoryList"]);
                for($i = 0;$i < $len;$i++){
                    unset($result["drugCategoryList"][$i]["kaipiao_price"]);
                    unset($result["drugCategoryList"][$i]["tax_price"]);
                    unset($result["drugCategoryList"][$i]["base_price"]);
                    //            unset($all_data[$k]["other_price"]);
                    unset($result["drugCategoryList"][$i]["profit"]);
                }
            }
            $this->ajaxReturn($result);
        }
    }

    public function getDeleDrugList(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_VIEW_ALL)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        $ss = new DrugService();
        if(IS_POST) {
            $params = array("drug_id" => I("post.drug_id"),);
            $this->ajaxReturn($ss->getDeleDrugList($params));
        }
    }

    public function drug2supplierList(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DELIVER_QUERY_CONDITION_BY_DRUGID)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        $ss = new DrugService();
        if(IS_POST) {
            $params = array("drug_id" => I("post.drug_id"));
            $this->ajaxReturn($ss->drug2supplierList($params));
        }
    }

    public function drug2deliverList(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DELIVER_QUERY_CONDITION_BY_DRUGID)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        $ss = new DrugService();
        if(IS_POST) {
            $params = array("drug_id" => I("post.drug_id"));
            $this->ajaxReturn($ss->drug2deliverList($params));
        }
    }

    public function drug2delegateList(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DELIVER_QUERY_CONDITION_BY_DRUGID)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        $ss = new DrugService();
        if(IS_POST) {
            $params = array("drug_id" => I("post.drug_id"));
            $this->ajaxReturn($ss->drug2delegateList($params));
        }
    }


    public function drugAssignHospitalList(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_BASIC_INFO)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        $ss = new DrugService();
        if(IS_POST) {
            $params = array(
                "drug_id"       => I("post.drug_id"),
                "hospital_name" => I("post.hospital_name"),
                "page"          => I("post.page"),
                "start"         => I("post.start"),
                "limit"         => I("post.limit")
            );
            $result = $ss->drugAssignHospitalList($params);
            if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_VIEW_COMPANY_PA)) {
                $len = count($result["drugAssignHospitalList"]);
                for($i = 0;$i < $len;$i++){
                    unset($result["drugAssignHospitalList"][$i]["company_profit"]);
                }
            }
            $this->ajaxReturn($result);
        }
    }


    public function drugProfitAssignList(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_BASIC_INFO)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        $ss = new DrugService();
        if(IS_POST) {
            $params = array(
                "drug_id"     => I("post.drug_id"),
                "hospital_id" => I("post.hospital_id"),
            );
            $result = $ss->drugProfitAssignList($params);
            if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_VIEW_EMPLOYEE_PA)) {
                $len = count($result["drugProfitAssignList"]);
                for($i = 0;$i < $len;$i++){
                    unset($result["drugProfitAssignList"][$i]["profit_assign"]);
                }
            }
            $this->ajaxReturn($result);
        }
    }


    public function addDrugCategory(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_VIEW_ALL)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $params = array(
                "code" => I("post.code"),
                "name" => I("post.name"),
            );
            $ss     = new DrugService();
            $this->ajaxReturn($ss->addDrugCategory($params));
        }
    }


    /**
     * 药品类别分类
     */
    public function categoryList(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_VIEW_ALL)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $params = array(
                "code"    => I("post.code"),
                "name"    => I("post.name"),
                "address" => I("post.address"),
                "contact" => I("post.contact"),
                "mobile"  => I("post.mobile"),
                "tel"     => I("post.tel"),
                "qq"      => I("post.qq")
            );
            $ss     = new DrugService();
            $this->ajaxReturn($ss->categoryList($params));
        }
    }

    /**
     * 药品类别档案列表
     */
    public function supplierList(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_VIEW_ALL)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $params = array(
                "categoryId" => I("post.categoryId"),
                "code"       => I("post.code"),
                "name"       => I("post.name"),
                "address"    => I("post.address"),
                "contact"    => I("post.contact"),
                "mobile"     => I("post.mobile"),
                "tel"        => I("post.tel"),
                "qq"         => I("post.qq"),
                "page"       => I("post.page"),
                "start"      => I("post.start"),
                "limit"      => I("post.limit")
            );
            $ss     = new DrugService();
            $this->ajaxReturn($ss->supplierList($params));
        }
    }

    /**
     * 新建或编辑药品类别分类
     */
    public function editCategory(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_EDIT)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $us = new UserService();
            if(I("post.id")) {
                // 编辑药品类别分类
                if(!$us->hasPermission(FIdConst::SUPPLIER_CATEGORY_EDIT)) {
                    $this->ajaxReturn($this->noPermission("编辑药品类别分类"));

                    return;
                }
            } else {
                // 新增药品类别分类
                if(!$us->hasPermission(FIdConst::SUPPLIER_CATEGORY_ADD)) {
                    $this->ajaxReturn($this->noPermission("新增药品类别分类"));

                    return;
                }
            }

            $params = array(
                "id"   => I("post.id"),
                "code" => I("post.code"),
                "name" => I("post.name")
            );
            $ss     = new DrugService();
            $this->ajaxReturn($ss->editCategory($params));
        }
    }

    /**
     * 删除药品类别分类
     */
    public function deleteDrugCategory(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_DELETE)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $us = new UserService();
            if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_DELETE)) {
                $this->ajaxReturn($this->noPermission("删除药品类别分类"));

                return;
            }

            $params = array("id" => I("post.id"));
            $ss     = new DrugService();
            $this->ajaxReturn($ss->deleteDrugCategory($params));
        }
    }

    /**
     * 新建或编辑药品类别档案
     */
    public function editDrug(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_EDIT)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $us = new UserService();
            if(I("post.id")) {
                // 编辑药品类别档案
                if(!$us->hasPermission(FIdConst::SUPPLIER_EDIT)) {
                    $this->ajaxReturn($this->noPermission("编辑药品类别档案"));

                    return;
                }
            } else {
                // 新增药品类别档案
                if(!$us->hasPermission(FIdConst::SUPPLIER_ADD)) {
                    $this->ajaxReturn($this->noPermission("新增药品类别档案"));

                    return;
                }
            }

            $params = array(
                "id"              => I("post.id"),
                "code"            => I("post.code"),
                "name"            => I("post.name"),
                "address"         => I("post.address"),
                "addressShipping" => I("post.addressShipping"),
                "contact01"       => I("post.contact01"),
                "mobile01"        => I("post.mobile01"),
                "tel01"           => I("post.tel01"),
                "qq01"            => I("post.qq01"),
                "contact02"       => I("post.contact02"),
                "mobile02"        => I("post.mobile02"),
                "tel02"           => I("post.tel02"),
                "qq02"            => I("post.qq02"),
                "bankName"        => I("post.bankName"),
                "bankAccount"     => I("post.bankAccount"),
                "tax"             => I("post.tax"),
                "fax"             => I("post.fax"),
                "note"            => I("post.note"),
                "categoryId"      => I("post.categoryId"),
                "initPayables"    => I("post.initPayables"),
                "initPayablesDT"  => I("post.initPayablesDT")
            );
            $ss     = new DrugService();
            $this->ajaxReturn($ss->editDrug($params));
        }
    }

    /**
     * 删除药品类别档案
     */
    public function deleteDrug(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_DELETE)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {
            $us = new UserService();
            if(!$us->hasPermission(FIdConst::SUPPLIER_DELETE)) {
                $this->ajaxReturn($this->noPermission("删除药品类别档案"));

                return;
            }

            $params = array("id" => I("post.id"));
            $ss     = new DrugService();
            $this->ajaxReturn($ss->deleteDrug($params));
        }
    }

    /**
     * 药品类别自定义字段，查询数据
     */
    public function queryData(){
        if(IS_POST) {
            $isSelf = 'both';
            switch(I("post.isSelf")) {
                case 'true':
                    $isSelf = 1;
                    break;
                case 'false':
                    $isSelf = 0;
                    break;
            }
            $params = array(
                "queryKey" => I("post.queryKey"),
                "isSelf"   => $isSelf
            );
            $ss     = new DrugService();
            $this->ajaxReturn($ss->queryData($params));
        }
    }

    /**
     * 获得某个药品类别的信息
     */
    public function supplierInfo(){
        if(IS_POST) {
            $params = array("id" => I("post.id"));
            $ss     = new DrugService();
            $this->ajaxReturn($ss->supplierInfo($params));
        }
    }

    /**
     * 药品分配导入
     */
    public function importDrugAssign(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_ASSIGN_IMPORT)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }

        if(IS_POST) {
            $upload = new \Think\Upload();

            // 允许上传的文件后缀
            $upload->exts = array(
                'xls',
                'xlsx'
            );

            // 保存路径
            $upload->savePath = '/Drug/';

            // 先上传文件
            $fileInfo = $upload->uploadOne($_FILES['data_file']);
            if(!$fileInfo) {
                $this->ajaxReturn(array(
                    "msg"     => $upload->getError(),
                    "success" => FALSE
                ));
            } else {
                $uploadFileFullPath = './Uploads' . $fileInfo['savepath'] . $fileInfo['savename']; // 获取上传到服务器文件路径
                $uploadFileExt      = $fileInfo['ext']; // 上传文件扩展名

                $params = array(
                    "datafile" => $uploadFileFullPath,
                    "ext"      => $uploadFileExt
                );
                $ims    = new ImportService();
                $this->ajaxReturn($ims->importDrugAssignFromExcelFile($params));
            }
        }
    }

    /**
     * 药品信息导入
     */
    public function importDrug(){
        $us = new UserService();
        if(!$us->hasPermission(FIdConst::DRUG_CATEGORY_IMPORT)) {
            $this->ajaxReturn($this->noPermission("没有操作权限"));

            return;
        }
        if(IS_POST) {

            $upload = new \Think\Upload();

            // 允许上传的文件后缀
            $upload->exts = array(
                'xls',
                'xlsx'
            );

            // 保存路径
            $upload->savePath = '/Drug/';

            // 先上传文件
            $fileInfo = $upload->uploadOne($_FILES['data_file']);
            if(!$fileInfo) {
                $this->ajaxReturn(array(
                    "msg"     => $upload->getError(),
                    "success" => FALSE
                ));
            } else {
                $uploadFileFullPath = './Uploads' . $fileInfo['savepath'] . $fileInfo['savename']; // 获取上传到服务器文件路径
                $uploadFileExt      = $fileInfo['ext']; // 上传文件扩展名

                $params = array(
                    "datafile" => $uploadFileFullPath,
                    "ext"      => $uploadFileExt
                );
                $ims    = new ImportService();
                $this->ajaxReturn($ims->importDrugFromExcelFile($params));
            }
        }
    }
}

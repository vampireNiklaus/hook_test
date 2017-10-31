<?php

namespace Home\Service;

use Home\Service\IdGenService;
use Home\Service\BizlogService;
use Home\Common\FIdConst;
use Home\Service\UserService;
use Think\Exception;

/**
 * 药品档案Service
 *
 * @author Baoyu Li
 */
class DrugService extends PSIBaseService
{
    private $LOG_CATEGORY = "基础数据-药品档案";


    public function editDrugCategory($params){

        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $ps            = new PinyinService();
        $py            = $ps->toPY($params['name']);
        $params['pym'] = $py;

        $drug_table = D("info_drug");
        $drug_table->startTrans();
        try {
            if($params["id"]) {
                $where      = array(
                    'common_name'  => $params['common_name'],
                    'guige'        => $params['guige'],
                    'id'           => array(
                        'neq',
                        $params['id']
                    ),
                    'jx'           => $params['jx'],
                    'manufacturer' => $params['manufacturer']
                );
                $tempSearch = $drug_table->where($where)->select();
                if(count($tempSearch) > 0) {
                    return $this->bad("该通用名，剂型，规格，生产企业的药品已经存在");
                }
                $drug_table->save($params);
            } else {
                $where      = array(
                    'common_name'  => $params['common_name'],
                    'guige'        => $params['guige'],
                    'jx'           => $params['jx'],
                    'manufacturer' => $params['manufacturer']
                );
                $tempSearch = $drug_table->where($where)->select();
                if(count($tempSearch) > 0) {
                    return $this->bad("该通用名，剂型，规格，生产企业的药品已经存在");
                }

                $params["creator_id"]  = session("loginUserId");
                $params['create_time'] = time();
                $params["id"]          = $drug_table->add($params);
            }


            //            $supplierList1 = json_decode($params['supplier_list'],TRUE);
            //            $supplierList  = $supplierList1['drug_supplierList'];
            //			$deliverList1 = json_decode($params['deliver_list'],true);
            //			$deliverList = $deliverList1['drug_deliverList'];
            //            $delegateList1 = json_decode($params['delegate_list'],TRUE);
            //            $delegateList  = $delegateList1['drug_delegateList'];

            //更新开票公司
            //            $d2stb = M('info_drug2supplier');
            //            $d2stb->startTrans();
            //            $whereStr = " drug_id = " . $params['id'];
            //
            //            $d2stb->where($whereStr)->delete();
            //            foreach($supplierList as $item){
            //                $tempPara = array("drug_id" => (int)$params['id'],"drug_name" => $params['common_name'],"supplier_id" => (int)$item['id'],"supplier_name" => $item['name']);
            //                $d2stb->add($tempPara);
            //            }

            //更新配送公司
            //			$d2delivertb = M('info_drug2deliver');
            //			$whereStr = " drug_id = ".$params['id'];
            //			$d2delivertb->where($whereStr)->delete();
            //			foreach($deliverList as $item){
            //				$tempPara = array(
            //					"drug_id"=>(int)$params['id'],
            //					"drug_name"=>$params['common_name'],
            //					"deliver_id"=>(int)$item['id'],
            //					"deliver_name"=>$item['name']
            //				);
            //				$d2delivertb->add($tempPara);
            //			}

            //更新代理商
            //            $d2delegatetb = M('info_drug2delegate');
            //            $d2delegatetb->startTrans();
            //            $whereStr = " drug_id = " . $params['id'];
            //
            //            $d2delegatetb->where($whereStr)->delete();
            //            foreach($delegateList as $item){
            //                $tempPara = array("drug_id" => (int)$params['id'],"drug_name" => $params['common_name'],"delegate_id" => (int)$item['id'],"delegate_name" => $item['name']);
            //                $d2delegatetb->add($tempPara);
            //            }
            //            $d2delegatetb->commit();
            //            $d2stb->commit();
            $drug_table->commit();

            //更新公司获取利润
            $hospital_list = M("info_drug2hospital")->where("drug_id=" . $params['id'])->select();

            for($index = 0;$index < count($hospital_list);$index++){
                $hospitalItem = $hospital_list[$index];
                if($hospitalItem['hospital_id'] != NULL) {
                    //这里需要限定药品到具体的医院的分配的时候不能有医院id是空的情况
                    $this->updateCompanyProfit($params['id'],$hospitalItem['hospital_id']);
                }
            }

            return $this->ok($params['id']);
        } catch(Exception $e) {
            //            $d2delegatetb->rollback();
            //            $d2stb->rollback();
            $drug_table->rollback();

            return $this->bad("保存出错！");
        }

    }

    public function addHospitalAssign($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $inData    = json_decode(html_entity_decode($params['itemDatas']),TRUE);
        $drugData  = json_decode(html_entity_decode($params['drugData']),TRUE);
        $itemDatas = $inData['itemDatas'];
        if($itemDatas == NULL || count($itemDatas) < 1 || (int)$drugData['id'] != $drugData['id']) {
            return $this->emptyResult();
        }
        $us          = new UserService();
        $creator_id  = $us->getLoginUserId();
        $temp_table  = M('info_drug2hospital');
        $drug_id     = $drugData['id'];
        $drug_name   = $drugData['common_name'];
        $returnDatas = array();
        $assignTable = M('info_drug_profit_assign');
        $temp_table->startTrans();
        $assignTable->startTrans();
        try {
            foreach($itemDatas as $item){
                $innerParams = array(
                    "drug_id"     => $drug_id,
                    "hospital_id" => $item['id'],
                );
                if(count($temp_table->where($innerParams)->select()) > 0) {
                    unset($item);
                    continue;
                }
                $innerParams['create_time']   = time();
                $innerParams['creator_id']    = $creator_id;
                $innerParams['hospital_name'] = $item['hospital_name'];
                $innerParams['drug_name']     = $drug_name;
                $item2                        = $innerParams;
                $item2['id']                  = $temp_table->add($innerParams);
                array_push($returnDatas,$item2);
            }
        } catch(Exception $e) {
            $temp_table->rollback();
            $assignTable->rollback();
        }
        $temp_table->commit();
        $assignTable->commit();

        for($i = 0;$i < count($returnDatas);$i++){
            $returnDatas[$i]['company_profit'] = $this->updateCompanyProfit($returnDatas[$i]['drug_id'],$returnDatas[$i]['hospital_id']);
            if($returnDatas[$i]['company_profit'] == FALSE) {
                unset($returnDatas[$i]);
                $temp_table->where("id=" . $returnDatas[$i]['id'])->delete();
                $assignTable->where("drug2hos_id=" . $returnDatas[$i]['id'])->delete();
            }
        }

        return array("addedHospitalsList" => $returnDatas);
    }


    /*
    * 添加药品到供应公司的分配
    * */
    public function addDrug2SupplierItem($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $drug2supplier_db = M("info_drug2supplier");
        //添加条件筛选，避免选择同一个供应商
        $filter['drug_id'] = $params['drug_id'];
        $filter['supplier_id'] = $params['supplier_id'];
        if(count(($drug2supplier_db->where($filter)->select())) > 0) {
            return $this->bad("已经存在该供应公司,请更换供应公司！");
        }

        try {
            if($params['id']) {
                //编辑条目
                $drug2supplier_db->save($params);
                return $this->bad("修改成功！");
            } else {
                //新增条目
                $params['id'] = $drug2supplier_db->add($params);
                return $this->bad("添加成功！");
            }
        } catch(Exception $e) {
            $drug2supplier_db->rollback();

            return $this->bad("操作出错");
        }

//        return array("addDrug2SupplierItem" => $params);
    }

    /*
     * 添加药品到配送公司的分配
     * */
    public function addDrug2DeliverItem($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $drug2deliver_db = M("info_drug2deliver");
        //添加条件筛选，避免选择同一个配送公司
        $filter['drug_id'] = $params['drug_id'];
        $filter['deliver_id'] = $params['deliver_id'];
        if(count(($drug2deliver_db->where($filter)->select())) > 0) {
            return $this->bad("已经存在该配送公司，请更换配送公司！");
        }

        try {
            if($params['id']) {
                //编辑条目
                $drug2deliver_db->save($params);
                return $this->bad("修改成功！");
            } else {
                //新增条目
                $params['id'] = $drug2deliver_db->add($params);
                return $this->bad("新增成功！");
            }
        } catch(Exception $e) {
            $drug2deliver_db->rollback();

            return $this->bad("操作出错");
        }

//        return array("addedDrug2DeliverItem" => $params);
    }

    /*
     * 添加药品到代理的分配
     * */
    public function addDrug2DelegateItem($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $drug2delegate_db = M("info_drug2delegate");
        //添加条件筛选，避免选择同一个代理商
        $filter['drug_id'] = $params['drug_id'];
        $filter['delegate_id'] = $params['delegate_id'];
        if(count(($drug2delegate_db->where($filter)->select())) > 0) {
            return $this->bad("已经存在该代理商，请更换代理商！");
        }

        try {
            if($params['id']) {
                //编辑条目
                $drug2delegate_db->save($params);
                return $this->bad("修改成功！");
            } else {
                //新增条目
                $params['id'] = $drug2delegate_db->add($params);
                return $this->bad("新增成功！");
            }
        } catch(Exception $e) {
            $drug2delegate_db->rollback();

            return $this->bad("操作出错");
        }

//        return array("addedDrug2DelegateItem" => $params);
    }


    /*
     * 添加药品利润分配条目
     * */
    public function addProfitAssignDetailItem($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $inData = json_decode(html_entity_decode($params['inData']),TRUE);
        $item   = $inData['item'];
        if($item == NULL || count($item) < 1) {
            return $this->emptyResult();
        }

        $drug2hospitalData     = $inData['d2hData'];
        $item['drug2hos_id']   = $drug2hospitalData['id'];
        $item['drug_id']       = $drug2hospitalData['drug_id'];
        $item['hospital_id']   = $drug2hospitalData['hospital_id'];
        $item['drug_name']     = $drug2hospitalData['drug_name'];
        $item['hospital_name'] = $drug2hospitalData['hospital_name'];

        $us         = new UserService();
        $creator_id = $us->getLoginUserId();
        $temp_table = M('info_drug_profit_assign');
        $temp_table->startTrans();
        //		if(count($temp_table->where("drug_id=".$item['drug_id']." and hospital_id=".$item['hospital_id']." and employee_id=".$item['employee_id'])->select())>0){
        //			return $this->bad("已经存在该药品在该医院的分配");
        //		}
        //        一人可以有多种利润分配
        $item['create_time'] = time();
        $item['creator_id']  = $creator_id;
        $item2               = $item;
        try {
            $where['drug_id']     = $item['drug_id'];
            $where['hospital_id'] = $item['hospital_id'];
            $where['description'] = $item['description'];
            $where['employee_id'] = $item['employee_id'];
            $data                 = $temp_table->where($where)->select();
            if(count($data) > 1) {
                return $this->bad("相同的业务员不能有相同的身份,请更改身份信息！");
            }


            if($item2['id'] != "") {
                $item['id'] = $temp_table->save($item2);
            } else {
                $item['id'] = $temp_table->add($item2);
            }

            if($this->updateCompanyProfit($item['drug_id'],$item['hospital_id']) != FALSE) {
                $temp_table->commit();

                return array(
                    "addedProfitAssignDetailItem" => $item,
                    "success"                     => TRUE
                );
            } else {
                $temp_table->rollback();

                return $this->bad("操作出错");
            }
        } catch(Exception $e) {
            $temp_table->rollback();

            return $this->bad("操作出错");
        }


    }


    /*
     * 更新药品所有的利润分配情况
     * */
    public function updateAllHospitalProfit($params){
        $drug2Hositems = M("info_drug2hospital")->select();
        try {
            for($i = 0;$i < count($drug2Hositems);$i++){
                $item          = $drug2Hositems[$i];
                $drug2hos_db   = M("info_drug2hospital");
                $drugProfit_db = M("info_drug_profit_assign");
                $drug_infos    = M("info_drug")->where("id=" . $item['drug_id'])->select();
                $drug2hos_db->startTrans();
                $drugProfit_db->startTrans();

                $drug2hosItems   = $drug2hos_db->where("drug_id=" . $item['drug_id'] . " and hospital_id=" . $item['hospital_id'])->select();
                $drugProfitItems = $drugProfit_db->where("drug_id=" . $item['drug_id'] . " and hospital_id=" . $item['hospital_id'])->select();
                if(count($drug2hosItems) == 1 && count($drug_infos) == 1) {
                    $drug2hosItem = $drug2hosItems[0];
                    $druginfo     = $drug_infos[0];
                    $profit       = $druginfo['profit'];
                    foreach($drugProfitItems as $profitItem){
                        $profit = $profit - $profitItem['profit_assign'];
                    }
                    $company_profit                 = $profit;
                    $drug2hosItem['company_profit'] = $company_profit;

                    $drug2hos_db->save($drug2hosItem);
                }
            }
            $drug2hos_db->commit();

            return $this->ok("全部更新");
        } catch(Exception $e) {
            $drug2hos_db->rollback();

            return $this->bad("操作错误！");
        }
    }

    /*
     * 添加药品利润分配条目
     * */
    public function editCompanyProfitAssign($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $itemId                 = $params['id'];
        $data['company_profit'] = $params['company_profit'];
        $us                     = new UserService();
        $creator_id             = $us->getLoginUserId();
        $temp_table             = M('info_drug2hospital');
        $temp_table->startTrans();

        try {
            $temp_table->where('id=' . $itemId . ' ')->save($data);
            $temp_table->commit();

            return array("id" => $itemId);
        } catch(Exception $e) {
            $temp_table->rollback();

            return $this->bad("操作出错");
        }

    }

    public function updateCompanyProfit($drug_id,$hospital_id){
        $drug2hos_db   = M("info_drug2hospital");
        $drugProfit_db = M("info_drug_profit_assign");
        $drug_infos    = M("info_drug")->where("id=" . $drug_id)->select();
        $drug2hos_db->startTrans();
        $drugProfit_db->startTrans();

        $result = FALSE;

        $drug2hosItems   = $drug2hos_db->where("drug_id=" . $drug_id . " and hospital_id=" . $hospital_id)->select();
        $drugProfitItems = $drugProfit_db->where("drug_id=" . $drug_id . " and hospital_id=" . $hospital_id)->select();
        if(count($drug2hosItems) == 1 && count($drug_infos) == 1) {
            $drug2hosItem = $drug2hosItems[0];
            $druginfo     = $drug_infos[0];
            $profit       = $druginfo['profit'];
            foreach($drugProfitItems as $profitItem){
                $profit = $profit - $profitItem['profit_assign'];
            }
            $company_profit                 = $profit;
            $drug2hosItem['company_profit'] = $company_profit;

            try {
                $drug2hos_db->save($drug2hosItem);
                $result = $company_profit;
                $drug2hos_db->commit();
                $result = TRUE;
            } catch(Exception $e) {
                $drug2hos_db->rollback();
            }
        }

        return $result;
    }


    public function deleteDrugProfitAssignItem($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db   = M("info_drug_profit_assign");
        $data = $db->where($params)->select();
        if(!$data) {
            return $this->bad("要删除的业务员信息不存在");
        }
        $item = $data[0];
        try {
            $result = $db->where($params)->delete();
            if(($this->updateCompanyProfit($item['drug_id'],$item['hospital_id'])) == FALSE) {
                return $this->bad("操作出错");
            }
            $db->commit();
            if($result) {
                $log = "删除业务员信息： 业务员姓名：{$data['name']}";
                $bs  = new BizlogService();
                $bs->insertBizlog($log,$this->LOG_CATEGORY);
            }

            return $this->ok();
        } catch(Exception $e) {
            $db->rollback();

            return $this->bad("操作出错");
        }

        //不再更新条目


    }

    /**
     * 删除药品供应
     * @author qianwenwei
     * @param $params
     * @return array
     */
    public function deleteDrug2SupplierItem($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db = M("info_drug2supplier");
        $db->startTrans();
        $data = $db->where($params)->select();
        if(!$data) {
            return $this->bad("要删除的信息不存在");
        }
        $item = $data[0];
        try {
            $result = $db->where($params)->delete();
        } catch(Exception $e) {
            $db->rollback();

            return $this->bad("操作出错");
        }
        $db->commit();
        if($result) {
            $log = "删除药品到供应公司信息： ：{$data['drug_name']},{$data['supplier_name']}";
            $bs  = new BizlogService();
            $bs->insertBizlog($log,$this->LOG_CATEGORY);
        }

        return $this->ok();
    }

    /**
     * 删除药品配送
     * @author qianwenwei
     * @param $params
     * @return array
     */
    public function deleteDrug2DeliverItem($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db   = M("info_drug2deliver");
        $db->startTrans();
        $data = $db->where($params)->select();
        if(!$data) {
            return $this->bad("要删除的信息不存在");
        }
        $item = $data[0];
        try {
            $result = $db->where($params)->delete();
        } catch(Exception $e) {
            $db->rollback();

            return $this->bad("操作出错");
        }
        $db->commit();
        if($result) {
            $log = "删除药品到配送公司信息： ：{$data['drug_name']},{$data['deliver_name']}";
            $bs  = new BizlogService();
            $bs->insertBizlog($log,$this->LOG_CATEGORY);
        }

        return $this->ok();
    }

    /**
     * 删除药品代理
     * @author qianwenwei
     * @param $params
     * @return array
     */
    public function deleteDrug2DelegateItem($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db   = M("info_drug2delegate");
        $db->startTrans();
        $data = $db->where($params)->select();
        if(!$data) {
            return $this->bad("要删除的信息不存在");
        }
        $item = $data[0];
        try {
            $result = $db->where($params)->delete();
        } catch(Exception $e) {
            $db->rollback();

            return $this->bad("操作出错");
        }
        $db->commit();
        if($result) {
            $log = "删除药品到代理商信息： ：{$data['drug_name']},{$data['delegate_name']}";
            $bs  = new BizlogService();
            $bs->insertBizlog($log,$this->LOG_CATEGORY);
        }

        return $this->ok();
    }


    public function deleteDrugAssignHospitalItem($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db   = M("info_drug2hospital");
        $data = $db->where($params)->select();
        if(!$data) {
            return $this->bad("要删除的药品---医院分配信息不存在");
        }
        $relate_params             = array("drug2hos_id" => $params['id']);
        $info_drug_profit_assignDB = M("info_drug_profit_assign");
        $assignList                = $info_drug_profit_assignDB->where($relate_params)->select();
        if(count($assignList) > 0) {
            return $this->bad("不能删除药品---医院分配信息，有提成分配信息存在");
        }
        try {
            $db->startTrans();
            $info_drug_profit_assignDB->startTrans();
            $result = $db->where($params)->delete();
            $info_drug_profit_assignDB->where($relate_params)->delete();
        } catch(Exception $e) {
            $db->rollback();
            $info_drug_profit_assignDB->rollback();

            return $this->bad("网络错误！");
        }
        $db->commit();
        $info_drug_profit_assignDB->commit();
        if($result) {
            $log = "药品---医院分配信息：医院id：{$data['hospital_id']}";
            $bs  = new BizlogService();
            $bs->insertBizlog($log,$this->LOG_CATEGORY);
        }

        return $this->ok();
    }


    public function drugCategoryList($params){

        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $drug_table = M('info_drug');
        $page       = $params['page'];
        $start      = $params['start'];
        $limit      = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
        $whereStr = $this->likeSearch($params);
        $all_data = $drug_table->where($whereStr)->page($page,$limit)->select();

        return array(
            "totalCount"       => count($drug_table->where($whereStr)->select()),
            "drugCategoryList" => $all_data
        );
    }

    public function getDeleDrugList($params){

        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $drug_table = M('info_drug');
        if($params['drug_id']) {
            $all_data = $drug_table->where("id=" . $params['drug_id'] . " and is_self=0")->field("common_name drug_name,id drug_id,jx,guige,jldw,manufacturer")->select();
        } else {
            $all_data = $drug_table->where("is_self=0")->field("common_name drug_name,id drug_id,jx,guige,jldw,manufacturer")->select();
        }

        return array(
            "totalCount" => count($all_data),
            "drugList"   => $all_data
        );
    }

    public function drug2supplierList($params){

        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $drug_table = M('info_drug2supplier');
        if(!empty($params['drug_id'])) {
            $all_data = $drug_table->where("drug_id=" . $params['drug_id'])->select();
            $count    = $drug_table->where("drug_id=" . $params['drug_id'])->count();

            return array(
                "totalCount"        => $count,
                "drug2supplierList" => $all_data
            );
        }

    }

    public function drug2deliverList($params){

        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $drug_table = M('info_drug2deliver');
        if(!empty($params['drug_id'])) {
            $all_data = $drug_table->where("drug_id=" . $params['drug_id'])->select();
            $count    = $drug_table->where("drug_id=" . $params['drug_id'])->count();

            return array(
                "totalCount"       => $count,
                "drug2deliverList" => $all_data
            );
        }

    }

    public function drug2delegateList($params){

        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $drug_table = M('info_drug2delegate');
        if(!empty($params['drug_id'])) {
            $all_data = $drug_table->where("drug_id=" . $params['drug_id'])->select();
            $count    = $drug_table->where("drug_id=" . $params['drug_id'])->count();

            return array(
                "totalCount"        => $count,
                "drug2delegateList" => $all_data
            );
        }

    }

    public function drugAssignHospitalList($params){

        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $drug_table = M('info_drug2hospital');
        $page       = $params['page'];
        $start      = $params['start'];
        $limit      = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        $record = M('t_user')->where("id='" . session("loginUserId") . "'")->getField('all_hospital_view');
        if(session("loginUserId") != FIdConst::ADMIN_USER_ID && $record != 1) {
            $drugIDs = $this->conditionalFilter4Drug();
            $drugIDs = explode(',',$drugIDs);

            $user2hospital_db = M("t_yewuset_user2hospital");
            $hospitals        = $user2hospital_db->where("user_id='" . session("loginUserId") . "'")->field("hospital_id")->select();

            $hospitalIDs = [];
            for($i = 0;$i < count($hospitals);$i++){
                $hospitalIDs[] = $hospitals[$i]['hospital_id'];
            }
            $hospitalIDs = implode(",",$hospitalIDs);

            if($params['drug_id'] && in_array($params['drug_id'],$drugIDs)) {
                $whereStr = "drug_id = " . $params['drug_id'] . " and hospital_id in (" . $hospitalIDs . ")";
            } else {
                $whereStr = "drug_id= ''";
            }
        } else {
            $whereStr = "drug_id=" . $params['drug_id'];
        }

        $whereStr = $whereStr . " and hospital_name like '%" . $params['hospital_name'] . "%'";

        import("ORG.Util.Page");

        $all_data = $drug_table->where($whereStr)->page($page,$limit)->select();

        return array(
            "totalCount"             => count($drug_table->where($whereStr)->select()),
            "drugAssignHospitalList" => $all_data
        );
    }


    public function drugProfitAssignList($params){

        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $drug_table = M('info_drug_profit_assign');
        $all_data   = $drug_table->where($params)->select();

        return array(
            "totalCount"           => count($all_data),
            "drugProfitAssignList" => $all_data
        );
    }


    public function addDrugCategory($params){
        $drug_table = D("drug");
        if($drug_table->create()) {
            if($params) {
                $drug_table->save($params);

                return $params;
            }
        }
    }

    /**
     * 药品分类列表
     */
    public function categoryList($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $code    = $params["code"];
        $name    = $params["name"];
        $address = $params["address"];
        $contact = $params["contact"];
        $mobile  = $params["mobile"];
        $tel     = $params["tel"];
        $qq      = $params["qq"];

        $sql        = "select c.id, c.code, c.name, count(s.id) as cnt 
				from t_supplier_category c 
				left join t_supplier s 
				on (c.id = s.category_id)";
        $queryParam = array();
        if($code) {
            $sql          .= " and (s.code like '%s') ";
            $queryParam[] = "%{$code}%";
        }
        if($name) {
            $sql          .= " and (s.name like '%s' or s.py like '%s' ) ";
            $queryParam[] = "%{$name}%";
            $queryParam[] = "%{$name}%";
        }
        if($address) {
            $sql          .= " and (s.address like '%s' or s.address_shipping like '%s') ";
            $queryParam[] = "%{$address}%";
            $queryParam[] = "%{$address}%";
        }
        if($contact) {
            $sql          .= " and (s.contact01 like '%s' or s.contact02 like '%s' ) ";
            $queryParam[] = "%{$contact}%";
            $queryParam[] = "%{$contact}%";
        }
        if($mobile) {
            $sql          .= " and (s.mobile01 like '%s' or s.mobile02 like '%s' ) ";
            $queryParam[] = "%{$mobile}%";
            $queryParam[] = "%{$mobile}";
        }
        if($tel) {
            $sql          .= " and (s.tel01 like '%s' or s.tel02 like '%s' ) ";
            $queryParam[] = "%{$tel}%";
            $queryParam[] = "%{$tel}";
        }
        if($qq) {
            $sql          .= " and (s.qq01 like '%s' or s.qq02 like '%s' ) ";
            $queryParam[] = "%{$qq}%";
            $queryParam[] = "%{$qq}";
        }

        $ds = new DataOrgService();
        $rs = $ds->buildSQL(FIdConst::SUPPLIER_CATEGORY,"c");
        if($rs) {
            $sql        .= " where " . $rs[0];
            $queryParam = array_merge($queryParam,$rs[1]);
        }

        $sql .= " group by c.id
				order by c.code";

        return M()->query($sql,$queryParam);
    }

    /**
     * 某个分类下的药品档案列表
     */
    public function supplierList($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $categoryId = $params["categoryId"];
        $page       = $params["page"];
        $start      = $params["start"];
        $limit      = $params["limit"];

        $code    = $params["code"];
        $name    = $params["name"];
        $address = $params["address"];
        $contact = $params["contact"];
        $mobile  = $params["mobile"];
        $tel     = $params["tel"];
        $qq      = $params["qq"];

        $sql          = "select id, category_id, code, name, contact01, qq01, tel01, mobile01, 
				contact02, qq02, tel02, mobile02, init_payables, init_payables_dt, 
				address, address_shipping,
				bank_name, bank_account, tax_number, fax, note, data_org
				from t_supplier 
				where (category_id = '%s')";
        $queryParam   = array();
        $queryParam[] = $categoryId;
        if($code) {
            $sql          .= " and (code like '%s' ) ";
            $queryParam[] = "%{$code}%";
        }
        if($name) {
            $sql          .= " and (name like '%s' or py like '%s' ) ";
            $queryParam[] = "%{$name}%";
            $queryParam[] = "%{$name}%";
        }
        if($address) {
            $sql          .= " and (address like '%s' or address_shipping like '%s') ";
            $queryParam[] = "%$address%";
            $queryParam[] = "%$address%";
        }
        if($contact) {
            $sql          .= " and (contact01 like '%s' or contact02 like '%s' ) ";
            $queryParam[] = "%{$contact}%";
            $queryParam[] = "%{$contact}%";
        }
        if($mobile) {
            $sql          .= " and (mobile01 like '%s' or mobile02 like '%s' ) ";
            $queryParam[] = "%{$mobile}%";
            $queryParam[] = "%{$mobile}";
        }
        if($tel) {
            $sql          .= " and (tel01 like '%s' or tel02 like '%s' ) ";
            $queryParam[] = "%{$tel}%";
            $queryParam[] = "%{$tel}";
        }
        if($qq) {
            $sql          .= " and (qq01 like '%s' or qq02 like '%s' ) ";
            $queryParam[] = "%{$qq}%";
            $queryParam[] = "%{$qq}";
        }

        $ds = new DataOrgService();
        $rs = $ds->buildSQL(FIdConst::SUPPLIER,"t_supplier");
        if($rs) {
            $sql        .= " and " . $rs[0];
            $queryParam = array_merge($queryParam,$rs[1]);
        }

        $queryParam[] = $start;
        $queryParam[] = $limit;
        $sql          .= " order by code 
				limit %d, %d";
        $result       = array();
        $db           = M();
        $data         = $db->query($sql,$queryParam);
        foreach($data as $i => $v){
            $result[$i]["id"]              = $v["id"];
            $result[$i]["categoryId"]      = $v["category_id"];
            $result[$i]["code"]            = $v["code"];
            $result[$i]["name"]            = $v["name"];
            $result[$i]["address"]         = $v["address"];
            $result[$i]["addressShipping"] = $v["address_shipping"];
            $result[$i]["contact01"]       = $v["contact01"];
            $result[$i]["qq01"]            = $v["qq01"];
            $result[$i]["tel01"]           = $v["tel01"];
            $result[$i]["mobile01"]        = $v["mobile01"];
            $result[$i]["contact02"]       = $v["contact02"];
            $result[$i]["qq02"]            = $v["qq02"];
            $result[$i]["tel02"]           = $v["tel02"];
            $result[$i]["mobile02"]        = $v["mobile02"];
            $result[$i]["initPayables"]    = $v["init_payables"];
            if($v["init_payables_dt"]) {
                $result[$i]["initPayablesDT"] = date("Y-m-d",strtotime($v["init_payables_dt"]));
            }
            $result[$i]["bankName"]    = $v["bank_name"];
            $result[$i]["bankAccount"] = $v["bank_account"];
            $result[$i]["tax"]         = $v["tax_number"];
            $result[$i]["fax"]         = $v["fax"];
            $result[$i]["note"]        = $v["note"];
            $result[$i]["dataOrg"]     = $v["data_org"];
        }

        $sql          = "select count(*) as cnt from t_supplier where (category_id  = '%s') ";
        $queryParam   = array();
        $queryParam[] = $categoryId;
        if($code) {
            $sql          .= " and (code like '%s' ) ";
            $queryParam[] = "%{$code}%";
        }
        if($name) {
            $sql          .= " and (name like '%s' or py like '%s' ) ";
            $queryParam[] = "%{$name}%";
            $queryParam[] = "%{$name}%";
        }
        if($address) {
            $sql          .= " and (address like '%s') ";
            $queryParam[] = "%$address%";
        }
        if($contact) {
            $sql          .= " and (contact01 like '%s' or contact02 like '%s' ) ";
            $queryParam[] = "%{$contact}%";
            $queryParam[] = "%{$contact}%";
        }
        if($mobile) {
            $sql          .= " and (mobile01 like '%s' or mobile02 like '%s' ) ";
            $queryParam[] = "%{$mobile}%";
            $queryParam[] = "%{$mobile}";
        }
        if($tel) {
            $sql          .= " and (tel01 like '%s' or tel02 like '%s' ) ";
            $queryParam[] = "%{$tel}%";
            $queryParam[] = "%{$tel}";
        }
        if($qq) {
            $sql          .= " and (qq01 like '%s' or qq02 like '%s' ) ";
            $queryParam[] = "%{$qq}%";
            $queryParam[] = "%{$qq}";
        }
        $ds = new DataOrgService();
        $rs = $ds->buildSQL(FIdConst::SUPPLIER,"t_supplier");
        if($rs) {
            $sql        .= " and " . $rs[0];
            $queryParam = array_merge($queryParam,$rs[1]);
        }
        $data = $db->query($sql,$queryParam);

        return array(
            "supplierList" => $result,
            "totalCount"   => $data[0]["cnt"]
        );
    }

    /**
     * 新建或编辑药品分类
     */
    public function editCategory($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id   = $params["id"];
        $code = $params["code"];
        $name = $params["name"];

        $db = M();
        $db->startTrans();

        $log = NULL;

        if($id) {
            // 编辑
            // 检查分类编码是否已经存在
            $sql  = "select count(*) as cnt from t_supplier_category where code = '%s' and id <> '%s' ";
            $data = $db->query($sql,$code,$id);
            $cnt  = $data[0]["cnt"];
            if($cnt > 0) {
                $db->rollback();

                return $this->bad("编码为 [$code] 的分类已经存在");
            }

            $sql = "update t_supplier_category 
					set code = '%s', name = '%s' 
					where id = '%s' ";
            $rc  = $db->execute($sql,$code,$name,$id);
            if($rc === FALSE) {
                $db->rollback();

                return $this->sqlError(__LINE__);
            }

            $log = "编辑药品分类: 编码 = $code, 分类名 = $name";
        } else {
            // 新增
            // 检查分类编码是否已经存在
            $sql  = "select count(*) as cnt from t_supplier_category where code = '%s' ";
            $data = $db->query($sql,$code);
            $cnt  = $data[0]["cnt"];
            if($cnt > 0) {
                $db->rollback();

                return $this->bad("编码为 [$code] 的分类已经存在");
            }

            $idGen = new IdGenService();
            $id    = $idGen->newId();

            $us        = new UserService();
            $dataOrg   = $us->getLoginUserDataOrg();
            $companyId = $us->getCompanyId();

            $sql = "insert into t_supplier_category (id, code, name, data_org, company_id) 
					values ('%s', '%s', '%s', '%s', '%s') ";
            $rc  = $db->execute($sql,$id,$code,$name,$dataOrg,$companyId);
            if($rc === FALSE) {
                $db->rollback();

                return $this->sqlError(__LINE__);
            }

            $log = "新增药品分类：编码 = $code, 分类名 = $name";
        }

        // 记录业务日志
        if($log) {
            $bs = new BizlogService();
            $bs->insertBizlog($log,$this->LOG_CATEGORY);
        }

        $db->commit();

        return $this->ok($id);
    }

    /**
     * 删除药品分类
     */
    public function deleteDrugCategory($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        return $this->bad("为防止误操作，暂时不支持删除");

        $id = $params["id"];

        $db = M("info_drug");
        $db->startTrans();
        $data = $db->where("id=" . $id)->select();
        if(!$data) {
            $db->rollback();

            return $this->bad("要删除的分类不存在");
        }

        $category = $data[0];

        $query = $db->query("select count(*) as cnt from t_supplier where category_id = '%s' ",$id);
        $cnt   = $query[0]["cnt"];
        if($cnt > 0) {
            $db->rollback();

            return $this->bad("当前分类 [{$category['name']}] 下还有药品档案，不能删除");
        }

        $rc = $db->execute("delete from t_supplier_category where id = '%s' ",$id);
        if($rc === FALSE) {
            $db->rollback();

            return $this->sqlError(__LINE__);
        }

        $log = "删除药品分类： 编码 = {$category['code']}, 分类名称 = {$category['name']}";
        $bs  = new BizlogService();
        $bs->insertBizlog($log,$this->LOG_CATEGORY);

        $db->commit();

        return $this->ok();
    }


    /**
     * 删除药品
     */
    public function deleteDrug($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];

        $db = M();
        $db->startTrans();

        $sql  = "select code, name from t_supplier where id = '%s' ";
        $data = $db->query($sql,$id);
        if(!$data) {
            $db->rollback();

            return $this->bad("要删除的药品档案不存在");
        }
        $code = $data[0]["code"];
        $name = $data[0]["name"];

        // 判断是否能删除药品
        $sql  = "select count(*) as cnt from t_pw_bill where supplier_id = '%s' ";
        $data = $db->query($sql,$id);
        $cnt  = $data[0]["cnt"];
        if($cnt > 0) {
            $db->rollback();

            return $this->bad("药品档案 [{$code} {$name}] 在采购入库单中已经被使用，不能删除");
        }
        $sql  = "select count(*) as cnt 
				from t_payables_detail p, t_payment m 
				where p.ref_type = m.ref_type and p.ref_number = m.ref_number 
				and p.ca_id = '%s' and p.ca_type = 'supplier' ";
        $data = $db->query($sql,$id);
        $cnt  = $data[0]["cnt"];
        if($cnt > 0) {
            $db->rollback();

            return $this->bad("药品档案 [{$code} {$name}] 已经产生付款记录，不能删除");
        }

        // 判断采购退货出库单中是否使用该药品
        $sql  = "select count(*) as cnt from t_pr_bill where supplier_id = '%s' ";
        $data = $db->query($sql,$id);
        $cnt  = $data[0]["cnt"];
        if($cnt > 0) {
            $db->rollback();

            return $this->bad("药品档案 [{$code} {$name}] 在采购退货出库单中已经被使用，不能删除");
        }

        // 判断在采购订单中是否已经使用该药品
        $sql  = "select count(*) as cnt from t_po_bill where supplier_id = '%s' ";
        $data = $db->query($sql,$id);
        $cnt  = $data[0]["cnt"];
        if($cnt > 0) {
            $db->rollback();

            return $this->bad("药品档案 [{$code} {$name}] 在采购订单中已经被使用，不能删除");
        }

        $sql = "delete from t_supplier where id = '%s' ";
        $rc  = $db->execute($sql,$id);
        if($rc === FALSE) {
            $db->rollback();

            return $this->sqlError(__LINE__);
        }

        // 删除应付总账、明细账
        $sql = "delete from t_payables where ca_id = '%s' and ca_type = 'supplier' ";
        $rc  = $db->execute($sql,$id);
        if($rc === FALSE) {
            $db->rollback();

            return $this->sqlError(__LINE__);
        }

        $sql = "delete from t_payables_detail where ca_id = '%s' and ca_type = 'supplier' ";
        $rc  = $db->execute($sql,$id);
        if($rc === FALSE) {
            $db->rollback();

            return $this->sqlError(__LINE__);
        }

        $log = "删除药品档案：编码 = {$code},  名称 = {$name}";
        $bs  = new BizlogService();
        $bs->insertBizlog($log,$this->LOG_CATEGORY);

        $db->commit();

        return $this->ok();
    }

    /**
     * 药品字段， 查询数据
     */
    public function queryData($queryKey){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }

        if($queryKey == NULL) {
            $queryKey = "";
        }

        if($queryKey['isSelf'] === 'both') {
            $isSelf = '';
        } else {
            $isSelf = ' AND is_self=' . $queryKey['isSelf'];
        }

        $sql = "select * from info_drug
				where (common_name like '%" . $queryKey["queryKey"] . "%' or drug_code like '%" . $queryKey["queryKey"] . "%' 
				or goods_name like '%" . $queryKey["queryKey"] . "%')" . $isSelf;
        //如果是合作伙伴登陆的话，那么合作伙伴可以看到的药品就只能限定于自己销售的那些
        if(session('loginType') == FIdConst::LOGIN_TYPE_EMPLOYEE) {
            $drugRange = M("info_drug_profit_assign")->where("employee_id=" . session('loginUserId'))->field("drug_id")->select();
            $drugSql   = " (";
            for($i = 0;$i < count($drugRange);$i++){
                if($i == count($drugRange) - 1) {
                    $drugSql .= $drugRange[$i]['drug_id'] . ") ";
                } else {
                    $drugSql .= $drugRange[$i]['drug_id'] . ",";
                }
            }
            $sql .= " and id in " . $drugSql;
        }
        $sql .= " order by id limit 30";

        return M()->query($sql);
    }

    public function queryData2($queryKey){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }

        if($queryKey == NULL) {
            $queryKey = "";
        }

        $sql           = "select id, code, name, tel01, fax, address_shipping, contact01 
				from t_supplier
				where (code like '%s' or name like '%s' or py like '%s') ";
        $queryParams   = array();
        $key           = "%{$queryKey}%";
        $queryParams[] = $key;
        $queryParams[] = $key;
        $queryParams[] = $key;

        $ds = new DataOrgService();
        $rs = $ds->buildSQL("1004-01","t_supplier");
        if($rs) {
            $sql         .= " and " . $rs[0];
            $queryParams = array_merge($queryParams,$rs[1]);
        }

        $sql .= " order by code 
				limit 20";

        return M()->query($sql,$queryParams);
    }

    /**
     * 获得某个药品档案的详情
     */
    public function supplierInfo($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $id = $params["id"];

        $result = array();

        $db   = M();
        $sql  = "select category_id, code, name, contact01, qq01, mobile01, tel01,
					contact02, qq02, mobile02, tel02, address, address_shipping,
					init_payables, init_payables_dt,
					bank_name, bank_account, tax_number, fax, note
				from t_supplier
				where id = '%s' ";
        $data = $db->query($sql,$id);
        if($data) {
            $result["categoryId"]      = $data[0]["category_id"];
            $result["code"]            = $data[0]["code"];
            $result["name"]            = $data[0]["name"];
            $result["contact01"]       = $data[0]["contact01"];
            $result["qq01"]            = $data[0]["qq01"];
            $result["mobile01"]        = $data[0]["mobile01"];
            $result["tel01"]           = $data[0]["tel01"];
            $result["contact02"]       = $data[0]["contact02"];
            $result["qq02"]            = $data[0]["qq02"];
            $result["mobile02"]        = $data[0]["mobile02"];
            $result["tel02"]           = $data[0]["tel02"];
            $result["address"]         = $data[0]["address"];
            $result["addressShipping"] = $data[0]["address_shipping"];
            $result["initPayables"]    = $data[0]["init_payables"];
            $d                         = $data[0]["init_payables_dt"];
            if($d) {
                $result["initPayablesDT"] = $this->toYMD($d);
            }
            $result["bankName"]    = $data[0]["bank_name"];
            $result["bankAccount"] = $data[0]["bank_account"];
            $result["tax"]         = $data[0]["tax_number"];
            $result["fax"]         = $data[0]["fax"];
            $result["note"]        = $data[0]["note"];
        }

        return $result;
    }

    /**
     * 判断药品是否存在
     */
    public function supplierExists($supplierId,$db){
        if(!$db) {
            $db = M();
        }

        $sql  = "select count(*) as cnt from t_supplier where id = '%s' ";
        $data = $db->query($sql,$supplierId);

        return $data[0]["cnt"] == 1;
    }

    /**
     * 根据药品Id查询药品名称
     */
    public function getDrugNameById($supplierId,$db){
        if(!$db) {
            $db = M();
        }

        $sql  = "select name from t_supplier where id = '%s' ";
        $data = $db->query($sql,$supplierId);
        if($data) {
            return $data[0]["name"];
        } else {
            return "";
        }
    }
}
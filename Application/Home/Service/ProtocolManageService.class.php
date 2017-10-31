<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;

/**
 * 协议管理Service
 *
 * @author RCG
 */
class ProtocolManageService extends PSIBaseService
{
    private $LOG_CATEGORY = "业务流程信息-采购单信息";

    /**
     * @param $params
     * @return array
     */
    public function editProtocolDetailManage($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        //        $params['start_date'] = strtotime($params['start_date']);
        //        $params['end_date'] = strtotime($params['end_date']);
        //        $params['execute_date'] = strtotime($params['execute_date']);
        $protocolManage_db = D('info_protocol_manage');
        $queryString       = "protocol_number='" . $params['protocol_number'] . "'";

        if($params['id']) {
            //编辑
            if(count($protocolManage_db->where($queryString . " and id<>" . $params['id'])->select()) > 0) {
                return $this->bad("该编号的协议管理已经存在，请更换其他名称");
            }
            $protocolManage_db->save($params);

        } else {
            //新建
            if(count($protocolManage_db->where($queryString)->select()) > 0) {
                return $this->bad("该编号的协议管理已经存在，请更换其他名称");
            }
            $protocolManage_db->add($params);

        }

        return $this->ok($params['id']);
    }


    /**
     * @param $params
     * @return array
     */
    public function editProtocolParentManage($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }


        $protocolManage_db = D('info_protocol_manage');
        $protocolDetail_db = D('info_protocol_detail');


        if($params['itemDatas'] == "") {
            return $this->bad("请求错误！");
        }
        $inDatas = json_decode(html_entity_decode($params['itemDatas']),TRUE);

        $id = $inDatas['id'];
        $parentDrug_id  = $inDatas['parentDrug_id'];
        $parentAgent_id = $inDatas['parentAgent_id'];
        $start_date     = $inDatas['start_date'];
        $end_date       = $inDatas['end_date'];
        $execute_date   = $inDatas['execute_date'];
        $protocol_number = $inDatas['protocol_number'];
        $protocol_detail_list = $inDatas['itemDatas'];


        //前端传入的数据校验：
        //1. 起始，执行日期符合日期格式
        //2. 不缺少药品和代理商的信息


        if($id) {
            //编辑条目
            $protocolDetail_db->startTrans();
            $protocolManage_db->startTrans();
            try {
                $parent_data = array(
                    "status" => 0,
                    "protocol_number" => $protocol_number,
                    "start_date" => $start_date,
                    "end_date" => $end_date,
                    "execute_date" => $execute_date,
                    "drug_id" => $parentDrug_id,
                    "agent_id" => $parentAgent_id);
                //修改数据
                $parent_protocol_id = $protocolManage_db->where("id=".$id)->save($parent_data);
                $protocolDetail_db->commit();
                //得到父协议单id之后，逐个的添加子单号，并设置子单号中的父单号的数值
                foreach($protocol_detail_list as $k => $v){
                    $son_data = array(
                        "parent_protocol_id" =>$id,
                        "region" => $v["region"],
                        "hospital_name" => $v["hospital_name"],
                        "drug_name" => $v["drug_name"],
                        "drug_id" => $v["drug_id"],
                        "cover_business" => $v["cover_business"],
                        "drug_guige" => $v["drug_guige"],
                        "cash_deposit" => $v["cash_deposit"],
                        "if_pay" => $v["if_pay"],
                        "protocol_amount" => $v["protocol_amount"],
                        "bidding_price" => $v["bidding_price"],
                        "commission" => $v["commission"],
                        "flow_type" => $v["flow_type"],
                        "zs_employee" => $v["zs_employee"],
                        "zs_commission" => $v["zs_commission"],
                        "develop_time" => $v["develop_time"],
                        "note" => $v["note"]);
                    //子列表数据循环入库
                    if(!$v['parent_protocol_id']){
                        //之前不存在的子协议明细进行添加操作
                        $protocolDetail_db->add($son_data);
                    }else{
                        //之前已经存在子协议明细进行更新操作
                        $protocolDetail_db->where('id='.$v['id'])->save($son_data);

                    }
                }
                $protocolManage_db->commit();

                //成功入库，返回成功信息
                return $this->ok($parent_protocol_id);


            } catch(Exception $e) {
                $protocolDetail_db->rollback();
                $protocolManage_db->rollback();

                return $this->bad("操作错误！");
            }

        } else {
            //新建条目
            $protocolDetail_db->startTrans();
            $protocolManage_db->startTrans();
            try {
                $parent_data = array(
                    "status" => 0,
                    "protocol_number" => "ZSXY" . date("YmdHis"),
                    "start_date" => $start_date,
                    "end_date" => $end_date,
                    "execute_date" => $execute_date,
                    "drug_id" => $parentDrug_id,
                    "agent_id" => $parentAgent_id);
                //首先添加父 协议单
                $parent_protocol_id = $protocolManage_db->add($parent_data);
                $protocolDetail_db->commit();
                //得到父协议单id之后，逐个的添加子单号，并设置子单号中的父单号的数值
                foreach($protocol_detail_list as $k => $v){
                    $son_data = array(
                        "parent_protocol_id" => $parent_protocol_id,
                        "region" => $v["region"],
                        "hospital_name" => $v["hospital_name"],
                        "drug_name" => $v["drug_name"],
                        "drug_id" => $v["drug_id"],
                        "cover_business" => $v["cover_business"],
                        "drug_guige" => $v["drug_guige"],
                        "cash_deposit" => $v["cash_deposit"],
                        "if_pay" => $v["if_pay"],
                        "protocol_amount" => $v["protocol_amount"],
                        "bidding_price" => $v["bidding_price"],
                        "commission" => $v["commission"],
                        "flow_type" => $v["flow_type"],
                        "zs_employee" => $v["zs_employee"],
                        "zs_commission" => $v["zs_commission"],
                        "develop_time" => $v["develop_time"],
                        "note" => $v["note"]);
                    //子列表数据循环入库
                    $protocolDetail_db->add($son_data);
                }
                $protocolManage_db->commit();

                //成功入库，返回成功信息
                return $this->ok($parent_protocol_id);


            } catch(Exception $e) {
                $protocolDetail_db->rollback();
                $protocolManage_db->rollback();

                return $this->bad("操作错误！");
            }

        }

    }


    /**
     * 删除协议明细列表
     */
    public function deleteProtocolDetailItem($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db   = M("info_protocol_detail");
        $data = $db->where($params)->select();
        if(!$data) {
            return $this->bad("要删除的协议明细信息不存在");
        }
        $item = $data[0];
        try {
            $result = $db->where($params)->delete();
            $db->commit();
            if($result) {
                $log = "删除协议明细信息：药品名称：{$data['drug_name']}";
                $bs  = new BizlogService();
                $bs->insertBizlog($log,$this->LOG_CATEGORY);
            }

            return $this->ok();
        } catch(Exception $e) {
            $db->rollback();

            return $this->bad("操作出错");
        }

    }

    /**
     * 获取协议管理列表
     */
    public function listProtocolManage($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $protocolManage_db = M('info_protocol_manage');
        $page       = $params['page'];
        $start      = $params['start'];
        $limit      = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
        $whereStr = $this->likeSearch($params);

        $all_data = $protocolManage_db
            ->alias('pm')
            ->join('info_drug AS idr ON idr.id=pm.drug_id')
            ->join('info_agent AS iag ON iag.id=pm.agent_id')
            ->where($whereStr)
            ->field("pm.*,idr.common_name as drug_name,idr.guige as drug_guige,idr.jx as drug_jx, idr.jldw as drug_jldw,iag.agent_name")
            ->page($page,$limit)
            ->select();

        $count = $protocolManage_db
            ->alias('pm')
            ->join('info_drug AS idr ON idr.id=pm.drug_id')
            ->join('info_agent AS iag ON iag.id=pm.agent_id')
            ->where($whereStr)
            ->count();

        return array("protocolManageList" => $all_data,"totalCount" => $count);
    }


    /**
     * 获取协议明细列表
     */

    public function getEditInvestProtocolDetail($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $protocolDetailManage_db = M('info_protocol_detail');

        $all_data = $protocolDetailManage_db->where("parent_protocol_id=" . $params['parent_id'])->select();

        return array("protocolDetailList" => $all_data,"totalCount" => count($all_data));
    }


    /**
     * 删除协议管理列表
     */
    public function deleteProtocolManage($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        //删除协议管理之前检查该协议是否存在协议明；如果存在，提示客户先删除协议明细条目，再删除协议管理
        $protocol_detail_db = M("info_protocol_detail");
        $detail_data        = $protocol_detail_db->where('parent_protocol_id=' . $params['id'])->find();

        if($detail_data) {
            return $this->bad("该协议存在协议明细，请先删除所有的协议明细！");
        }

        //获取要删除的信息
        $protocol_manage_db = M("info_protocol_manage");
        $data               = $protocol_manage_db->where('id=' . $params['id'])->find();
        if(!$data) {
            return $this->bad("要删除的协议信息不存在");
        }

        //通过审核的不能删除
        if($data['status'] == FIdConst::SELF_PURCHASE_STATUS_VERIFY_PASSED) {
            return $this->bad("该协议已通过审核，无法删除");
        }

        $result = $protocol_manage_db->where('id=' . $params['id'])->delete();
        if($result) {
            $log = "删除协议管理信息： 协议编号：{$data['protocol_number']}";
            $bs  = new BizlogService();
            $bs->insertBizlog($log,$this->LOG_CATEGORY);
        }

        return $this->ok();
    }

    /**
     * 修改协议管理状态，审核与反审核
     */
    public function protocolManageStatus($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id   = $params["id"];
        $type = $params["type"];
        $db   = M('info_protocol_manage');
        //        $params['operate_info'] = $db->where("id=".$id)->getField("operate_info");
        //能修改的条件
        $io = $db->where('id=' . $id)->find();
        //当前状态
        $statusNow = $io['status'];
        if($type == 'no' && $statusNow == FIdConst::PROTOCOL_MANAGE_STATUS_2VERIFY) {
            //审核未通过
            $data['status'] = FIdConst::SELF_PURCHASE_STATUS_VERIFY_DENIED;
            //            $data['verifier_id'] = session('loginUserId');
            //            $data['operate_info'] = $params['operate_info'].$this->getOperateInfo("协议管理审核未通过");
            $db->where('id=' . $id)->save($data);

            return $this->ok($id);
        } else {
            if($type == 'yes' && ($statusNow == FIdConst::PROTOCOL_MANAGE_STATUS_2VERIFY || FIdConst::PROTOCOL_MANAGE_STATUS_VERIFY_DENIED)) {

                //通过审核，生成付款单
                $data['status'] = FIdConst::PROTOCOL_MANAGE_STATUS_VERIFY_PASSED;
                //                $data['verifier_id'] = session('loginUserId');
                //                $data['operate_info'] = $params['operate_info'].$this->getOperateInfo("协议管理审核通过,生成子单");
                $db->where('id=' . $id)->save($data);

                //                $re = $this->createSelfPay($id);
                return $this->ok($id);

            } elseif($type == 'return' && $statusNow == FIdConst::PROTOCOL_MANAGE_STATUS_VERIFY_PASSED) {

                $data['verifier_id'] = session('loginUserId');
                //已审核且生成了入库单的反审核，先判断是否可以反审核，可以的话状态修改为审核未通过
                if($this->beforeVerifyReturn($id)) {
                    //可以反审核
                    $data['status']       = FIdConst::SELF_PURCHASE_STATUS_VERIFY_DENIED;
                    $data['operate_info'] = $params['operate_info'] . $this->getOperateInfo("协议管理审核未通过");
                    $db->where('id=' . $id)->save($data);

                    return $this->ok($id);
                } else
                    return $this->bad('该采购单已被引用，无法进行反审核操作');
            }
        }
    }

    /**
     * 查询已经通过审核的管理列表
     */
    public function getAgentList4AddInvestPayItem($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        $agent_id = $params['agent_id'];
        $whereStr='';
        if($agent_id){
            $whereStr=" AND agent_id=".$agent_id;
        }
        //当前月
        $now_month  =$params['now_date'];
        //当前月的范围
        $now_month_b=$now_month.'-01';
        $now_month_e=date('Y-m',strtotime($now_month." +1 month")).'-01';
        $protocolManage_db = M('info_protocol_manage');

        $all_data = $protocolManage_db
            ->alias('pm')
            ->join('info_agent as iag on iag.id=pm.agent_id')
            ->where("status=1". $whereStr)
            ->field('pm.agent_id,iag.*')
            ->group('pm.agent_id')
            ->select();

        //数据嵌入
        foreach($all_data as $k=>$v){
            $all_data[$k]['now_date'] = $now_month;
        }
        return array(
            "agentList" => $all_data
        );

    }

}
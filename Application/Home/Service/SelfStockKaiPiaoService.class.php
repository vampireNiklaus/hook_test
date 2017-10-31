<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;

/**
 * 自销入库单Service
 *
 * @author RCG
 */
class SelfStockKaiPiaoService extends PSIBaseService {
    private $LOG_CATEGORY = "业务流程信息-入库单信息";

    public function editSelfStockKaiPiao($params){
        //编辑入库单
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $idService = new IdGenService();
        $selfStock_db = D('bill_self_stock_kaipiao');
        $selfStockSub_db = D('bill_self_stock_kaipiao_sub');
        $parent_id=$params['parent_id'];

        $stock= $parent_id ==''?$selfStock_db->where('id='.$params['id'])->find():$selfStockSub_db->where('id='.$params['id'])->find();

        $fatherStockId=$parent_id ==''?$params['id']:$selfStockSub_db->where('id='.$params['id'])->getField('parent_id');
        $fatherStock= $selfStock_db->where('id='.$fatherStockId)->find();

        //剩余入库量
        $needStock=$fatherStock['stock_amount']-$fatherStock['had_amount'];
        if($needStock<$params['stock_amount']){
            return $this->bad('入库量大于剩余入库量');
        }else{
            $supplier_name = M("info_supplier")->where("id=".$params['supplier_id'])->getField("name");
            //新建子入库单
            $data['drug_id']=$stock['drug_id'];
            $data['parent_id']=$fatherStock['id'];
            $data['buy_bill_code']=$stock['buy_bill_code'];
            $data['pay_bill_code']=$stock['pay_bill_code'];
            $data['buy_date']=$stock['buy_date'];
            $data['supplier_id']=$params['supplier_id'];
            $data['supplier_name']=$params['supplier_name'];
            $data['stock_amount']=$params['stock_amount'];
            $data['remain_amount']=$params['stock_amount'];
            $data['kaipiao_unit_price']=$params['kaipiao_unit_price'];
            $data['batch_num']=$params['batch_num'];
            $data['instock_date']=$params['instock_date'];
            $data['outstock_date']=$params['outstock_date'];
            $data['validity']=$params['validity'];
            $data['note']=$params['note'];
            if($parent_id==''){
                $data['operate_info'] = $this->getOperateInfo("添加自销子入库单");
                $data['create_time']=time();
                $data['bill_code']=FIdConst::BILL_CODE_TYPE_SELF_STOCK_KAIPIAO.$idService->newId();
                $selfStockSub_db->add($data);
//                //同时改变父采购单已入库数量
//                $fatherStock['had_amount'] = $fatherStock['had_amount'] + $params['stock_amount'];
//                $selfStock_db->where('id='.$params['id'])->setField('had_amount',$fatherStock['had_amount']);
            }else{
                $data['operate_info'] = $selfStockSub_db->where("id=".$params['id'])->getField("operate_info").$this->getOperateInfo("编辑自销子入库单");
                $selfStockSub_db->where('id='.$params['id'])->save($data);
            }
            return $this->ok($params['id']);
        }

    }

    /*
     * 获取自销采购单列表
     */

    public function listSelfStockKaiPiaoUnEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfStock_db = M('bill_self_stock_kaipiao');
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
//        $whereStr = $this->likeSearch($params);
        $count = $selfStock_db
            ->alias('ss')
            ->join('info_drug AS idr ON idr.id=ss.drug_id')
            ->join('info_supplier AS isu ON isu.id=ss.supplier_id')
            ->join('bill_self_pay AS spa ON spa.bill_code=ss.pay_bill_code')
            ->where("idr.common_name like '%".$params['common_name']."%' AND ss.bill_code like '%".$params['bill_code']."%'")
            ->count();
        $all_data = $selfStock_db
            ->alias('ss')
            ->join('info_drug AS idr ON idr.id=ss.drug_id')
            ->join('info_supplier AS isu ON isu.id=ss.supplier_id')
            ->join('bill_self_pay AS spa ON spa.bill_code=ss.pay_bill_code')
            ->where("idr.common_name like '%".$params['common_name']."%' AND ss.bill_code like '%".$params['bill_code']."%'")
            ->field('ss.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer,isu.name supplier_name
                ,spa.bill_code pay_bill_code,spa.buy_date')
            ->page($page,$limit)
            ->select();

        //数据处理
        foreach ($all_data as $k=>$v){
            $needAmount=$v['stock_amount']-$v['had_amount'];
            $all_data[$k]['need_amount']=$needAmount;
            $all_data[$k]['status_str']= $needAmount==0?"<span>已全部入库</span>":"<span style='color: red'>待入库</span>";
            $all_data[$k]['status']= $needAmount==0?(string)FIdConst::SELF_STOCK_STATUS_STOCKED:(string)FIdConst::SELF_STOCK_STATUS_2STOCK;
        }
        return array(
            "selfStockKaiPiaoList" => $all_data,
            "totalCount" => $count
        );
    }

    public function listSelfStockKaiPiaoEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfStockSub_db = M('bill_self_stock_kaipiao_sub');
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
//        $whereStr = $this->likeSearch($params);
        $count = $selfStockSub_db
            ->alias('sss')
            ->join('info_drug AS idr ON idr.id=sss.drug_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND sss.bill_code like '%".$params['bill_code']."%'")
            ->count();
        $all_data = $selfStockSub_db
            ->alias('sss')
            ->join('info_drug AS idr ON idr.id=sss.drug_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND sss.bill_code like '%".$params['bill_code']."%'")
            ->field('sss.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer')
            ->order('status asc')
            ->page($page,$limit)
            ->select();

        //数据处理
        foreach ($all_data as $k=>$v){
            switch ($v['status']){
                case 0:
                    $all_data[$k]['status_str']='<span style="color:red">未审核</span>';
                    break;
                case 1:
                    $all_data[$k]['status_str']='已审核';
                    break;
                case 2:
                    $all_data[$k]['status_str']='<span style="color:blue">未通过审核</span>';
                    break;
                case 4:
                    $all_data[$k]['status_str']='<span style="color:#795548">税票单被退回</span>';
                    break;
            }
        }
        return array(
            "selfStockKaiPiaoList" => $all_data,
            "totalCount" => $count
        );
    }

    /*
     * 根据子入库单id获取父入库单的入库数量信息
     */
    public function getStockAmount($id){
        $p_id=M('bill_self_stock_kaipiao_sub')->where('id='.$id)->getField('parent_id');
        $re=M('bill_self_stock_kaipiao')->where('id='.$p_id)->find();
        return array(
            "stock_amount" => $re['stock_amount'],
            "need_amount" => $re['stock_amount']-$re['had_amount']
        );
    }

    public function deleteSelfStockKaiPiao($id,$isSub){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db = M("bill_self_stock_kaipiao");
        $subDb = M("bill_self_stock_kaipiao_sub");
        $pay_db = M("bill_self_pay");
        $db->startTrans();
        $subDb->startTrans();
        $pay_db->startTrans();

        $pay_service=new \Home\Service\SelfPayService();

        $data = $isSub?$subDb->where('id='.$id)->find():$db->where('id='.$id)->find();
        if(!$data){
            return $this->bad("要删除的采购单信息不存在");
        }
        if(!$isSub){
            //非子入库单，需要判断是否有子入库单是已审核状态，有的话就不能删除
            $sub=$subDb->where('parent_id='.$id.' AND status='.FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED)->find();
            $canDelete=$sub==NULL?true:false;
        }

        try{
            //非子入库单
            if(!$isSub&&$canDelete){
                //设置对应采购单的状态为未通过
//                $pay_db->where('id='.$data['pay_bill_id'])->save(array('status'=>FIdConst::SELF_PAY_STATUS_STOCK_BACK));
                //退回资金
//                $pay_service->accountReturnMoney($data['pay_bill_id']);
                //删除之前判断是否有已审核通过入开票子单
                if($data['had_amount'] == 0){
                    $db->where('id='.$id)->delete();
                    //删除子单
                    $subDb->where('parent_id='.$id)->delete();
                    //判断该待入开票单的来源，更改对应的表
                    if($data['pay_bill_id']){
                        //存在付款单id，则这条数据来至则更改付款单信息
                        $pay_db->where('id='.$data['pay_bill_id'])->setField('status',FIdConst::SELF_PAY_STATUS_2EDIT);
                    }
                    $log = "删除入开票单信息： 入开票单单号：{$data['bill_code']}";
                    $bs = new BizlogService();
                    $bs->insertBizlog($log, $this->LOG_CATEGORY);
                    $db->commit();
                    $subDb->commit();
                    $pay_db->commit();
                    return $this->ok();
                }

            }elseif($isSub&&($data['status']==FIdConst::SELF_STOCK_STATUS_2VERIFY
                    ||$data['status']==FIdConst::SELF_STOCK_STATUS_VERIFY_DENIED
                    ||$data['status']==FIdConst::SELF_STOCK_KAIPIAO_STATUS_BACK
                )){
                //子入库单，状态为待审核、未通过审核、税票单被退回的可以删除
                //删除子入库单的同时恢复父入库单的剩余入库数量
//                $son_data = $subDb->where('id='.$id)->find();
//                $parent_data = $db->where('id='.$son_data['parent_id'])->find();
//                $parent_data['had_amount'] = $parent_data['had_amount']-$son_data['remain_amount'];
//                $db->where('id='.$son_data['parent_id'])->setField('had_amount',$parent_data['had_amount']);

                $result = $subDb->where('id='.$id)->delete();
                if($result){
                    $log = "删除入库单信息： 入库单单号：{$data['bill_code']}";
                    $bs = new BizlogService();
                    $bs->insertBizlog($log, $this->LOG_CATEGORY);
                }
                $db->commit();
                $subDb->commit();
                $pay_db->commit();
                return $this->ok();
            }else{
                return $this->bad('已被引用，无法删除');
            }
        }catch (Exception $e){
            $db->rollback();
            $subDb->rollback();
            $pay_db->rollback();
        }


    }

    /**
     * 修改自销入库单状态，审核与反审核
     */
    public function selfStockKaiPiaoStatus($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $type = $params["type"];
        $db = M('bill_self_stock_kaipiao_sub');
        $kaiPiaoDb = M("bill_self_stock_kaipiao");
        $deliverDb = M("bill_self_stock");
        $deliverSubDb = M("bill_self_stock_sub");

        $db->startTrans();
        $kaiPiaoDb->startTrans();
        $deliverDb->startTrans();
        $deliverSubDb->startTrans();
        //能修改的条件
        $stock=$db->where('id='.$id)->find();
        //当前状态
        $statusNow=$stock['status'];
        try{
            if($type=='no' && $statusNow==FIdConst::SELF_STOCK_STATUS_2VERIFY){
                //审核未通过
                $operate_info = $db->where('id='.$id)->getField("operate_info").$this->getOperateInfo("审核未通过");
                $db->where('id='.$id)->setField('status',FIdConst::SELF_STOCK_STATUS_VERIFY_DENIED);
                $db->where('id='.$id)->setField('operate_info',$operate_info);
                $db->commit();
                return $this->ok($id);
            }else{
                if($type=='yes'&& ($statusNow==FIdConst::SELF_STOCK_STATUS_2VERIFY
                        ||$statusNow==FIdConst::SELF_STOCK_STATUS_VERIFY_DENIED
                        ||$statusNow==FIdConst::SELF_STOCK_STATUS_KAIPIAO_OUT_BACK)){

                    $kaipiaoParent=$kaiPiaoDb->where('id='.$stock['parent_id'])->find();
                    $hadAmount = $kaipiaoParent['had_amount'];
                    $stockAmount = $kaipiaoParent['stock_amount'];
                    $hadAmountNow =$hadAmount+$stock['stock_num'];
                    //审核之前判断当前入库的数量是否大于剩余入库数量
                    if($hadAmountNow>$stockAmount){
                        return $this->bad('入库数量大于剩余入库数量');
                    }
                    //通过审核，修改父级入库单的已入库数量，并生成入商业公司配送单！
                    $db->where('id='.$id)->save(array('status'=>FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED));
                    $operate_info = $kaiPiaoDb->where('id='.$stock['parent_id'])->getField("operate_info").$this->getOperateInfo("审核通过,生成开票公司待出库单");
                    $hadAmount = $kaiPiaoDb->where('id='.$stock['parent_id'])->getField('had_amount');
                    $hadAmountNow = $hadAmount+$stock['stock_amount'];
                    $kaiPiaoDb->where('id='.$stock['parent_id'])->setField('had_amount',$hadAmountNow);
                    $kaiPiaoDb->where('id='.$stock['parent_id'])->setField('operate_info',$operate_info);
//                    $re=$this->createSelfStockKaiPiaoOut($id);
                    //去除去开票公司流程，直接入配送公司
                    $res=$this->createSelfStockDeliver($id);
                    $deliverDb->commit();
                    $db->commit();
                    $kaiPiaoDb->commit();
                    return $this->ok($res);
                }elseif($type=='return'&& $statusNow==FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED){
                    $m_flag=$this->beforeVerifyReturn($id);
                    if($m_flag){
                        //反审核,删除掉对应的未审核的开票公司出库单
                        //同时删除对应的子单
                        $stockSubID = $deliverDb->where('parent_id='.$id)->getField("id");
                        $deliverSubDb->where('parent_id='.$stockSubID)->delete();
                        $deliverDb->where('parent_id='.$id)->delete();
                        $db->where('id='.$id)->setField("status",FIdConst::SELF_STOCK_STATUS_VERIFY_DENIED);
                        $kaiPiaoId = $db->where('id='.$id)->getField("parent_id");
                        $kaipiaoAmount = $db->where('id='.$id)->getField("stock_amount");
                        $hadAmount = $kaiPiaoDb->where('id='.$kaiPiaoId)->getField("had_amount");
                        $hadAmountNow = $hadAmount - $kaipiaoAmount;
                        $kaiPiaoDb->where("id=".$kaiPiaoId)->setField("had_amount",$hadAmountNow);
                        $deliverDb->commit();
                        $db->commit();
                        $deliverSubDb->commit();
                        return $this->ok($id);
                    }else{
                        $db->rollback();
                        $msg='该开票单已被引用，无法进行反审核操作';
                        return $this->bad($msg);
                    }
                }
            }
        }catch (Exception $e){
            $db->rollback();
            $kaiPiaoDb->rollback();
            $deliverDb->rollback();
            $deliverSubDb->rollback();
            return $this->bad();
        }

    }



    /**
     * 判断是否能进行反审核操作,可以的话先删除相关 出开票公司单
     * @param $id 要进行反审核操作的付款单id
     * @return boolean
     */
    public function beforeVerifyReturn($id){
        //检查入配送公司待入库数量，判断是否符合反审核条件
        $stock = M('bill_self_stock')->where('parent_id='.$id)->find();
        if($stock['had_amount']>0){
            return false;
        }
            return true;
    }

    /**
     * 进库
     * @param $id 入库单的id
     */
    public function toStock($id){
        $selfStock_db=M('bill_self_stock_sub');
        $stock_db=M('info_stock');
        //获取信息info
        $info=$selfStock_db->where('id='.$id)->find();
        $stock=$stock_db
            ->where(
                'drug_id='.$info['drug_id'].
                ' AND deliver_id='.$info['deliver_id'].
                " AND batch_num='".$info['batch_num']."'"
            )
            ->find();
        if($stock==NULL){
            //不存在当前批号
            $data['drug_id']=$info['drug_id'];
            $data['drug_name']=M('info_drug')->where('id='.$info['drug_id'])->getField('common_name');
            $data['deliver_id']=$info['deliver_id'];
            $data['deliver_name']=M('info_deliver')->where('id='.$info['deliver_id'])->getField('name');
            $data['amount']=$info['stock_amount'];
            $data['id']=$info['drug_id']."*".$info['deliver_id']."*".$info['batch_num'];
            $data['batch_num']=$info['batch_num'];
            $stock_db->add($data);
        }else{
            //存在批号，获取已经有的库存量
            $batch=$stock['amount'];
            $amountNow=$batch+$info['stock_amount'];
            //更新
            $stock_db->where("id='".$stock['id']."'")->setField('amount',$amountNow);
        }
    }

    /**
     * 反审核库存调回
     * @author qianwenwei
     * @param $id
     * @return bool
     */
    public function outStock($id){
        $selfStock_db=M('bill_self_stock_sub');
        $stock_db=M('info_stock');
        //获取信息
        $info=$selfStock_db->where('id='.$id)->find();
        $stock=$stock_db
            ->where(
                'drug_id='.$info['drug_id'].
                ' AND deliver_id='.$info['deliver_id'].
                " AND batch_num='".$info['batch_num']."'"
            )
            ->find();
        //存在批号，获取已经有的库存量
        $batch=$stock['amount'];
        $amountNow=$batch-$info['stock_amount'];
        if($amountNow>=0){
            //更新
            $stock_db->where("id='".$stock['id']."'")->setField('amount',$amountNow);
            return true;
        }else{
            return false;
        }
    }


    /**
     * 审核通过，生成配送公司入库单
     * @author qianwenwei
     * @param $id
     * @return bool|mixed
     * *
     */
    public function createSelfStockDeliver($id){
        $idService = new IdGenService();
        $father=M('bill_self_stock_kaipiao_sub')->where('id='.$id)->find();
        $deliverDb = M('bill_self_stock');
        try{
            if($father['status']==FIdConst::SELF_STOCK_KAIPIAO_STATUS_VERIFY_PASSED){
                //开票公司入库单已经审核
                $data['drug_id']=$father['drug_id'];
                $data['pay_bill_code']=$father['pay_bill_code'];
                $data['kaipiao_unit_price']=$father['kaipiao_unit_price'];
                $data['supplier_id']=$father['supplier_id'];
                $data['stock_amount']=$father['stock_amount'];
                $data['batch_num']=$father['batch_num'];
                $data['parent_id']=$father['id'];
                $data['validity']=$father['validity'];
                $data['buy_date']=$father['buy_date'];
                $data['create_time']=time();
                $data['bill_code']=FIdConst::BILL_CODE_TYPE_SELF_STOCK_DELIVER.$idService->newId();
                $data['status']=FIdConst::SELF_STOCK_STATUS_2STOCK;
                return $deliverDb->add($data);

            }else
                return false;
        }catch (Exception $e){
            $deliverDb->rollback();
            return false;
        }

    }
}
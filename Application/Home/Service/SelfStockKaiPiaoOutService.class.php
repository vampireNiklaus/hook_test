<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;

/**
 * 自销出库单Service
 *
 * @author RCG
 */
class SelfStockKaiPiaoOutService extends PSIBaseService {
    private $LOG_CATEGORY = "业务流程信息-出库单信息";

    public function editSelfStockKaiPiaoOut($params){
        //编辑出库单
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $idService = new IdGenService();
        $selfStock_db = D('bill_self_stock_kaipiao_sub');
        $selfStockSub_db = D('bill_self_stock_kaipiao_out_sub');
        $parent_id=$params['parent_id'];

        $stock= $parent_id ==''?$selfStock_db->where('id='.$params['id'])->find():$selfStockSub_db->where('id='.$params['id'])->find();

        $fatherStockId=$parent_id ==''?$params['id']:$selfStockSub_db->where('id='.$params['id'])->getField('parent_id');
        $fatherStock= $selfStock_db->where('id='.$fatherStockId)->find();

        //剩余出库量
        $needStock=$fatherStock['remain_amount'];
        if($needStock<$params['stock_amount']){
            return $this->bad('出库量大于剩余出库量');
        }else{
            //前端可修改的部分
            $data['out_amount']=$params['out_amount'];
            $data['kaipiao_unit_price']=$params['kaipiao_unit_price'];
            $data['outstock_date']=$params['outstock_date'];
            $data['note']=$params['note'];

            if($parent_id==''){
                //新增一个条目
                $data['drug_id']=$stock['drug_id'];
                $data['parent_id']=$fatherStock['id'];
                $data['instock_date']=$stock['instock_date'];
                $data['batch_num']=$stock['batch_num'];
                $data['validity']=$stock['validity'];
                $data['supplier_id']=$stock['supplier_id'];
                $data['supplier_name']=$stock['supplier_name'];
                $data['create_time']=time();
                $data['buy_bill_code']=$stock['buy_bill_code'];
                $data['pay_bill_code']=$stock['pay_bill_code'];
                $data['bill_code']=FIdConst::BILL_CODE_TYPE_SELF_STOCK_KAIPIAO.$idService->newId();
                $data['operate_info'] = $this->getOperateInfo("添加自销子出库单");
                $selfStockSub_db->add($data);
            }else{
                //编辑一个条目
                $data['operate_info'] = $selfStockSub_db->where("id=".$params['id'])->getField("operate_info").$this->getOperateInfo("编辑自销子出库单");
                $selfStockSub_db->where('id='.$params['id'])->save($data);
            }
            return $this->ok($params['id']);
        }

    }

    /*
     * 获取自销采购单列表
     */

    public function listSelfStockKaiPiaoOutUnEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfStock_db = M('bill_self_stock_kaipiao_sub');
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
            ->where("idr.common_name like '%".$params['common_name']."%' AND ss.bill_code like '%".$params['bill_code']."%' and ss.status=1")
            ->count();
        $all_data = $selfStock_db
            ->alias('ss')
            ->join('info_drug AS idr ON idr.id=ss.drug_id')
            ->join('info_supplier AS isu ON isu.id=ss.supplier_id')
            ->join('bill_self_pay AS spa ON spa.bill_code=ss.pay_bill_code')
            ->where("idr.common_name like '%".$params['common_name']."%' AND ss.bill_code like '%".$params['bill_code']."%' and ss.status=1")
            ->field('ss.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer,isu.name supplier_name
                ,spa.bill_code pay_bill_code,spa.buy_date')
            ->page($page,$limit)
            ->select();

        //数据处理
        foreach ($all_data as $k=>$v){
            $needAmount=$v['remain_amount'];
            $all_data[$k]['status_str']= $needAmount==0?"<span>已全部出库</span>":"<span style='color: red'>待出库</span>";
            $all_data[$k]['status']= $needAmount==0?(string)FIdConst::SELF_STOCK_STATUS_STOCKED:(string)FIdConst::SELF_STOCK_STATUS_2STOCK;
        }
        return array(
            "SelfStockKaiPiaoOutList" => $all_data,
            "totalCount" => $count
        );
    }

    public function listSelfStockKaiPiaoOutEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfStockSub_db = M('bill_self_stock_kaipiao_out_sub');
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
            ->join('bill_self_stock_kaipiao_sub AS sskps ON sskps.id = sss.parent_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND sss.bill_code like '%".$params['bill_code']."%'")
            ->field('sss.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer,sskps.remain_amount,sskps.stock_amount')
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
                    $all_data[$k]['status_str']='<span style="color:#795548">入配送公司单被退回</span>';
                    break;
            }
        }
        return array(
            "SelfStockKaiPiaoOutList" => $all_data,
            "totalCount" => $count
        );
    }

    /*
     * 根据子出库单id获取父出库单的出库数量信息
     */
    public function getStockAmount($id){
        $p_id=M('bill_self_stock_kaipiao_out_sub')->where('id='.$id)->getField('parent_id');
        $re=M('bill_self_stock_kaipiao_sub')->where('id='.$p_id)->find();
        return array(
            "stock_amount" => $re['stock_amount'],
            "remain_amount" => $re['remain_amount']
        );
    }

    public function deleteSelfStockKaiPiaoOut($id,$isSub){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db = M("bill_self_stock_kaipiao_sub");
        $inKaiPiaoDb = M("bill_self_stock_kaipiao");
        $subDb = M("bill_self_stock_kaipiao_out_sub");
        $db->startTrans();
        $inKaiPiaoDb->startTrans();
        $subDb->startTrans();
        $data = $isSub?$subDb->where('id='.$id)->find():$db->where('id='.$id)->find();
        if(!$data){
            return $this->bad("要删除的开票公司出库单信息不存在");
        }
        try{
            if(!$isSub){
                //非子出库单，需要判断是否有子出库单是已审核状态，有的话就不能删除
                $sub=$subDb->where('parent_id='.$id.' AND status='.FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED)->find();
                $canDelete=$sub==NULL?true:false;
            }
            //非子出库单
            if(!$isSub&&$canDelete){
                //出开票公司的子单和入配送公司的母单是同一张表格，所以这里直接不能删除，如果想做删除工作的话去开票公司的入库界面去操作
                return $this->bad("这里不能直接删除，请到开票公司出库页面去反审核或者是删除操作！");
                /*//首先删除子单
                $subDb->where('parent_id='.$id)->delete();
                //已出库的开票公司库存再返回到库存中
                $inKaiPiaoItem = $inKaiPiaoDb->where("id=".$data['parent_id'])->find();
                $newRemain = $inKaiPiaoItem['remain_amount'] + $data['out_amount'];
                $inKaiPiaoDb->where("id=".$data['parent_id'])->setField("remain_amount",$newRemain);
                $db->where("id=".$id)->delete();
                $db->commit();
                $inKaiPiaoDb->commit();
                $subDb->commit();
                $log = "删除开票公司出库单信息： 出库单单号：{$data['bill_code']}";
                $bs = new BizlogService();
                $bs->insertBizlog($log, $this->LOG_CATEGORY);
                return $this->ok();*/
            }elseif($isSub&&($data['status']==FIdConst::SELF_STOCK_STATUS_2VERIFY
                    ||$data['status']==FIdConst::SELF_STOCK_STATUS_VERIFY_DENIED
                    ||$data['status']==FIdConst::SELF_STOCK_STATUS_TAX_BACK
                )){
                //子出库单，状态为待审核、未通过审核、税票单被退回的可以删除
               $subDb->where('id='.$id)->delete();
               $subDb->commit();
                $log = "删除开票公司出库单信息： 出库单单号：{$data['bill_code']}";
                $bs = new BizlogService();
                $bs->insertBizlog($log, $this->LOG_CATEGORY);
                return $this->ok();
            }else{
                return $this->bad('已被引用，无法删除');
            }
        }catch (Exception $e){
            $db->rollback();
            $subDb->rollback();
            $inKaiPiaoDb->rollback();
            return $this->bad();
        }

    }

    /**
     * 修改自销出库单状态，审核与反审核
     */
    public function SelfStockKaiPiaoOutStatus($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $type = $params["type"];
        $db = M('bill_self_stock_kaipiao_out_sub');
        $fatherDb = M('bill_self_stock_kaipiao_sub');
        $deliverDb = M("bill_self_stock");
        $deliverSubDb = M("bill_self_stock_sub");
        $deliverDb->startTrans();
        $deliverSubDb->startTrans();
        $fatherDb->startTrans();
        $db->startTrans();
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
            }
            else{
                if($type=='yes'&& ($statusNow==FIdConst::SELF_STOCK_STATUS_2VERIFY
                        ||$statusNow==FIdConst::SELF_STOCK_STATUS_VERIFY_DENIED
                        ||$statusNow==FIdConst::SELF_STOCK_STATUS_TAX_BACK)){


                    if($fatherDb->where('id='.$stock['parent_id'])->getField('remain_amount') - $stock['out_amount']<0)
                        return $this->bad("出库数量超出限制，请重新编辑再审核！");
                    //通过审核，修改父级出库单的已出库数量，并生成税票单
                    if($this->createSelfStockDeliver($id)){
                        $db->where('id='.$id)->save(array('status'=>FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED));
                        $remainAmount=$fatherDb->where('id='.$stock['parent_id'])->getField('remain_amount') - $stock['out_amount'];
                        $operate_info = $fatherDb->where('id='.$stock['parent_id'])->getField("operate_info").$this->getOperateInfo("审核通过，修改父出库单数量，生成税票单");
                        $fatherDb->where('id='.$stock['parent_id'])->setField('remain_amount',$remainAmount);
                        $fatherDb->where('id='.$stock['parent_id'])->setField('operate_info',$operate_info);
                        //更改库存$this->toStock($id);
                        $deliverDb->commit();
                        $fatherDb->commit();
                        $db->commit();
                        return $this->ok();
                    }else{
                        $deliverDb->rollback();
                        $fatherDb->rollback();
                        $db->rollback();
                        return $this->bad();
                    }



                }elseif($type=='return'&& $statusNow==FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED){
                    $m_flag=$this->beforeVerifyReturn($id);

                    if($m_flag){
                        //可以反审核，找到配送公司的总单，然后删除就好了。
                        $db->where('id='.$id)->save(array('status'=>FIdConst::SELF_STOCK_STATUS_2VERIFY));
                        $remainAmount=$fatherDb->where('id='.$stock['parent_id'])->getField('remain_amount')+$stock['out_amount'];
                        $operate_info = $fatherDb->where('id='.$stock['parent_id'])->getField("operate_info").$this->getOperateInfo("审核通过，修改父出库单数量，生成税票单");
                        $fatherDb->where('id='.$stock['parent_id'])->setField('remain_amount',$remainAmount);
                        $fatherDb->where('id='.$stock['parent_id'])->setField('operate_info',$operate_info);
                        $deliverSubs = $deliverDb->where("parent_id=".$stock['id'])->select();
                        for ($i=0;$i<count($deliverSubs);$i++){
                            $deliverSubDb->where("parent_id=".$deliverSubs[$i]['id'])->delete();
                        }
                        $deliverDb->where("parent_id=".$stock['id'])->delete();
                        $deliverDb->commit();
                        $deliverSubDb->commit();
                        $fatherDb->commit();
                        $db->commit();
                        return $this->ok($id);
                    }else{
                        $fatherDb->rollback();
                        $db->rollback();
                        $msg=$m_flag?'':'该采购单已被引用，无法进行反审核操作';
                        return $this->bad($msg);
                    }
                }
            }
        }catch (Exception $e){
            $db->rollback();
            $fatherDb->rollback();
            $deliverDb->rollback();
            $deliverSubDb->rollback();
            return $this->bad();
        }

    }

    /**
     * 生成税票单
     * @param $id 子出库单id
     */
    public function createSelfTax($id){
        $stock=M('bill_self_stock_sub')->where('id='.$id)->find();
        if($stock['status']==1){
            $drug=M('info_drug')->where('id='.$stock['drug_id'])->find();

            //采购单已审核，生成出库单
            $data['drug_id']=$stock['drug_id'];
            $data['pay_bill_id']=$stock['id'];
            $data['supplier_id']=$stock['supplier_id'];
            $data['deliver_id']=$stock['deliver_id'];
            //对应子出库单id
            $data['stock_sub_bill_id']=$stock['id'];

            $data['kaipiao_unit_price']=$drug['kaipiao_price'];
            $data['tax_unit_price']=$drug['tax_price'];
            $data['kaipiao_amount']=$stock['stock_num'];
            $data['sum_kaipiao_money']=$data['kaipiao_unit_price']*$data['kaipiao_amount'];
            $data['sum_tax_money']=$data['tax_unit_price']*$data['kaipiao_amount'];


            $data['create_time']=time();
            $data['bill_code']='BSTA'.date('YmdHis');

            return M('bill_self_tax')->add($data);
        }else
            return false;
    }

    /**
     * 判断是否能进行反审核操作,可以的话先删除相关配送公司的子入库单
     * @param $id 要进行反审核操作的付款单id
     * @return boolean
     */
    public function beforeVerifyReturn($id){
        //配送公司的父单已经有单据被审核了，所以不能继续反审核
        $stockDeliver  = M('bill_self_stock')->where("parent_id=".$id)->find();
        if($stockDeliver['had_amount'] > 0){
            return false;
        }
        return true;
    }

    /**
     * 进库
     * @param $id 出库单的id
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
            $data['amount']=$info['stock_num'];
            $data['id']=$info['drug_id']."*".$info['deliver_id']."*".$info['batch_num'];
            $data['batch_num']=$info['batch_num'];
            $stock_db->add($data);
        }else{
            //存在批号，获取已经有的库存量
            $batch=$stock['amount'];
            $amountNow=$batch+$info['stock_num'];
            //更新
            $stock_db->where("id='".$stock['id']."'")->setField('amount',$amountNow);
        }
    }

    /**
     * 反审核库存调回
     * @param $id 采购单的id
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
        $amountNow=$batch-$info['stock_num'];
        if($amountNow>=0){
            //更新
            $stock_db->where("id='".$stock['id']."'")->setField('amount',$amountNow);
            return true;
        }else{
            return false;
        }
    }

    /**
     * 审核通过，生成配送公司入库单5
     * @param $id
     */
    public function createSelfStockDeliver($id){
        $idService = new IdGenService();
        $father=M('bill_self_stock_kaipiao_out_sub')->where('id='.$id)->find();
        $deliverDb = M('bill_self_stock');
        try{
            if($father['status']==FIdConst::SELF_STOCK_STATUS_2STOCK){
                //开票公司出库单已经审核
                $data['drug_id']=$father['drug_id'];
                $data['pay_bill_code']=$father['pay_bill_code'];
                $data['kaipiao_unit_price']=$father['kaipiao_unit_price'];
                $data['supplier_id']=$father['supplier_id'];
                $data['stock_amount']=$father['out_amount'];
                $data['batch_num']=$father['batch_num'];
                $data['parent_id']=$father['id'];
                $data['validity']=$father['validity'];
                $data['create_time']=time();
                $data['bill_code']=FIdConst::BILL_CODE_TYPE_SELF_STOCK_DELIVER.$idService->newId();
                $data['status']=FIdConst::SELF_STOCK_STATUS_2STOCK;
                $deliverDb->commit();
                return M('bill_self_stock')->add($data);
            }else
                return false;
        }catch (Exception $e){
            $deliverDb->rollback();
            return false;
        }

    }
}
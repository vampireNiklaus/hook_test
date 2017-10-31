<?php

namespace Home\Service;

use Home\Common\FIdConst;

/**
 * 代销采购单Service
 *
 * @author RCG
 */
class DelePurchaseService extends PSIBaseService {
    private $LOG_CATEGORY = "业务流程信息-采购单信息";

    public function editDelePurchase($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $delePurchase_db = D('bill_dele_purchase');
        //获取药品底价
        $drug=M('info_drug')->where('id='.$params['drug_id'])->field('bid_price,kaipiao_price,tax_price')->find();
        $num=$params['buy_amount'];
        //计算
        $params['per_price']=$drug['bid_price'];
        $params['tax_unit_price']=$drug['tax_price'];
        $params['kaipiao_unit_price']=$drug['kaipiao_price'];
        $params['sum_pay']=$drug['bid_price']*$num;
        $params['sum_tax_money']=$drug['tax_price']*$num;
        $params['sum_kaipiao_money']=$drug['kaipiao_price']*$num;

        //开单人id
        $params['kaidan_ren']=session("loginUserId");
        $params['create_time']=time();
        $params['bill_code']='BDPU'.date('YmdHis',time());
        if($params['id']){
            $params['operate_info'] = $delePurchase_db->where("id=".$params['id'])->getField("operate_info").$this->getOperateInfo("编辑");
            $delePurchase_db->save($params);
        }else{
            $params['operate_info'] = $this->getOperateInfo("新建");
            $params['id'] = $delePurchase_db->add($params);
        }
        return $this->ok($params['id']);
    }

    /*
     * 获取代销采购单列表
     */

    public function listDelePurchase($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $delePurchase_db = M('bill_dele_purchase');
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
//        $whereStr = $this->likeSearch($params);
        $count = $delePurchase_db
            ->alias('sp')
            ->join('info_drug AS idr ON idr.id=sp.drug_id')
            ->join('info_supplier AS isu ON isu.id=sp.supplier_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND sp.bill_code like '%".$params['bill_code']."%'")
            ->count();
        $all_data = $delePurchase_db
            ->alias('sp')
            ->join('info_drug AS idr ON idr.id=sp.drug_id')
            ->join('info_supplier AS isu ON isu.id=sp.supplier_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND sp.bill_code like '%".$params['bill_code']."%'")
            ->field('sp.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer,isu.name supplier_name')
            ->page($page,$limit)
            ->select();

        //数据处理
        for($i=0;$i<count($all_data);$i++){
            if ($all_data[$i]['deliver_id']!=0){
                $all_data[$i]['deliver_name'] = M("info_deliver")->where("id=".$all_data[$i]['deliver_id'])->getField("name");
            }else{
                $all_data[$i]['deliver_name'] = "未填写";
            }
            switch ($all_data[$i]['status']){
                case FIdConst::DELE_PURCHASE_STATUS_2VERIFY:
                    $all_data[$i]['status_str']='<span style="color:red">未审核</span>';
                    break;
                case FIdConst::DELE_PURCHASE_STATUS_VERIFIY_PASSED:
                    $all_data[$i]['status_str']='已审核';
                    break;
                case FIdConst::DELE_PURCHASE_STATUS_VERIFY_DENIED:
                    $all_data[$i]['status_str']='<span style="color:blue">审核未通过</span>';
                    break;
                case FIdConst::DELE_PURCHASE_STATUS_HUIKUAN_BACK:
                    $all_data[$i]['status_str']='<span style="color:#795548">回款单被退回</span>';
                    break;
            }
        }
        return array(
            "delePurchaseList" => $all_data,
            "totalCount" => $count
        );
    }

    public function deleteDelePurchase($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        //获取要删除的信息
        $db = M("bill_dele_purchase");
        $data = $db->where('id='.$params)->find();
        if(!$data){
            return $this->bad("要删除的采购单信息不存在");
        }
        //通过审核的不能删除
        if($data['status']==FIdConst::DELE_PURCHASE_STATUS_VERIFIY_PASSED){
            return $this->bad("该采购单已通过审核，无法删除");
        }
        $result = $db->where('id='.$params)->delete();
        if($result){
            $log = "删除采购单信息： 采购单单号：{$data['dh']}";
            $bs = new BizlogService();
            $bs->insertBizlog($log, $this->LOG_CATEGORY);
        }
        return $this->ok();
    }

    /**
     * 修改代销采购单状态，审核与反审核
     */
    public function delePurchaseStatus($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $type = $params["type"];
        $db = M('bill_dele_purchase');
        //能修改的条件
        $io=$db->where('id='.$id)->find();
        //当前状态
        $statusNow=$io['status'];
        if($type=='no' && $statusNow==FIdConst::DELE_PURCHASE_STATUS_2VERIFY){
            //审核未通过
            $data['status']=FIdConst::DELE_PURCHASE_STATUS_VERIFY_DENIED;
            $data['verifier_id']=session('loginUserId');
            $data['operate_info']= $db->where('id='.$id)->getField("operate_info").$this->getOperateInfo("审核不通过");
            $db->where('id='.$id)->save($data);
            return $this->ok($id);
        }else{
            if($type=='yes'&& ($statusNow==FIdConst::DELE_PURCHASE_STATUS_2VERIFY||FIdConst::DELE_PURCHASE_STATUS_VERIFY_DENIED)){

                //通过审核，生成回款单
                $data['status']=FIdConst::DELE_PURCHASE_STATUS_VERIFIY_PASSED;
                $data['verifier_id']=session('loginUserId');
                $data['operate_info']= $db->where('id='.$id)->getField("operate_info").$this->getOperateInfo("审核通过");
                $db->where('id='.$id)->save($data);
                $re=$this->createDeleHuikuan($id);
                //更改库存
                $this->toStock($id);

                return $this->ok($re);

            }elseif($type=='return'&& $statusNow==FIdConst::DELE_PURCHASE_STATUS_VERIFIY_PASSED){

                $data['verifier_id']=session('loginUserId');
                $db->startTrans();
                $m_flag=$this->beforeVerifyReturn($id);
                $s_flag= $m_flag?$this->outStock($id):false;
                //已审核且生成了入库单的反审核，先判断是否可以反审核，可以的话状态修改为审核未通过
                if( $m_flag && $s_flag){
                    //可以反审核
                    $data['status']=FIdConst::DELE_PURCHASE_STATUS_VERIFY_DENIED;
                    $data['operate_info']= $db->where('id='.$id)->getField("operate_info").$this->getOperateInfo("修改状态为可反审核");
                    $db->where('id='.$id)->save($data);
                    $db->commit();
                    return $this->ok($id);
                }
                else{
                    $db->rollback();
                    $msg=$m_flag?'':'该采购单已被引用，无法进行反审核操作';
                    $msg=(!$s_flag)&&$m_flag?'库存不足，无法进行反审核操作':$msg;
                    return $this->bad($msg);
                }
            }
        }
    }

    /**
     * 生成回款单
     * @param $id 采购单id
     */
    protected function createDeleHuikuan($id){
        $purchase=M('bill_dele_purchase')->where('id='.$id)->find();
        if($purchase['status']==FIdConst::DELE_PURCHASE_STATUS_VERIFIY_PASSED){
            //采购单已审核，生成付款单
            $data['bill_code']='BDHU'.date('YmdHis');
            $data['purchase_id']=$purchase['id'];
            $data['drug_id']=$purchase['drug_id'];
            $data['deliver_id']=$purchase['deliver_id'];
            $data['supplier_id']=$purchase['supplier_id'];
            $data['batch_num']=$purchase['batch_num'];
            $data['kaipiao_unit_price']=$purchase['kaipiao_unit_price'];
            $data['huikuan_amount']=$purchase['buy_amount'];
            $data['sum_kaipiao_money']=$purchase['sum_kaipiao_money'];
            $data['had_amount']=0;
            $data['create_time']=time();

            return M('bill_dele_huikuan')->add($data);
        }else
            return false;
    }

    /**
     * 判断是否能进行反审核操作,可以的话先删除相关付款单
     * @param $id 要进行反审核操作的采购单id
     * @return boolean
     */
    public function beforeVerifyReturn($id){
        //实例化两个要用到的入库单模型
        $huikuan_db=M('bill_dele_huikuan');
        $huikuanSub_db=M('bill_dele_huikuan_sub');
        //根据id获取对应的回款单id
        $huikuan_id=$huikuan_db->where('purchase_id='.$id)->getField('id');
        //获取对应入库单id
        $payCount=$huikuanSub_db->where('parent_id='.$huikuan_id.' AND status='.FIdConst::DELE_HUIKUAN_STATUS_VERIFY_PASSED)->count();
        if($payCount==0){
            //数量为0，说明没有审核通过的，返回真表示可以反审核
            //删除对应的入库单
            $huikuan_db->where('purchase_id='.$id)->delete();
            $huikuanSub_db->where('parent_id='.$huikuan_id)->delete();
            return true;
        }elseif($payCount>0){
            //不能反审核，返回假
            return false;
        }
    }

    /**
     * 进库
     * @param $id 采购单的id
     */
    public function toStock($id){
        $purchase_db=M('bill_dele_purchase');
        $stock_db=M('info_stock');
        //获取信息
        $info=$purchase_db->where('id='.$id)->find();
        $stock=$stock_db
            ->where('drug_id='.$info['drug_id'].' AND deliver_id='.$info['deliver_id']." AND batch_num='".$info['batch_num']."'")
            ->find();
        if($stock==NULL){
            //不存在当前批号
            $data['drug_id']=$info['drug_id'];
            $data['drug_name']=M('info_drug')->where('id='.$info['drug_id'])->getField('common_name');
            $data['deliver_id']=$info['deliver_id'];
            $data['deliver_name']=M('info_deliver')->where('id='.$info['deliver_id'])->getField('name');
            $data['amount']=$info['buy_amount'];
            $data['batch_num']=$info['batch_num'];
            $data['id']=$info['drug_id']."*".$info['deliver_id']."*".$info['batch_num'];
            $stock_db->add($data);
        }else{
            //存在批号，获取已经有的库存量
            $batch=$stock['amount'];
            $amountNow=$batch+$info['buy_amount'];
            //更新
            $stock_db->where('drug_id='.$info['drug_id'].' AND deliver_id='.$info['deliver_id']." AND batch_num='".$info['batch_num']."'")->setField('amount',$amountNow);
        }
    }

    /**
     * 反审核库存调回
     * @param $id 采购单的id
     */
    public function outStock($id){
        $purchase_db=M('bill_dele_purchase');
        $stock_db=M('info_stock');
        //获取信息
        $info=$purchase_db->where('id='.$id)->find();
        $stock=$stock_db
            ->where('drug_id='.$info['drug_id'].' AND deliver_id='.$info['deliver_id']." AND batch_num='".$info['batch_num']."'")
            ->find();
        //存在批号，获取已经有的库存量
        $batch=$stock['amount'];
        $amountNow=$batch-$info['buy_amount'];
        if($amountNow>=0){
            //更新
            $stock_db->where('drug_id='.$info['drug_id'].' AND deliver_id='.$info['deliver_id']." AND batch_num='".$info['batch_num']."'")->setField('amount',$amountNow);
            return true;
        }else{
            return false;
        }
    }

}
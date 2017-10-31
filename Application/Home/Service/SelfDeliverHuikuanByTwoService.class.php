<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;

/**
 * 自销回款单Service
 *
 * @author Baoyu Li
 */
class SelfDeliverHuikuanByTwoService extends PSIBaseService {
    private $LOG_CATEGORY = "业务流程信息-回款单信息";

    public function editSelfDeliverHuikuanByTwo($params){
        //编辑回款单
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfHuikuan_db = D('bill_self_deliver_huikuan_by_two');
        $selfHuikuanSub_db = D('bill_self_deliver_huikuan_by_two_sub');
        $parent_id=$params['parent_id'];
        $huikuanId=$parent_id==''?$params['id']:$selfHuikuanSub_db->where('id='.$params['id'])->getField('parent_id');
        $huikuan=$selfHuikuan_db->where('id='.$huikuanId)->find();
        //剩余开票量
        $needTax=$huikuan['huikuan_amount']-$huikuan['had_amount'];
        if($needTax<$params['huikuan_num']){
            return $this->bad('开票数大于剩余开票数');
        }else{
            //新建子回款单
            $data['drug_id']=$huikuan['drug_id'];
            $data['parent_id']=$huikuan['id'];
            $data['huikuan_way']=$huikuan['huikuan_way'];
            $data['deliver_id']=$huikuan['deliver_id'];
            $data['kaipiao_unit_price']=$huikuan['kaipiao_unit_price'];
            $data['huikuan_num']=$params['huikuan_num'];
            $data['huikuan_money']=$params['huikuan_money'];
//            $data['sum_kaipiao_money']=$data['kaipiao_unit_price']*$data['huikuan_num'];
            $data['huikuan_code']=$params['huikuan_code'];
            $data['bill_date']=$params['bill_date'];
//            $data['huikuan_account']=$params['huikuan_account'];
            $data['kaidan_ren']=session('loginUserId');
            $data['note']=$params['note'];
            $data['status']=FIdConst::SELF_HUIKUAN_STATUS_2VERIFY;
            $data['create_time']=time();
            //生成系统单号
            $data['bill_code']="SYHK-S".date('YmdHis');
            if($parent_id==''){
                $data['operate_info'] = $this->getOperateInfo("新建");
                $selfHuikuanSub_db->add($data);
//                //同时改变父待回款单数量
//                $huikuan['had_amount'] = $huikuan['had_amount'] + $params['huikuan_num'];
//                $selfHuikuan_db->where('id='.$params['id'])->setField('had_amount',$huikuan['had_amount']);
            }else{
                $data['operate_info'] = $selfHuikuanSub_db->where('id='.$params['id'])->getField("operate_info").$this->getOperateInfo("编辑");
                $selfHuikuanSub_db->where('id='.$params['id'])->save($data);
            }
            return $this->ok($params['id']);
        }


    }

    /*
     * 获取未编辑自销回款单列表
     */
    public function listSelfDeliverHuikuanByTwoUnEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfHuikuan_db = M('bill_self_deliver_huikuan_by_two');
        //分页信息
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
        $count = $selfHuikuan_db
            ->alias('shk')
            ->join('info_drug AS idr ON idr.id=shk.drug_id')
//            ->join('info_supplier AS isu ON isu.id=shk.supplier_id')
            ->join('info_deliver AS ide ON ide.id=shk.deliver_id')
            ->join('bill_self_stock_by_two_sub AS sts ON sts.id=shk.stock_bill_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND shk.bill_code like '%".$params['bill_code']."%'")
            ->count();
        $all_data = $selfHuikuan_db
            ->alias('shk')
            ->join('info_drug AS idr ON idr.id=shk.drug_id')
//            ->join('info_supplier AS isu ON isu.id=shk.supplier_id')
            ->join('info_deliver AS ide ON ide.id=shk.deliver_id')
            ->join('bill_self_stock_by_two_sub AS sts ON sts.id=shk.stock_bill_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND shk.bill_code like '%".$params['bill_code']."%'")
            ->field('shk.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.manufacturer,ide.name deliver_name')
            ->page($page,$limit)
            ->select();

        //数据处理
        foreach ($all_data as $k=>$v){
            $needAmount=$v['huikuan_amount']-$v['had_amount'];
            $all_data[$k]['need_amount']=$needAmount;
            $all_data[$k]['status_str']= $needAmount==0?"<span>已全部回款</span>":"<span style='color: red'>待回款</span>";
            //找到开票公司  或者是其他的相关的信息

        }
        return array(
            "selfHuikuanList" => $all_data,
            "totalCount" => $count
        );
    }

    public function listSelfDeliverHuikuanByTwoEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfHuikuanSub_db = M('bill_self_deliver_huikuan_by_two_sub');
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
        $count = $selfHuikuanSub_db
            ->alias('shk')
            ->join('info_drug AS idr ON idr.id=shk.drug_id')
//            ->join('info_supplier AS isu ON isu.id=shk.supplier_id')
            ->join('info_deliver AS ide ON ide.id=shk.deliver_id')
//            ->join('info_bank_account AS iba ON iba.id=shk.huikuan_account')
            ->where("idr.common_name like '%".$params['common_name']."%' AND shk.bill_code like '%".$params['bill_code']."%'")
            ->count();
        $all_data = $selfHuikuanSub_db
            ->alias('shk')
            ->join('info_drug AS idr ON idr.id=shk.drug_id')
//            ->join('info_supplier AS isu ON isu.id=shk.supplier_id')
            ->join('info_deliver AS ide ON ide.id=shk.deliver_id')
//            ->join('info_bank_account AS iba ON iba.id=shk.huikuan_account')
            ->where("idr.common_name like '%".$params['common_name']."%' AND shk.bill_code like '%".$params['bill_code']."%'")
            ->field('shk.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.manufacturer,ide.name deliver_name')
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
                    $all_data[$k]['status_str']='<span style="color:blue">回款单被撤回</span>';
                    break;
            }
        }
        return array(
            "selfHuikuanList" => $all_data,
            "totalCount" => $count
        );
    }

    /*
     * 根据子回款单id获取父回款单的入库数量信息
     */
    public function getHuikuanAmount($id){
        $p_id=M('bill_self_deliver_huikuan_by_two_sub')->where('id='.$id)->getField('parent_id');
        $re=M('bill_self_deliver_huikuan_by_two')
            ->alias('bst')
            ->where('bst.id='.$p_id)
            ->field('bst.huikuan_amount,bst.had_amount')
            ->find();
        return array(
            "huikuan_amount" => $re['huikuan_amount'],
            "need_amount" => $re['huikuan_amount']-$re['had_amount']
        );
    }

    /**
     * 删除商业回款单
     * @author qianwenwei
     * @param $id
     * @param $isSub
     * @return array
     * *
     */
    public function deleteSelfDeliverHuikuanByTwo($id,$isSub){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db = M("bill_self_deliver_huikuan_by_two");
        $subDb = M("bill_self_deliver_huikuan_by_two_sub");
        $data = $isSub?$subDb->where('id='.$id)->find():$db->where('id='.$id)->find();
        if(!$data){
            return $this->bad("要删除的回款单信息不存在");
        }
        if(!$isSub){
            //非子回款单，需要判断是否有子回款单是已审核状态，有的话就不能删除
            $sub=$subDb->where('parent_id='.$id.' AND status='.FIdConst::SELF_HUIKUAN_STATUS_VERIFY_PASSED)->find();
            $canDelete=$sub==NULL?true:false;
        }
        //非子回款单
        if(!$isSub&&$canDelete){
            //实例化入商业公司相关模型
            $taxSub_db=M('bill_self_stock_by_two_sub');
            $tax_db=M('bill_self_stock_by_two');
            //设置对应子配送单状态为被退回
            $taxSub_db->where('id='.$data['stock_bill_id'])->save(array('status'=>FIdConst::SELF_STOCK_KAIPIAO_STATUS_OUT_BACK));

            //获取对应子配送单信息
            $tax=$taxSub_db->where('id='.$data['stock_bill_id'])->find();
            //获取父配送单已开票数
            $hadAmount=$tax_db->where('id='.$tax['parent_id'])->getField('had_amount');
            //已入库数减去退回的--当前已开票数
            $hadAmountNow=$hadAmount-$tax['stock_num'];
            //保存当前已开票数
            $tax_db->where('id='.$tax['parent_id'])->setField('had_amount',$hadAmountNow);

            //资金退回
//            $taxService=new \Home\Service\SelfTaxService();
//            $taxService->accountReturnMoney($tax['id']);

            //删除回款单
            $result = $db->where('id='.$id)->delete();
            //删除子单
            $subDb->where('parent_id='.$id)->delete();

            //记录日志
            if($result){
                $log = "删除回款单信息： 回款单单号：{$data['bill_code']}";
                $bs = new BizlogService();
                $bs->insertBizlog($log, $this->LOG_CATEGORY);
            }
            return $this->ok();
        }elseif($isSub&&($data['status']==FIdConst::SELF_HUIKUAN_STATUS_2VERIFY||$data['status']==FIdConst::SELF_HUIKUAN_STATUS_VERIFY_DENIED)){
            //子回款单，状态为待审核和未通过审核的可以删除
//            //删除子入库单的同时恢复父入库单的剩余入库数量
//            $son_data = $subDb->where('id='.$id)->find();
//            $parent_data = $db->where('id='.$son_data['parent_id'])->find();
//            $parent_data['had_amount'] = $parent_data['had_amount']-$son_data['huikuan_num'];
//            $db->where('id='.$son_data['parent_id'])->setField('had_amount',$parent_data['had_amount']);

            $result = $subDb->where('id='.$id)->delete();
            if($result){
                $log = "删除回款单信息： 回款单单号：{$data['bill_code']}";
                $bs = new BizlogService();
                $bs->insertBizlog($log, $this->LOG_CATEGORY);
            }
            return $this->ok();
        }else{
            return $this->bad('已被引用，无法删除');
        }
    }

    /**
     * 修改自销商业回款单状态，审核与反审核
     * @author qianwenwei
     * @param $params
     * @return array
     * *
     */
    public function selfHuikuanStatus($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $type = $params["type"];
        $huikuan_db = M('bill_self_deliver_huikuan_by_two');
        $huikuanSub_db = M('bill_self_deliver_huikuan_by_two_sub');
        //能修改的条件
        $huikuan=$huikuanSub_db->where('id='.$id)->find();
        //当前状态
        $statusNow=$huikuan['status'];
        if($type=='no' && $statusNow==FIdConst::SELF_HUIKUAN_STATUS_2VERIFY){
            //审核未通过
            $huikuanSub_db->where('id='.$id)->setField('status',FIdConst::SELF_HUIKUAN_STATUS_VERIFY_DENIED);
            return $this->ok($id);
        }
        $huikuanParent=$huikuan_db->where('id='.$huikuan['parent_id'])->field('huikuan_amount,had_amount')->find();
        $hadAmount=$huikuanParent['had_amount'];
        $huikuanAmount=$huikuanParent['huikuan_amount'];
        if($type=='yes'&& ($statusNow==FIdConst::SELF_HUIKUAN_STATUS_2VERIFY
                ||$statusNow==FIdConst::SELF_HUIKUAN_STATUS_VERIFY_DENIED||$statusNow==FIdConst::SELF_DELIVER_HUIKUAN_STATUS_BACK)){
            $hadAmountNow=$hadAmount+$huikuan['huikuan_num'];
            //判断当前回款数是否大于剩余回款数
            if($hadAmountNow>$huikuanAmount)
                return $this->bad('回款数大于当前剩余回款数');
            else{
                //通过审核，生成厂家回款单
                $huikuanSub_db->where('id='.$id)->save(array('status'=>FIdConst::SELF_HUIKUAN_STATUS_VERIFY_PASSED));
                $operate_info = $huikuan_db->where('id='.$huikuan['parent_id'])->getField("operate_info").$this->getOperateInfo("审核通过");
                $huikuan_db->where('id='.$huikuan['parent_id'])->setField('had_amount',$hadAmountNow);
                $huikuan_db->where('id='.$huikuan['parent_id'])->setField('operate_info',$operate_info);
//                $this->accountPayMoney($id);
                //生成厂家回款单
                $this->createSelfManufacturerHuikuan($id);
                return $this->ok();
            }
        }
        if($type=='return'&& $statusNow==FIdConst::SELF_HUIKUAN_STATUS_VERIFY_PASSED){
//            if($this->accountReturnMoney($id)){
                //反审核
                $mHuikuan_db = M('bill_self_manufacturer_huikuan_by_two');
                $mHuikuan_sub_db = M('bill_self_manufacturer_huikuan_by_two_sub');
                $mHuikuan = $mHuikuan_db->where('deliver_huikuan_bill_id='.$huikuan['id'])->find();
                //反审核的同时通过厂家已回款数量判断厂家回款单是否已有回款记录
                if($mHuikuan['had_amount'] > 0){
                    //已生成厂家回款单，不能反审核
                    return $this->bad('已被引用，无法进行反审核操作');
                }else{
                    //没有被引用，可以进行反审核操作
                    $huikuanSub_db->where('id='.$id)->save(array('status'=>FIdConst::SELF_HUIKUAN_STATUS_2VERIFY));
                    $hadAmountNow=$hadAmount-$huikuan['huikuan_num'];
                    $operate_info = $huikuan_db->where('id='.$huikuan['parent_id'])->getField("operate_info").$this->getOperateInfo("反审核通过");
                    $huikuan_db->where('id='.$huikuan['parent_id'])->setField('had_amount',$hadAmountNow);
                    $huikuan_db->where('id='.$huikuan['parent_id'])->setField('operate_info',$operate_info);
                    //删除该厂家回款单对应的子单
                    $id = $mHuikuan_db->where('deliver_huikuan_bill_id='.$huikuan['id'])->getField('id');
                    $mHuikuan_sub_db->where('parent_id='.$id)->delete();
                    //删除对应的待回款状态的厂家回款单
                    $mHuikuan_db->where('deliver_huikuan_bill_id='.$huikuan['id'])->delete();
                    return $this->ok();
                }
//            }else
//                return $this->bad('账户余额不足，无法进行反审核操作');
        }
    }

    /**
     * 审核通过，加相应账户的资金
     * @author qianwenwei
     * @param $id
     * @return bool
     * *
     */
    protected function accountPayMoney($id){
        //实例化模型
        $pay_db=M('bill_self_huikuan_sub');
        $account_db=M('info_bank_account');
        $bds = new BankDepositService();

        //获取回款单信息
        $bill=$pay_db->where('id='.$id)->find();
        //获取账户及金额
        $account=$bill['huikuan_account'];
        $money=$bill['sum_kaipiao_money'];
        //判断账户是否有足够的余额
        if($money>0&&$account>0){
            //获取当前余额
            $account_db->startTrans();
            try{
                    $account_money=$account_db->where('id='.$account)->getField('now_money');
                    $data['now_money']=$account_money+$money;
                    $data['operate_info'] = $account_db->where('id='.$account)->getField("operate_info").$this->getOperateInfo("自销回款操作金额：$money");
                    $account_db->where('id='.$account)->save($data);

                    if($bds->newBankIODetaillList("自销回款单-审核",FIdConst::SELF_HUIKUAN_BILL_VERIFY,$account,"收款账户：对应单号：".$bill['bill_code'],$money)){
                        $account_db->commit();
                        return true;
                    }
                }catch (Exception $e){
                    $account_db->rollback();
                    return false;
            }
        }
    }

    /**
     * 反审核，资金回流
     * @author qianwenwei
     * @param $id
     * @return bool
     * *
     */
    public function accountReturnMoney($id){
        //实例化模型
        $huikuanSub_db=M('bill_self_deliver_huikuan_by_two_sub');
        $account_db=M('info_bank_account');

        $bds = new BankDepositService();

        //获取付款单信息
        $bill=$huikuanSub_db->where('id='.$id)->find();
        //获取账户及金额
        $account=$bill['huikuan_account'];
        $money=$bill['huikuan_money'];
        //更新余额
        if($account>0&&$money>0){
            $account_money=$account_db->where('id='.$account)->getField('now_money');
            if($account_money<$money)
                return false;
            else{
                $account_db->startTrans();
                try{
                    $account_1_money=$account_db->where('id='.$account)->getField('now_money');
                    $data['now_money']=$account_1_money-$money;
                    if($bds->newBankIODetaillList("自销商业回款单-反审核",FIdConst::SELF_HUIKUAN_BILL_REVERT_VERIFY,$account,"对应单号：".$bill['bill_code'],-$money)){
                        $account_db->where('id='.$account)->save($data);
                        $account_db->commit();
                        return true;
                    }
                }catch (Exception $e){
                    $account_db->rollback();
                    return false;
                }

            }
        }
    }

    /**
     * 生成厂家回款单
     * @author qianwenwei
     * @param $id
     * @return bool|mixed
     * *
     */
    protected function createSelfManufacturerHuikuan($id){
        $deliver_huikuan=M('bill_self_deliver_huikuan_by_two_sub')->where('id='.$id)->find();
        if($deliver_huikuan['status']==FIdConst::SELF_HUIKUAN_STATUS_VERIFY_PASSED){
            //商业回款单已审核，生成厂家回款单
            $data['drug_id']=$deliver_huikuan['drug_id'];
            $data['deliver_huikuan_bill_id']=$deliver_huikuan['id'];
            $data['deliver_id']=$deliver_huikuan['deliver_id'];
            $data['kaipiao_unit_price']=$deliver_huikuan['kaipiao_unit_price'];
            $data['huikuan_amount']=$deliver_huikuan['huikuan_num'];
//            $data['sum_kaipiao_money']=$data['kaipiao_unit_price']*$data['huikuan_amount'];
            $data['huikuan_money']=$deliver_huikuan['huikuan_money'];
            $data['huikuan_way']=$deliver_huikuan['huikuan_way'];
            $data['had_amount']=0;
            $data['create_time']=time();
            $data['bill_code']='CJHK'.date('YmdHis');
            $data['operate_info'] = $this->getOperateInfo("子汇款单创建");
            return M('bill_self_manufacturer_huikuan_by_two')->add($data);
        }else
            return false;
    }


}
<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;

/**
 * 自销回款单Service
 *
 * @author RCG
 */
class SelfHuikuanService extends PSIBaseService {
    private $LOG_CATEGORY = "业务流程信息-回款单信息";

    public function editSelfHuikuan($params){
        //编辑回款单
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfHuikuan_db = D('bill_self_huikuan');
        $selfHuikuanSub_db = D('bill_self_huikuan_sub');
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
            $data['supplier_id']=$huikuan['supplier_id'];
            $data['deliver_id']=$huikuan['deliver_id'];
//            $data['kaipiao_unit_price']=$huikuan['kaipiao_unit_price'];
            $data['kaipiao_unit_price']=$params['kaipiao_unit_price'];
            $data['huikuan_num']=$params['huikuan_num'];
//            $data['sum_kaipiao_money']=$data['kaipiao_unit_price']*$data['huikuan_num'];
            $data['sum_kaipiao_money']=$params['sum_kaipiao_money'];
            $data['huikuan_code']=$params['huikuan_code'];
            $data['bill_date']=$params['bill_date'];
            $data['huikuan_account']=$params['huikuan_account'];
            $data['kaidan_ren']=session('loginUserId');
            $data['note']=$params['note'];
            $data['status']=FIdConst::SELF_HUIKUAN_STATUS_2VERIFY;

            $data['create_time']=time();
            //生成系统单号
            $data['bill_code']="BSHK-S".date('YmdHis');
            if($parent_id==''){
                $data['operate_info'] = $this->getOperateInfo("新建");
                $selfHuikuanSub_db->add($data);
//                同时改变父待回款单数量
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
    public function listSelfHuikuanUnEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfHuikuan_db = M('bill_self_huikuan');
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
            ->join('info_supplier AS isu ON isu.id=shk.supplier_id')
            ->join('info_deliver AS ide ON ide.id=shk.deliver_id')
            ->join('bill_self_tax_sub AS sts ON sts.id=shk.tax_bill_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND shk.bill_code like '%".$params['bill_code']."%'")
            ->count();
        $all_data = $selfHuikuan_db
            ->alias('shk')
            ->join('info_drug AS idr ON idr.id=shk.drug_id')
            ->join('info_supplier AS isu ON isu.id=shk.supplier_id')
            ->join('info_deliver AS ide ON ide.id=shk.deliver_id')
            ->join('bill_self_tax_sub AS sts ON sts.id=shk.tax_bill_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND shk.bill_code like '%".$params['bill_code']."%'")
            ->field('shk.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.manufacturer,isu.name supplier_name
                ,sts.tax_shuipiao_code tax_sub_bill_code,ide.name deliver_name')
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

    public function listSelfHuikuanEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfHuikuanSub_db = M('bill_self_huikuan_sub');
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
            ->join('info_supplier AS isu ON isu.id=shk.supplier_id')
            ->join('info_deliver AS ide ON ide.id=shk.deliver_id')
            ->join('info_bank_account AS iba ON iba.id=shk.huikuan_account')
            ->where("idr.common_name like '%".$params['common_name']."%' AND shk.bill_code like '%".$params['bill_code']."%'")
            ->count();
        $all_data = $selfHuikuanSub_db
            ->alias('shk')
            ->join('info_drug AS idr ON idr.id=shk.drug_id')
            ->join('info_supplier AS isu ON isu.id=shk.supplier_id')
            ->join('info_deliver AS ide ON ide.id=shk.deliver_id')
            ->join('info_bank_account AS iba ON iba.id=shk.huikuan_account')
            ->where("idr.common_name like '%".$params['common_name']."%' AND shk.bill_code like '%".$params['bill_code']."%'")
            ->field('shk.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.manufacturer,isu.name supplier_name,
                ide.name deliver_name,iba.account_name huikuan_account_name,iba.account_num huikuan_account_num')
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
        $p_id=M('bill_self_huikuan_sub')->where('id='.$id)->getField('parent_id');
        $re=M('bill_self_huikuan')
            ->alias('bst')
            ->join('bill_self_tax_sub sss ON sss.id=bst.tax_bill_id')
            ->where('bst.id='.$p_id)
            ->field('bst.huikuan_amount,bst.had_amount,sss.tax_shuipiao_code tax_sub_bill_code')
            ->find();
        return array(
            "tax_sub_bill_code" => $re['tax_sub_bill_code'],
            "huikuan_amount" => $re['huikuan_amount'],
            "need_amount" => $re['huikuan_amount']-$re['had_amount']
        );
    }

    public function deleteSelfHuikuan($id,$isSub){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db = M("bill_self_huikuan");
        $subDb = M("bill_self_huikuan_sub");
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
            //实例化税票相关模型
            $taxSub_db=M('bill_self_tax_sub');
            $tax_db=M('bill_self_tax');
            //设置对应子税票单状态为被退回
            $taxSub_db->where('id='.$data['tax_bill_id'])->save(array('status'=>FIdConst::SELF_TAX_STATUS_HUIKUAN_BACK));

            //获取对应子税票单信息
            $tax=$taxSub_db->where('id='.$data['tax_bill_id'])->find();
            //获取父税票单已开票数
            $hadAmount=$tax_db->where('id='.$tax['parent_id'])->getField('amount_had_pay');
            //已开票数减去退回的--当前已开票数
            $hadAmountNow=$hadAmount-$tax['kaipiao_num'];
            //保存当前已开票数
            $tax_db->where('id='.$tax['parent_id'])->setField('amount_had_pay',$hadAmountNow);

            //资金退回
            $taxService=new \Home\Service\SelfTaxService();
            $taxService->accountReturnMoney($tax['id']);

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
     * 修改自销回款单状态，审核与反审核
     */
    public function selfHuikuanStatus($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $type = $params["type"];
        $huikuan_db = M('bill_self_huikuan');
        $huikuanSub_db = M('bill_self_huikuan_sub');
        //能修改的条件
        $huikuan=$huikuanSub_db->where('id='.$id)->find();
        //当前状态
        $statusNow=$huikuan['status'];
        if($type=='no' && $statusNow==FIdConst::SELF_HUIKUAN_STATUS_2VERIFY){
            //审核未通过
            $huikuanSub_db->where('id='.$id)->setField('status',FIdConst::SELF_HUIKUAN_STATUS_VERIFY_DENIED);
            return $this->ok($id);
        }
        $huikuanParent=M('bill_self_huikuan')->where('id='.$huikuan['parent_id'])->field('huikuan_amount,had_amount')->find();
        $hadAmount=$huikuanParent['had_amount'];
        $hadAmountNow = $hadAmount + $huikuan['huikuan_num'];
        if($type=='yes'&& ($statusNow==FIdConst::SELF_HUIKUAN_STATUS_2VERIFY
                ||$statusNow==FIdConst::SELF_HUIKUAN_STATUS_VERIFY_DENIED)){

            //通过审核，资金入账
            $huikuanSub_db->where('id='.$id)->save(array('status'=>FIdConst::SELF_HUIKUAN_STATUS_VERIFY_PASSED));
            $operate_info = M('bill_self_huikuan')->where('id='.$huikuan['parent_id'])->getField("operate_info").$this->getOperateInfo("审核通过");
            M('bill_self_huikuan')->where('id='.$huikuan['parent_id'])->setField('had_amount',$hadAmountNow);
            M('bill_self_huikuan')->where('id='.$huikuan['parent_id'])->setField('operate_info',$operate_info);
            $this->accountPayMoney($id);
            return $this->ok();

        }
        if($type=='return'&& $statusNow==FIdConst::SELF_HUIKUAN_STATUS_VERIFY_PASSED){
            if($this->accountReturnMoney($id)){
                //反审核
                $huikuanSub_db->where('id='.$id)->save(array('status'=>FIdConst::SELF_HUIKUAN_STATUS_2VERIFY));
                $hadAmountNow=$hadAmount-$huikuan['huikuan_num'];
                $operate_info = $huikuan_db->where('id='.$huikuan['parent_id'])->getField("operate_info").$this->getOperateInfo("反审核通过");
                $huikuan_db->where('id='.$huikuan['parent_id'])->setField('had_amount',$hadAmountNow);
                $huikuan_db->where('id='.$huikuan['parent_id'])->setField('operate_info',$operate_info);
                return $this->ok();
            }else
                return $this->bad('账户余额不足，无法进行反审核操作');
        }
    }

    /**
     * 审核通过，加相应账户的资金
     * @author qianwenwei
     * @param $id  回款单id
     * @return bool
     *
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
     * @param $id  回款单id
     * @return bool
     * *
     */
    public function accountReturnMoney($id){
        //实例化模型
        $huikuanSub_db=M('bill_self_huikuan_sub');
        $account_db=M('info_bank_account');

        $bds = new BankDepositService();

        //获取付款单信息
        $bill=$huikuanSub_db->where('id='.$id)->find();
        //获取账户及金额
        $account=$bill['huikuan_account'];
        $money=$bill['sum_kaipiao_money'];
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
                    if($bds->newBankIODetaillList("自销回款单-反审核",FIdConst::SELF_HUIKUAN_BILL_REVERT_VERIFY,$account,"对应单号：".$bill['bill_code'],-$money)){
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

}
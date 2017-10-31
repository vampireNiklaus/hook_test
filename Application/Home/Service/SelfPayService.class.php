<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;

/**
 * 自销付款单Service
 *
 * @author RCG
 */
class SelfPayService extends PSIBaseService {
    private $LOG_CATEGORY = "业务流程信息-付款单信息";

    public function editSelfPay($params,$isParent,$isFund){
        //编辑付款单
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfPay_db = M('bill_self_pay');
        if($isFund){
            //只要修改打款日期跟note
            $data['fund_date']=$params['fund_date'];
            $data['note']=$params['note'];
            $data['status']=FIdConst::SELF_PAY_STATUS_FUND_PASSED;
        }else{
            //获取支付金额
            $needPay=$selfPay_db->where('id='.$params['id'])->getField('sum_pay_money');
            if((string)($params['pay_1st_amount']+$params['pay_2nd_amount'])!=(string)($needPay+0)){
                return $this->bad('付款金额不等于买货金额');
            }else{
                //存储   状态变为已编辑
                $data['pay_1st_account']=$params['pay_1st_account_id'];
                $data['pay_1st_amount']=$params['pay_1st_amount'];
                if($params['pay_2nd_amount']>0){
                    $data['pay_2nd_account']=$params['pay_2nd_account_id'];
                    $data['pay_2nd_amount']=$params['pay_2nd_amount'];
                }else{
                    $data['pay_2nd_account']='';
                    $data['pay_2nd_amount']=0;
                }
                //未编辑的设置状态，修改的就不设置状态了
                $data['status']=FIdConst::SELF_PAY_STATUS_2FUND;
                $data['note']=$params['note'];
            }
            
        }
        $data['operate_info'] = $selfPay_db->where("id=".$params['id'])->getField("operate_info").$this->getOperateInfo("编辑自销付款单");
        $selfPay_db->where('id='.$params['id'])->save($data);
        return $this->ok($params['id']);
    }

    /*
     * 获取自销采购单列表
     */

    public function listSelfPayUnEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfPay_db = M('bill_self_pay');
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
//        $whereStr = $this->likeSearch($params);
        $count = $selfPay_db
            ->alias('sp')
            ->join('info_drug AS idr ON idr.id=sp.drug_id')
            ->join('info_supplier AS isu ON isu.id=sp.supplier_id')
            ->where("sp.status=0 AND idr.common_name like '%".$params['common_name']."%' AND sp.bill_code like '%".$params['bill_code']."%'")
            ->count();
        $all_data = $selfPay_db
            ->alias('sp')
            ->join('info_drug AS idr ON idr.id=sp.drug_id')
            ->join('info_supplier AS isu ON isu.id=sp.supplier_id')
            ->join('info_supplier AS isu2 ON isu2.id=sp.kpgs_id')
            ->join('bill_self_purchase AS spu ON spu.id=sp.buy_bill_id')
            ->where("sp.status=0 AND idr.common_name like '%".$params['common_name']."%' AND sp.bill_code like '%".$params['bill_code']."%'")
            ->field('sp.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.manufacturer,isu.name supplier_name,isu2.name kpgs_name
                ,spu.bill_code buy_bill_code')
            ->page($page,$limit)
            ->select();

        //数据处理
        foreach ($all_data as $k=>$v){
            $all_data[$k]['status_str']='<span style="color:red">未编辑</span>';
        }
        return array(
            "selfPayList" => $all_data,
            "totalCount" => $count
        );
    }

    public function listSelfPayEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfPay_db = M('bill_self_pay');
        $status = $params['status'];
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
//        $whereStr = $this->likeSearch($params);
        if ($status == -1) {
            $where = "sp.status <> 0 AND idr.common_name like '%".$params['common_name']."%' AND sp.bill_code like '%".$params['bill_code']."%'";
        } else {
            $where = "sp.status = '".$status."' AND idr.common_name like '%".$params['common_name']."%' AND sp.bill_code like '%".$params['bill_code']."%'";
        }
        $count = $selfPay_db
            ->alias('sp')
            ->join('info_drug AS idr ON idr.id=sp.drug_id')
            ->join('info_supplier AS isu ON isu.id=sp.supplier_id')
            ->join('bill_self_purchase AS spu ON spu.id=sp.buy_bill_id')
            ->join('info_bank_account AS iba ON iba.id=sp.pay_1st_account')
            ->join('LEFT JOIN info_bank_account AS iba2 ON iba2.id=sp.pay_2nd_account')
            ->where($where)
            ->count();
        $all_data = $selfPay_db
            ->alias('sp')
            ->join('info_drug AS idr ON idr.id=sp.drug_id')
            ->join('info_supplier AS isu ON isu.id=sp.supplier_id')
            ->join('info_supplier AS isu2 ON isu2.id=sp.kpgs_id')
            ->join('bill_self_purchase AS spu ON spu.id=sp.buy_bill_id')
            ->join('info_bank_account AS iba ON iba.id=sp.pay_1st_account')
            ->join('LEFT JOIN info_bank_account AS iba2 ON iba2.id=sp.pay_2nd_account')
            ->where($where)
            ->field('sp.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.manufacturer,isu.name supplier_name,isu2.name kpgs_name
            ,spu.bill_code buy_bill_code,iba.account_name pay_1st_account_name,iba.account_num pay_1st_account_num
            ,iba2.account_name pay_2nd_account_name,iba2.account_num pay_2nd_account_num')
            ->order('status asc')
            ->page($page,$limit)
            ->select();

        //数据处理
        foreach ($all_data as $k=>$v){
            $all_data[$k]['pay_1st_account_str']=$v['pay_1st_account_name'].' 卡号：'.$v['pay_1st_account_num'];
            $all_data[$k]['pay_2nd_account_str']=$v['pay_2nd_account_name']==null?'':$v['pay_2nd_account_name'].' 卡号：'.$v['pay_2nd_account_num'];
            $all_data[$k]['fund_date']= $v['fund_date']=='0000-00-00'?'':$v['fund_date'];
            switch ($v['status']){
                case FIdConst::SELF_PAY_STATUS_2FUND:
                    $all_data[$k]['status_str']='<span style="color:red">待打款</span>';
                    break;
                case FIdConst::SELF_PAY_STATUS_FUND_DENIED:
                    $all_data[$k]['status_str']='<span style="color:#DA8500">未通过打款</span>';
                    break;
                case FIdConst::SELF_PAY_STATUS_FUND_PASSED:
                    $all_data[$k]['status_str']='<span style="color:#1A1EA5">已打款，待复核</span>';
                    break;
                case FIdConst::SELF_PAY_STATUS_VERIFY_PASSED:
                    $all_data[$k]['status_str']='<span style="color:#189E09">复核通过</span>';
                    break;
                case FIdConst::SELF_PAY_STATUS_VERIFY_DENIED:
                    $all_data[$k]['status_str']='<span style="color:#DA8500">未通过复核</span>';
                    break;
                case FIdConst::SELF_PAY_STATUS_STOCK_BACK:
                    $all_data[$k]['status_str']='<span style="color:#505050">入库单被撤回</span>';
                    break;
            }
        }
        return array(
            "selfPayList" => $all_data,
            "totalCount" => $count
        );
    }

    public function deleteSelfPay($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db = M("bill_self_pay");
        $data = $db->where('id='.$params)->find();
        if(!$data){
            return $this->bad("要删除的采购单信息不存在");
        }
        if($data['status']==0||$data['status']==2){
            //设置对应采购单的状态为未通过
            M('bill_self_purchase')->where('id='.$data['buy_bill_id'])->save(array('status'=>2));
            $result = $db->where('id='.$params)->delete();
            if($result){
                $log = "删除付款单信息： 付款单单号：{$data['bill_code']}";
                $bs = new BizlogService();
                $bs->insertBizlog($log, $this->LOG_CATEGORY);
            }
            return $this->ok();
        }else{
            return $this->bad('无法删除');
        }
    }

    /**
     * 修改自销付款单状态，审核与反审核
     */
    public function selfPayStatus($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        //获得付款单id
        $id = $params["id"];
        //获得当前操作类型 审核通过-审核不通过-反审核
        $type = $params["type"];
        //实例化付款单模型
        $db = M('bill_self_pay');
        $db->startTrans();
        //获取当前付款单
        $io=$db->where('id='.$id)->find();
        //获取付款单当前状态
        $statusNow=$io['status']+0;

        try{
            //审核不通过操作
            if($type=='no'){
                $data['verifier_id']=session('loginUserId');
                switch ($statusNow){
                    case FIdConst::SELF_PAY_STATUS_2FUND:
                        //付款单已编辑，待打款状态下的审核不通过，进入未通过打款状态
                        $data['status']=FIdConst::SELF_PAY_STATUS_FUND_DENIED;
                        break;
                    case FIdConst::SELF_PAY_STATUS_FUND_PASSED:
                        //已打款待复核状态下的审核不通过，进入未通过复核状态
                        $data['status']=FIdConst::SELF_PAY_STATUS_VERIFY_DENIED;
                        break;
                }
                $db->where('id='.$id)->save($data);
                $db->commit();
                return $this->ok($id);
            }

            //审核通过操作
            if($type=='yes'){
                $data['verifier_id']=session('loginUserId');
                switch ($statusNow){
                    case FIdConst::SELF_PAY_STATUS_2FUND:
                    case FIdConst::SELF_PAY_STATUS_FUND_DENIED:
                        //付款单已编辑待打款状态 或 未通过打款状态 下的审核通过，进入已打款待复核状态
                        $data['status']=FIdConst::SELF_PAY_STATUS_FUND_PASSED;
                        $db->where('id='.$id)->save($data);
                        $db->commit();
                        break;
                    case FIdConst::SELF_PAY_STATUS_FUND_PASSED:
                    case FIdConst::SELF_PAY_STATUS_VERIFY_DENIED:
                    case FIdConst::SELF_PAY_STATUS_STOCK_BACK:
                        //已打款待复核状态 或 复核未通过状态 或 入库单被撤回 下的审核通过，进入已通过复核状态
                        $data['status']=FIdConst::SELF_PAY_STATUS_VERIFY_PASSED;
                        //先把账户资金修改了，返回false表示有账户资金不足
                        $pay_result=$this->accountPayMoney($id);
                        if($pay_result===true){
                            $db->where('id='.$id)->save($data);
                            //生成入库单,修改状态了之后再调用
//                        $this->createSelfStock($id);
                            $this->createSelfStockKaiPiao($id);
                            $db->commit();
                            break;
                        }elseif($pay_result==='account_1')
                            return $this->bad('主付账户余额不足，无法通过审核');
                        elseif ($pay_result==='account_2')
                            return $this->bad('次付账户余额不足，无法通过审核');
                }
                return $this->ok($id);
            }

            //反审核操作
            if($type=='return'){
                $data['verifier_id']=session('loginUserId');
                switch ($statusNow){
                    case FIdConst::SELF_PAY_STATUS_FUND_PASSED:
                        //已打款待复核状态下的反审核，状态变为 未通过打款状态
                        $data['status']=FIdConst::SELF_PAY_STATUS_FUND_DENIED;
                        break;
                    case FIdConst::SELF_PAY_STATUS_VERIFY_PASSED:
                        //已审核且生成了开票入库单的反审核，先判断是否可以反审核，可以的话状态修改为审核未通过
                        if($this->beforeVerifyReturn($id)){
                            //可以反审核
                            $data['status']=FIdConst::SELF_PAY_STATUS_VERIFY_DENIED;
                            //资金回流
                            $this->accountReturnMoney($id);
                        }
                        else
                            return $this->bad('该付款单已被引用，无法进行反审核操作');
                        break;
                }
                //反审核
                $db->where('id='.$id)->save($data);
                $db->commit();
                return $this->ok($id);

            }
        }catch (Exception $e){
            $db->rollback();
            return $this->bad();
        }

    }

//    /**
//     * 审核通过，生成入库单
//     * @param $id
//     */
//    public function createSelfStock($id){
//        $pay=M('bill_self_pay')->where('id='.$id)->find();
//        if($pay['status']==FIdConst::SELF_PAY_STATUS_VERIFY_PASSED){
//            //采购单已审核，生成付款单
//            $data['drug_id']=$pay['drug_id'];
//            $data['pay_bill_id']=$pay['id'];
//            $data['supplier_id']=$pay['supplier_id'];
//            $data['stock_amount']=$pay['pay_amount'];
//
//            $data['create_time']=time();
//            $data['bill_code']='BSST'.date('YmdHis');
//            $data['status']=FIdConst::SELF_STOCK_STATUS_2STOCK;
//
//            return M('bill_self_stock')->add($data);
//        }else
//            return false;
//    }

    /**
     * 审核通过，生成开票入库单
     * @author qianwenwei
     * @param $id
     * @return bool|mixed
     * *
     */
    public function createSelfStockKaiPiao($id){
        $pay=M('bill_self_pay')->where('id='.$id)->find();
        $buy = M('bill_self_purchase')->where("id=".$pay['buy_bill_id'])->getField("bill_code");
        if($pay['status']==FIdConst::SELF_PAY_STATUS_VERIFY_PASSED){
            //采购单已审核，生成付款单
            $data['drug_id']=$pay['drug_id'];
            $data['pay_bill_code']=$pay['bill_code'];
            $data['pay_bill_id']=$pay['id'];
            $data['supplier_id']=$pay['supplier_id'];
            $data['stock_amount']=$pay['pay_amount'];
            $data['buy_bill_code']=$pay['buy_bill_code'];
            $data['buy_date']=$pay['buy_date'];
            $data['create_time']=time();
            $data['bill_code']='BSSTKP'.date('YmdHis');
            $data['status']=FIdConst::SELF_STOCK_STATUS_2STOCK;
            return M('bill_self_stock_kaipiao')->add($data);
        }else
            return false;
    }

    /**
     * 判断是否能进行反审核操作,可以的话先删除相关入库单
     * @param $id 要进行反审核操作的付款单id
     * @return boolean
     */
    public function beforeVerifyReturn($id){
        //入开票公司的单子一单已经部分入库了，那么久不能够反审核了
        $pay_bill_id  = M("bill_self_pay")->where("id=".$id)->getField("id");
        $kaipiaoStock = M("bill_self_stock_kaipiao")->where("pay_bill_id=".$pay_bill_id)->find();
        if($kaipiaoStock['had_amount']>0){
            return false;
        }else{
            //相应删除对应的入开票单和其子单
            M("bill_self_stock_kaipiao")->where("id=".$kaipiaoStock['id'])->delete();
            M("bill_self_stock_kaipiao_sub")->where("parent_id=".$kaipiaoStock['id'])->delete();
            return true;
        }

    }

    /**
     * 审核通过，扣除相应账户的资金
     * @author qianwenwei
     * @param $id  付款单id
     * @return bool|string
     * *
     */
    public function accountPayMoney($id){
        //实例化模型
        $pay_db=M('bill_self_pay');
        $account_db=M('info_bank_account');

        $bds = new BankDepositService();
        //账户是否需要和可以扣
        $account_1_can=false;
        $account_2_can=false;
        //获取付款单信息
        $bill=$pay_db->where('id='.$id)->find();
        //获取两个账户及金额
        $account_1=$bill['pay_1st_account'];
        $money_1=$bill['pay_1st_amount'];
        $account_2=$bill['pay_2nd_account'];
        $money_2=$bill['pay_2nd_amount'];
        //判断账户1是否有足够的余额
        if($money_1>0&&$account_1>0){
            //判断账户2是否有足够的余额
            $account_1_money=$account_db->where('id='.$account_1)->getField('now_money');
            if($account_1_money<$money_1)
                return 'account_1';
            else
                $account_1_can=true;
        }
        //判断是否需要账户2
        if($money_2>0&&$account_2>0){
            //判断账户2是否有足够的余额
            $account_2_money=$account_db->where('id='.$account_2)->getField('now_money');
            if($account_2_money<$money_2)
                return 'account_2';
            else
                $account_2_can=true;
        }

        $account_db->startTrans();

        try{
            //这里开始扣钱
            if($account_1_can){
                $data_1['now_money']=$account_1_money-$money_1;
                $account_db->where('id='.$account_1)->save($data_1);
                if($account_2_can){
                    $data_2['now_money']=$account_2_money-$money_2;
                    $account_db->where('id='.$account_2)->save($data_2);
                }
                if($bds->newBankIODetaillList("自销付款单-审核",FIdConst::SELF_PAY,$account_1,"主付款账户：对应单号：".$bill['bill_code'],-$money_1)&&
                    $bds->newBankIODetaillList("自销付款单-审核",FIdConst::SELF_PAY,$account_2,"次付款账户：对应单据信息：".$bill['bill_code'],-$money_2)){
                    $account_db->commit();
                    return true;
                }
            }
        }catch (Exception $e){
            $account_db ->rollback();
            return false;
        }

    }

    /**
     * 反审核，资金回流
     * @author qianwenwei
     * @param $id   付款单id
     * @return bool
     * *
     */
    public function accountReturnMoney($id){
        //实例化模型
        $pay_db=M('bill_self_pay');
        $account_db=M('info_bank_account');
        $bds = new BankDepositService();

        //获取付款单信息
        $bill=$pay_db->where('id='.$id)->find();
        //获取两个账户及金额
        $account_1=$bill['pay_1st_account'];
        $money_1=$bill['pay_1st_amount'];
        $account_2=$bill['pay_2nd_account'];
        $money_2=$bill['pay_2nd_amount'];
        //更新余额
        $account_db->startTrans();
        try{
            if($account_1>0&&$money_1>0){
                $account_1_money=$account_db->where('id='.$account_1)->getField('now_money');
                $data_1['now_money']=$account_1_money+$money_1;
                $account_db->where('id='.$account_1)->save($data_1);
            }
            if($account_2>0&&$money_2>0){
                $account_2_money=$account_db->where('id='.$account_2)->getField('now_money');
                $data_2['now_money']=$account_2_money+$money_2;
                $account_db->where('id='.$account_2)->save($data_2);
            }

            if($bds->newBankIODetaillList("自销付款单-反审核",FIdConst::SELF_PAY_BILL_REVERT_VERIFY,$account_1,"主收款账户：对应单号：".$bill['bill_code'],$money_1)&&
                $bds->newBankIODetaillList("自销付款单-反审核",FIdConst::SELF_PAY_BILL_REVERT_VERIFY,$account_2,"次收付款账户：对应单据信息：".$bill['bill_code'],$money_2)){
                $account_db->commit();
                return true;
            }
        }catch (Exception $e){
            $account_db->rollback();
            return false;
        }

    }
}
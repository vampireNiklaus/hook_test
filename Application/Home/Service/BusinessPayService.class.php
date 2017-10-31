<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;
use Home\Service\SMSService;

/**
 * 业务支付Service
 *
 * @author RCG
 */
class BusinessPayService extends PSIBaseService {
    //获取新添加未确认的业务支付记录
    public function getNewBusinessPay($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
//        $page = $params['page'];
//        $limit = $params['limit'];
//        import("ORG.Util.Page");

        $businessPay_db = M('bill_business_pay');
        $dateWhere = "";
        if($params['bill_date_from']&&$params['bill_date_to']){
            $dateWhere = " and ds.bill_date between '".$params['bill_date_from']."' and '".$params['bill_date_to']."'";
            unset($params['bill_date_to']);
            unset($params['bill_date_from']);
        }elseif($params['bill_date_from']){
            $dateWhere = " and ds.bill_date >= '".$params['bill_date_from']."'";
            unset($params['bill_date_from']);
        }elseif($params['bill_date_to']){
            $dateWhere = " and ds.bill_date <= '".$params['bill_date_to']."'";
            unset($params[' and bill_date_to']);
        }

        if (session('loginUserId') != FIdConst::ADMIN_USER_ID) {
           $employeeIds = $this->employeeFilter();
            $where  = " ie.name like'"."%".$params['employee_name']."%' and ds.status like'"."%".$params['status']."%' ".$dateWhere." and employee_id in (".$employeeIds.")";
        } else {
            $where  = " ie.name like'"."%".$params['employee_name']."%' and ds.status like'"."%".$params['status']."%' ".$dateWhere;
        }


        $count=$businessPay_db
            ->alias('ds')
            ->join('LEFT JOIN info_employee AS ie ON ds.employee_id=ie.id')
            ->where($where)
            ->count();
        $all_data = $businessPay_db
            ->alias('ds')
            ->join('LEFT JOIN info_employee AS ie ON ds.employee_id=ie.id')
            ->join('LEFT JOIN info_bank_account AS ib ON ds.pay_account_id=ib.id')
            ->field('ds.*,ie.name employee_name,ie.bank_account as employee_bank_account,ib.account_name pay_account_name,ib.account_num pay_account_num')
            ->where($where)
//            ->page($page,$limit)
            ->select();
        return array(
            "all_data" => $all_data,
            "totalCount" => $count
        );
    }
    //添加新的待付款业务支付单
    public function editBusinessPay($params){
        $dailySell_db=M('bill_daily_sell');
        $businessPay_db=M('bill_business_pay');
        $account_id=$params['account_id'];
        $bill_date=$params['bill_date'];
        $search_date_to=$params['search_date_to'];
        $search_date_from=$params['search_date_from'];
        $edit_id=$params['edit_id'];
        $select=$params['select'];
        $data=array();
        //传入的参数为需要编辑的 daily_sell id数组
        foreach($select as $v){
            $sell=$dailySell_db->where('id='.$v)->find();
            $data['pay_amount']+=$sell['employee_profit']*$sell['sell_amount'];
        }
        $data['employee_id']=$sell['employee_id'];
        $data['pay_account_id']=$account_id;
        $data['bill_date']=$bill_date;
        $data['bill_code']='BUPA-'.date('YmdHis');
        $data['status']=0;
        $data['create_time']=time();
//        $data['pay_month']=substr($sell['sell_date'],0,7);
        $data['pay_month']=$params['pay_month'];

        //加入数据库
        if($edit_id){
            $data['operate_info']= $businessPay_db->where('id='.$edit_id)->getField("operate_info").$this->getOperateInfo("编辑条目");
            $businessPay_db->where('id='.$edit_id)->save($data);
            $bp_id=$edit_id;
        }else{
            $data['operate_info']= $this->getOperateInfo("新建条目");
            $bp_id=$businessPay_db->add($data);
        }

        //先设置所有的都为未匹配
        if($edit_id){
            $dailySell_db->where('paybill_id='.$edit_id)->save(
                array(
                    'paybill_id'=>'0',
                    'status'=>FIdConst::DAILY_SELL_STATUS_CONFIRMED
                )
            );
        }

        foreach ($select as $v2){
            $dailySell_db->where('id='.$v2)->save(
                array(
                    'paybill_id'=>$bp_id, 
                    'status'=>FIdConst::DAILY_SELL_STATUS_CONFIRMED_TOPAY
                )
            );
        }
        $result = $this->ok($bp_id);
        return $result;
    }
    //根据指定id 获取对应dailysell
    public function getDailySellById($id){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $dailySellModel=M('bill_daily_sell');
        $all_data=$dailySellModel
            ->where("paybill_id=".$id)
            ->field("*,GROUP_CONCAT(id) sell_id_list,convert(sum(employee_profit*sell_amount),decimal(20,2)) pay_sum_money,sum(sell_amount) sell_amount,DATE_FORMAT(sell_date,'%Y-%m') sell_month")
            ->group('drug_id,hospital_id,employee_des,sell_month')
            ->select();
        
        return array(
            "all_data" => $all_data,
        );
    }
    /**
     * 删除支付单
     * @params $list 要删除的单子id数组
     */
    public function deleteBusinessPay($list){
        if(count($list)>0){
            $businessPay_db=M('bill_business_pay');
            $dailySell_db=M('bill_daily_sell');
            $businessPay_db->startTrans();
            $dailySell_db->startTrans();
            try{
                foreach ($list as $k=>$v){
                    //判断businessPay的状态是否为待确认
                    if($businessPay_db->where('id='.$v)->getField('status')==FIdConst::BUSINESS_PAY_STATUS_TOPAY){
                        //找出dailySell子单，状态修改未匹配
                        $setField=array(
                            'status'=>FIdConst::DAILY_SELL_STATUS_CONFIRMED,
                            'paybill_id'=>""
                        );
                        $dailySell_db->where('paybill_id='.$v)->setField($setField);
                        //删除父单
                        $businessPay_db->where('id='.$v)->delete();
                    }elseif($businessPay_db->where('id='.$v)->getField('status')==FIdConst::BUSINESS_PAY_STATUS_PAIED){
                        return $this->bad("已支付条目必须先反审核才可以删除！！");
                    }

                }
            }catch ( Exception $e){
                $businessPay_db->rollback();
                $dailySell_db->rollback();
            }
            $businessPay_db->commit();
            $dailySell_db->commit();
            return $this->ok();
        }
    }
    /**
     * 审核与反审核
     * @params $list 传入要操作的
     */
    public function businessPayStatus($list,$type,$sms_enable){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        //能否修改，一定要list中的所有对应记录都能修改
//        $canChange=true;
//        $status=null;
        //本来打算前端可以多选的，但不适合，因为要判断银行卡余额是否充足
        $id=$list[0];//如果打算处理多选，使用循环

        $db = M('bill_business_pay');
        $dailySell_db = M('bill_daily_sell');

        $flag  = false;
        $msg = "";

        $db->startTrans();
        $dailySell_db->startTrans();
        try{
            $statusNow=$db->where('id='.$id)->getField('status');
            if($type=='no' && $statusNow==FIdConst::BUSINESS_PAY_STATUS_TOPAY){

            }
            if($type=='yes' && $statusNow==FIdConst::BUSINESS_PAY_STATUS_TOPAY){
                $pay_success=$this->accountPayMoney($id);
                if($pay_success){
                    //支付成功
                    $db->where('id='.$id)->setField('status',FIdConst::BUSINESS_PAY_STATUS_PAIED);
                    $payTime =$db->where('id='.$id)->getField('bill_date');
                    $dailySell_db->where('paybill_id='.$id)->setField('status',FIdConst::DAILY_SELL_STATUS_PAIED);
                    $dailySell_db->where('paybill_id='.$id)->setField('pay_time',$payTime);
                    $dailySell_db->where('paybill_id='.$id)->setField('if_paid',1);

                    $flag = true;
                }else{
                    $flag = false;
                    $msg = '账户余额不足，审核失败！';
                }
            }
            if($type=='return'){
                $this->accountReturnMoney($id);
                $db->where('id='.$id)->setField('status',FIdConst::BUSINESS_PAY_STATUS_TOPAY);
                $dailySell_db->where('paybill_id='.$id)->setField('status',FIdConst::DAILY_SELL_STATUS_CONFIRMED_TOPAY);
                $flag = true;
            }
        }catch(Exception $e){
            $flag = false;
            $msg = "操作数据库错误";
            $db->rollback();
            $dailySell_db->rollback();
        }
        $db->commit();
        $dailySell_db->commit();
        if($flag == true){
            if($sms_enable == 1){
                $smsService = new SMSService();
                $billContents = $db->where("id=".$id)->select();
                if(count($billContents)>0){
                    $billContent = $billContents[0];
                    $employees = M("info_employee")->where("id=".$billContent['employee_id'])->select();
                    if(count($employees)>0){
                        $employeeInfo = $employees[0];
                        $mobile = $employeeInfo['phone'];
//                    $mobile = "18768119456";
                        $sell_time = $billContent['pay_month'];
                        $pay_time = $billContent['bill_date'];
                        $content = $billContent['pay_amount'];
                        $smsResult = $smsService->sendSMS($mobile,$sell_time,$pay_time,$content);
                        if($smsResult['code'] == 0){
                            $msg = "付款通知已经发送到对方手机！";
                        }
                    }
                }
            }
            return $this->ok($msg);
        }else{
            return $this->bad($msg);
        }
    }


    /**
     * 审核通过，扣除相应账户的资金
     * @param $id 付款单id
     * @return true 说明扣钱成功，false 说明余额不足
     */
    public function accountPayMoney($id){
        //实例化模型
        $businessPay_db=M('bill_business_pay');
        $account_db=M('info_bank_account');
        $bds = new BankDepositService();

        //账户是否需要和可以扣
        $account_can=false;
        //获取付款单信息
        $bill=$businessPay_db->where('id='.$id)->find();
        //获取账户及金额
        $account=$bill['pay_account_id'];
        $pay_money=$bill['pay_amount'];
        //判断账户1是否有足够的余额
        if($pay_money>=0&&$account>0){
            //判断账户是否有足够的余额
            $account_money=$account_db->where('id='.$account)->getField('now_money');
            if($account_money<$pay_money)
                return false;
            else
                $account_can=true;
        }
        //这里开始扣钱
        if($account_can){
            $data['now_money']=$account_money-$pay_money;
            $data['operate_info'] = $account_db->where("id=".$account)->getField("operate_info").$this->getOperateInfo("业务支付审核资金操作，原有资金：$account_money"."操作金额：$pay_money");
            $account_db->startTrans();
            try{
                if($bds->newBankIODetaillList("业务支付单-审核",FIdConst::BUSINESS_PAY_VERIFY,$account,"付款账户：对应单号：".$bill['bill_code'],-$pay_money)){
                    $account_db->where('id='.$account)->save($data);
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
     * @param $id 付款单id
     */
    public function accountReturnMoney($id){
        //实例化模型
        $businessPay_db=M('bill_business_pay');
        $account_db=M('info_bank_account');
        $bds = new BankDepositService();

        //获取付款单信息
        $bill=$businessPay_db->where('id='.$id)->find();
        //获取账户及金额
        $account=$bill['pay_account_id'];
        $pay_money=$bill['pay_amount'];
        //更新余额
        if($account>0&&$pay_money>=0){
            $account_money=$account_db->where('id='.$account)->getField('now_money');
            $data_1['now_money']=$account_money+$pay_money;
            $data_1['operate_info'] = $account_db->where("id=".$account)->getField("operate_info").$this->getOperateInfo("业务支付反审核资金操作，原有资金：$account_money"."操作金额：$pay_money");
            $account_db->startTrans();
            try{
                if($bds->newBankIODetaillList("业务支付单-反审核",FIdConst::BUSINESS_PAY_REVERT_VERIFY,$account,"对应单号：".$bill['bill_code'],$pay_money)){
                    $account_db->where('id='.$account)->save($data_1);
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
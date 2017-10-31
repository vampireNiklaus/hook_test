<?php
/**
 * User: RCG
 * Date: 2016/6/30 0030
 * Time: 14:25
 */

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;

/**
 * 账款管理Service
 *
 * @author RCG
 */
class CapitalManageService extends PSIBaseService {
    private $LOG_CATEGORY = "账款管理";

    /**
     * 其他收入支出单
     */
    public function getExtraBillList($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $db=M('bill_extra');
        $where = '';
        if($params['type']){
            $where = " bill_type = '".$params['type']."'";
        }
        $all_data=$db->join("left join info_drug as idr on idr.id= bill_extra.drug_id")->where($where)->field(" idr.common_name drug_name,idr.guige,idr.manufacturer, bill_extra.*")->select();
        return array(
            'extraBillList'=>$all_data
        );
    }

    public function editExtraBill($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $bill_extra_db = M("bill_extra");
        $type_db = M("type_billing");
        $type = $type_db->where('id='.$params['type_id'])->field('type,name')->find();
        $data['type_id']=$params['type_id'];
        $data['money']=$params['money'];
        $data['note']=$params['note'];
        $data['drug_id']=$params['drug_id'];
        $data['bank_account_id']=$params['bank_account_id'];
        $data['bank_account_name']=$params['bank_account_name'];
        $data['bank_account_num']=$params['bank_account_num'];
        $data['bill_type']=$type['type'];
        $data['type_name']=$type['name'];
        $data['yewu_date']=$params['yewu_date'];
        if($params['id']){
            //编辑调拨单
            $bill_extra_db->where('id='.$params['id'])->save($data);
        }else{
            $data['create_time']=time();
            $data['status']=0;
            //添加调拨单
            $bill_extra_db->add($data);
        }

        return $this->ok($params['id']);

    }

    public function deleteExtraBill($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        $bill_extra_db = M("bill_extra");
        $data = $bill_extra_db->where('id='.$params['id'])->find();
        if($data['status']==FIdConst::EXTRA_BILL_STATUS_VERIFY_PASSED){
            return $this->bad("该条目已通过审核，无法删除");
        }else{
            $bill_extra_db->where('id='.$params['id'])->delete();
            return $this->ok($params['id']);
        }

    }

    public function extraBillStatus($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $type = $params["type"];
        $bill_db = M('bill_extra');
        //能修改的条件
        $bill=$bill_db->where('id='.$id)->find();
        //当前状态
        $statusNow=$bill['status'];
        $bill_type=$bill['bill_type'];
        $bank_account_id=$bill['bank_account_id'];
        $money=$bill['money'];
        $data=array();
        $date=date('Y-m-d');
        $data['verify_date']=$date;
        $data['verify_id']=session("loginUserId");
        if( ($type=='no' && $statusNow==FIdConst::EXTRA_BILL_STATUS_2VERIFY) ||
            ($type=='return'&& $statusNow==FIdConst::EXTRA_BILL_STATUS_VERIFY_PASSED) ){
            //审核未通过
            $data['status']=FIdConst::EXTRA_BILL_STATUS_VERIFY_DENIED;
            //反审核，回款
            if($type=='return'){
                //获取对应账户余额
                $accountDB=M('info_bank_account');
                $now_money=$accountDB->where('id='.$bank_account_id)->getField('now_money');
                if($bill_type=='收入'){
                    $now_money-=$money;
                    if($now_money<0){
                        //付款账户余额不足
                        return $this->bad('退款账户余额不足');
                    }
                }elseif ($bill_type=='支出'){
                    $now_money+=$money;
                }
                $accountDB->where('id='.$bank_account_id)->setField('now_money',$now_money);
            }
        }
        if($type=='yes'&& ($statusNow==FIdConst::EXTRA_BILL_STATUS_2VERIFY
                ||$statusNow==FIdConst::EXTRA_BILL_STATUS_VERIFY_DENIED)){
            //审核通过，先判断是收入还是支出
            //获取对应账户余额
            $accountDB=M('info_bank_account');
            $now_money=$accountDB->where('id='.$bank_account_id)->getField('now_money');
            if($bill_type=='收入'){
                $now_money+=$money;
            }elseif ($bill_type=='支出'){
                $now_money-=$money;
                if($now_money<0){
                    //付款账户余额不足
                    return $this->bad('付款账户余额不足');
                }
            }
            $accountDB->where('id='.$bank_account_id)->setField('now_money',$now_money);
            $data['status']=FIdConst::EXTRA_BILL_STATUS_VERIFY_PASSED;
        }
        $bill_db->where('id='.$id)->save($data);
        return $this->ok($id);
    }

    public function getReceiptPayBillList($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $db=M('bill_receipt_pay');
        $all_data=$db->select();
        return array(
            'receiptPayBillList'=>$all_data
        );
    }
    
    public function editReceiptPayBill($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $bill_extra_db = M("bill_receipt_pay");
        $type_db = M("type_billing");
        $type = $type_db->where('id='.$params['type_id'])->field('type,name')->find();
        $data['type_id']=$params['type_id'];
        $data['money']=$params['money'];
        $data['note']=$params['note'];
        $data['bill_type']=$type['type'];
        $data['type_name']=$type['name'];
        if($params['id']){
            //编辑调拨单
            $bill_extra_db->where('id='.$params['id'])->save($data);
        }else{
            $data['create_time']=time();
            $data['status']=0;
            //添加调拨单
            $bill_extra_db->add($data);
        }

        return $this->ok($params['id']);

    }

    public function deleteReceiptPayBill($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        $bill_extra_db = M("bill_receipt_pay");
        $data = $bill_extra_db->where('id='.$params['id'])->find();
        if($data['status']==FIdConst::RECEIPT_PAY_BILL_STATUS_VERIFY_PASSED){
            return $this->bad("该条目已通过审核，无法删除");
        }else{
            $bill_extra_db->where('id='.$params['id'])->delete();
            return $this->ok($params['id']);
        }

    }

    public function receiptPayBillStatus($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $type = $params["type"];
        $bill_db = M('bill_receipt_pay');
        //能修改的条件
        $bill=$bill_db->where('id='.$id)->find();
        //当前状态
        $statusNow=$bill['status'];
        $bill_type=$bill['bill_type'];
        $data=array();
        $date=date('Y-m-d');
        $data['verify_date']=$date;
        $data['verify_id']=session("loginUserId");
        if( ($type=='no' && $statusNow==FIdConst::RECEIPT_PAY_BILL_STATUS_2VERIFY) ||
            ($type=='return'&& $statusNow==FIdConst::RECEIPT_PAY_BILL_STATUS_VERIFY_PASSED) ){
            //审核未通过
            $data['status']=FIdConst::RECEIPT_PAY_BILL_STATUS_VERIFY_DENIED;
        }
        if($type=='yes'&& ($statusNow==FIdConst::RECEIPT_PAY_BILL_STATUS_2VERIFY
                ||$statusNow==FIdConst::RECEIPT_PAY_BILL_STATUS_VERIFY_DENIED)){
            //审核通过，先判断是收入还是支出
            $data['status']=FIdConst::RECEIPT_PAY_BILL_STATUS_VERIFY_PASSED;
        }
        $bill_db->where('id='.$id)->save($data);
        return $this->ok($id);
    }

}
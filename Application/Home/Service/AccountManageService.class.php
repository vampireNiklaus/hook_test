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
class AccountManageService extends PSIBaseService {
    private $LOG_CATEGORY = "账款管理";

    /**
     * 其他收入支出单
     */
    public function getExtraBillList($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $db=M('extra_bill');
        $all_data=$db->select();
        return array(
            'extraBillList'=>$all_data
        );
    }

    public function editExtraBill($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $extra_bill_db = M("extra_bill");
        $type_db = M("type_billing");
        $type = $type_db->where('id='.$params['type_id'])->field('type,name')->find();
        $data['type_id']=$params['type_id'];
        $data['money']=$params['money'];
        $data['note']=$params['note'];
        $data['bill_type']=$type['type'];
        $data['type_name']=$type['name'];
        if($params['id']){
            //编辑调拨单
            $extra_bill_db->where('id='.$params['id'])->save($data);
        }else{
            $data['create_time']=time();
            $data['status']=0;
            //添加调拨单
            $extra_bill_db->add($data);
        }

        return $this->ok($params['id']);

    }

    public function deleteExtraBill($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        $extra_bill_db = M("extra_bill");
        $data = $extra_bill_db->where('id='.$params['id'])->find();
        if($data['status']==FIdConst::EXTRA_BILL_STATUS_VERIFY_PASSED){
            return $this->bad("该条目已通过审核，无法删除");
        }else{
            $extra_bill_db->where('id='.$params['id'])->delete();
            return $this->ok($params['id']);
        }

    }

    public function extraBillStatus($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $type = $params["type"];
        $bill_db = M('extra_bill');
        //能修改的条件
        $bill=$bill_db->where('id='.$id)->find();
        //当前状态
        $statusNow=$bill['status'];
        $data=array();
        $date=date('Y-m-d');
        $data['verify_date']=$date;
        $data['verify_id']=session("loginUserId");
        if( ($type=='no' && $statusNow==FIdConst::EXTRA_BILL_STATUS_2VERIFY) ||
            ($type=='return'&& $statusNow==FIdConst::EXTRA_BILL_STATUS_VERIFY_PASSED) ){
            //审核未通过
            $data['status']=FIdConst::EXTRA_BILL_STATUS_VERIFY_DENIED;
        }
        if($type=='yes'&& ($statusNow==FIdConst::EXTRA_BILL_STATUS_2VERIFY
                ||$statusNow==FIdConst::EXTRA_BILL_STATUS_VERIFY_DENIED)){
            $data['status']=FIdConst::EXTRA_BILL_STATUS_VERIFY_PASSED;
        }
        $bill_db->where('id='.$id)->save($data);
        return $this->ok($id);
    }

}
<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;

/**
 * 自销税票单Service
 *
 * @author RCG
 */
class SelfTaxService extends PSIBaseService
{
    private $LOG_CATEGORY = "业务流程信息-税票单信息";

    public function editSelfTax($params,$isParent,$isFund){
        //编辑税票单
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfTax_db    = M('bill_self_tax');
        $selfTaxSub_db = M('bill_self_tax_sub');
        $selfTax_db->startTrans();
        $selfTaxSub_db->startTrans();
        try {
            $data['tax_unit_price'] = $params['tax_unit_price'];
            $data['sum_tax_money']  = $params['sum_tax_money'];

            if($isFund) {
                //只要修改打款日期跟note
                $data['fund_date'] = $params['fund_date'];
                $data['note']      = $params['note'];
                $data['status']    = FIdConst::SELF_TAX_STATUS_FUND_PASSED;
            } else {
                $parent_id = $params['parent_id'];
                $taxId     = $parent_id == '' ? $params['id'] : $selfTaxSub_db->where('id=' . $params['id'])->getField('parent_id');
                $tax       = $selfTax_db->where('id=' . $taxId)->find();
                //剩余开票量
                $needTax = $tax['kaipiao_amount'] - $tax['amount_had_pay'];
                if($needTax < $params['kaipiao_num']) {
                    return $this->bad('开票数大于剩余开票数');
                } else {
                    //新建子税票单
                    $idService                   = new IdGenService();
                    $data['drug_id']             = $tax['drug_id'];
                    $data['parent_id']           = $tax['id'];
                    $data['supplier_id']         = $tax['supplier_id'];
                    $data['deliver_id']          = $tax['deliver_id'];
                    $data['kaipiao_unit_price']  = $params['kaipiao_unit_price'];
                    $data['kaipiao_num']         = $params['kaipiao_num'];
                    $data['sum_kaipiao_money']   = $params['kaipiao_unit_price'] * $data['kaipiao_num'];
                    $data['tax_danju_code']      = $params['tax_danju_code'];
                    $data['tax_shuipiao_code']   = $params['tax_shuipiao_code'];
                    $data['yewu_date']           = $params['yewu_date'];
                    $data['taxbill_create_date'] = $params['taxbill_create_date'];
                    $data['pay_account']         = $params['pay_account'];
                    $data['kaidan_ren']          = session('loginUserId');
                    $data['note']                = $params['note'];
                    $data['status']              = FIdConst::SELF_TAX_STATUS_2FUND;
                    $data['create_time']         = time();
                    $data['bill_code']           = "BSTA-S" . $idService->newId();
                }
            }
            if($isParent) {
                $data['operate_info'] = $this->getOperateInfo("新建子税票单");
                $selfTaxSub_db->add($data);
                //同时改变父税票单数量
//                $tax['amount_had_pay'] = $tax['amount_had_pay'] + $params['kaipiao_num'];
//                $selfTax_db->where('id=' . $params['id'])->setField('amount_had_pay',$tax['amount_had_pay']);
            } else {
                $data['operate_info'] = $selfTaxSub_db->where('id=' . $params['id'])->getField("operate_info") . $this->getOperateInfo("编辑子税票单");
                $selfTaxSub_db->where('id=' . $params['id'])->save($data);
            }
            $selfTaxSub_db->commit();

            return $this->ok($params['id']);
        } catch(Exception $e) {
            $selfTax_db->rollback();
            $selfTaxSub_db->rollback();

            return $this->bad();
        }

    }

    /*
     * 获取未编辑自销税票单列表
     */
    public function listSelfTaxUnEdit($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfTax_db = M('bill_self_tax');
        //分页信息
        $page  = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
        $count    = $selfTax_db->alias('st')->join('info_drug AS idr ON idr.id=st.drug_id')->join('info_supplier AS isu ON isu.id=st.supplier_id')->join('info_deliver AS ide ON ide.id=st.deliver_id')->join('bill_self_stock_sub AS sss ON sss.id=st.stock_sub_bill_id')->where("idr.common_name like '%" . $params['common_name'] . "%' AND st.bill_code like '%" . $params['bill_code'] . "%'")->count();
        $all_data = $selfTax_db->alias('st')->join('info_drug AS idr ON idr.id=st.drug_id')->join('info_supplier AS isu ON isu.id=st.supplier_id')->join('info_deliver AS ide ON ide.id=st.deliver_id')->join('bill_self_stock_sub AS sss ON sss.id=st.stock_sub_bill_id')->where("idr.common_name like '%" . $params['common_name'] . "%' AND st.bill_code like '%" . $params['bill_code'] . "%'")->field('st.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.manufacturer,isu.name supplier_name
                ,sss.bill_code stock_sub_bill_code,sss.instock_date,ide.name deliver_name')->page($page,$limit)->select();

        //数据处理
        foreach($all_data as $k => $v){
            $needAmount                  = $v['kaipiao_amount'] - $v['amount_had_pay'];
            $all_data[$k]['need_amount'] = $needAmount;
            $all_data[$k]['status_str']  = $needAmount == 0 ? "<span>已全部开票</span>" : "<span style='color: red'>待开票</span>";
        }

        return array("selfTaxList" => $all_data,"totalCount" => $count);
    }

    public function listSelfTaxEdit($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfTaxSub_db = M('bill_self_tax_sub');
        $page          = $params['page'];
        $start         = $params['start'];
        $limit         = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
        $count    = $selfTaxSub_db->alias('sts')->join('info_drug AS idr ON idr.id=sts.drug_id')->join('info_supplier AS isu ON isu.id=sts.supplier_id')->join('info_deliver AS ide ON ide.id=sts.deliver_id')->join('info_bank_account AS iba ON iba.id=sts.pay_account')->where("idr.common_name like '%" . $params['common_name'] . "%' AND sts.bill_code like '%" . $params['bill_code'] . "%'")->count();
        $all_data = $selfTaxSub_db->alias('sts')->join('info_drug AS idr ON idr.id=sts.drug_id')->join('info_supplier AS isu ON isu.id=sts.supplier_id')->join('info_deliver AS ide ON ide.id=sts.deliver_id')->join('info_bank_account AS iba ON iba.id=sts.pay_account')->where("idr.common_name like '%" . $params['common_name'] . "%' AND sts.bill_code like '%" . $params['bill_code'] . "%'")->field('sts.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.manufacturer,isu.name supplier_name,
                ide.name deliver_name,iba.account_name pay_account_name,iba.account_num pay_account_num')->order('status asc')->page($page,$limit)->select();

        //数据处理
        foreach($all_data as $k => $v){
            switch($v['status']) {
                case FIdConst::SELF_TAX_STATUS_2FUND:
                    $all_data[$k]['status_str'] = '<span style="color:red">待打款</span>';
                    break;
                case FIdConst::SELF_TAX_STATUS_FUND_DENIED:
                    $all_data[$k]['status_str'] = '<span style="color:#DA8500">未通过打款</span>';
                    break;
                case FIdConst::SELF_TAX_STATUS_FUND_PASSED:
                    $all_data[$k]['status_str'] = '<span style="color:#1A1EA5">已打款，待复核</span>';
                    break;
                case FIdConst::SELF_TAX_STATUS_VERIFY_PASSED:
                    $all_data[$k]['status_str'] = '<span style="color:#189E09">复核通过</span>';
                    break;
                case FIdConst::SELF_TAX_STATUS_VERIFY_DENIED:
                    $all_data[$k]['status_str'] = '<span style="color:#DA8500">未通过复核</span>';
                    break;
                case FIdConst::SELF_TAX_STATUS_HUIKUAN_BACK:
                    $all_data[$k]['status_str'] = '<span style="color:#505050">回款单被撤回</span>';
                    break;
            }
            $all_data[$k]['instock_date'] = M("bill_self_stock_sub")->where("id=" . (M("bill_self_tax")->where("id=" . $v['parent_id'])->getField("stock_sub_bill_id")))->getField("instock_date");
        }

        return array("selfTaxList" => $all_data,"totalCount" => $count);
    }

    /*
     * 根据子税票单id获取父税票单的入库数量信息
     */
    public function getTaxAmount($id){
        $p_id = M('bill_self_tax_sub')->where('id=' . $id)->getField('parent_id');
        $re   = M('bill_self_tax')->alias('bst')->join('bill_self_stock_sub sss ON sss.id=bst.stock_sub_bill_id')->where('bst.id=' . $p_id)->field('bst.kaipiao_amount,bst.amount_had_pay,sss.bill_code stock_sub_bill_code')->find();

        return array("stock_sub_bill_code" => $re['stock_sub_bill_code'],"kaipiao_amount" => $re['kaipiao_amount'],"need_amount" => $re['kaipiao_amount'] - $re['amount_had_pay']);
    }

    public function deleteSelfTax($id,$isSub){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db          = M("bill_self_tax");
        $stock_db    = M("bill_self_stock");
        $subDb       = M("bill_self_tax_sub");
        $stockSub_db = M('bill_self_stock_sub');
        $data        = $isSub ? $subDb->where('id=' . $id)->find() : $db->where('id=' . $id)->find();
        if(!$data) {
            return $this->bad("要删除的税票单信息不存在");
        }
        if(!$isSub) {
            //非子税票单，需要判断是否有子税票单是已审核状态，有的话就不能删除
            $sub       = $subDb->where('parent_id=' . $id . ' AND status=' . FIdConst::SELF_TAX_STATUS_VERIFY_PASSED)->find();
            $canDelete = $sub == NULL ? TRUE : FALSE;
        }
        try {
            //非子税票单
            if(!$isSub && $canDelete) {
                //设置对应入库单的状态为退回
                $stockSub_db->where('id=' . $data['stock_sub_bill_id'])->save(array('status' => FIdConst::SELF_STOCK_STATUS_TAX_BACK));
                //获取对应子入库单的库存量
                $stockSub = $stockSub_db->where('id=' . $data['stock_sub_bill_id'])->field('parent_id,stock_num')->find();
                //获取父入库单的已入库量
                $hadAmount     = $stock_db->where('id=' . $stockSub['parent_id'])->getField('had_amount');
                $hadAmountNow = $hadAmount - $stockSub['stock_num'];
                $stock_db->where('id=' . $stockSub['parent_id'])->setField('had_amount',$hadAmountNow);

                $result = $db->where('id=' . $id)->delete();
                //删除子单
                $subDb->where('parent_id=' . $id)->delete();
                if($result) {
                    $log = "删除税票单信息： 税票单单号：{$data['bill_code']}";
                    $bs  = new BizlogService();
                    $bs->insertBizlog($log,$this->LOG_CATEGORY);
                }
                $db->commit();
                $subDb->commit();
                $stock_db->commit();
                $stockSub_db->commit();

                return $this->ok();
            } elseif($isSub && ($data['status'] == FIdConst::SELF_TAX_STATUS_2FUND || $data['status'] == FIdConst::SELF_TAX_STATUS_FUND_DENIED || $data['status'] == FIdConst::SELF_TAX_STATUS_VERIFY_DENIED || $data['status'] == FIdConst::SELF_TAX_STATUS_HUIKUAN_BACK)) {
                //子税票单，状态为待审核和未通过打款，未通过复核的可以删除
                //删除子税票单的同时恢复父税票单的剩余开票数量
//                $son_data                      = $subDb->where('id=' . $id)->find();
//                $parent_data                   = $db->where('id=' . $son_data['parent_id'])->find();
//                $parent_data['amount_had_pay'] = $parent_data['amount_had_pay'] - $son_data['kaipiao_num'];
//                $db->where('id=' . $son_data['parent_id'])->setField('amount_had_pay',$parent_data['amount_had_pay']);

                $result = $subDb->where('id=' . $id)->delete();
                if($result) {
                    $log = "删除税票单信息： 税票单单号：{$data['bill_code']}";
                    $bs  = new BizlogService();
                    $bs->insertBizlog($log,$this->LOG_CATEGORY);
                }
                $db->commit();
                $subDb->commit();
                $stock_db->commit();
                $stockSub_db->commit();

                return $this->ok();
            } else {
                return $this->bad('已被引用，无法删除');
            }
        } catch(Exception $e) {
            $db->rollback();
            $subDb->rollback();
            $stock_db->rollback();
            $stockSub_db->rollback();
        }

    }

    /**
     * 修改自销税票单状态，审核与反审核
     */
    public function selfTaxStatus($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id        = $params["id"];
        $type      = $params["type"];
        $taxSub_db = M('bill_self_tax_sub');
        $tax_db    = M('bill_self_tax');
        //能修改的条件
        $tax = $taxSub_db->where('id=' . $id)->find();
        //当前状态
        $statusNow = $tax['status'] + 0;
        //审核不通过操作
        if($type == 'no') {
            //审核未通过
            $data['verifier_id'] = session('loginUserId');
            switch($statusNow) {
                case FIdConst::SELF_TAX_STATUS_2FUND:
                    //付款单已编辑，待打款状态下的审核不通过，进入未通过打款状态
                    $data['status'] = FIdConst::SELF_TAX_STATUS_FUND_DENIED;
                    break;
                case FIdConst::SELF_TAX_STATUS_FUND_PASSED:
                    //已打款待复核状态下的审核不通过，进入未通过复核状态
                    $data['status'] = FIdConst::SELF_TAX_STATUS_VERIFY_DENIED;
                    break;
            }
            $data['operate_info'] = $taxSub_db->where('id=' . $id)->getField("operate_info") . $this->getOperateInfo("审核未通过");
            $taxSub_db->where('id=' . $id)->save($data);

            return $this->ok($id);
        }
        //审核通过操作
        if($type == 'yes') {
            $data['verifier_id'] = session('loginUserId');
            switch($statusNow) {
                case FIdConst::SELF_TAX_STATUS_2FUND:
                case FIdConst::SELF_TAX_STATUS_FUND_DENIED:
                    //付款单已编辑待打款状态 或 未通过打款状态 下的审核通过，进入已打款待复核状态
                    $data['status'] = FIdConst::SELF_TAX_STATUS_FUND_PASSED;
                    $taxSub_db->where('id=' . $id)->save($data);
                    break;
                case FIdConst::SELF_TAX_STATUS_FUND_PASSED:
                case FIdConst::SELF_TAX_STATUS_VERIFY_DENIED:
                case FIdConst::SELF_TAX_STATUS_HUIKUAN_BACK:
                    //已打款待复核状态 或 复核未通过状态 或 回款单被撤回 下的审核通过，进入已通过复核状态
                    $data['status'] = FIdConst::SELF_TAX_STATUS_VERIFY_PASSED;
                    $taxParent      = $tax_db->where('id=' . $tax['parent_id'])->field('amount_had_pay,kaipiao_amount')->find();
                    $amount_had_pay = $taxParent['amount_had_pay'] + $tax['kaipiao_num'];
                    //先把账户资金修改了，返回false表示有账户资金不足
                    $pay_result = $this->accountPayMoney($id);
                    if($pay_result === TRUE) {
                        $tax_db->where('id='.$tax['parent_id'])->setField('amount_had_pay',$amount_had_pay);
                        $data['operate_info'] = $taxSub_db->where('id=' . $id)->getField("operate_info") . $this->getOperateInfo("审核通过，自动生成汇款单");
                        $taxSub_db->where('id=' . $id)->save($data);
                        //生成入库单,修改状态了之后再调用
                        $this->createSelfHuiKuan($id);
                        break;
                    } else {
                        return $this->bad('付款账户余额不足，无法通过审核');
                    }
            }

            return $this->ok($id);

        }
        if($type == 'return') {

            $data['verifier_id'] = session('loginUserId');
            switch($statusNow) {
                case FIdConst::SELF_TAX_STATUS_FUND_PASSED:
                    //已打款待复核状态下的反审核，状态变为 未通过打款状态
                    $data['status'] = FIdConst::SELF_PAY_STATUS_FUND_DENIED;
                    break;
                case FIdConst::SELF_TAX_STATUS_VERIFY_PASSED:
                    //已审核且生成了入库单的反审核，先判断是否可以反审核，可以的话状态修改为审核未通过
                    if($this->beforeVerifyReturn($id)) {
                        //可以反审核
                        $data['status'] = FIdConst::SELF_TAX_STATUS_VERIFY_DENIED;
                        $hadAmount      = M('bill_self_tax')->where('id=' . $tax['parent_id'])->getField('amount_had_pay');
                        $hadAmountNow=$hadAmount-$tax['kaipiao_num'];
                        $tax_db->where('id='.$tax['parent_id'])->setField('amount_had_pay',$hadAmountNow);
                        //资金回流
                        $this->accountReturnMoney($id);
                    } else
                        return $this->bad('该税票单已被引用，无法进行反审核操作');
                    break;
            }
            //反审核
            $data['operate_info'] = $taxSub_db->where('id=' . $id)->getField('operate_info') . $this->getOperateInfo("反审核成功！");
            $taxSub_db->where('id=' . $id)->save($data);

            return $this->ok($id);

        }

    }

    /**
     * 生成回款单
     * @author qianwenwei
     * @param $id
     * @return bool|mixed
     * *
     */
    protected function createSelfHuiKuan($id){
        $tax = M('bill_self_tax_sub')->where('id=' . $id)->find();
        if($tax['status'] == FIdConst::SELF_TAX_STATUS_VERIFY_PASSED) {
            //采购单已审核，生成税票单
            $data['drug_id']     = $tax['drug_id'];
            $data['tax_bill_id'] = $tax['id'];
            $data['supplier_id'] = $tax['supplier_id'];
            $data['deliver_id']  = $tax['deliver_id'];

            $data['kaipiao_unit_price'] = $tax['kaipiao_unit_price'];
            $data['huikuan_amount']     = $tax['kaipiao_num'];
            $data['sum_kaipiao_money']  = $data['kaipiao_unit_price'] * $data['huikuan_amount'];


            $data['had_amount']   = 0;
            $data['create_time']  = time();
            $data['bill_code']    = 'BSHK' . date('YmdHis');
            $data['operate_info'] = $this->getOperateInfo("子汇款单创建");

            return M('bill_self_huikuan')->add($data);
        } else
            return FALSE;
    }

    /**
     * 判断是否能进行反审核操作,可以的话先删除相关回款单
     * @param $id 要进行反审核操作的付款单id
     * @return boolean
     */
    public function beforeVerifyReturn($id){
        //实例化两个要用到的入库单模型
        $huikuan_db    = M('bill_self_huikuan');
        $huikuanSub_db = M('bill_self_huikuan_sub');
        //获取对应入库单id
        $huikuanId = $huikuan_db->where('tax_bill_id=' . $id)->getField('id');
        //获取对应子入库单中状态为已审核的数量
        $huikuanCount = $huikuanSub_db->where('parent_id=' . $huikuanId . ' AND status=' . FIdConst::SELF_HUIKUAN_STATUS_VERIFY_PASSED)->count();
        if($huikuanCount == 0) {
            //数量为0，说明没有审核通过的，返回真表示可以反审核
            //删除对应的入库单
            $huikuan_db->where('tax_bill_id=' . $id)->delete();
            $huikuanSub_db->where('parent_id=' . $huikuanId)->delete();

            return TRUE;
        } elseif($huikuanCount > 0) {
            //不能反审核，返回假
            return FALSE;
        }
    }

    /**
     * 审核通过，扣除相应账户的资金
     * @author qianwenwei
     * @param $id
     * @return bool
     * *
     */
    protected function accountPayMoney($id){
        //实例化模型
        $pay_db     = M('bill_self_tax_sub');
        $account_db = M('info_bank_account');
        $bds        = new BankDepositService();


        //获取付款单信息
        $bill = $pay_db->where('id=' . $id)->find();
        //获取两个账户及金额
        $account = $bill['pay_account'];
        $money   = $bill['sum_tax_money'];
        //判断账户是否有足够的余额
        if($money >= 0 && $account > 0) {
            //获取当前余额
            $account_money = $account_db->where('id=' . $account)->getField('now_money');
            if($account_money < $money) return FALSE; else {
                $account_db->startTrans();
                try {
                    if($bds->newBankIODetaillList("自销税票单-审核",FIdConst::SELF_TAX_BILL_VERIFY,$account,"付款账户：对应单号：" . $bill['bill_code'],-$money)) {
                        $data['now_money'] = $account_money - $money;
                        $account_db->where('id=' . $account)->save($data);
                        $account_db->commit();

                        return TRUE;
                    }
                } catch(Exception $e) {
                    $account_db->rollback();

                    return FALSE;
                }

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
        $taxSub_db  = M('bill_self_tax_sub');
        $account_db = M('info_bank_account');
        $bds        = new BankDepositService();


        //获取付款单信息
        $bill = $taxSub_db->where('id=' . $id)->find();
        //获取两个账户及金额
        $account = $bill['pay_account'];
        $money   = $bill['sum_tax_money'];
        //更新余额
        if($account > 0 && $money > 0) {
            $account_db->startTrans();
            try {
                $account_1_money      = $account_db->where('id=' . $account)->getField('now_money');
                $data['now_money']    = $account_1_money + $money;
                $data['operate_info'] = $account_db->where('id=' . $account)->getField("operate_info") . $this->getOperateInfo("自销税票反审核回款金额：$money");
                if($bds->newBankIODetaillList("自销税票单-反审核",FIdConst::SELF_TAX_BILL_REVERT_VERIFY,$account,"对应单号：" . $bill['bill_code'],$money)) {
                    $account_db->where('id=' . $account)->save($data);
                    $account_db->commit();
                }
            } catch(Exception $e) {
                $account_db->rollback();

                return FALSE;
            }

        }
    }
}
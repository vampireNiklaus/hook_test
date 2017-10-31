<?php

namespace Home\Service;

use Home\Common\FIdConst;

/**
 * 自销采购单Service
 *
 * @author RCG
 */
class SelfPurchaseService extends PSIBaseService
{
    private $LOG_CATEGORY = "业务流程信息-采购单信息";

    /**
     * @param $params
     * @return array
     */
    public function editSelfPurchase($params)
    {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfPurchase_db = D('bill_self_purchase');
        //获取药品底价
        $drug = M('info_drug')->where('id=' . $params['drug_id'])->field('base_price,kaipiao_price,tax_price')->find();
        $num = $params['buy_amount'];
        //计算
//        $params['tax_unit_price'] = $drug['tax_price'];
        $params['tax_unit_price'] = 0;
//        $params['kaipiao_unit_price'] = $drug['kaipiao_price'];
        $params['kaipiao_unit_price'] = 0;
        $params['sum_pay'] = $params['per_price'] * $num;
//        $params['sum_tax_money'] = $drug['tax_price'] * $num;
        $params['sum_tax_money'] = 0;
//        $params['sum_kaipiao_money'] = $drug['kaipiao_price'] * $num;
        $params['sum_kaipiao_money'] = 0;

        //开单人id
        $params['kaidan_ren'] = session("loginUserId");
        $params['create_time'] = time();
        $params['bill_code'] = 'BSPU' . date('YmdHis', time());
        if ($params['id']) {
            $params['operate_info'] = $selfPurchase_db->where("id=".$params['id'])->getField("operate_info").$this->getOperateInfo("编辑自销采购单");
            $selfPurchase_db->save($params);
        } else {
            $params['operate_info'] = $this->getOperateInfo("添加自销采购单");
            $params['id'] = $selfPurchase_db->add($params);
        }
        return $this->ok($params['id']);
    }

    /*
     * 获取自销采购单列表
     */

    public function listSelfPurchase($params)
    {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfPurchase_db = M('bill_self_purchase');
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
//        $whereStr = $this->likeSearch($params);
        $count = $selfPurchase_db
            ->alias('sp')
            ->join('info_drug AS idr ON idr.id=sp.drug_id')
            ->join('info_supplier AS isu ON isu.id=sp.supplier_id')
            ->where("idr.common_name like '%" . $params['common_name'] . "%' AND sp.bill_code like '%" . $params['bill_code'] . "%' and sp.status like'%".$params['status']."%'")
            ->count();
        $all_data = $selfPurchase_db
            ->alias('sp')
            ->join('info_drug AS idr ON idr.id=sp.drug_id')
            ->join('info_supplier AS isu ON isu.id=sp.supplier_id')
            ->join('info_supplier AS isu2 ON isu2.id=sp.kpgs_id')
            ->where("idr.common_name like '%" . $params['common_name'] . "%' AND sp.bill_code like '%" . $params['bill_code'] . "%' and sp.status like'%".$params['status']."%'")
            ->field('sp.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer,isu.name supplier_name,isu2.name kpgs_name')
            ->page($page, $limit)
            ->select();

        //数据处理
        foreach ($all_data as $k => $v) {
            switch ($v['status']) {
                case 0:
                    $all_data[$k]['status_str'] = '<span style="color:red">未审核</span>';
                    break;
                case 1:
                    $all_data[$k]['status_str'] = '已审核';
                    break;
                case 2:
                    $all_data[$k]['status_str'] = '<span style="color:blue">审核未通过</span>';
                    break;
            }
        }
        return array(
            "selfPurchaseList" => $all_data,
            "totalCount" => $count
        );
    }

    public function deleteSelfPurchase($params)
    {
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        //获取要删除的信息
        $db = M("bill_self_purchase");
        $data = $db->where('id='.$params)->find();
        if (!$data) {
            return $this->bad("要删除的采购单信息不存在");
        }
        //通过审核的不能删除
        if ($data['status'] == FIdConst::SELF_PURCHASE_STATUS_VERIFY_PASSED) {
            return $this->bad("该采购单已通过审核，无法删除");
        }
        $result = $db->where('id='.$params)->delete();
        if ($result) {
            $log = "删除采购单信息： 采购单单号：{$data['dh']}";
            $bs = new BizlogService();
            $bs->insertBizlog($log, $this->LOG_CATEGORY);
        }
        return $this->ok();
    }

    /**
     * 修改自销采购单状态，审核与反审核
     */
    public function selfPurchaseStatus($params)
    {
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $type = $params["type"];
        $db = M('bill_self_purchase');
        $params['operate_info'] = $db->where("id=".$id)->getField("operate_info");
        //能修改的条件
        $io = $db->where('id=' . $id)->find();
        //当前状态
        $statusNow = $io['status'];
        if ($type == 'no' && $statusNow == FIdConst::SELF_PURCHASE_STATUS_2VERIFY) {
            //审核未通过
            $data['status'] = FIdConst::SELF_PURCHASE_STATUS_VERIFY_DENIED;
            $data['verifier_id'] = session('loginUserId');
            $data['operate_info'] = $params['operate_info'].$this->getOperateInfo("自销采购单审核未通过");
            $db->where('id=' . $id)->save($data);
            return $this->ok($id);
        } else {
            if ($type == 'yes' && ($statusNow == FIdConst::SELF_PURCHASE_STATUS_2VERIFY || FIdConst::SELF_PURCHASE_STATUS_VERIFY_DENIED)) {

                //通过审核，生成付款单
                $data['status'] = FIdConst::SELF_PURCHASE_STATUS_VERIFY_PASSED;
                $data['verifier_id'] = session('loginUserId');
                $data['operate_info'] = $params['operate_info'].$this->getOperateInfo("自销采购单审核通过,生成子单");
                $db->where('id=' . $id)->save($data);
                $re = $this->createSelfPay($id);
                return $this->ok($re);

            } elseif ($type == 'return' && $statusNow == FIdConst::SELF_PURCHASE_STATUS_VERIFY_PASSED) {

                $data['verifier_id'] = session('loginUserId');
                //已审核且生成了入库单的反审核，先判断是否可以反审核，可以的话状态修改为审核未通过
                if ($this->beforeVerifyReturn($id)) {
                    //可以反审核
                    $data['status'] = FIdConst::SELF_PURCHASE_STATUS_VERIFY_DENIED;
                    $data['operate_info'] = $params['operate_info'].$this->getOperateInfo("自销采购单审核未通过");
                    $db->where('id=' . $id)->save($data);
                    return $this->ok($id);
                } else{
                    return $this->bad('该采购单已被引用，无法进行反审核操作');
                }
            }
        }
    }

    /**
     * 生成付款单
     * @param $id 采购单id
     */
    protected function createSelfPay($id)
    {
        $purchase = M('bill_self_purchase')->where('id=' . $id)->find();
        if ($purchase['status'] == 1) {
            //采购单已审核，生成付款单
            $data['drug_id'] = $purchase['drug_id'];
            $data['buy_bill_id'] = $purchase['id'];
            $data['supplier_id'] = $purchase['supplier_id'];
            $data['kpgs_id'] = $purchase['kpgs_id'];
            $data['unit'] = $purchase['unit'];
            $data['unit_price'] = $purchase['per_price'];

            $data['yewu_date'] = $purchase['kaidan_date'];
            $data['kaidan_ren'] = $purchase['kaidan_ren'];
            $data['sum_pay_money'] = $purchase['sum_pay'];//总支付金额（不变）
            $data['pay_amount'] = $purchase['buy_amount'];//总支付数量（不变）
            $data['money_should_pay'] = $purchase['sum_pay'];//待支付金额（可变）
            $data['amount_should_pay'] = $purchase['buy_amount'];//待支付数量（可变）

            $data['tax_unit_price'] = $purchase['tax_unit_price'];
            $data['sum_tax_money'] = $purchase['sum_tax_money'];
            $data['kaipiao_unit_price'] = $purchase['kaipiao_unit_price'];
            $data['sum_kaipiao_money'] = $purchase['sum_kaipiao_money'];

            $data['buy_date'] = $purchase['buy_date'];
            $data['bill_code'] = 'BSPA' . date('YmdHis');
            $data['status'] = 0;
            $data['operate_info'] = $this->getOperateInfo("自动生成自销付款单，对应采购单号：".$data['buy_bill_id']);
            return M('bill_self_pay')->add($data);
        } else
            return false;
    }

    /**
     * 判断是否能进行反审核操作,可以的话先删除相关付款单
     * @param $id 要进行反审核操作的采购单id
     * @return boolean
     */
    public function beforeVerifyReturn($id)
    {
        //实例化两个要用到的入库单模型
        $pay_db = M('bill_self_pay');
        //获取对应入库单id
        $payCount = $pay_db->where('buy_bill_id=' . $id . ' AND status=' . FIdConst::SELF_PAY_STATUS_VERIFY_PASSED)->count();
        if ($payCount == 0) {
            //数量为0，说明没有审核通过的，返回真表示可以反审核
            //删除对应的入库单
            $pay_db->where('buy_bill_id=' . $id)->delete();
            return true;
        } elseif ($payCount > 0) {
            //不能反审核，返回假
            return false;
        }
    }

}
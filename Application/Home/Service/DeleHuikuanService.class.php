<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;

/**
 * 代销回款单Service
 *
 * @author RCG
 */
class DeleHuikuanService extends PSIBaseService {
    private $LOG_CATEGORY = "业务流程信息-代销回款单信息";

    public function editDeleHuikuan($params){
        //编辑回款单
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $deleHuikuan_db = D('bill_dele_huikuan');
        $deleHuikuanSub_db = D('bill_dele_huikuan_sub');
        $parent_id=$params['parent_id'];

        //获取父回款单的id，如果编辑的是父级的则直接拿id，编辑子集的则连接数据库获取父级id
        $huikuanId=$parent_id==''?$params['id']:$deleHuikuanSub_db->where('id='.$params['id'])->getField('parent_id');
        $huikuan=$deleHuikuan_db->where('id='.$huikuanId)->find();

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
            $data['batch_num']=$huikuan['batch_num'];
            $data['kaipiao_unit_price']=$huikuan['kaipiao_unit_price'];
            $data['huikuan_num']=$params['huikuan_num'];
            $data['huikuan_money']=$data['kaipiao_unit_price']*$data['huikuan_num'];
            $data['huikuan_code']=$params['huikuan_code'];
            $data['bill_date']=$params['bill_date'];
            $data['huikuan_account']=$params['huikuan_account'];
            $data['kaidan_ren']=session('loginUserId');
            $data['note']=$params['note'];
            $data['status']=FIdConst::DELE_HUIKUAN_STATUS_2VERIFY;

            $data['create_time']=time();
            //生成系统单号
            $data['bill_code']="BSHK-S".date('YmdHis');
            if($parent_id==''){
                $data['operate_info'] = $this->getOperateInfo("新建");
                $deleHuikuanSub_db->add($data);
            }else{
                $data['operate_info'] = $deleHuikuanSub_db->where('id='.$params['id'])->getField("operate_info").$this->getOperateInfo("编辑");
                $deleHuikuanSub_db->where('id='.$params['id'])->save($data);
            }
            return $this->ok($params['id']);
        }


    }


    /*
     * 根据销售单生成或者是编辑回款单
     * */
    public function editDeleHuikuanFromDailySell($params){
        $dailySell_db=M('bill_daily_sell');
        $deleHuikuanSub_db=M('bill_dele_huikuan_sub');
        $idService = new IdGenService();
        $dailySell_db->startTrans();
        $deleHuikuanSub_db->startTrans();
        try{
            $account_id=$params['account_id'];
            $bill_date=$params['bill_date'];

            $edit_id=$params['edit_id'];
            $data=array();

            if($edit_id){
                //编辑
                //先设置所有的待匹配的都为未匹配
                $data['bill_code'] = $deleHuikuanSub_db->where("id=".$params['edit_id'])->getField("bill_code");
                $dailySell_db->where("huikuan_status=".FIdConst::DAILY_SELL_STATUS_DELE_HUIKUAN_TOPAY." and huikuan_bill_code='".$deleHuikuanSub_db->where("id=".$edit_id)->getField("bill_code")."'")->save(
                    array(
                        'huikuan_bill_code'=>'',
                        'huikuan_status'=>FIdConst::DAILY_SELL_STATUS_DELE_HUIKUAN_INIT
                    )
                );
                $dailySell_db->commit();
            }else{
                $data['bill_code']='DHKFDS'.$idService->newId();
            }

            for($i=0;$i<$params['select_count'];$i++){
               $sell_id_list = $params['select_'.$i]['sell_id_list'];
               $huikuan_unit_price = $params['select_'.$i]['huikuan_unit_price'];
               $select=explode(',',$sell_id_list);
                foreach($select as $v){
                    $sell=$dailySell_db->where('id='.$v)->find();

                    $dailySell_db->where('id='.$v)->save(
                        array(
                            'huikuan_bill_code'=>$data['bill_code'],
                            'huikuan_status'=>FIdConst::DAILY_SELL_STATUS_DELE_HUIKUAN_TOPAY,
                            'huikuan_unit_price'=>$huikuan_unit_price,
                        )
                    );
                    $data['huikuan_num'] +=$sell['sell_amount'];
                    $data['huikuan_money'] +=$sell['sell_amount']*$huikuan_unit_price;
                }

            }
            //传入的参数为需要编辑的 daily_sell id数组
            $data['huikuan_account']=$account_id;
            $data['bill_date']=$bill_date;
            $data['status']=0;
            $data['drug_id']= $params['drug_id'];

            //编辑
            if($edit_id){
                $data['operate_info']= $deleHuikuanSub_db->where('id='.$edit_id)->getField("operate_info").$this->getOperateInfo("编辑条目");
                $deleHuikuanSub_db->where('id='.$edit_id)->save($data);
                $bp_id=$edit_id;
            }else{
                //新增
                $data['operate_info']= $this->getOperateInfo("新建条目");
                $data['create_time'] = time();
                $bp_id=$deleHuikuanSub_db->add($data);
            }

            $dailySell_db->commit();
            $deleHuikuanSub_db->commit();
            return $this->ok($bp_id);
        }catch (Exception $e){
            $dailySell_db->rollback();
            $deleHuikuanSub_db->rollback();
            return $this->bad("操作错误");
        }
    }


    /*
     * 获取未编辑代销回款单列表
     */
    public function listDeleHuikuanUnEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $deleHuikuan_db = M('bill_dele_huikuan');
        //分页信息
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
        $count = $deleHuikuan_db
            ->alias('shk')
            ->join('info_drug AS idr ON idr.id=shk.drug_id')
            ->join('info_supplier AS isu ON isu.id=shk.supplier_id')
            ->join('info_deliver AS ide ON ide.id=shk.deliver_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND shk.bill_code like '%".$params['bill_code']."%'")
            ->count();
        $all_data = $deleHuikuan_db
            ->alias('shk')
            ->join('info_drug AS idr ON idr.id=shk.drug_id')
            ->join('info_supplier AS isu ON isu.id=shk.supplier_id')
            ->join('info_deliver AS ide ON ide.id=shk.deliver_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND shk.bill_code like '%".$params['bill_code']."%'")
            ->field('shk.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.manufacturer,isu.name supplier_name
                ,ide.name deliver_name')
            ->page($page,$limit)
            ->select();

        //数据处理
        foreach ($all_data as $k=>$v){
            $needAmount=$v['huikuan_amount']-$v['had_amount'];
            $all_data[$k]['need_amount']=$needAmount;
            $all_data[$k]['status_str']= $needAmount==0?"<span>已全部回款</span>":"<span style='color: red'>待回款</span>";
        }
        return array(
            "deleHuikuanList" => $all_data,
            "totalCount" => $count
        );
    }

    public function listDeleHuikuanEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $deleHuikuanSub_db = M('bill_dele_huikuan_sub');
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);


        $where = " bill_date between'".$params['bill_date_from']."' and '".$params['bill_date_to']."'";

        if($params['drug_id']){
            $where = $where." and drug_id=".$params['drug_id'];
        }

        if($params['status']!=-1){
            $where =$where." and status=".$params['status'];
        }
        import("ORG.Util.Page");
        $count = $deleHuikuanSub_db
            ->alias('shk')
            ->join('left join info_drug AS idr ON idr.id=shk.drug_id')
            ->join('left join info_supplier AS isu ON isu.id=shk.supplier_id')
            ->join('left join info_deliver AS ide ON ide.id=shk.deliver_id')
            ->join('left join info_bank_account AS iba ON iba.id=shk.huikuan_account')
            ->where($where)
            ->count();
        $all_data = $deleHuikuanSub_db
            ->alias('shk')
            ->join('left join info_drug AS idr ON idr.id=shk.drug_id')
            ->join('left join info_supplier AS isu ON isu.id=shk.supplier_id')
            ->join('left join info_deliver AS ide ON ide.id=shk.deliver_id')
            ->join('left join info_bank_account AS iba ON iba.id=shk.huikuan_account')
            ->where($where)
            ->field('shk.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.manufacturer,isu.name supplier_name,
                ide.name deliver_name,iba.account_name huikuan_account_name,iba.account_num huikuan_account_num')
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
            "deleHuikuanList" => $all_data,
            "totalCount" => $count
        );
    }

    /*
     * 回款单根据单号获取内部的销售单据详情
     * */
    public function getDeleHuikuanInnerDetailById($id){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $dailySellModel=M('bill_daily_sell');
        $huikuan_bill = M("bill_dele_huikuan_sub")->where("id=".$id)->find();

        $all_data=$dailySellModel
            ->where("huikuan_bill_code='".$huikuan_bill['bill_code']."' and employee_des='公司利润' and drug_id=".$huikuan_bill['drug_id'])
            ->field("drug_id,drug_name,drug_guige,drug_manufacture,hospital_id,hospital_name,huikuan_unit_price,
            huikuan_status,batch_num,GROUP_CONCAT(id) sell_id_list,sum(sell_amount) sell_amount,DATE_FORMAT(sell_date,'%Y-%m') sell_month")
            ->group('hospital_id,sell_month,batch_num')
            ->select();

        return array(
            "all_data" => $all_data,
        );
    }


    /*
     * 根据子回款单id获取父回款单的入库数量信息
     */
    public function getHuikuanAmount($id){
        $p_id=M('bill_dele_huikuan_sub')->where('id='.$id)->getField('parent_id');
        $re=M('bill_dele_huikuan')
            ->alias('bst')
            ->join('bill_dele_tax_sub sss ON sss.id=bst.tax_bill_id')
            ->where('bst.id='.$p_id)
            ->field('bst.huikuan_amount,bst.had_amount,sss.bill_code tax_sub_bill_code')
            ->find();
        return array(
            "tax_sub_bill_code" => $re['tax_sub_bill_code'],
            "huikuan_amount" => $re['huikuan_amount'],
            "need_amount" => $re['huikuan_amount']-$re['had_amount']
        );
    }

    public function deleteDeleHuikuan($list){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        $subDb = M("bill_dele_huikuan_sub");
        $dailysellDb = M("bill_daily_sell");
        $subDb->startTrans();
        $dailysellDb->startTrans();
        try{
            foreach ($list as $id){
                $huikuan = $subDb->where("id=".$id)->find();
                if($huikuan['status'] == FIdConst::DELE_HUIKUAN_STATUS_VERIFY_PASSED){
                    $subDb->rollback();
                    $dailysellDb->rollback();
                    return $this->bad("有已经审核通过的单据不能删除，请重新选择");
                }

                //重新设置对应的业务支付单
                $dailysellDb->where("huikuan_bill_code='".$huikuan['bill_code']."'")->setField(
                    array(
                        "huikuan_status"=>FIdConst::DAILY_SELL_STATUS_DELE_HUIKUAN_INIT,
                        "huikuan_bill_code"=>"",
                    )
                );

                //删除回款单
                $subDb->where("id=".$id)->delete();

                $subDb->commit();
                $dailysellDb->commit();
                return $this->ok("操作成功");
            }
        }catch (Exception $e){
            $subDb->rollback();
            $dailysellDb->rollback();
            return $this->bad("操纵失败");
        }


       /*
       原来的操作
       $data = $isSub?$subDb->where('id='.$id)->find():$db->where('id='.$id)->find();
        if(!$data){
            return $this->bad("要删除的回款单信息不存在");
        }
        if(!$isSub){
            //非子回款单，需要判断是否有子回款单是已审核状态，有的话就不能删除
            $sub=$subDb->where('parent_id='.$id.' AND status='.FIdConst::DELE_HUIKUAN_STATUS_VERIFY_PASSED)->find();
            $canDelete=$sub==NULL?true:false;
        }
        //非子回款单
        if(!$isSub&&$canDelete){
            //实例化税票相关模型
            $pur_db=M('bill_dele_purchase');
            //设置对应进货单状态为被退回
            $pur_db->where('id='.$data['purchase_id'])->save(array('status'=>FIdConst::DELE_PURCHASE_STATUS_HUIKUAN_BACK));

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
        }elseif($isSub&&($data['status']==FIdConst::DELE_HUIKUAN_STATUS_2VERIFY||$data['status']==FIdConst::DELE_HUIKUAN_STATUS_VERIFY_DENIED)){
            //子回款单，状态为待审核和未通过审核的可以删除
            $result = $subDb->where('id='.$id)->delete();
            if($result){
                $log = "删除回款单信息： 回款单单号：{$data['bill_code']}";
                $bs = new BizlogService();
                $bs->insertBizlog($log, $this->LOG_CATEGORY);
            }
            return $this->ok();
        }else{
            return $this->bad('已被引用，无法删除');
        }*/
    }

    /**
     * 修改代销回款单状态，审核与反审核
     */
    public function deleHuikuanStatus($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        $bds = new BankDepositService();

        $list = $params['list'];
        $type = $params["type"];
        $huikuanSub_db = M('bill_dele_huikuan_sub');
        $daily_sell_db = M("bill_daily_sell");
        $account_db=M('info_bank_account');
        $account_db->startTrans();
        $daily_sell_db->startTrans();
        $huikuanSub_db->startTrans();

        try{
            foreach ($list as $id){
                //能修改的条件
                $huikuan=$huikuanSub_db->where('id='.$id)->find();
                //当前状态
                $statusNow=$huikuan['status'];
                if($type=='no' && $statusNow==FIdConst::DELE_HUIKUAN_STATUS_2VERIFY){
                    //审核未通过
                    $operate_info = $huikuanSub_db->where("id=".$id)->getField("operate_info").$this->getOperateInfo("审核不通过");
                    $huikuanSub_db->where('id='.$id)->setField('status',FIdConst::DELE_HUIKUAN_STATUS_VERIFY_DENIED);
                    $huikuanSub_db->where('id='.$id)->setField('operate_info',$operate_info);
                    return $this->ok($id);
                }

                if($type=='yes'&& ($statusNow==FIdConst::DELE_HUIKUAN_STATUS_2VERIFY
                        ||$statusNow==FIdConst::DELE_HUIKUAN_STATUS_VERIFY_DENIED)){
                        //通过审核，资金入账
                        $operate_info = $huikuanSub_db->where("id=".$id)->getField("operate_info").$this->getOperateInfo("审核通过");
                        $huikuanSub_db->where('id='.$id)->save(array('status'=>FIdConst::DELE_HUIKUAN_STATUS_VERIFY_PASSED));
                        $huikuanSub_db->where('id='.$id)->setField('operate_info',$operate_info);

                        //获取账户及金额
                        $account=$huikuan['huikuan_account'];
                        $money=$huikuan['huikuan_money'];
                        //判断账户是否有足够的余额
                        if($money>0&&$account>0){
                            //获取当前余额
                            $account_money=$account_db->where('id='.$account)->getField('now_money');
                            $data['now_money']=$account_money+$money;
                            $data['operate_info'] = $account_db->where("id=".$account)->getField("operate_info").$this->getOperateInfo("代销回款单审核通过，资金变动数量：$money"."原有数量：$account_money");
                            $account_db->where('id='.$account)->save($data);

                        }else{
                            $daily_sell_db->rollback();
                            $huikuanSub_db->rollback();
                            $account_db->rollback();
                            return $this->bad("资金不足，无法进行审核");
                        }


                        //处理销售单，设置状态位
                        $daily_sell_db->where("huikuan_bill_code='".$huikuan['bill_code']."' and huikuan_status=".FIdConst::DAILY_SELL_STATUS_DELE_HUIKUAN_TOPAY)->setField("huikuan_status=".FIdConst::DAILY_SELL_STATUS_DELE_HUIKUAN_PAIED);
                        if($bds->newBankIODetaillList("代销支付单-审核",FIdConst::DELE_HUIKUAN_BILL_VERIFY,$account,"收款-对应单号：".$huikuan['bill_code'],$money)){
                            $daily_sell_db->commit();
                            $huikuanSub_db->commit();
                            $account_db->commit();
                            return $this->ok();
                        }else{
                            $daily_sell_db->rollback();
                            $huikuanSub_db->rollback();
                            $account_db->rollback();
                            return $this->bad();
                        }

                }
                if($type=='return'&& $statusNow==FIdConst::DELE_HUIKUAN_STATUS_VERIFY_PASSED){
                    $account=$huikuan['huikuan_account'];
                    $money=$huikuan['huikuan_money'];
                    //更新余额
                    if($account>0&&$money>0){
                        $account_money=$account_db->where('id='.$account)->getField('now_money');
                        if($account_money<$money){
                            $daily_sell_db->rollback();
                            $huikuanSub_db->rollback();
                            $account_db->rollback();
                            return $this->bad("资金不足，无法进行审核");
                        }
                        else{
                            $account_1_money=$account_db->where('id='.$account)->getField('now_money');
                            $data['now_money']=$account_1_money-$money;
                            $account_db->where('id='.$account)->save($data);
                        }
                    }
                    $huikuanSub_db->where('id='.$id)->save(array('status'=>FIdConst::DELE_HUIKUAN_STATUS_2VERIFY));
                    $huikuanSub_db->where('id='.$id)->setField('operate_info',$huikuan["operate_info"].$this->getOperateInfo("反审核通过"));

                    //修改销售单的装填位
                    $daily_sell_db->where("huikuan_bill_code='".$huikuan['bill_code']."' and huikuan_status=".FIdConst::DAILY_SELL_STATUS_DELE_HUIKUAN_PAIED)->setField("huikuan_status=".FIdConst::DAILY_SELL_STATUS_DELE_HUIKUAN_INIT);
                    if($bds->newBankIODetaillList("代销支付单-反审核",FIdConst::DELE_HUIKUAN_BILL_REVERT_VERIFY,$account,"付款-对应单号：".$huikuan['bill_code'],-$money)){
                        $daily_sell_db->commit();
                        $huikuanSub_db->commit();
                        $account_db->commit();
                        return $this->ok();
                    }else{
                        $daily_sell_db->rollback();
                        $huikuanSub_db->rollback();
                        $account_db->rollback();
                        return $this->bad();
                    }
                }

            }

        }catch (Exception $e){
            $daily_sell_db->rollback();
            $huikuanSub_db->rollback();
            $account_db->rollback();
            return $this->bad("操作失败");
        }

    }

    /**
     * 审核通过，加相应账户的资金
     * @param $id 回款单id
     */
    protected function accountPayMoney($id){
        //实例化模型
        $pay_db=M('bill_dele_huikuan_sub');
        $account_db=M('info_bank_account');
        $account_db->startTrans();

        try{
            //获取回款单信息
            $bill=$pay_db->where('id='.$id)->find();
            //获取账户及金额
            $account=$bill['huikuan_account'];
            $money=$bill['huikuan_money'];
            //判断账户是否有足够的余额
            if($money>0&&$account>0){
                //获取当前余额
                $account_money=$account_db->where('id='.$account)->getField('now_money');
                $data['now_money']=$account_money+$money;
                $data['operate_info'] = $account_db->where("id=".$account)->getField("operate_info").$this->getOperateInfo("代销回款单审核通过，资金变动数量：$money"."原有数量：$account_money");
                $account_db->where('id='.$account)->save($data);
            }
            $account_db->commit();
            return true;
        }catch (Exception $e){
            return false;
        }

    }

    /**
     * 反审核，资金回流
     * @param $id 回款单id
     */
    public function accountReturnMoney($id){
        //实例化模型
        $huikuanSub_db=M('bill_dele_huikuan_sub');
        $account_db=M('info_bank_account');
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
                $account_1_money=$account_db->where('id='.$account)->getField('now_money');
                $data['now_money']=$account_1_money-$money;
                $account_db->where('id='.$account)->save($data);
                return true;
            }
        }
    }

}
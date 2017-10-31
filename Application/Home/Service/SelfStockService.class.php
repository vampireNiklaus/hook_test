<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;

/**
 * 自销入库单Service
 *
 * @author Baoyu Li
 */
class SelfStockService extends PSIBaseService {
    private $LOG_CATEGORY = "业务流程信息-入库单信息";

    public function editSelfStock($params){
        //编辑入库单
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfStock_db = D('bill_self_stock');
        $selfStockSub_db = D('bill_self_stock_sub');
        $parent_id=$params['parent_id'];
        $stockId=$parent_id==''?$params['id']:$selfStockSub_db->where('id='.$params['id'])->getField('parent_id');
        $stock=$selfStock_db->where('id='.$stockId)->find();
        //剩余入库量
        $needStock=$stock['stock_amount']-$stock['had_amount'];
        if($needStock<$params['stock_num']){
            return $this->bad('入库量大于剩余入库量');
        }else{
            //新建子入库单
            $data['deliver_id']=$params['deliver_id'];
            $data['stock_num']=$params['stock_num'];
            $data['instock_date']=$params['instock_date'];
            $data['note']=$params['note'];
            $data['is_broken']=$params['is_broken'];
            if($parent_id==''){
                //新建
                $idService = new IdGenService();
                $data['drug_id']=$stock['drug_id'];
                $data['kaipiao_unit_price']=$stock['kaipiao_unit_price'];
                $data['parent_id']=$stock['id'];
                $data['batch_num']=$stock['batch_num'];
                $data['validity']=$stock['validity'];
                $data['buy_date']=$stock['buy_date'];
                $data['create_time']=time();
                $data['bill_code']=FIdConst::BILL_CODE_TYPE_SELF_STOCK_DELIVER_SUB.$idService->newId();
                $data['supplier_id']=$stock['supplier_id'];
                $data['operate_info'] = $this->getOperateInfo("添加自销子入库单");
                $selfStockSub_db->add($data);
                //同时改变父入库单数量
//                $stock['had_amount'] = $stock['had_amount'] + $params['stock_num'];
//                $selfStock_db->where('id='.$params['id'])->setField('had_amount',$stock['had_amount']);
            }else{
                //编辑
                $data['operate_info'] = $selfStockSub_db->where("id=".$params['id'])->getField("operate_info").$this->getOperateInfo("编辑自销子入库单");
                $selfStockSub_db->where('id='.$params['id'])->save($data);
            }
            return $this->ok($params['id']);
        }


    }

    /*
     * 获取自销采购单列表
     */

    public function listSelfStockUnEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfStock_db = M('bill_self_stock');
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
//        $whereStr = $this->likeSearch($params);
        $count = $selfStock_db
            ->alias('ss')
            ->join('info_drug AS idr ON idr.id=ss.drug_id')
            ->join('info_supplier AS isu ON isu.id=ss.supplier_id')
            ->join('bill_self_pay AS spa ON spa.bill_code=ss.pay_bill_code')
            ->where("idr.common_name like '%".$params['common_name']."%' AND ss.bill_code like '%".$params['bill_code']."%'")
            ->count();
        $all_data = $selfStock_db
            ->alias('ss')
            ->join('info_drug AS idr ON idr.id=ss.drug_id')
            ->join('info_supplier AS isu ON isu.id=ss.supplier_id')
            ->join('bill_self_pay AS spa ON spa.bill_code=ss.pay_bill_code')
            ->where("idr.common_name like '%".$params['common_name']."%' AND ss.bill_code like '%".$params['bill_code']."%'")
            ->field('ss.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer,isu.name supplier_name
                ,spa.bill_code pay_bill_code,spa.buy_date')
            ->page($page,$limit)
            ->select();

        //数据处理
        foreach ($all_data as $k=>$v){
            $needAmount=$v['stock_amount']-$v['had_amount'];
            $all_data[$k]['need_amount']=$needAmount;
            $all_data[$k]['status_str']= $needAmount==0?"<span>已全部入库</span>":"<span style='color: red'>待入库</span>";
            $all_data[$k]['status']= $needAmount==0?(string)FIdConst::SELF_STOCK_STATUS_STOCKED:(string)FIdConst::SELF_STOCK_STATUS_2STOCK;
        }
        return array(
            "selfStockList" => $all_data,
            "totalCount" => $count
        );
    }

    public function listSelfStockEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfStockSub_db = M('bill_self_stock_sub');
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
//        $whereStr = $this->likeSearch($params);
        $count = $selfStockSub_db
            ->alias('sss')
            ->join('info_drug AS idr ON idr.id=sss.drug_id')
            ->join('info_supplier AS isu ON isu.id=sss.supplier_id')
            ->join('info_deliver AS ide ON ide.id=sss.deliver_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND ide.name like '%".$params['deliver_name']."%' AND sss.status like '%".$params['status']."%'")
            ->count();
        $all_data = $selfStockSub_db
            ->alias('sss')
            ->join('info_drug AS idr ON idr.id=sss.drug_id')
            ->join('info_supplier AS isu ON isu.id=sss.supplier_id')
            ->join('info_deliver AS ide ON ide.id=sss.deliver_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND sss.status like '%".$params['status']."%' AND ide.name like '%".$params['deliver_name']."%'")
            ->field('sss.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer,isu.name supplier_name,
                ide.name deliver_name')
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
                    $all_data[$k]['status_str']='<span style="color:#795548">税票单被退回</span>';
                    break;
            }
            if($v['is_broken'] == 1){
                //破损单
                $all_data[$k]['status_str'] = $all_data[$k]['status_str'].'<span style="color:green">破损单</span>';
            }
        }
        return array(
            "selfStockList" => $all_data,
            "totalCount" => $count
        );
    }


    /*
     * 根据子入库单id获取父入库单的入库数量信息
     */
    public function getStockAmount($id){
        $p_id=M('bill_self_stock_sub')->where('id='.$id)->getField('parent_id');
        $re=M('bill_self_stock')->where('id='.$p_id)->find();
        return array(
            "stock_amount" => $re['stock_amount'],
            "need_amount" => $re['stock_amount']-$re['had_amount']
        );
    }

    public function deleteSelfStock($id,$isSub){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db = M("bill_self_stock");
        $subDb = M("bill_self_stock_sub");
        $kaipiaoSubDb = M("bill_self_stock_kaipiao_sub");
        $db->startTrans();
        $subDb->startTrans();
        $kaipiaoSubDb->startTrans();


        $data = $isSub?$subDb->where('id='.$id)->find():$db->where('id='.$id)->find();
        if(!$data){
            return $this->bad("要删除的出入配送公司单据信息不存在");
        }

        try{
            if(!$isSub){
                //非子入库单，需要判断是否有子入库单是已审核状态，有的话就不能删除
                $sub=$subDb->where('parent_id='.$id.' AND status='.FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED)->find();
                $canDelete=$sub==NULL?true:false;
            }
            //非子入库单
            if(!$isSub&&$canDelete){
                //改变上一步的入开票公司的单据状态为0
                $kaipiaoSubDb->where("id=".$data['parent_id'])->setField("status",0);
                $db->where("id=".$id)->delete();
                $subItems = $subDb->where("parent_id=".$id)->select();
                $subDb->where("parent_id=".$id)->delete();
                //事物提交
                $db->commit();
                $subDb->commit();
                $kaipiaoSubDb->commit();
                $log = "删除配送公司入库单，以及关联的子单信息：入库单单号{$data['bill_code']}，子单集合{$subItems}";
                $bs = new BizlogService();
                $bs->insertBizlog($log, $this->LOG_CATEGORY);
                return $this->ok();
            }elseif($isSub&&($data['status']==FIdConst::SELF_STOCK_STATUS_2VERIFY
                    ||$data['status']==FIdConst::SELF_STOCK_STATUS_VERIFY_DENIED
                    ||$data['status']==FIdConst::SELF_STOCK_STATUS_TAX_BACK
                )){
                //子入库单，状态为待审核、未通过审核、税票单被退回的可以删除
                //删除子入库单的同时恢复父入库单的剩余入库数量
//                $son_data = $subDb->where('id='.$id)->find();
//                $parent_data = $db->where('id='.$son_data['parent_id'])->find();
//                $parent_data['had_amount'] = $parent_data['had_amount']-$son_data['stock_num'];
//                $db->where('id='.$son_data['parent_id'])->setField('had_amount',$parent_data['had_amount']);

                $result = $subDb->where('id='.$id)->delete();
                if($result){
                    $log = "删除入库单信息： 入库单单号：{$data['bill_code']}";
                    $bs = new BizlogService();
                    $bs->insertBizlog($log, $this->LOG_CATEGORY);
                }
                $subDb->commit();
                return $this->ok();
            }else{
                return $this->bad('已被引用，无法删除');
            }
        }catch (Exception $e){
            $db->rollback();
            $subDb->rollback();
            $kaipiaoOutDb->rollback();
            $kaipiaoSubDb->rollback();
            return $this->bad();
        }

    }

    /**
     * 修改自销入库单状态，审核与反审核
     */
    public function selfStockStatus($params){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $type = $params["type"];
        $db = M('bill_self_stock_sub');
        $selfStockDb = M('bill_self_stock');
        $selfTax = M('bill_self_tax');
        $stockDb = M('info_stock');
        $db->startTrans();
        $selfStockDb->startTrans();
        $stockDb->startTrans();

        //能修改的条件
        $stock=$db->where('id='.$id)->find();
        //当前状态
        $statusNow=$stock['status'];
        try{
            if($type=='no' && $statusNow==FIdConst::SELF_STOCK_STATUS_2VERIFY){
                //审核未通过
                $operate_info = $db->where('id='.$id)->getField("operate_info").$this->getOperateInfo("审核未通过");
                $db->where('id='.$id)->setField('status',FIdConst::SELF_STOCK_STATUS_VERIFY_DENIED);
                $db->where('id='.$id)->setField('operate_info',$operate_info);
                $db->commit();
                return $this->ok($id);
            }else{
                if($type=='yes'&& ($statusNow==FIdConst::SELF_STOCK_STATUS_2VERIFY
                        ||$statusNow==FIdConst::SELF_STOCK_STATUS_VERIFY_DENIED
                        ||$statusNow==FIdConst::SELF_STOCK_STATUS_TAX_BACK)){
                    if($db->where('id='.$id)->getField("is_broken") == 1){
                        //破损单，不需要入库，直接审核通过，不需要创建税票单和入库
                        $db->where('id='.$id)->save(array('status'=>FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED));
                        $hadAmount=M('bill_self_stock')->where('id='.$stock['parent_id'])->getField('had_amount');
                        $hadAmountNow=$hadAmount+$stock['stock_num'];
                        $operate_info = M('bill_self_stock')->where('id='.$stock['parent_id'])->getField("operate_info").$this->getOperateInfo("审核通过，修改父入库单数量，生成税票单");
                        M('bill_self_stock')->where('id='.$stock['parent_id'])->setField('had_amount',$hadAmountNow);
                        M('bill_self_stock')->where('id='.$stock['parent_id'])->setField('operate_info',$operate_info);
                        $selfStockDb->commit();
                        $db->commit();
                        return $this->ok();
                    }else{
                        //正常的未破损的单子
                        $stockParent=$selfStockDb->where('id='.$stock['parent_id'])->find();
                        $hadAmount=$stockParent['had_amount'];
                        $stockAmount = $stockParent['stock_amount'];
                        $hadAmountNow=$hadAmount+$stock['stock_num'];
                        //审核之前判断当前入库的数量是否大于剩余入库数量
                        if($hadAmountNow>$stockAmount){
                            return $this->bad('入库数量大于剩余入库数量');
                        }
                        //通过审核，修改父级入库单的已入库数量，并生成税票单
                        $db->where('id='.$id)->save(array('status'=>FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED));
                        $operate_info = M('bill_self_stock')->where('id='.$stock['parent_id'])->getField("operate_info").$this->getOperateInfo("审核通过，修改父入库单数量，生成税票单");
                        M('bill_self_stock')->where('id='.$stock['parent_id'])->setField('had_amount',$hadAmountNow);
                        M('bill_self_stock')->where('id='.$stock['parent_id'])->setField('operate_info',$operate_info);
                        $re=$this->createSelfTax($id);

                        //更改库存
                        $this->toStock($id);
                        $selfStockDb->commit();
                        $db->commit();
                        $selfTax->commit();
                        $stockDb->commit();
                        return $this->ok($re);
                    }


                }elseif($type=='return'&& $statusNow==FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED){
                    if($db->where('id='.$id)->getField("is_broken") == 1) {
                        //破损单，不需要入库，直接审核通过，不需要创建税票单和入库
                        $db->where('id='.$id)->save(array('status'=>FIdConst::SELF_STOCK_STATUS_2VERIFY));
                        $hadAmount=M('bill_self_stock')->where('id='.$stock['parent_id'])->getField('had_amount');
                        $hadAmoountNow=$hadAmount-$stock['stock_num'];
                        $operate_info = M('bill_self_stock')->where('id='.$stock['parent_id'])->getField("operate_info").$this->getOperateInfo("审核通过，修改父入库单数量，生成税票单");
                        M('bill_self_stock')->where('id='.$stock['parent_id'])->setField('had_amount',$hadAmoountNow);
                        M('bill_self_stock')->where('id='.$stock['parent_id'])->setField('operate_info',$operate_info);
                        $db->commit();
                        $selfStockDb->commit();
                        return $this->ok($id);
                    }else{
                        $m_flag=$this->beforeVerifyReturn($id);
                        $s_flag= $m_flag?$this->outStock($id):false;
                        if($m_flag && $s_flag){
                            //反审核
                            $db->where('id='.$id)->save(array('status'=>FIdConst::SELF_STOCK_STATUS_2VERIFY));
                            $hadAmount=M('bill_self_stock')->where('id='.$stock['parent_id'])->getField('had_amount');
                            $hadAmountNow=$hadAmount-$stock['stock_num'];
                            $operate_info = M('bill_self_stock')->where('id='.$stock['parent_id'])->getField("operate_info").$this->getOperateInfo("审核通过，修改父入库单数量，生成税票单");
                            M('bill_self_stock')->where('id='.$stock['parent_id'])->setField('had_amount',$hadAmountNow);
                            M('bill_self_stock')->where('id='.$stock['parent_id'])->setField('operate_info',$operate_info);
                            $db->commit();
                            $selfStockDb->commit();
                            return $this->ok($id);
                        }else{
                            $db->rollback();
                            $msg=$m_flag?'':'该采购单已被引用，无法进行反审核操作';
                            $msg=(!$s_flag)&&$m_flag?'库存不足，无法进行反审核操作':$msg;
                            return $this->bad($msg);
                        }
                    }

                }
            }
        }catch (Exception $e){
            $db->rollback();
            $selfStockDb->rollback();
            $stockDb->rollback();
            $selfTax->rollback();
            $stockDb->rollback();
            return $this->bad();
        }

    }

    /**
     * 生成税票单
     * @author qianwenwei
     * @param $id  子入库单id
     * @return bool|mixed
     * *
     */
    public function createSelfTax($id){
        $stock=M('bill_self_stock_sub')->where('id='.$id)->find();
        $idService = new IdGenService();
        if($stock['status']==1){

            $stockId = M("bill_self_stock")->where("id=".$stock['parent_id'])->getField("parent_id");
            $kaipiao_unit_price  = M("bill_self_stock_kaipiao_sub")->where("id=".$stockId)->getField("kaipiao_unit_price");
            //采购单已审核，生成入库单
            $data['drug_id']=$stock['drug_id'];
            $data['supplier_id']=$stock['supplier_id'];
            $data['deliver_id']=$stock['deliver_id'];
            //对应子入库单id
            $data['stock_sub_bill_id']=$stock['id'];
            $data['kaipiao_unit_price']=$kaipiao_unit_price;
            $data['tax_unit_price']=0.000;
            $data['kaipiao_amount']=$stock['stock_num'];
            $data['sum_kaipiao_money']=$data['kaipiao_unit_price']*$data['kaipiao_amount'];
            $data['sum_tax_money']=$data['tax_unit_price']*$data['kaipiao_amount'];
            $data['create_time']=time();
            $data['bill_code']=FIdConst::BILL_CODE_TYPE_SELF_TAX.$idService->newId();

            return M('bill_self_tax')->add($data);
        }else
            return false;
    }

    /**
     * 判断是否能进行反审核操作,可以的话先删除相关回款单
     * @param $id 要进行反审核操作的付款单id
     * @return boolean
     */
    public function beforeVerifyReturn($id){
        //实例化两个要用到的入库单模型
        $tax_db=M('bill_self_tax');
        $taxSub_db=M('bill_self_tax_sub');
        //获取对应入库单id
        $taxId=$tax_db->where('stock_sub_bill_id='.$id)->getField('id');
        if($taxId == null){
            //没有子单
            return true;
        }else{
            //获取对应子入库单中状态为已审核的数量
            $taxCount=$taxSub_db->where('parent_id='.$taxId.' AND status='.FIdConst::SELF_TAX_STATUS_VERIFY_PASSED)->count();
            if($taxCount==0){
                //数量为0，说明没有审核通过的，返回真表示可以反审核
                //删除对应的入库单
                $tax_db->where('stock_sub_bill_id='.$id)->delete();
                $taxSub_db->where('parent_id='.$taxId)->delete();
                return true;
            }elseif($taxCount>0){
                //不能反审核，返回假
                return false;
            }
        }

    }

    /**
     * 进库
     * @param $id 入库单的id
     */
    public function toStock($id){
        $selfStock_db=M('bill_self_stock_sub');
        $stock_db=M('info_stock');
        //获取信息info
        $info=$selfStock_db->where('id='.$id)->find();
        $stock=$stock_db
            ->where(
                'drug_id='.$info['drug_id'].
                ' AND deliver_id='.$info['deliver_id'].
                " AND batch_num='".$info['batch_num']."'"
            )
            ->find();
        if($stock==NULL){
            //不存在当前批号
            $data['drug_id']=$info['drug_id'];
            $data['drug_name']=M('info_drug')->where('id='.$info['drug_id'])->getField('common_name');
            $data['deliver_id']=$info['deliver_id'];
            $data['deliver_name']=M('info_deliver')->where('id='.$info['deliver_id'])->getField('name');
            $data['amount']=$info['stock_num'];
            $data['id']=$info['drug_id']."*".$info['deliver_id']."*".$info['batch_num'];
            $data['batch_num']=$info['batch_num'];
            $data['expire_time']=$info['validity'];
            $data['instock_date']=$info['instock_date'];
            $stock_db->add($data);
        }else{
            //存在批号，获取已经有的库存量
            $batch=$stock['amount'];
            $amountNow=$batch+$info['stock_num'];
            //更新
            $stock_db->where("id='".$stock['id']."'")->setField('amount',$amountNow);
        }
    }

    /**
     * 反审核库存调回
     * @author qianwenwei
     * @param $id
     * @return bool
     * *
     */
    public function outStock($id){
        $selfStock_db=M('bill_self_stock_sub');
        $stock_db=M('info_stock');
        //获取信息
        $info=$selfStock_db->where('id='.$id)->find();
        $stock=$stock_db
            ->where(
                'drug_id='.$info['drug_id'].
                ' AND deliver_id='.$info['deliver_id'].
                " AND batch_num='".$info['batch_num']."'"
            )
            ->find();
        //存在批号，获取已经有的库存量
        $batch=$stock['amount'];
        $amountNow=$batch-$info['stock_num'];
        if($amountNow>=0){
            //更新
            $stock_db->where("id='".$stock['id']."'")->setField('amount',$amountNow);
            return true;
        }else{
            return false;
        }
    }
}
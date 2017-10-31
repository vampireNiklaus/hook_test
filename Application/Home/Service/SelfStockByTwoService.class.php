<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;

/**
 * 自销入库单Service
 *
 * @author RCG
 */
class SelfStockByTwoService extends PSIBaseService {
    private $LOG_CATEGORY = "业务流程信息-入库单信息";

    public function editSelfStockByTwo($params){
        //编辑入库单
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfStock_db = D('bill_self_stock_by_two');
        $selfStockSub_db = D('bill_self_stock_by_two_sub');
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
            $data['validity']=$params['validity'];
            $data['batch_num']=$params['batch_num'];
            $data['tax_shuipiao_code']=$params['tax_shuipiao_code'];
            $data['note']=$params['note'];
            $data['is_broken']=$params['is_broken'];
            if($parent_id==''){
                //新建
                $idService = new IdGenService();
                $data['parent_id']=$stock['id'];
                $data['drug_id']=$stock['drug_id'];
                $data['base_price']=$stock['base_price'];
                $data['tax_unit_price']=$stock['tax_unit_price'];
                $data['buy_date']=$stock['buy_date'];
                $data['kaipiao_unit_price']=$stock['kaipiao_unit_price'];
                $data['huikuan_way']=$stock['huikuan_way'];
                $data['create_time']=time();
//                $data['bill_code']=FIdConst::BILL_CODE_TYPE_SELF_STOCK_DELIVER_SUB.$idService->newId();
                $data['bill_code']= 'PSD-S' . date('YmdHis');
                $data['operate_info'] = $this->getOperateInfo("添加自销子入库单");
                $selfStockSub_db->add($data);
//                //同时改变父入库单数量
//                $stock['had_amount'] = $stock['had_amount'] + $params['stock_num'];
//                $selfStock_db->where('id='.$params['id'])->setField('had_amount',$stock['had_amount']);
            }else{
                //编辑
                //修改子单入库数量时要修改父单对应的数量
//                $son_data = $selfStockSub_db->where('id='.$params['id'])->find();
//                $stock['had_amount'] = $stock['had_amount'] - $son_data['stock_num'] + $params['stock_num'];
//                $selfStock_db->where('id='.$son_data['parent_id'])->setField('had_amount',$stock['had_amount']);
                //保存修改
                $data['operate_info'] = $selfStockSub_db->where("id=".$params['id'])->getField("operate_info").$this->getOperateInfo("编辑自销子入库单");
                $selfStockSub_db->where('id='.$params['id'])->save($data);
            }
            return $this->ok($params['id']);
        }


    }

    /*
     * 获取自销入库单列表
     */

    public function listSelfStockByTwoUnEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfStock_db = M('bill_self_stock_by_two');
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
//            ->join('bill_self_pay_by_two AS spa ON spa.bill_code=ss.pay_bill_code')
//            ->join('bill_self_purchase_by_two AS spu ON spu.bill_code=ss.purchase_bill_code')
            ->where("idr.common_name like '%".$params['common_name']."%' AND ss.bill_code like '%".$params['bill_code']."%'")
            ->count();
        $all_data = $selfStock_db
            ->alias('ss')
            ->join('info_drug AS idr ON idr.id=ss.drug_id')
//            ->join('bill_self_pay_by_two AS spa ON spa.bill_code=ss.pay_bill_code')
//            ->join('bill_self_purchase_by_two AS spu ON spu.bill_code=ss.purchase_bill_code')
            ->where("idr.common_name like '%".$params['common_name']."%' AND ss.bill_code like '%".$params['bill_code']."%'")
            ->field('ss.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer')
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

    public function listSelfStockByTwoEdit($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $selfStockSub_db = M('bill_self_stock_by_two_sub');
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
            ->join('info_deliver AS ide ON ide.id=sss.deliver_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND ide.name like '%".$params['deliver_name']."%' AND sss.status like '%".$params['status']."%'")
            ->count();
        $all_data = $selfStockSub_db
            ->alias('sss')
            ->join('info_drug AS idr ON idr.id=sss.drug_id')
            ->join('info_deliver AS ide ON ide.id=sss.deliver_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND sss.status like '%".$params['status']."%' AND ide.name like '%".$params['deliver_name']."%'")
            ->field('sss.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer,ide.name deliver_name')
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
                    $all_data[$k]['status_str']='<span style="color:#795548">商业回款单被退回</span>';
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

    public function drugBrokenBillList($params){
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
            ->where("idr.common_name like '%".$params['common_name']."%' AND sss.bill_code like '%".$params['bill_code']."%'and is_broken=1")
            ->count();
        $all_data = $selfStockSub_db
            ->alias('sss')
            ->join('info_drug AS idr ON idr.id=sss.drug_id')
            ->join('info_supplier AS isu ON isu.id=sss.supplier_id')
            ->join('info_deliver AS ide ON ide.id=sss.deliver_id')
            ->where("idr.common_name like '%".$params['common_name']."%' AND sss.bill_code like '%".$params['bill_code']."%' and is_broken=1")
            ->field('sss.*,idr.common_name,idr.jx,idr.goods_name,idr.guige,idr.jldw,idr.manufacturer,isu.name supplier_name,
                ide.name deliver_name')
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
            "brokenDrugList" => $all_data,
            "totalCount" => $count
        );
    }

    /*
     * 根据子入库单id获取父入库单的入库数量信息
     */
    public function getStockAmount($id){
        $p_id=M('bill_self_stock_by_two_sub')->where('id='.$id)->getField('parent_id');
        $re=M('bill_self_stock_by_two')->where('id='.$p_id)->find();
        return array(
            "stock_amount" => $re['stock_amount'],
            "need_amount" => $re['stock_amount']-$re['had_amount']
        );
    }

    /**
     * 删除配送单
     * @author qianwenwei
     * @param $id
     * @param $isSub
     * @return array
     * *
     */
    public function deleteSelfStockByTwo($id,$isSub){
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $db = M("bill_self_stock_by_two");
        $subDb = M("bill_self_stock_by_two_sub");
        $purchaseDd = M('bill_self_purchase_by_two');
        $payDd = M('bill_self_pay_by_two');
        $db->startTrans();
        $subDb->startTrans();

        $data = $isSub?$subDb->where('id='.$id)->find():$db->where('id='.$id)->find();
        if(!$data){
            return $this->bad("要删除的出入配送公司单据信息不存在");
        }

        try{
            if(!$isSub){
                //非子入库单，需要判断是否有子入库单是已审核状态，有的话就不能删除
                $sub=$subDb->where('parent_id='.$id.' AND status='.FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED)->find();
                $canDelete =$sub==NULL?true:false;
                //非子入库单，不允许删除
//                return $this->bad('已被引用，无法删除');
            }
            //非子入库单
            if(!$isSub&&$canDelete){
                $db->where("id=".$id)->delete();
                $subItems = $subDb->where("parent_id=".$id)->select();
                $subDb->where("parent_id=".$id)->delete();
                //判断该待入库入配送单的来源，再更改对应的表
                if($data['pay_bill_id']){
                    //存在付款单id，则这条数据来至付款单，更改该付款单信息
                    $payDd->where('id='.$data['pay_bill_id'])->setField('status',FIdConst::SELF_PAY_STATUS_2EDIT);
                }
                if($data['buy_bill_id']){
                    //存在采购单id，则这条数据来至采购单，更改该采购单信息
                    $purchaseDd->where('id='.$data['buy_bill_id'])->setField('status',FIdConst::SELF_PURCHASE_STATUS_2VERIFY);
                }
                //事物提交
                $db->commit();
                $subDb->commit();
                $purchaseDd->commit();
                $payDd->commit();
                $log = "删除配送公司入库单，以及关联的子单信息：入库单单号{$data['bill_code']}，子单集合{$subItems}";
                $bs = new BizlogService();
                $bs->insertBizlog($log, $this->LOG_CATEGORY);
                return $this->ok();
            }elseif($isSub&&($data['status']==FIdConst::SELF_STOCK_STATUS_2VERIFY
                    ||$data['status']==FIdConst::SELF_STOCK_STATUS_VERIFY_DENIED
                    ||$data['status']==FIdConst::SELF_STOCK_STATUS_TAX_BACK
                )){
                //子入库单，状态为待审核、未通过审核、商业回款单被退回的可以删除
//                //删除子入库单的同时恢复父入库单的剩余入库数量
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
        $db = M('bill_self_stock_by_two_sub');
        $selfStockDb = M('bill_self_stock_by_two');
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
                        //破损单，不需要入库，直接审核通过，不需要创建入库单
                        $db->where('id='.$id)->save(array('status'=>FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED));
                        $hadAmount=M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->getField('had_amount');
                        $hadAmountNow=$hadAmount+$stock['stock_num'];
                        $operate_info = M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->getField("operate_info").$this->getOperateInfo("审核通过，修改父入库单数量，生成商业回款单");
                        M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->setField('had_amount',$hadAmountNow);
                        M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->setField('operate_info',$operate_info);
                        //更改库存
                        $selfStockDb->commit();
                        $db->commit();
                        return $this->ok();
                    }else{
                        //正常的未破损的单子
                        $stockParent=$selfStockDb->where('id='.$stock['parent_id'])->find();
                        $hadAmount = $stockParent['had_amount'];
                        $stockAmount = $stockParent['stock_amount'];
                        $hadAmountNow =$hadAmount+$stock['stock_num'];
                        //审核之前判断当前入库的数量是否大于剩余入库数量
                        if($hadAmountNow>$stockAmount){
                            return $this->bad('入库数量大于剩余入库数量');
                        }
                        //审核之前判断其税票号是否存在
                        if($stock['tax_shuipiao_code'] == null){
                            return $this->bad('税票号不存在!请先将信息填写完整！');
                        }
                        //通过审核，修改父级入库单的已入库数量，并生成商业回款单
                        $db->where('id='.$id)->save(array('status'=>FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED));
                        $hadAmount=M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->getField('had_amount');
                        $hadAmountNow=$hadAmount+$stock['stock_num'];
                        $operate_info = M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->getField("operate_info").$this->getOperateInfo("审核通过，修改父入库单数量，生成商业回款单");
                        M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->setField('had_amount',$hadAmountNow);
                        M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->setField('operate_info',$operate_info);
                        //判断回款方式，如果是商业公司预付，则直接生成厂家回款单(2为商业公司预付）
                        if($stock['huikuan_way'] != 2){
                            //生成商业回款单
                            $res=$this->createSelfDeliverHuikuan($id);
                        }else{
                            $res=$this->createSelfManufacturerHuikuan($id);
                        }


                        //更改库存
                        $this->toStock($id);
                        $selfStockDb->commit();
                        $db->commit();
                        $stockDb->commit();
                        return $this->ok($res);
                    }


                }elseif($type=='return'&& $statusNow==FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED){
                    if($db->where('id='.$id)->getField("is_broken") == 1) {
                        //破损单，不需要入库，直接审核通过，不需要创建税票单和入库
                        $db->where('id='.$id)->save(array('status'=>FIdConst::SELF_STOCK_STATUS_2VERIFY));
                        $hadAmount=M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->getField('had_amount');
                        $hadAmountNow=$hadAmount-$stock['stock_num'];
                        $operate_info = M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->getField("operate_info").$this->getOperateInfo("反审核通过，修改父入库单数量");
                        M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->setField('had_amount',$hadAmountNow);
                        M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->setField('operate_info',$operate_info);
                        $db->commit();
                        $selfStockDb->commit();
                        return $this->ok($id);
                    }else{
                        $m_flag=$this->beforeVerifyReturn($id);
                        $s_flag= $m_flag?$this->outStock($id):false;
                        if($m_flag && $s_flag){
                            //反审核
                            $db->where('id='.$id)->save(array('status'=>FIdConst::SELF_STOCK_STATUS_2VERIFY));
                            $hadAmount=M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->getField('had_amount');
                            $hadAmountNow=$hadAmount-$stock['stock_num'];
                            $operate_info = M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->getField("operate_info").$this->getOperateInfo("反审核通过，修改父入库单数量");
                            M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->setField('had_amount',$hadAmountNow);
                            M('bill_self_stock_by_two')->where('id='.$stock['parent_id'])->setField('operate_info',$operate_info);
                            $db->commit();
                            $selfStockDb->commit();
                            return $this->ok($id);
                        }else{
                            $db->rollback();
                            $msg=$m_flag?'':'该配送单已被引用，无法进行反审核操作';
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
            $stockDb->rollback();
            return $this->bad();
        }

    }

    /**
     * 判断是否能进行反审核操作,可以的话先删除相关回款单
     * @author qianwenwei
     * @param $id   要进行反审核操作的付款单id
     * @return bool
     * *
     */
    public function beforeVerifyReturn($id){
        //实例化两个要用到的入库单模型
        $del_huikuan_db=M('bill_self_deliver_huikuan_by_two');
        $del_huikuanSub_db=M('bill_self_deliver_huikuan_by_two_sub');
        //获取对应入库单id
        $del_huikuanId=$del_huikuan_db->where('stock_bill_id='.$id)->getField('id');
        if($del_huikuanId == null){
            //没有子单
            return true;
        }else{
            //获取对应子入库单中状态为已审核的数量
            $del_huikuanCount=$del_huikuanSub_db->where('parent_id='.$del_huikuanId.' AND status='.FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED)->count();
            if($del_huikuanCount==0){
                //数量为0，说明没有审核通过的，返回真表示可以反审核
                //删除对应的入库单
                $del_huikuan_db->where('stock_bill_id='.$id)->delete();
                $del_huikuanSub_db->where('parent_id='.$del_huikuanId)->delete();
                return true;
            }elseif($del_huikuanCount>0){
                //不能反审核，返回假
                return false;
            }
        }

    }

    /**
     * 进库
     * @author qianwenwei
     * @param $id  进库id
     * *
     */
    public function toStock($id){
        $selfStock_db=M('bill_self_stock_by_two_sub');
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
        $selfStock_db=M('bill_self_stock_by_two_sub');
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

    /**
     * 审核通过生成商业回款单
     * @author qianwenwei
     * @param $id
     * @return bool|mixed
     * *
     */
    protected function createSelfDeliverHuiKuan($id){
        $stock=M('bill_self_stock_by_two_sub')->where('id='.$id)->find();
        if($stock['status']==FIdConst::SELF_STOCK_STATUS_VERIFY_PASSED){
            //采购单已审核，生成商业回款单
            $data['drug_id']=$stock['drug_id'];
            $data['stock_bill_id']=$stock['id'];
            $data['deliver_id']=$stock['deliver_id'];
            $data['huikuan_way']=$stock['huikuan_way'];
            $data['base_price']=$stock['base_price'];
            $data['tax_unit_price']=$stock['tax_unit_price'];
            $data['kaipiao_unit_price']=$stock['kaipiao_unit_price'];
            $data['huikuan_amount']=$stock['stock_num'];
            //入商业回款数据库之前进行判断：商业公司预支付和非商业公司预支付
            if($data['huikuan_way'] == 2){
                //商业公司与支付
                $data['sum_kaipiao_money']=($stock['kaipiao_unit_price']-$data['base_price']-$data['tax_unit_price'])*$data['huikuan_amount'];
            }else{
                $data['sum_kaipiao_money']=$stock['kaipiao_unit_price']*$data['huikuan_amount'];
            }
            $data['had_amount']=0;
            $data['create_time']=time();
            $data['bill_code']='SYHK'.date('YmdHis');
            $data['operate_info'] = $this->getOperateInfo("子商业回款单创建");
            return M('bill_self_deliver_huikuan_by_two')->add($data);
        }else
            return false;
    }

    /**
     * 生成厂家回款单
     * @author qianwenwei
     * @param $id
     * @return bool|mixed
     * *
     */
    protected function createSelfManufacturerHuikuan($id){
        $stockSub=M('bill_self_stock_by_two_sub')->where('id='.$id)->find();
        if($stockSub['status']==FIdConst::SELF_HUIKUAN_STATUS_VERIFY_PASSED){
            //商业回款单已审核，生成厂家回款单
            $data['drug_id']=$stockSub['drug_id'];
//            $data['deliver_huikuan_bill_id']=$stockSub['id'];
            $data['deliver_id']=$stockSub['deliver_id'];
            $data['kaipiao_unit_price']=$stockSub['kaipiao_unit_price'];
            $data['huikuan_amount']=$stockSub['stock_num'];
            $data['huikuan_money']=$stockSub['stock_num']*($stockSub['kaipiao_unit_price']-$stockSub['base_price']-$stockSub['tax_unit_price']);
            $data['huikuan_way']=$stockSub['huikuan_way'];
            $data['had_amount']=0;
            $data['create_time']=time();
            $data['bill_code']='CJHK'.date('YmdHis');
            $data['operate_info'] = $this->getOperateInfo("子汇款单创建");
            return M('bill_self_manufacturer_huikuan_by_two')->add($data);
        }else
            return false;
    }
}
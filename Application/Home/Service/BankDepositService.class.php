<?php

namespace Home\Service;

use Home\Service\IdGenService;
use Home\Service\BizlogService;
use Home\Common\FIdConst;
use Think\Exception;

/**
 * 资金账户Service
 *
 * @author RCG
 */
class BankDepositService extends PSIBaseService
{
    private $LOG_CATEGORY = "基础数据-资金账户";

    /**
     * 银行账户列表
     */
    public function bankAccountList($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $page  = $params["page"];
        $start = $params["start"];
        $limit = $params["limit"];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        $bankCard_db = M("info_bank_account");
        import("ORG.Util.Page");
        $whereStr   = $this->likeSearch($params);
        $totalCount = $bankCard_db->where($whereStr)->count();
        $all_data   = $bankCard_db->where($whereStr)->page($page,$limit)->select();

        //数据整理
        foreach($all_data as $k => $v){
            $all_data[$k]['is_cash_str']  = $v['is_cash'] == 1 ? '是' : '否';
            $all_data[$k]['disabled_str'] = $v['disabled'] == 1 ? '已停用' : '否';
        }

        return array(
            "bankAccountList" => $all_data,
            "totalCount"      => $totalCount
        );
    }


    /**
     * 银行账户流水明细列表
     */
    public function bankIODetaillList($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $us    = new UserService();
        $page  = $params["page"];
        $start = $params["start"];
        $limit = $params["limit"];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);
        $date_from           = strtotime($params['date_from']);
        $date_to             = strtotime($params['date_to']) + 86400;
        $bankCardIODetail_db = M("record_bankio_detail");
        import("ORG.Util.Page");
        $count    = $bankCardIODetail_db->alias("iode")->join("left join info_bank_account as ba on ba.id=" . $params['bankcard_id'])->join("left join t_user as user on user.id=iode.operate_user_id")->where("operate_time between " . $date_from . " and " . $date_to . " and bankcard_id=" . $params['bankcard_id'])->count();
        $all_data = $bankCardIODetail_db->alias("iode")->join("left join info_bank_account as ba on ba.id=" . $params['bankcard_id'])->join("left join t_user as user on user.id= iode.operate_user_id")->where("operate_time between " . $date_from . " and " . $date_to . " and bankcard_id=" . $params['bankcard_id'])->page($page,$limit)->field("iode.id,iode.money,FROM_UNIXTIME(iode.operate_time,'%Y-%m-%d %H:%i:%s') operate_time,iode.category,ba.account_name,ba.account_num,user.name operater,iode.description")->select();

        return array(
            "bankIODetaillList" => $all_data,
            "totalCount"        => $count
            //				"totalCount" => count($all_data)
        );
    }


    /**
     * 银行账户流水明细列表
     */
    public function newBankIODetaillList($category,$fid,$bankcard_id,$description,$money){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $data                = [];
        $bankCardIODetail_db = M("record_bankio_detail");


        $bankCardIODetail_db->startTrans();
        try {
            $data['category']        = $category;
            $data['fid']             = $fid;
            $data['operate_time']    = time();
            $data['bankcard_id']     = $bankcard_id;
            $data['operate_user_id'] = session("loginUserId");
            $data['description']     = $description;
            $data['money']           = $money;

            $bankCardIODetail_db->add($data);
            $bankCardIODetail_db->commit();

            return TRUE;
        } catch(Exception $e) {
            $bankCardIODetail_db->rollback();

            return FALSE;
        }


    }

    /**
     * 银行转账单列表
     */
    public function bankIOList($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $page       = $params["page"];
        $start      = $params["start"];
        $limit      = $params["limit"];
        $account_id = $params['account_id'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        $bankCard_db = M("bank_io");
        import("ORG.Util.Page");
        if($account_id) {
            $whereStr = "bi.out_account_id=" . $account_id . " OR bi.in_account_id=" . $account_id;
        }
        $all_data = $bankCard_db
            ->alias('bi')
            ->join("info_bank_account AS ba ON ba.id=bi.out_account_id")
            ->join("info_bank_account AS ba2 ON ba2.id=bi.in_account_id")
            ->join("t_user AS user1 ON user1.id=bi.creator_id")
            ->join("left join t_user AS user2 ON user2.id=bi.verifier_id")
            ->field("bi.*,ba.account_name out_account_name,ba.account_num out_account_num,ba2.account_name in_account_name,ba2.account_num in_account_num,user1.name creator_name,user2.name verifier_name")
            ->where($whereStr)
            ->page($page,$limit)
            ->select();

        return array(
            "bankIOList" => $all_data,
            "totalCount" => count($all_data)
        );
    }


    /**
     * 新建或编辑银行账户
     */
    public function editBankAccount($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $bankCard_db = M("info_bank_account");
        if($params['id']) {
            //编辑
            $bankCard_db->save($params);
        } else {
            //新建
            $params['id'] = $bankCard_db->add($params);
        }

        return $this->ok($params['id']);
    }

    /**
     * 新建或编辑转账单
     */
    public function editBankIO($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $bankCard_db = M("bank_io");
        if($params['id']) {
            //编辑
            $bankCard_db->save($params);
        } else {
            //新建
            $params['id'] = $bankCard_db->add($params);
        }

        return $this->ok($params['id']);
    }

    /**
     * 修改转账单状态 审核与反审核操作
     */
    public function IOstatus($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id   = $params["id"];
        $type = $params["type"];
        $db   = M('bank_io');
        //能修改的条件
        $io        = $db->where('id=' . $id)->find();
        $statusNow = $io['status'];
        if($type == 'no' && $statusNow == FIdConst::BANK_IO_STATUS_2VERIFY) {
            $db->where('id=' . $id)->save(array(
                'status'       => FIdConst::BANK_IO_STATUS_VERIFY_DENIED,
                'operate_info' => $this->getOperateInfo("审核不通过"),
                'verify_time'  => date('Y-m-d',time()),
                'verifier_id'  => $params['verifier_id']
            ));

            return $this->ok($id);
        } else {
            $out_id    = $io['out_account_id'];
            $in_id     = $io['in_account_id'];
            $amount    = $io['amount'];
            $accountDB = M('info_bank_account');
            $out_money = $accountDB->where('id=' . $out_id)->find();
            $in_money  = $accountDB->where('id=' . $in_id)->find();
            if($type == 'yes' && ($statusNow == FIdConst::BANK_IO_STATUS_2VERIFY || FIdConst::BANK_IO_STATUS_VERIFY_DENIED)) {
                //相应账号资金更改
                $outData['now_money']    = $out_money['now_money'] - $amount;
                $outData['operate_info'] = $accountDB->where('id=' . $out_id)->getField("operate_info") . $this->getOperateInfo("银行存取款审核通过，转出前：$out_money" . "转出金额：$amount" . "剩余金额：$out_money-$amount");
                $inData['now_money']     = $in_money['now_money'] + $amount;
                $inData['operate_info']  = $accountDB->where('id=' . $in_id)->getField("operate_info") . $this->getOperateInfo("银行存取款审核通过，转入前：$out_money" . "转入金额：$amount" . "剩余金额：$out_money+$amount");
                if($outData['now_money'] < 0) {
                    //付款账户余额不足
                    return $this->bad('付款账户余额不足');
                } else {
                    $accountDB->where('id=' . $out_id)->save($outData);
                    $accountDB->where('id=' . $in_id)->save($inData);
                    $db->where('id=' . $id)->save(array(
                        'status'       => FIdConst::BANK_IO_STATUS_VERIFIY_PASSED,
                        'operate_info' => $this->getOperateInfo("审核通过"),
                        'verify_time'  => date('Y-m-d',time()),
                        'verifier_id'  => $params['verifier_id']
                    ));

                    /*记入流水详情*/
                    $bds      = new BankDepositService();
                    $result_1 = $bds->newBankIODetaillList("转账付款单-审核",FIdConst::BANK_DEPOSIT,$out_id,"主付款账户,转账给" . $in_money['account_name'],-$amount);
                    $result_2 = $bds->newBankIODetaillList("转账付款单-审核",FIdConst::BANK_DEPOSIT,$in_id,"收款账户,收到" . $out_money['account_name'] . "的转账",$amount);
                    if($result_1 && $result_2) {
                        return $this->ok($id);
                    }
                }
            } elseif($type == 'return' && $statusNow == FIdConst::BANK_IO_STATUS_VERIFIY_PASSED) {
                //相应账号资金更改
                $outData['now_money']    = $out_money['now_money'] + $amount;
                $outData['operate_info'] = $accountDB->where('id=' . $out_id)->getField("operate_info") . $this->getOperateInfo("银行存取款反审核通过，转出前：$out_money" . "转出金额：$amount" . "剩余金额：$out_money+$amount");
                $inData['now_money']     = $in_money['now_money'] - $amount;
                $inData['operate_info']  = $accountDB->where('id=' . $in_id)->getField("operate_info") . $this->getOperateInfo("银行存取款反审核通过，转入前：$out_money" . "转入金额：$amount" . "剩余金额：$out_money-$amount");
                if($inData['now_money'] < 0) {
                    //退款账户余额不足
                    return $this->bad('要回款的账户余额不足');
                } else {
                    $accountDB->where('id=' . $out_id)->save($outData);
                    $accountDB->where('id=' . $in_id)->save($inData);
                    $db->where('id=' . $id)->save(array(
                        'status'       => FIdConst::BANK_IO_STATUS_VERIFY_DENIED,
                        'operate_info' => $this->getOperateInfo("反审核通过"),
                        'verify_time'  => date('Y-m-d',time()),
                        'verifier_id'  => $params['verifier_id']
                    ));

                    /*记入流水详情*/
                    $bds      = new BankDepositService();
                    $result_1 = $bds->newBankIODetaillList("转账付款单-反审核",FIdConst::BANK_DEPOSIT,$out_id,"主付款账户，反审核给" . $in_money['account_name'] . "的转账",$amount);
                    $result_2 = $bds->newBankIODetaillList("转账付款单-反审核",FIdConst::BANK_DEPOSIT,$in_id,"收款账户,反审核" . $out_money['account_name'] . "的转账",-$amount);
                    if($result_1 && $result_2) {
                        return $this->ok($id);
                    }
                }
            }
        }
    }

    /**
     * 删除资金账户
     */
    public function deleteBankAccount($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        if($params['id']) {
            $db   = M("info_bank_account");
            $data = $db->where($params)->select();
            if(!$data) {
                return $this->bad("要删除的资金账户信息不存在");
            }
            $ioCount = M('bank_io')->where('out_account_id=' . $params['id'] . ' OR in_account_id=' . $params['id'])->count();
            if($ioCount > 0) {
                return $this->bad('账户已被引用，无法删除！');
            } else {
                $result = $db->where($params)->delete();
                if($result) {
                    $log = "删除银行账户：{$data['account_name']}";
                    $bs  = new BizlogService();
                    $bs->insertBizlog($log,$this->LOG_CATEGORY);
                }

                return $this->ok();
            }
        }
    }

    /**
     * 删除资金账户
     */
    public function deleteBankIO($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        if($params['id']) {
            $db   = M("bank_io");
            $data = $db->where($params)->find();
            if(!$data) {
                return $this->bad("要删除的转账单信息不存在");
            }
            if($data['status'] != 1) {
                $result = $db->where($params)->delete();
                if($result) {
                    $log = "删除转账单：{$data['out_account_id']}";
                    $bs  = new BizlogService();
                    $bs->insertBizlog($log,$this->LOG_CATEGORY);
                }

                return $this->ok();
            }
        }
    }

    /**
     * 银行账户字段， 查询数据
     */
    public function queryData($queryKey){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }

        if($queryKey == NULL) {
            $queryKey = "";
        }

        $sql = "select *
				from info_bank_account
				where (account_name like '%" . $queryKey["queryKey"] . "%' or account_num like '%" . $queryKey["queryKey"] . "%') ";
        //		$queryParams = array();
        //		$key = "%{$queryKey}%";
        //		$queryParams[] = $key;
        //		$queryParams[] = $key;
        //		$queryParams[] = $key;
        //
        //		$ds = new DataOrgService();
        //		$rs = $ds->buildSQL("1004-01", "info_employee");
        //		if ($rs) {
        //			$sql .= " and " . $rs[0];
        //			$queryParams = array_merge($queryParams, $rs[1]);
        //		}

        $sql .= " order by id
				limit 20";

        return M()->query($sql);
    }


}
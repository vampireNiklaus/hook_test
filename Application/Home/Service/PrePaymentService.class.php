<?php

namespace Home\Service;

/**
 * 预付款Service
 *
 * @author Baoyu Li
 */
class PrePaymentService extends PSIBaseService {
	private $LOG_CATEGORY = "预付款管理";

	public function addPrePaymentInfo() {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		
		$us = new UserService();
		
		return array(
				"bizUserId" => $us->getLoginUserId(),
				"bizUserName" => $us->getLoginUserName()
		);
	}

	public function returnPrePaymentInfo() {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		
		$us = new UserService();
		
		return array(
				"bizUserId" => $us->getLoginUserId(),
				"bizUserName" => $us->getLoginUserName()
		);
	}

	/**
	 * 向供应商付预付款
	 */
	public function addPrePayment($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
		
		$supplierId = $params["supplierId"];
		$bizUserId = $params["bizUserId"];
		$bizDT = $params["bizDT"];
		$inMoney = $params["inMoney"];
		
		$db = M();
		$db->startTrans();
		
		// 检查客户
		$cs = new SupplierService();
		if (! $cs->supplierExists($supplierId, $db)) {
			$db->rollback();
			return $this->bad("供应商不存在，无法付预付款");
		}
		
		// 检查业务日期
		if (! $this->dateIsValid($bizDT)) {
			$db->rollback();
			return $this->bad("业务日期不正确");
		}
		
		// 检查收款人是否存在
		$us = new UserService();
		if (! $us->userExists($bizUserId, $db)) {
			$db->rollback();
			return $this->bad("收款人不存在");
		}
		
		$inMoney = floatval($inMoney);
		if ($inMoney <= 0) {
			$db->rollback();
			return $this->bad("付款金额需要是正数");
		}
		
		$idGen = new IdGenService();
		
		$companyId = $us->getCompanyId();
		
		$sql = "select in_money, balance_money from t_pre_payment
					where supplier_id = '%s' and company_id = '%s' ";
		$data = $db->query($sql, $supplierId, $companyId);
		if (! $data) {
			// 总账
			$sql = "insert into t_pre_payment(id, supplier_id, in_money, balance_money, company_id)
						values ('%s', '%s', %f, %f, '%s')";
			$rc = $db->execute($sql, $idGen->newId(), $supplierId, $inMoney, $inMoney, $companyId);
			if (! $rc) {
				$db->rollback();
				return $this->sqlError(__LINE__);
			}
			
			// 明细账
			$sql = "insert into t_pre_payment_detail(id, supplier_id, in_money, balance_money, date_created,
							ref_number, ref_type, biz_user_id, input_user_id, biz_date, company_id)
						values('%s', '%s', %f, %f, now(), '', '预付供应商采购货款', '%s', '%s', '%s', '%s')";
			$rc = $db->execute($sql, $idGen->newId(), $supplierId, $inMoney, $inMoney, $bizUserId, 
					$us->getLoginUserId(), $bizDT, $companyId);
			if (! $rc) {
				$db->rollback();
				return $this->sqlError(__LINE__);
			}
		} else {
			$totalInMoney = $data[0]["in_money"];
			$totalBalanceMoney = $data[0]["balance_money"];
			if (! $totalInMoney) {
				$totalInMoney = 0;
			}
			if (! $totalBalanceMoney) {
				$totalBalanceMoney = 0;
			}
			
			$totalInMoney += $inMoney;
			$totalBalanceMoney += $inMoney;
			// 总账
			$sql = "update t_pre_payment
						set in_money = %f, balance_money = %f
						where supplier_id = '%s' and company_id = '%s' ";
			$rc = $db->execute($sql, $totalInMoney, $totalBalanceMoney, $supplierId, $companyId);
			if (! $rc) {
				$db->rollback();
				return $this->sqlError(__LINE__);
			}
			
			// 明细账
			$sql = "insert into t_pre_payment_detail(id, supplier_id, in_money, balance_money, date_created,
							ref_number, ref_type, biz_user_id, input_user_id, biz_date, company_id)
						values('%s', '%s', %f, %f, now(), '', '预付供应商采购货款', '%s', '%s', '%s', '%s')";
			$rc = $db->execute($sql, $idGen->newId(), $supplierId, $inMoney, $totalBalanceMoney, 
					$bizUserId, $us->getLoginUserId(), $bizDT, $companyId);
			if (! $rc) {
				$db->rollback();
				return $this->sqlError(__LINE__);
			}
		}
		
		// 记录业务日志
		$bs = new BizlogService();
		$supplierName = $cs->getSupplierNameById($supplierId, $db);
		$log = "付供应商[{$supplierName}]预付款：{$inMoney}元";
		$bs->insertBizlog($log, $this->LOG_CATEGORY);
		
		$db->commit();
		
		return $this->ok();
	}

	/**
	 * 供应商退回预收款
	 */
	public function returnPrePayment($params) {
		if ($this->isNotOnline()) {
			return $this->notOnlineError();
		}
		
		$supplierId = $params["supplierId"];
		$bizUserId = $params["bizUserId"];
		$bizDT = $params["bizDT"];
		$inMoney = $params["inMoney"];
		
		$db = M();
		$db->startTrans();
		
		// 检查客户
		$cs = new SupplierService();
		if (! $cs->supplierExists($supplierId, $db)) {
			$db->rollback();
			return $this->bad("供应商不存在，无法收款");
		}
		
		// 检查业务日期
		if (! $this->dateIsValid($bizDT)) {
			$db->rollback();
			return $this->bad("业务日期不正确");
		}
		
		// 检查收款人是否存在
		$us = new UserService();
		if (! $us->userExists($bizUserId, $db)) {
			$db->rollback();
			return $this->bad("收款人不存在");
		}
		
		$inMoney = floatval($inMoney);
		if ($inMoney <= 0) {
			$db->rollback();
			return $this->bad("收款金额需要是正数");
		}
		
		$supplierName = $cs->getSupplierNameById($supplierId, $db);
		
		$idGen = new IdGenService();
		$companyId = $us->getCompanyId();
		
		$sql = "select balance_money, in_money from t_pre_payment 
				where supplier_id = '%s' and company_id = '%s' ";
		$data = $db->query($sql, $supplierId, $companyId);
		$balanceMoney = $data[0]["balance_money"];
		if (! $balanceMoney) {
			$balanceMoney = 0;
		}
		
		if ($balanceMoney < $inMoney) {
			$db->rollback();
			return $this->bad(
					"退款金额{$inMoney}元超过余额。<br /><br />供应商[{$supplierName}]的预付款余额是{$balanceMoney}元");
		}
		$totalInMoney = $data[0]["in_money"];
		if (! $totalInMoney) {
			$totalInMoney = 0;
		}
		
		// 总账
		$sql = "update t_pre_payment
					set in_money = %f, balance_money = %f
					where supplier_id = '%s' and company_id = '%s' ";
		$totalInMoney -= $inMoney;
		$balanceMoney -= $inMoney;
		$rc = $db->execute($sql, $totalInMoney, $balanceMoney, $supplierId, $companyId);
		if (! $rc) {
			$db->rollback();
			return $this->sqlError(__LINE__);
		}
		
		// 明细账
		$sql = "insert into t_pre_payment_detail(id, supplier_id, in_money, balance_money,
						biz_date, date_created, ref_number, ref_type, biz_user_id, input_user_id,
						company_id)
					values ('%s', '%s', %f, %f, '%s', now(), '', '供应商退回采购预付款', '%s', '%s', '%s')";
		$rc = $db->execute($sql, $idGen->newId(), $supplierId, - $inMoney, $balanceMoney, $bizDT, 
				$bizUserId, $us->getLoginUserId(), $companyId);
		
		// 记录业务日志
		$bs = new BizlogService();
		$log = "供应商[{$supplierName}]退回采购预付款：{$inMoney}元";
		$bs->insertBizlog($log, $this->LOG_CATEGORY);
		
		$db->commit();
		
		return $this->ok();
	}

	public function prepaymentList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		
		$page = $params["page"];
		$start = $params["start"];
		$limit = $params["limit"];
		
		$categoryId = $params["categoryId"];
		$us = new UserService();
		$companyId = $us->getCompanyId();
		
		$db = M();
		$sql = "select r.id, c.id as supplier_id, c.code, c.name,
					r.in_money, r.out_money, r.balance_money
				from t_pre_payment r, t_supplier c
				where r.supplier_id = c.id and c.category_id = '%s'
					and r.company_id = '%s'
				limit %d , %d
				";
		$data = $db->query($sql, $categoryId, $companyId, $start, $limit);
		
		$result = array();
		foreach ( $data as $i => $v ) {
			$result[$i]["id"] = $v["id"];
			$result[$i]["supplierId"] = $v["supplier_id"];
			$result[$i]["code"] = $v["code"];
			$result[$i]["name"] = $v["name"];
			$result[$i]["inMoney"] = $v["in_money"];
			$result[$i]["outMoney"] = $v["out_money"];
			$result[$i]["balanceMoney"] = $v["balance_money"];
		}
		
		$sql = "select count(*) as cnt
				from t_pre_payment r, t_supplier c
				where r.supplier_id = c.id and c.category_id = '%s'
					and r.company_id = '%s'
				";
		$data = $db->query($sql, $categoryId, $companyId);
		$cnt = $data[0]["cnt"];
		
		return array(
				"dataList" => $result,
				"totalCount" => $cnt
		);
	}

	public function prepaymentDetailList($params) {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		
		$start = $params["start"];
		$limit = $params["limit"];
		
		$supplerId = $params["supplierId"];
		$dtFrom = $params["dtFrom"];
		$dtTo = $params["dtTo"];
		$us = new UserService();
		$companyId = $us->getCompanyId();
		
		$db = M();
		$sql = "select d.id, d.ref_type, d.ref_number, d.in_money, d.out_money, d.balance_money,
					d.biz_date, d.date_created,
					u1.name as biz_user_name, u2.name as input_user_name
				from t_pre_payment_detail d, t_user u1, t_user u2
				where d.supplier_id = '%s' and d.biz_user_id = u1.id and d.input_user_id = u2.id
					and (d.biz_date between '%s' and '%s')
					and d.company_id = '%s'
				order by d.date_created
				limit %d , %d
				";
		$data = $db->query($sql, $supplerId, $dtFrom, $dtTo, $companyId, $start, $limit);
		$result = array();
		foreach ( $data as $i => $v ) {
			$result[$i]["id"] = $v["id"];
			$result[$i]["refType"] = $v["ref_type"];
			$result[$i]["refNumber"] = $v["ref_number"];
			$result[$i]["inMoney"] = $v["in_money"];
			$result[$i]["outMoney"] = $v["out_money"];
			$result[$i]["balanceMoney"] = $v["balance_money"];
			$result[$i]["bizDT"] = $this->toYMD($v["biz_date"]);
			$result[$i]["dateCreated"] = $v["date_created"];
			$result[$i]["bizUserName"] = $v["biz_user_name"];
			$result[$i]["inputUserName"] = $v["input_user_name"];
		}
		
		$sql = "select count(*) as cnt
				from t_pre_payment_detail d, t_user u1, t_user u2
				where d.supplier_id = '%s' and d.biz_user_id = u1.id and d.input_user_id = u2.id
					and (d.biz_date between '%s' and '%s')
					and d.company_id = '%s'
				";
		
		$data = $db->query($sql, $supplerId, $companyId, $dtFrom, $dtTo);
		$cnt = $data[0]["cnt"];
		
		return array(
				"dataList" => $result,
				"totalCount" => $cnt
		);
	}
}
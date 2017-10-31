<?php

namespace Home\Service;

use Home\Common\FIdConst;

/**
 * Portal Service
 *
 * @author Baoyu Li
 */
class PortalService extends PSIBaseService {

	public function inventoryPortal() {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		
		$result = array();
		
		$db = M();
		$sql = "select id, name 
				from t_warehouse 
				where (inited = 1) ";
		$queryParams = array();
		$ds = new DataOrgService();
		$rs = $ds->buildSQL(FIdConst::PORTAL_STOCK_ALARM, "t_warehouse");
		if ($rs) {
			$sql .= " and " . $rs[0];
			$queryParams = $rs[1];
		}
		
		$sql .= " order by code ";
		$data = $db->query($sql, $queryParams);
		foreach ( $data as $i => $v ) {
			$result[$i]["warehouseName"] = $v["name"];
			$warehouseId = $v["id"];
			
			// 库存金额
			$sql = "select sum(balance_money) as balance_money 
					from t_inventory
					where warehouse_id = '%s' ";
			$d = $db->query($sql, $warehouseId);
			if ($d) {
				$m = $d[0]["balance_money"];
				$result[$i]["inventoryMoney"] = $m ? $m : 0;
			} else {
				$result[$i]["inventoryMoney"] = 0;
			}
			// 低于安全库存数量的商品种类
			$sql = "select count(*) as cnt
					from t_inventory i, t_goods_si s
					where i.goods_id = s.goods_id and i.warehouse_id = s.warehouse_id
						and s.safety_inventory > i.balance_count
						and i.warehouse_id = '%s' ";
			$d = $db->query($sql, $warehouseId);
			$result[$i]["siCount"] = $d[0]["cnt"];
			
			// 超过库存上限的商品种类
			$sql = "select count(*) as cnt
					from t_inventory i, t_goods_si s
					where i.goods_id = s.goods_id and i.warehouse_id = s.warehouse_id
						and s.inventory_upper < i.balance_count 
						and (s.inventory_upper <> 0 and s.inventory_upper is not null)
						and i.warehouse_id = '%s' ";
			$d = $db->query($sql, $warehouseId);
			$result[$i]["iuCount"] = $d[0]["cnt"];
		}
		
		return $result;
	}

	public function salePortal() {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		
		$result = array();
		
		$db = M();
		
		// 当月
		$sql = "select year(now()) as y, month(now()) as m";
		$data = $db->query($sql);
		$year = $data[0]["y"];
		$month = $data[0]["m"];
		
		for($i = 0; $i < 6; $i ++) {
			if ($month < 10) {
				$result[$i]["month"] = "$year-0$month";
			} else {
				$result[$i]["month"] = "$year-$month";
			}
			
			$sql = "select sum(w.sale_money) as sale_money, sum(w.profit) as profit
					from t_ws_bill w
					where w.bill_status = 1000
						and year(w.bizdt) = %d
						and month(w.bizdt) = %d";
			$queryParams = array();
			$queryParams[] = $year;
			$queryParams[] = $month;
			$ds = new DataOrgService();
			$rs = $ds->buildSQL(FIdConst::PORTAL_SALE, "w");
			if ($rs) {
				$sql .= " and " . $rs[0];
				$queryParams = array_merge($queryParams, $rs[1]);
			}
			
			$data = $db->query($sql, $queryParams);
			$saleMoney = $data[0]["sale_money"];
			if (! $saleMoney) {
				$saleMoney = 0;
			}
			$profit = $data[0]["profit"];
			if (! $profit) {
				$profit = 0;
			}
			
			// 扣除退货
			$sql = "select sum(s.rejection_sale_money) as rej_sale_money,
						sum(s.profit) as rej_profit
					from t_sr_bill s
					where s.bill_status = 1000
						and year(s.bizdt) = %d
						and month(s.bizdt) = %d";
			$queryParams = array();
			$queryParams[] = $year;
			$queryParams[] = $month;
			$ds = new DataOrgService();
			$rs = $ds->buildSQL(FIdConst::PORTAL_SALE, "s");
			if ($rs) {
				$sql .= " and " . $rs[0];
				$queryParams = array_merge($queryParams, $rs[1]);
			}
			
			$data = $db->query($sql, $queryParams);
			$rejSaleMoney = $data[0]["rej_sale_money"];
			if (! $rejSaleMoney) {
				$rejSaleMoney = 0;
			}
			$rejProfit = $data[0]["rej_profit"];
			if (! $rejProfit) {
				$rejProfit = 0;
			}
			
			$saleMoney -= $rejSaleMoney;
			$profit += $rejProfit; // 这里是+号，因为$rejProfit是负数
			
			$result[$i]["saleMoney"] = $saleMoney;
			$result[$i]["profit"] = $profit;

			$result[$i]["saleMoney"] = 100 + $i;
			$result[$i]["profit"] = 50+$i;
			
			if ($saleMoney != 0) {
				$result[$i]["rate"] = sprintf("%0.2f", $profit / $saleMoney * 100) . "%";
			} else {
				$result[$i]["rate"] = "";
				$result[$i]["rate"] = 0.5;
			}
			
			// 获得上个月
			if ($month == 1) {
				$month = 12;
				$year -= 1;
			} else {
				$month -= 1;
			}
		}
		
		return $result;
	}

	public function purchasePortal() {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		
		$result = array();
		
		$db = M();
		
		// 当月
		$sql = "select year(now()) as y, month(now()) as m";
		$data = $db->query($sql);
		$year = $data[0]["y"];
		$month = $data[0]["m"];
		
		for($i = 0; $i < 6; $i ++) {
			if ($month < 10) {
				$result[$i]["month"] = "$year-0$month";
			} else {
				$result[$i]["month"] = "$year-$month";
			}
			
			$sql = "select sum(w.goods_money) as goods_money
					from t_pw_bill w
					where w.bill_status = 1000
						and year(w.biz_dt) = %d
						and month(w.biz_dt) = %d";
			$queryParams = array();
			$queryParams[] = $year;
			$queryParams[] = $month;
			$ds = new DataOrgService();
			$rs = $ds->buildSQL(FIdConst::PORTAL_PURCHASE, "w");
			if ($rs) {
				$sql .= " and " . $rs[0];
				$queryParams = array_merge($queryParams, $rs[1]);
			}
			
			$data = $db->query($sql, $queryParams);
			$goodsMoney = $data[0]["goods_money"];
			if (! $goodsMoney) {
				$goodsMoney = 0;
			}
			
			// 扣除退货
			$sql = "select sum(s.rejection_money) as rej_money
					from t_pr_bill s
					where s.bill_status = 1000
						and year(s.bizdt) = %d
						and month(s.bizdt) = %d";
			$queryParams = array();
			$queryParams[] = $year;
			$queryParams[] = $month;
			$ds = new DataOrgService();
			$rs = $ds->buildSQL(FIdConst::PORTAL_PURCHASE, "s");
			if ($rs) {
				$sql .= " and " . $rs[0];
				$queryParams = array_merge($queryParams, $rs[1]);
			}
			
			$data = $db->query($sql, $queryParams);
			$rejMoney = $data[0]["rej_money"];
			if (! $rejMoney) {
				$rejMoney = 0;
			}
			
			$goodsMoney -= $rejMoney;
			
			$result[$i]["purchaseMoney"] = $goodsMoney;
			
			// 获得上个月
			if ($month == 1) {
				$month = 12;
				$year -= 1;
			} else {
				$month -= 1;
			}
		}
		
		return $result;
	}

	public function moneyPortal() {
		if ($this->isNotOnline()) {
			return $this->emptyResult();
		}
		
		$result = array();
		
		$db = M();
		$us = new UserService();
		$companyId = $us->getCompanyId();
		
		// 应收账款
		$result[0]["item"] = "应收账款";
		$sql = "select sum(balance_money) as balance_money
				from t_receivables 
				where company_id = '%s' ";
		$data = $db->query($sql, $companyId);
		$balance = $data[0]["balance_money"];
		if (! $balance) {
			$balance = 0;
		}
		$result[0]["balanceMoney"] = $balance;
		
		// 账龄30天内
		$sql = "select sum(balance_money) as balance_money
				from t_receivables_detail
				where datediff(current_date(), biz_date) < 30
					and company_id = '%s' ";
		$data = $db->query($sql, $companyId);
		$balance = $data[0]["balance_money"];
		if (! $balance) {
			$balance = 0;
		}
		$result[0]["money30"] = $balance;
		
		// 账龄30-60天
		$sql = "select sum(balance_money) as balance_money
				from t_receivables_detail
				where datediff(current_date(), biz_date) <= 60
					and datediff(current_date(), biz_date) >= 30
					and company_id = '%s' ";
		$data = $db->query($sql, $companyId);
		$balance = $data[0]["balance_money"];
		if (! $balance) {
			$balance = 0;
		}
		$result[0]["money30to60"] = $balance;
		
		// 账龄60-90天
		$sql = "select sum(balance_money) as balance_money
				from t_receivables_detail
				where datediff(current_date(), biz_date) <= 90
					and datediff(current_date(), biz_date) > 60
					and company_id = '%s' ";
		$data = $db->query($sql, $companyId);
		$balance = $data[0]["balance_money"];
		if (! $balance) {
			$balance = 0;
		}
		$result[0]["money60to90"] = $balance;
		
		// 账龄大于90天
		$sql = "select sum(balance_money) as balance_money
				from t_receivables_detail
				where datediff(current_date(), biz_date) > 90
					and company_id = '%s' ";
		$data = $db->query($sql, $companyId);
		$balance = $data[0]["balance_money"];
		if (! $balance) {
			$balance = 0;
		}
		$result[0]["money90"] = $balance;
		
		// 应付账款
		$result[1]["item"] = "应付账款";
		$sql = "select sum(balance_money) as balance_money
				from t_payables 
				where company_id = '%s' ";
		$data = $db->query($sql, $companyId);
		$balance = $data[0]["balance_money"];
		if (! $balance) {
			$balance = 0;
		}
		$result[1]["balanceMoney"] = $balance;
		
		// 账龄30天内
		$sql = "select sum(balance_money) as balance_money
				from t_payables_detail
				where datediff(current_date(), biz_date) < 30
					and company_id = '%s' ";
		$data = $db->query($sql, $companyId);
		$balance = $data[0]["balance_money"];
		if (! $balance) {
			$balance = 0;
		}
		$result[1]["money30"] = $balance;
		
		// 账龄30-60天
		$sql = "select sum(balance_money) as balance_money
				from t_payables_detail
				where datediff(current_date(), biz_date) <= 60
					and datediff(current_date(), biz_date) >= 30
					and company_id = '%s' ";
		$data = $db->query($sql, $companyId);
		$balance = $data[0]["balance_money"];
		if (! $balance) {
			$balance = 0;
		}
		$result[1]["money30to60"] = $balance;
		
		// 账龄60-90天
		$sql = "select sum(balance_money) as balance_money
				from t_payables_detail
				where datediff(current_date(), biz_date) <= 90
					and datediff(current_date(), biz_date) > 60
					and company_id = '%s' ";
		$data = $db->query($sql, $companyId);
		$balance = $data[0]["balance_money"];
		if (! $balance) {
			$balance = 0;
		}
		$result[1]["money60to90"] = $balance;
		
		// 账龄大于90天
		$sql = "select sum(balance_money) as balance_money
				from t_payables_detail
				where datediff(current_date(), biz_date) > 90
					and company_id = '%s' ";
		$data = $db->query($sql, $companyId);
		$balance = $data[0]["balance_money"];
		if (! $balance) {
			$balance = 0;
		}
		$result[1]["money90"] = $balance;
		
		return $result;
	}

	public function getAllAlarmData()
    {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $db = M();
        $all_result = array();
        $queryStr  = "SELECT
							`info_drug`.`guige` AS `guige`,
							`info_drug`.`jldw` AS `jldw`,
							`info_drug`.`manufacturer` AS `manufacturer`,
							`info_stock`.`drug_name` AS `drug_name`,
							`info_stock`.`batch_num` AS `batch_num`,
							`info_stock`.`deliver_name` AS `deliver_name`,
							sum(`info_stock`.`amount`) AS `sum_amount`,
							info_stock.expire_time
						FROM
							(
								`info_stock` JOIN `info_drug` on info_stock.drug_id = info_drug.id
							)
                        WHERE date_sub(info_stock.expire_time,interval 6 month) < curdate()
						GROUP BY
							`info_stock`.`drug_id`,
							`info_stock`.`batch_num`,
							`info_stock`.`deliver_id`
						ORDER BY `sum_amount` DESC";

        $result = $db->query($queryStr);
        $all_result['drug_alarm'] = $result;


        $result = array();
        $queryStr  =
                        "SELECT
							`info_drug`.`guige` AS `guige`,
							`info_drug`.`jldw` AS `jldw`,
							`info_drug`.`manufacturer` AS `manufacturer`,
							`info_stock`.`drug_name` AS `drug_name`,
							`info_stock`.`deliver_name` AS `deliver_name`,
							sum(`info_stock`.`amount`) AS `sum_amount`,
							`info_stock`.`alarm_amount` AS `alarm_amount`
						FROM
							(
								`info_stock` JOIN `info_drug` on info_stock.drug_id = info_drug.id
							)
						GROUP BY
							`info_stock`.`drug_id`,
							`info_stock`.`batch_num`,
							`info_stock`.`deliver_id`
						ORDER BY `sum_amount` DESC";

        $result = $db->query($queryStr);
        $temp = array();
        foreach ($result as $k=>$v){
            if(intval($v['sum_amount'])<intval($v['alarm_amount']))
                $temp[] = $v;
        }
        $all_result['stock_alarm'] = $temp;




        $result = array();
        // 当月
        $sql = "select year(now()) as y, month(now()) as m";
        $data = $db->query($sql);
        $year = $data[0]["y"];
        $month = $data[0]["m"];
        //只查询近三个月份的产品的滞销情况
        //这是一个查询速度超级慢的地方，需要好好地修改一下
        for($i = 0; $i < 1; $i ++) {
            if ($month < 10) {
                $result[$i]["month"] = "$year-0$month";
            } else {
                $result[$i]["month"] = "$year-$month";
            }
            $queryStr  = "SELECT sum(bill_daily_sell.sell_amount) AS `sum_amount`,
                          info_drug_profit_assign.employee_alarm_month AS alarm_amount,
                          info_drug_profit_assign.employee_name,
                          `info_drug`.`guige` AS `guige`,
                            `info_drug`.`jldw` AS `jldw`,
                            `info_drug`.`id` AS `drug_id`,
                            `info_drug`.`manufacturer` AS `manufacturer`,
                            bill_daily_sell.drug_name
						FROM `bill_daily_sell` JOIN (`info_drug_profit_assign`,info_drug) on (info_drug_profit_assign.employee_id = bill_daily_sell.employee_id  and info_drug_profit_assign.drug_id = info_drug.id)
						
						WHERE  bill_daily_sell.sell_date BETWEEN '".$result[$i]["month"]."-01' and '".$result[$i]["month"]."-31'
					    GROUP BY bill_daily_sell.employee_id,bill_daily_sell.drug_id";
            $data = $db->query($queryStr);
            $temp = array();
            foreach ($data as $k=>$v){
                if(intval(['sum_amount'])<intval($v['alarm_amount'])){
                    $data[$k]['month'] = $result[$i]["month"];
                    $temp[] = $data[$k];
                }
            }
            // 获得上个月
            if ($month == 1) {
                $month = 12;
                $year -= 1;
            } else {
                $month -= 1;
            }
            $result [] = $temp;
        }
            //获取inventoryData
        $all_result['employee_alarm'] = $result;
        return $all_result;



    }
	public function getAllPortalData()
    {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $all_result = array();
        $result = array();


        //获取inventoryData
        $db = M();
        $queryStr  = "SELECT
							`info_drug`.`guige` AS `guige`,
							`info_drug`.`jldw` AS `jldw`,
							`info_drug`.`id` AS `drug_id`,
							`info_drug`.`manufacturer` AS `manufacturer`,
							`info_stock`.`drug_name` AS `drug_name`,
							sum(`info_stock`.`amount`) AS `sum_amount`,
							`info_stock`.`alarm_amount` AS `alarm_amount`
						FROM
							(
								`info_stock` JOIN `info_drug` on info_stock.drug_id = info_drug.id
							)
						GROUP BY
							`info_stock`.`drug_id`
						ORDER BY `sum_amount` DESC LIMIT 6";
        $result = $db->query($queryStr);
        foreach ($result as $k=>$v){
            $queryStr  = "SELECT
							`info_stock`.`deliver_name` AS `deliver_name`,
							sum(`info_stock`.`amount`) AS `sum_amount`,
							`info_stock`.`alarm_amount` AS `alarm_amount`
						FROM
							(
								`info_stock` JOIN `info_drug` on info_stock.drug_id = info_drug.id
							)
                        WHERE  info_stock.drug_id = ".$v['drug_id']."
						GROUP BY
							`info_stock`.`deliver_id`
						ORDER BY `sum_amount` DESC LIMIT 6";
            $result[$k]['details'] = $db->query($queryStr);
        }

        $all_result['inventory_data'] = $result;

        //获取saledata
        $result = array();

        $db = M();

        // 当月
        $sql = "select year(now()) as y, month(now()) as m";
        $data = $db->query($sql);
        $year = $data[0]["y"];
        $month = $data[0]["m"];

        for($i = 0; $i < 6; $i ++) {
            if ($month < 10) {
                $result[$i]["month"] = "$year-0$month";
            } else {
                $result[$i]["month"] = "$year-$month";
            }

            $queryStr  = "SELECT convert(sum(bill_daily_sell.employee_profit*bill_daily_sell.sell_amount),DECIMAL) AS `sale_money`
						FROM `bill_daily_sell` WHERE  bill_daily_sell.sell_date BETWEEN '".$result[$i]["month"]."-01' and '".$result[$i]["month"]."-31'";


            $data = $db->query($queryStr);
            $saleMoney = $data[0]["sale_money"];
            if (! $saleMoney) {
                $saleMoney = 0;
            }

            $queryStr  = "SELECT convert(sum(bill_daily_sell.employee_profit*bill_daily_sell.sell_amount),DECIMAL)  AS `profit`
						FROM `bill_daily_sell` WHERE  bill_daily_sell.employee_des = '公司利润' AND bill_daily_sell.sell_date BETWEEN '".$result[$i]["month"]."-01' and '".$result[$i]["month"]."-31'";


            $data = $db->query($queryStr);
            $profit = $data[0]["profit"];
            if (! $profit) {
                $profit = 0;
            }



            $result[$i]["saleMoney"] = $saleMoney;
            $result[$i]["profit"] = $profit;

            if ($saleMoney != 0) {
                $result[$i]["rate"] = sprintf("%0.2f", $profit / $saleMoney * 100) . "%";
            } else {
                $result[$i]["rate"] = 0;
            }
            // 获得上个月
            if ($month == 1) {
                $month = 12;
                $year -= 1;
            } else {
                $month -= 1;
            }
        }

        $all_result['sale_data'] = $result;

        //获取采购数据
        $result = array();

        $db = M();

        // 当月
        $sql = "select year(now()) as y, month(now()) as m";
        $data = $db->query($sql);
        $year = $data[0]["y"];
        $month = $data[0]["m"];

        for($i = 0; $i < 6; $i ++) {
            if ($month < 10) {
                $result[$i]["month"] = "$year-0$month";
            } else {
                $result[$i]["month"] = "$year-$month";
            }

            $queryStr  = "SELECT 
                        convert(sum(bill_self_pay.sum_pay_money),DECIMAL) AS `purchase_money`,
                        convert(sum(bill_self_pay.pay_amount),DECIMAL) AS `purchase_amount` 
						FROM `bill_self_pay` WHERE  bill_self_pay.status = ".FIdConst::SELF_PAY_STATUS_VERIFY_PASSED."  AND bill_self_pay.buy_date BETWEEN '".$result[$i]["month"]."-01' and '".$result[$i]["month"]."-31'";


            $data = $db->query($queryStr);

            $result[$i]["purchaseMoney"] = $data[0]["purchase_money"] == null? 0:$data[0]["purchase_money"];
            $result[$i]["purchaseAmount"] = $data[0]["purchase_amount"] == null? 0:$data[0]["purchase_amount"];

            // 获得上个月
            if ($month == 1) {
                $month = 12;
                $year -= 1;
            } else {
                $month -= 1;
            }
        }

        $all_result['purchase_data'] = $result;




        //获取资金数据
        $result = array();

        $db = M();
        $us = new UserService();
        $companyId = $us->getCompanyId();

        // 应收账款
        $result[0]["item"] = "应收账款";
        $sql = "select sum(balance_money) as balance_money
				from t_receivables 
				where company_id = '%s' ";
        $data = $db->query($sql, $companyId);
        $balance = $data[0]["balance_money"];
        if (! $balance) {
            $balance = 0;
        }
        $result[0]["balanceMoney"] = $balance;

        // 账龄30天内
        $sql = "select sum(balance_money) as balance_money
				from t_receivables_detail
				where datediff(current_date(), biz_date) < 30
					and company_id = '%s' ";
        $data = $db->query($sql, $companyId);
        $balance = $data[0]["balance_money"];
        if (! $balance) {
            $balance = 0;
        }
        $result[0]["money30"] = $balance;

        // 账龄30-60天
        $sql = "select sum(balance_money) as balance_money
				from t_receivables_detail
				where datediff(current_date(), biz_date) <= 60
					and datediff(current_date(), biz_date) >= 30
					and company_id = '%s' ";
        $data = $db->query($sql, $companyId);
        $balance = $data[0]["balance_money"];
        if (! $balance) {
            $balance = 0;
        }
        $result[0]["money30to60"] = $balance;

        // 账龄60-90天
        $sql = "select sum(balance_money) as balance_money
				from t_receivables_detail
				where datediff(current_date(), biz_date) <= 90
					and datediff(current_date(), biz_date) > 60
					and company_id = '%s' ";
        $data = $db->query($sql, $companyId);
        $balance = $data[0]["balance_money"];
        if (! $balance) {
            $balance = 0;
        }
        $result[0]["money60to90"] = $balance;

        // 账龄大于90天
        $sql = "select sum(balance_money) as balance_money
				from t_receivables_detail
				where datediff(current_date(), biz_date) > 90
					and company_id = '%s' ";
        $data = $db->query($sql, $companyId);
        $balance = $data[0]["balance_money"];
        if (! $balance) {
            $balance = 0;
        }
        $result[0]["money90"] = $balance;

        // 应付账款
        $result[1]["item"] = "应付账款";
        $sql = "select sum(balance_money) as balance_money
				from t_payables 
				where company_id = '%s' ";
        $data = $db->query($sql, $companyId);
        $balance = $data[0]["balance_money"];
        if (! $balance) {
            $balance = 0;
        }
        $result[1]["balanceMoney"] = $balance;

        // 账龄30天内
        $sql = "select sum(balance_money) as balance_money
				from t_payables_detail
				where datediff(current_date(), biz_date) < 30
					and company_id = '%s' ";
        $data = $db->query($sql, $companyId);
        $balance = $data[0]["balance_money"];
        if (! $balance) {
            $balance = 0;
        }
        $result[1]["money30"] = $balance;

        // 账龄30-60天
        $sql = "select sum(balance_money) as balance_money
				from t_payables_detail
				where datediff(current_date(), biz_date) <= 60
					and datediff(current_date(), biz_date) >= 30
					and company_id = '%s' ";
        $data = $db->query($sql, $companyId);
        $balance = $data[0]["balance_money"];
        if (! $balance) {
            $balance = 0;
        }
        $result[1]["money30to60"] = $balance;

        // 账龄60-90天
        $sql = "select sum(balance_money) as balance_money
				from t_payables_detail
				where datediff(current_date(), biz_date) <= 90
					and datediff(current_date(), biz_date) > 60
					and company_id = '%s' ";
        $data = $db->query($sql, $companyId);
        $balance = $data[0]["balance_money"];
        if (! $balance) {
            $balance = 0;
        }
        $result[1]["money60to90"] = $balance;

        // 账龄大于90天
        $sql = "select sum(balance_money) as balance_money
				from t_payables_detail
				where datediff(current_date(), biz_date) > 90
					and company_id = '%s' ";
        $data = $db->query($sql, $companyId);
        $balance = $data[0]["balance_money"];
        if (! $balance) {
            $balance = 0;
        }
        $result[1]["money90"] = $balance;


        $result = array();
        //资金状况看板
        $queryStr = "select convert(sum(info_bank_account.now_money),decimal) as bank_money from info_bank_account";
        $data = $db->query($queryStr)[0];
        $result['bankMoney'] = $data['bank_money'] == null? 0: $data['bank_money'];

        $queryStr  = "SELECT 
                        convert(sum(bill_self_pay.sum_pay_money),DECIMAL) AS `purchase_money`
						FROM `bill_self_pay` WHERE  bill_self_pay.status < ".FIdConst::SELF_PAY_STATUS_VERIFY_PASSED;
        $data = $db->query($queryStr)[0];
        $result['to_buy'] = $data['purchase_money'] == null? 0: $data['purchase_money'];

        $queryStr  = "SELECT 
                        convert(sum(bill_self_huikuan.kaipiao_unit_price*(bill_self_huikuan.huikuan_amount-bill_self_huikuan.had_amount)),DECIMAL) AS `to_huikuan`
						FROM `bill_self_huikuan` WHERE  bill_self_huikuan.had_amount < bill_self_huikuan.huikuan_amount";
        $data = $db->query($queryStr)[0];
        $result['to_huikuan'] = $data['to_huikuan'] == null? 0: $data['to_huikuan'];


        $queryStr  = "SELECT convert(sum(bill_daily_sell.employee_profit*bill_daily_sell.sell_amount),DECIMAL)  AS `to_pay`
						FROM `bill_daily_sell` WHERE  bill_daily_sell.employee_des <> '公司利润'";
        $data = $db->query($queryStr)[0];
        $result['to_pay'] = $data['to_pay'] == null? 0: $data['to_pay'];


        $all_result['money_data'] = $result;

        return $all_result;



    }
}
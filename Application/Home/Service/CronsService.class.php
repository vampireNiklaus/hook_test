<?php

namespace Home\Service;

use Home\Common\DemoConst;
use Home\Common\FIdConst;

/**
 * 用户Service
 *
 * @author Baoyu Li
 */
//class CronsService extends PSIBaseService {
//	public function  update_drug_daily_stock(){
//		$drug_stocks = M("info_stock")->select();
//		$today = date("Y-m-d",time());
//		foreach ($drug_stocks as $drug_stock) {
//			unset($drug_stock['id']);
//			$drug_stock['record_date'] = $today;
//			M("info_stock_daily_record")->add($drug_stock);
//		}
//		return $this->ok("finish");
//	}
//}

//库存任务每天自动备份，这个功能已经放在数据库的定时计划事件里了，这里不需要了
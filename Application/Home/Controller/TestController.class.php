<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Home\Service\ExportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\BusinessPayService;
use Home\Common\FIdConst;
use Home\Service\SMSService;

/**
 * 销售Controller
 *
 * @author Baoyu Li
 *        
 */
class TestController extends PSIBaseController {

	/**
	 * 销售 - 主页面
	 */
	public function  testSms(){
		$smsService = new SMSService();
		$result  = $smsService->sendSMS("18768119456","2016-07","2016-09-01","10000");
		echo '<pre>';print_r($result);
	}


}

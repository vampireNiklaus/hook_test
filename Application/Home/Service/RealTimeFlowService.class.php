<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Home\Common\DemoConst;
use Home\Service\ImportService;
use Think\Exception;

/**
 * 业务员Service
 *
 * @author Baoyu Li
 */
class RealTimeFlowService extends PSIBaseService {

    public function realTimeList($params) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $us = new UserService();
        $yewuHospitals = implode(",",$us->getLoginUserYeWuSetHospitalLists());

		$dailySell_db = M('bill_daily_sell');
        $where = array();
        $where['drug_name'] = array('like',"%".$params['drug_name']."%");
        $where['employee_name'] = array("eq","公司");
        $where['hospital_name'] = array('like',"%".$params['hospital_name']."%");
        $where['sell_date'] = array('between',"".$params['sell_date_from'].",".$params['sell_date_to']);
		$where['status'] = array('gt','1');

        //对于普通的公司员工设置医院的查看权限
        if($us->getLoginUserId() != $us->getAdminUserId()){
            $where['hospital_id'] = array('in',$yewuHospitals);
        }

		if (session('loginUserId') != FIdConst::ADMIN_USER_ID) {
			$drugIDs = $this->conditionalFilter4Drug();
			$where['drug_id'] = array('in',$drugIDs);
		}

        $page = $params['page'];
        $limit = $params['limit'];

        import("ORG.Util.Page");


        $all_data = $dailySell_db->where($where)->page($page,$limit)->select();
        return array(
            "dailySellList" => $all_data,
            "totalCount" => $dailySell_db->where($where)->count()
        );
    }
}
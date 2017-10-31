<?php

namespace Home\Service;

use Home\Service\IdGenService;
use Home\Service\BizlogService;
use Home\Common\FIdConst;

/**
 * 代理商档案Service
 *
 * @author Baoyu Li
 */
class AgentService extends PSIBaseService
{
    private $LOG_CATEGORY = "基础数据-代理商档案";

    /**
     * 某个分类下的代理商档案列表
     */
    public function listAgent($params){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $page  = $params["page"];
        $start = $params["start"];
        $limit = $params["limit"];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        $agent_db = M("info_agent");
        import("ORG.Util.Page");
        $whereStr = $this->likeSearch($params);
        $all_data = $agent_db->where($whereStr)->page($page,$limit)->select();

        return array("agentList" => $all_data,"totalCount" => count($agent_db->select()));
    }


    /**
     * 新建或编辑代理商档案
     */
    public function editAgent($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $bs = new BizlogService();

        $agent_db = M("info_agent");
        $queryString = "agent_name='" . $params['agent_name'] . "'";

        if($params['id']) {
            //编辑
            if(count($agent_db->where($queryString . " and id<>" . $params['id'])->select()) > 0) {
                return $this->bad("该名称的代理商已经存在，请更换其他名称");
            }
            $agent_db->save($params);
            $log = "修改代理商{$params}";
        } else {
            //新建
            if(count($agent_db->where($queryString)->select()) > 0) {
                return $this->bad("该名称的代理商已经存在，请更换其他名称");
            }
            $params["creator_id"]  = session("loginUserId");
            $params['create_time'] = time();
            $params['id']          = $agent_db->add($params);
            $log                   = "新建代理商{$params}";
        }
        $bs->insertBizlog($log,$this->LOG_CATEGORY);

        return $this->ok($params['id']);
    }

    /**
     * 删除代理商
     */
    public function deleteAgent($params){
        if($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        if($params['id']) {
            $db   = M("info_agent");
            $data = $db->where($params)->select();
            if(!$data) {
                return $this->bad("要删除的业务员信息不存在");
            }
            $result = $db->where($params)->delete();
            if($result) {
                $log = "删除代理商信息： 业务员姓名：{$data['agent_name']}";
                $bs  = new BizlogService();
                $bs->insertBizlog($log,$this->LOG_CATEGORY);
            }

            return $this->ok();
        }
    }

    /**
     * 代理商字段， 查询数据
     */
    public function queryData($queryKey){
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }

        if($queryKey == NULL) {
            $queryKey = "";
        }

        $sql = "select *
				from info_agent
				where (agent_name like '%" . $queryKey["queryKey"] . "%' or code like '%" . $queryKey["queryKey"] . "%') ";
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
				limit 50";

        return M()->query($sql);
    }

}
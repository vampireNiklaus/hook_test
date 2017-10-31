<?php

namespace Home\Service;
use Home\Common\FIdConst;

/**
 * Service 基类
 *
 * @author Baoyu Li
 */
class PSIBaseService
{


    /**
     * 是否是演示系统
     */
    protected function isDemo()
    {
//		return getenv("IS_DEMO") == "1";
        return false;
    }

    /**
     * 判断当前环境是否是MoPaaS
     *
     * @return boolean true: 当前运行环境是MoPaaS
     */
    public function isMoPaaS()
    {
        // VCAP_APPLICATION 是 CloudFoundry 所带的系统环境变量
        // 所以这个判断方法只是当前的解决办法
        return getenv("VCAP_APPLICATION") != null;
    }

    /**
     * 操作成功
     */
    protected function ok($id = null)
    {
        if ($id) {
            return array(
                "success" => true,
                "id" => $id
            );
        } else {
            return array(
                "success" => true
            );
        }
    }

    protected  function  getOperateInfo($appendStr){
        $us = new UserService();
        $userName = $us->getLoginUserName();
        return "+{操作：".$appendStr."/日期：".$this->noTime()."/操作人：".$userName."}+";
    }
    /**
     * 操作失败
     *
     * @param string $msg
     *            错误信息
     */
    protected function bad($msg)
    {
        return array(
            "success" => false,
            "msg" => $msg
        );
    }

    /**
     * 当前功能还没有开发
     *
     * @param string $info
     *            附加信息
     */
    protected function todo($info = null)
    {
        if ($info) {
            return array(
                "success" => false,
                "msg" => "TODO: 功能还没开发, 附加信息：$info"
            );
        } else {
            return array(
                "success" => false,
                "msg" => "TODO: 功能还没开发"
            );
        }
    }

    /**
     * 数据库错误
     */
    protected function sqlError($codeLine = null)
    {
        $info = "数据库错误，请联系管理员";
        if ($codeLine) {
            $info .= "<br />错误定位：{$codeLine}行";
        }
        return $this->bad($info);
    }

    /**
     * 把时间类型格式化成类似2015-08-13的格式
     */
    protected function toYMD($d)
    {
        return date("Y-m-d", strtotime($d));
    }

    /**
     * @return bool|string
     */
    protected  function  noTime(){
        return date("Y-m-d H:i:s",time());
    }
    /**
     * 盘点当前用户的session是否已经失效
     * true: 已经不在线
     */
    protected function isNotOnline()
    {
//		return session("loginUserId") == null;
        return false;
    }

    /**
     * 当用户不在线的时候，返回的提示信息
     */
    protected function notOnlineError()
    {
        return $this->bad("当前用户已经退出系统，请重新登录PSI");
    }

    /**
     * 返回空列表
     */
    protected function emptyResult()
    {
        return array();
    }

    /**
     * 盘点日期是否是正确的Y-m-d格式
     *
     * @param string $date
     * @return boolean true: 是正确的格式
     */
    protected function dateIsValid($date)
    {
        $dt = strtotime($date);
        if (!$dt) {
            return false;
        }

        return date("Y-m-d", $dt) == $date;
    }

    protected function tableExists($db, $tableName)
    {
        $dbName = C('DB_NAME');
        $sql = "select count(*) as cnt
				from information_schema.columns
				where table_schema = '%s'
					and table_name = '%s' ";
        $data = $db->query($sql, $dbName, $tableName);
        return $data[0]["cnt"] != 0;
    }

    protected function columnExists($db, $tableName, $columnName)
    {
        $dbName = C('DB_NAME');

        $sql = "select count(*) as cnt
				from information_schema.columns
				where table_schema = '%s'
					and table_name = '%s'
					and column_name = '%s' ";
        $data = $db->query($sql, $dbName, $tableName, $columnName);
        $cnt = $data[0]["cnt"];
        return $cnt == 1;
    }

    protected function likeSearch($params)
    {
        $likeSearchString = '';
        if (is_array($params)) {
            $i = 0;
            foreach ($params as $key => $value) {
                $i++;
                if ($i != count($params)) {
                    $likeSearchString .= $key . " like '%" . $value . "%' and ";
                } else {
                    $likeSearchString .= $key . " like '%" . $value . "%'";
                }
            }
        }
        return $likeSearchString;
    }

    /*
     * 权限分配里可以对登录用户分配具体的医院，当这个用户登录系统时，用户只能看到具体的和医院关联的品种
     *
     */
    protected function conditionalFilter4Drug()
    {
        if (session("loginType") == FIdConst::LOGIN_TYPE_EMPLOYEE) {
            $user2hospital_db= M("t_yewuset_user2hospital");
            $hospitals  = $user2hospital_db->where("user_id='".session("loginUserId")."'")->field("hospital_id")->select();
            if(count($hospitals)<1){
                return "";
            }else{
                $drug2hosDb = M("info_drug2hospital");
                $hospitalIDs =  [];
                for( $i = 0; $i<count($hospitals);$i++){
                    $hospitalIDs[] = $hospitals[$i]['hospital_id'];
                }
                $drugs = $drug2hosDb->where("hospital_id in (".implode(",",$hospitalIDs).")")->field("drug_id")->select();
                $drugIDs =  [];
                for( $i = 0; $i<count($drugs);$i++){
                    $drugIDs[] = $drugs[$i]['drug_id'];
                }
                return implode(",",$drugIDs);
            }
        } else {
            $drug = M("info_drug");
            $drugs = $drug->field("id")->select();

            $drugIDs =  [];
            for( $i = 0; $i<count($drugs);$i++){
                if (!empty($drugs[$i]['id'])) {
                    $drugIDs[] = $drugs[$i]['id'];
                }
            }
            return implode(",",$drugIDs);
        }
    }

    /**
     * 权限分配时可以对登录用户分配的具体医院，根据医院信息得到该用户所管理的员工信息
     * @author huxinlu
     * @return string
     */
    protected function employeeFilter()
    {
        $user2hospital_db= M("t_yewuset_user2hospital");
        $hospitalIDs  = $user2hospital_db->where("user_id='".session("loginUserId")."'")->getField("hospital_id",true);
        if(count($hospitalIDs)<1){
            return "";
        }else{
            $drugProfitAssign = M("info_drug_profit_assign");
            $hospitalIDs = implode(',',$hospitalIDs);
            $employeeIDs = $drugProfitAssign->where("hospital_id in (".$hospitalIDs.")")->getField('employee_id',true);
            return implode(',',$employeeIDs);
        }
    }


    /**
     * 当前数据库版本
     */
    protected $CURRENT_DB_VERSION = "20160314-01";
}

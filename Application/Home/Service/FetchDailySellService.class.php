<?php
/**
 * Created by PhpStorm.
 * User: shiwanbing
 * Date: 2017/9/27
 * Time: 11:40
 */

namespace Home\Service;
use Home\Common\FIdConst;

use Think\Exception;


class FetchDailySellService extends PSIBaseService {

    const DRUGOOGLE_CODE = 1;    //www.drugoogle.com编码
    const LX_CODE = 2;    //www.600216.com编码

    protected $cookie_path = "";
    protected $img_path = "";
    protected $excel_path = "";
    protected $deliver_name = "";



    public function autoFetchDailySells($params) {
        $deliver_account_id = $params['deliver_account_id'];
        $date_from = $params['date_from'];
        $date_to = $params['date_to'];
        //判断账号状态
        $deliver_account_db = M('info_deliver_account');
        $deliver_account = $deliver_account_db->where('id', $deliver_account_id)->find();
        if(!$deliver_account) {
            return $this->bad("该商业公司的登录账号不存在！");
        }
        if($deliver_account['disabled']) {
            return $this->bad("该商业公司的登录账号被禁用！");
        }

        $this->deliver_name = $deliver_account['deliver_name'];

        //商业公司流向抓取匹配
        if(stripos($deliver_account['url'], "drugoogle.com") !== false) {
            //$cookie_path = __ROOT__."/Temp/VerifyCode/drugoogle/".session('loginUserId').".txt";
            //$img_path =  __ROOT__."/Temp/VerifyCode/drugoogle/".session('loginUserId').".png";
            $this->cookie_path = __DIR__."/".session('loginUserId').".txt";
            $this->img_path = __DIR__."/".session('loginUserId').".png";
            $this->excel_path = __DIR__."/".session('loginUserId').".xls";
            if(file_exists($this->cookie_path)) {
                $res = $this->matchDeliverToFetch(self::DRUGOOGLE_CODE, $date_from, $date_to);
                if ($res['success']) {
                    return $res;
                }
            }
            $res = $this->matchDeliverToLogin(self::DRUGOOGLE_CODE, $deliver_account);
            if(!$res['success']) {
                return $res;
            }
            return $this->matchDeliverToFetch(self::DRUGOOGLE_CODE, $date_from, $date_to);
        }else {
            return $this->bad("该商业公司的流向抓取暂未匹配，请联系管理员");
        }
    }

    private function matchDeliverToFetch($deliver_code, $date_from, $date_to) {
        if($deliver_code == self::DRUGOOGLE_CODE) {
            //访问基础页面
            $ch = curl_init();
            $timeout = 20;
            curl_setopt($ch, CURLOPT_URL, "http://www.drugoogle.com/member/agentman/medicineGoto/medicinegoto.jspx");
            curl_setopt($ch, CURLOPT_COOKIEFILE, $this->cookie_path); //使用存储的COOKIE
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $contents = curl_exec($ch);
            curl_close($ch);

            //解析基础页面获取交易单位
            $html = new \DOMDocument();
            $html->loadHTML($contents);
//            $html->loadHTMLFile(__DIR__."/test.html");
            $entry = $html->getElementById("entryId");
            if(!$entry) {
                return $this->bad("非正确页面");
            }

            $id_array = array();

            foreach($entry->childNodes as $item) {
                $id_array[] = $item->getAttribute("value");
            }

            if(count($id_array) == 0) {
                return $this->bad("非正确页面");
            }

            $result = array();
            foreach ($id_array as $id) {
                if($id != "") {
                    $ch = curl_init();
                    $timeout = 20;
                    $url = "http://www.drugoogle.com/member/suppliers/medicineGoto/medicinegotoexport.jspx"
                            ."?entryId=".$id."&medicineId=0&timeType=1&startTime=".$date_from."%2000:00:00&endTime="
                            .$date_to."%2023:59:59&tabFlag=4&userType=2&buyerType=0&storegeType=1&updateTime=20170927025511"
                            ."&month=&year=";
                    curl_setopt($ch, CURLOPT_URL, $url);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                    curl_setopt($ch, CURLOPT_HEADER, 0);
                    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
                    curl_setopt($ch, CURLOPT_COOKIEFILE, $this->cookie_path); //使用存储的COOKIE
                    $excel = curl_exec($ch);
                    curl_close($ch);
                    $fp = fopen($this->excel_path, "w");
                    fwrite($fp, $excel);
                    fclose($fp);

                    $result[$id] = $this->importExcelToDailySell($deliver_code);
                }
            }
            $res = false;
            foreach ($result as $item) {
                $res = $res || $item['success'];
            }
            return array(
                'success'=> $res,
                'msg' => $res? "导入成功" : "导入失败"
            );

        } elseif ($deliver_code == self::LX_CODE) {
            $ch = curl_init();
            $timeout = 20;
            $url = "http://www.600216.com/lx/download.asp?from=sa&searchGoodsid=&searchCustom=&searchDateBegin=".$date_from."&searchDateEnd=".$date_to;
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
            curl_setopt($ch, CURLOPT_COOKIEFILE, $this->cookie_path); //使用存储的COOKIE
            $excel = curl_exec($ch);
            curl_close($ch);
            $fp = fopen($this->excel_path, "w");
            fwrite($fp, $excel);
            fclose($fp);

            $result = $this->importExcelToDailySell($deliver_code);

            return array(
                'success'=> $result['success'],
                'msg' => $result['success'] ? "导入成功" : "导入失败"
            );
        }
    }

    private function matchDeliverToLogin($deliver_code, $deliver_account) {
        if($deliver_code == self::DRUGOOGLE_CODE) {
            $code_path= "http://www.drugoogle.com/verifyCode/verifyCode.jsp";
            $login_path = "http://www.drugoogle.com/index/registerloginjson.jspx";

            $user = array(
                'username' => 'username',
                'password' => 'password',
                'verifyCode' => 'verifyCode'
            );
        } elseif ($deliver_code == self::LX_CODE) {
            $code_path= "http://www.600216.com/lx/bmp.asp?flg=login";
            $login_path = "http://www.600216.com/lx/index.asp";

            $user = array(
                'username' => 'loginName',
                'password' => 'LoginPwd',
                'verifyCode' => 'imgcodes',
            );
        }


        for($index = 0; $index < 3; $index++) {
            $res = $this->loginInProcess($user, $code_path, $login_path, $deliver_account);
            if($res)
                return $this->ok(2);
        }
        return $this->bad("使用系统记录账号登录不成功,请确认账号是否正确");
    }

    private function matchExcelToDailySell($deliver_code, $params) {
        if($deliver_code == self::DRUGOOGLE_CODE) {
            $index_params = array(
                'hospital_name' => 'I',
                'drug_name' => 'C',
                'drug_guige' => 'D',
                'sell_amount' => 'G',
                'sell_date' => 'J',
                'batch_num' => 'E',
                'expire_time' => 'F',
            );
            $additional_params_fixed = array(
                'deliver_name' => $this->deliver_name,
                'drug_manufacture' => '',
                'note' => ''
            );
        } elseif ($deliver_code == self::LX_CODE) {
            $index_params = array(
                'hospital_name' => 'C',
                'drug_name' => 'E',
                'drug_guige' => 'G',
                'sell_amount' => 'L',
                'sell_date' => 'N',
                'batch_num' => 'J',
                'expire_time' => 'K',
            );
            $additional_params_fixed = array(
                'deliver_name' => $this->deliver_name,
                'drug_manufacture' => '',
                'note' => ''
            );
        } else {
            return $this->bad("该商业公司的流向抓取暂未匹配，请联系管理员");
        }

        $gs = new ImportService();
        return $gs->importDailySellFromExcelMatchParams($params, $index_params, $additional_params_fixed, $this->deliver_name);
    }

    private function loginInProcess($user, $code_path, $login_path, $deliver_account){
        try {
            /**
             * 获取COOKIE
             */
            if (!file_exists($this->cookie_path)) {
                $fp = fopen($this->cookie_path, "w");
                fclose($fp);
            }

            $ch = curl_init();
            $timeout = 20;
            curl_setopt($ch, CURLOPT_URL, $login_path);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
            curl_setopt($ch, CURLOPT_COOKIEJAR, $this->cookie_path); //获取COOKIE并存储
            $contents = curl_exec($ch);
            curl_close($ch);

            /**
             * 获取验证码
             */
            $ch = curl_init();
            $timeout = 20;
            curl_setopt($ch, CURLOPT_URL, $code_path);
            curl_setopt($ch, CURLOPT_COOKIEFILE, $this->cookie_path);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $img = curl_exec($ch);
            curl_close($ch);
            $fp = fopen($this->img_path, "w");
            fwrite($fp, $img);
            fclose($fp);

            /**
             * 识别验证码
             */
            $ch = curl_init();
            $timeout = 60;
            $data = array(
                "key" => "940237313709a9eaa2516d86e11bec81",
                "codeType" => "6001",
                "image" => curl_file_create($this->img_path, 'image/png', 'verifyCode.png')

            );
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_URL, 'http://op.juhe.cn/vercode/index');
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            $res = curl_exec($ch);
            curl_close($ch);

            $res_arr = json_decode($res, true);

            /**
             * 模拟登录
             */
            if($res_arr['error_code'] === 0) {
                $login_url = $login_path;
                $login_params = array(
                    $user['username'] => $deliver_account['username'],
                    $user['password'] => $deliver_account['password'],
                    $user['verifyCode'] => $res_arr['result']
                );
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_URL, $login_url);
                curl_setopt($ch,CURLOPT_COOKIEFILE, $this->cookie_path); //使用存储的COOKIE
                curl_setopt($ch, CURLOPT_POSTFIELDS, $login_params);
                $res = curl_exec($ch);
                curl_close($ch);

                $res_arr = json_decode($res, true);
                return $res_arr['success'];
            }else {
                return false;
            }

        }catch (Exception $e) {
            return false;
        }

    }

    private function importExcelToDailySell($deliver_code) {

        $params = array(
            "datafile" => $this->excel_path,
            "ext" => "xls"
        );
        return $this->matchExcelToDailySell($deliver_code, $params);
    }
}

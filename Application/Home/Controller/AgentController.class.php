<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Home\Service\ExportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\AgentService;
use Home\Common\FIdConst;

/**
 * 代理商资料Controller
 *
 * @author Baoyu Li
 *        
 */
class AgentController extends PSIBaseController {

	/**
	 * 代理商资料 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::AGENT_BASIC_INFO)) {
			$this->initVar();
			
			$this->assign("title", "代理商资料");

			$this->assign("pAddAgent",
				$us->hasPermission(FIdConst::AGENT_ADD) ? 1 : 0);
			$this->assign("pEditAgent",
				$us->hasPermission(FIdConst::AGENT_EDIT) ? 1 : 0);
			$this->assign("pDeleteAgent",
				$us->hasPermission(FIdConst::AGENT_DELETE) ? 1 : 0);
			$this->assign("pImportAgent", $us->hasPermission(FIdConst::AGENT_IMPORT) ? 1 : 0);
			$this->assign("pExportAgent", $us->hasPermission(FIdConst::AGENT_EXPORT) ? 1 : 0);
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Agent/index");
		}
	}
	/**
	 * 新增或编辑代理商
	 */
	public function editAgent(){
		if(IS_POST){
			$es = new AgentService();
			$params = array(
				"code" => I("post.code"),
                "agent_name" => I("post.agent_name"),
                "region" => I("post.region"),
                "duty_employee" => I("post.duty_employee"),
                "address" => I("post.address"),
                "link_name" => I("post.link_name"),
                "gender" => I("post.gender"),
				"mobile_phone" => I("post.mobile_phone"),
                "payment_way" => I("post.payment_way"),
                "telephone" => I("post.telephone"),
                "fax" => I("post.fax"),
				"qq" => I("post.qq"),
				"email" =>I("post.email"),
                "id_card" => I("post.id_card"),
                "bank_account" => I("post.bank_account"),
				"note" => I("post.note")
			);
			if(I("id")){
				$params["id"] = I("id");
			}
			$this->ajaxReturn($es->editAgent($params));
		}

	}
	/**
	 * 查询代理商列表
	 */
	public function listAgent(){
		if(IS_POST){
			$es = new AgentService();
			if(IS_POST){
				$params = array(
					"agent_name" => I("post.agent_name"),
					"page" => I("post.page"),
					"start" => 	I("post.start"),
					"limit"=> 	I("post.limit")
				);
				$this->ajaxReturn($es->listAgent($params));
			}

		}
	}

	/**
	 * 删除代理商
	 */
	public function deleteAgent(){
		if(IS_POST){
			$es = new AgentService();
			if(I("post.id")){
				$params["id"] = I("post.id");
			}
			$this->ajaxReturn($es->deleteAgent($params));
		}
	}


	/**
	 * 代理商自定义字段，查询代理商
	 */
	public function queryData() {
		if (IS_POST) {
			$params = array(
					"queryKey" => I("post.queryKey")
			);
			$cs = new AgentService();
			$this->ajaxReturn($cs->queryData($params));
		}
	}


	/**
	 * 通过Excel导入代理商资料
	 */
	public function import() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::AGENT_IMPORT)) {
				$this->ajaxReturn($this->noPermission("导入代理商"));
				return;
			}
			
			$upload = new \Think\Upload();
			
			// 允许上传的文件后缀
			$upload->exts = array(
					'xls',
					'xlsx'
			);
			
			// 保存路径
			$upload->savePath = '/Agent/';
			
			// 先上传文件
			$fileInfo = $upload->uploadOne($_FILES['data_file']);
			if (! $fileInfo) {
				$this->ajaxReturn(
						array(
								"msg" => $upload->getError(),
								"success" => false
						));
			} else {
				$uploadFileFullPath = './Uploads' . $fileInfo['savepath'] . $fileInfo['savename']; // 获取上传到服务器文件路径
				$uploadFileExt = $fileInfo['ext']; // 上传文件扩展名
				
				$params = array(
						"datafile" => $uploadFileFullPath,
						"ext" => $uploadFileExt
				);
				$cs = new ImportService();
				$this->ajaxReturn($cs->importAgentFromExcelFile($params));
			}
		}
	}

	/*导出代理商信息*/
	public function  exportAgentInfo(){
		$us = new UserService();
		if (! $us->hasPermission(FIdConst::AGENT_EXPORT_EXCEL)) {
			$this->ajaxReturn($this->noPermission("导出代理商excel"));
			return;
		}
		$exs = new ExportService();
		$exs->exportAgentInfo();
	}
}

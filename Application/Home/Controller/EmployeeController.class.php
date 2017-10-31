<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Home\Service\ExportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\EmployeeService;
use Home\Common\FIdConst;

/**
 * 业务员资料Controller
 *
 * @author Baoyu Li
 *        
 */
class EmployeeController extends PSIBaseController {

	/**
	 * 业务员资料 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::EMPLOYEE_BASIC_INFO)) {
			$this->initVar();
			
			$this->assign("title", "合作伙伴资料");

			$this->assign("pAddEmployee",
				$us->hasPermission(FIdConst::EMPLOYEE_ADD) ? 1 : 0);
			$this->assign("pEditEmployee",
				$us->hasPermission(FIdConst::EMPLOYEE_EDIT) ? 1 : 0);
			$this->assign("pDeleteEmployee",
				$us->hasPermission(FIdConst::EMPLOYEE_DELETE) ? 1 : 0);
			$this->assign("pImportEmployee", $us->hasPermission(FIdConst::EMPLOYEE_IMPORT) ? 1 : 0);
			$this->assign("pExportEmployee", $us->hasPermission(FIdConst::EMPLOYEE_EXPORT_EXCEL) ? 1 : 0);
			
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Employee/index");
		}
	}
	/**
	 * 新增或编辑业务员
	 */
	public function editEmployee(){
		if(IS_POST){
			$es = new EmployeeService();
			$params = array(
				"name" => I("post.name"),
				"code" => I("post.code"),
				"bank_account" => I("post.bank_account"),
				"phone" => I("post.phone"),
				"qq" => I("post.qq"),
				"email" =>I("post.email"),
				"pym" => I("post.pym"),
				"address" => I("post.address"),
				"note" => I("post.note"),
				"is_employee" => 	I("post.is_employee"),
				"is_off_job" => I("post.is_off_job"),
				"client_user_name" => I("post.client_user_name"),
				"client_password" => I("post.client_password"),
				"login_enable" => I("post.login_enable")
			);
			if(I("id")){
				$params["id"] = I("id");
			}
			$this->ajaxReturn($es->editEmployee($params));
		}

	}
	/**
	 * 查询业务员列表
	 */
	public function listEmployee(){
		if(IS_POST){
			$es = new EmployeeService();
			if(_POST){
				$params = array(
					"name" => I("post.name"),
					"phone" => I("post.phone"),
					"qq" => I("post.qq"),
					"page" => I("post.page"),
					"start" => 	I("post.start"),
					"limit"=> 	I("post.limit")
				);
				$this->ajaxReturn($es->listEmployee($params));
			}

		}
	}

	/**
	 * 删除业务员
	 */
	public function deleteEmployee(){
		if(IS_POST){
			$es = new EmployeeService();
			if(I("post.id")){
				$params["id"] = I("post.id");
			}
			$this->ajaxReturn($es->deleteEmployee($params));
		}
	}


	/**
	 * 业务员自定义字段，查询业务员
	 */
	public function queryData() {
		if (IS_POST) {
			$params = array(
					"queryKey" => I("post.queryKey")
			);
			$cs = new EmployeeService();
			$this->ajaxReturn($cs->queryData($params));
		}
	}


	/**
	 * 通过Excel导入业务员资料
	 */
	public function import() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::EMPLOYEE_IMPORT)) {
				$this->ajaxReturn($this->noPermission("导入业务员"));
				return;
			}
			
			$upload = new \Think\Upload();
			
			// 允许上传的文件后缀
			$upload->exts = array(
					'xls',
					'xlsx'
			);
			
			// 保存路径
			$upload->savePath = '/Employee/';
			
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
				$this->ajaxReturn($cs->importEmployeeFromExcelFile($params));
			}
		}
	}

	/*导出业务员信息*/
	public function  exportEmployeeInfo(){
		$us = new UserService();
		if (! $us->hasPermission(FIdConst::EMPLOYEE_EXPORT_EXCEL)) {
			$this->ajaxReturn($this->noPermission("导出业务员excel"));
			return;
		}
		$exs = new ExportService();
		$exs->exportEmployeeInfo();
	}
}

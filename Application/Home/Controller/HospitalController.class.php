<?php

namespace Home\Controller;

use Home\Service\ImportService;
use Think\Controller;
use Home\Service\UserService;
use Home\Service\HospitalService;
use Home\Common\FIdConst;

/**
 * 医院Controller
 *
 * @author Baoyu Li
 *        
 */
class HospitalController extends PSIBaseController {

	/**
	 * 医院 - 主页面
	 */
	public function index() {
		$us = new UserService();
		
		if ($us->hasPermission(FIdConst::HOSPITAL_BASIC_INFO)) {
			$this->initVar();
			
			$this->assign("title", "医院信息");
			
			$this->assign("pAddHospital",
					$us->hasPermission(FIdConst::HOSPITAL_ADD) ? 1 : 0);
			$this->assign("pEditHospital",
					$us->hasPermission(FIdConst::HOSPITAL_EDIT) ? 1 : 0);
			$this->assign("pDeleteHospital",
					$us->hasPermission(FIdConst::HOSPITAL_DELETE) ? 1 : 0);
			$this->assign("pImportHospital", $us->hasPermission(FIdConst::HOSPITAL_IMPORT) ? 1 : 0);
			$this->assign("pExportHospital", $us->hasPermission(FIdConst::HOSPITAL_EXPORT) ? 1 : 0);
			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Hospital/index");
		}
	}


	/**
	 * 医院等级主页面
	 */
	public function typeIndex() {
		$us = new UserService();

		if ($us->hasPermission(FIdConst::HOSPITAL_BASIC_INFO)) {
			$this->initVar();

			$this->assign("title", "医院等级");

			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Hospital/unitIndex");
		}
	}

	/**
	 * 获得所有的医院等级列表
	 */
	public function allTypes() {
		if (IS_POST) {
			$gs = new HospitalService();
			$this->ajaxReturn($gs->allUnits());
		}
	}

	/**
	 * 新增或编辑医院单位
	 */
	public function editType() {
		if (IS_POST) {
			$params = array(
				"id" => I("post.id"),
				"name" => I("post.name")
			);
			$gs = new HospitalService();
			$this->ajaxReturn($gs->editUnit($params));
		}
	}

	/**
	 * 删除医院等级
	 */
	public function deleteType() {
		if (IS_POST) {
			$params = array(
				"id" => I("post.id")
			);
			$gs = new HospitalService();
			$this->ajaxReturn($gs->deleteUnit($params));
		}
	}

	/**
	 * 获得医院分类
	 */
	public function allRegions() {
		if (IS_POST) {
			$gs = new HospitalService();
			$params = array(
				"hospital_name" => I("post.hospital_name"),
				"hospital_type" => I("post.hospital_type")
			);
			$this->ajaxReturn($gs->allRegions($params));
		}
	}


	/**
	 * 获得医院列表
	 */
	public function hospitalList() {
		if (IS_POST) {
			$params = array(
				"region_id" => I("post.region_id"),
				"hospital_name" => I("post.hospital_name"),
				"hospital_type" => I("post.hospital_type"),
			);
			$gs = new HospitalService();
			$this->ajaxReturn($gs->hospitalList($params));
		}
	}

	/**
	 * 新增或编辑医院
	 */
	public function editHospital() {
		if (IS_POST) {
			$us = new UserService();
			if (I("post.id")) {
				// 编辑医院
				if (! $us->hasPermission(FIdConst::HOSPITAL_EDIT)) {
					$this->ajaxReturn($this->noPermission("编辑医院"));
					return;
				}
			} else {
				// 新增医院
				if (! $us->hasPermission(FIdConst::HOSPITAL_ADD)) {
					$this->ajaxReturn($this->noPermission("新增医院"));
					return;
				}
			}

			$params = array(
				"id" => I("post.id"),
				"hospital_code" => I("post.hospital_code"),
				"hospital_name" => I("post.hospital_name"),
				"region_id" => I("post.region_id"),
				"hospital_type" => I("post.hospital_type"),
				"pym" => I("post.pym"),
				"note" => I("post.note"),
				"manager" => I("post.manager")
			);
			$gs = new HospitalService();
			$this->ajaxReturn($gs->editHospital($params));
		}
	}

	/**
	 * 删除医院
	 */
	public function deleteHospital() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::HOSPITAL_DELETE)) {
				$this->ajaxReturn($this->noPermission("删除医院"));
				return;
			}

			$params = array(
				"id" => I("post.id")
			);
			$gs = new HospitalService();
			$this->ajaxReturn($gs->deleteHospital($params));
		}
	}

	/**
	 * 医院自定义字段，查询数据
	 */
	public function queryData() {
		if (IS_POST) {
			$queryKey = I("post.queryKey");
			$gs = new HospitalService();
			$this->ajaxReturn($gs->queryData($queryKey));
		}
	}

	/**
	 * 医院自定义字段，查询数据
	 */
	public function queryDataWithSalePrice() {
		if (IS_POST) {
			$queryKey = I("post.queryKey");
			$gs = new HospitalService();
			$this->ajaxReturn($gs->queryDataWithSalePrice($queryKey));
		}
	}

	/**
	 * 医院自定义字段，查询数据
	 */
	public function queryDataWithPurchasePrice() {
		if (IS_POST) {
			$queryKey = I("post.queryKey");
			$gs = new HospitalService();
			$this->ajaxReturn($gs->queryDataWithPurchasePrice($queryKey));
		}
	}

	/**
	 * 查询某个医院的信息
	 */
	public function hospitalInfo() {
		if (IS_POST) {
			$id = I("post.id");
			$regionId = I("post.region_id");
			$gs = new HospitalService();
			$data = $gs->getHospitalInfo($id, $regionId);
			$this->ajaxReturn($data);
		}
	}

	/**
	 * 获得医院的安全库存信息
	 */
	public function hospitalSafetyInventoryList() {
		if (IS_POST) {
			$params = array(
				"id" => I("post.id")
			);
			$gs = new HospitalService();
			$this->ajaxReturn($gs->hospitalSafetyInventoryList($params));
		}
	}

	/**
	 * 设置安全库存时候，查询信息
	 */
	public function siInfo() {
		if (IS_POST) {
			$params = array(
				"id" => I("post.id")
			);
			$gs = new HospitalService();
			$this->ajaxReturn($gs->siInfo($params));
		}
	}

	/**
	 * 设置安全库存
	 */
	public function editSafetyInventory() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::GOODS_SI)) {
				$this->ajaxReturn($this->noPermission("设置医院安全库存"));
				return;
			}

			$params = array(
				"jsonStr" => I("post.jsonStr")
			);
			$gs = new HospitalService();
			$this->ajaxReturn($gs->editSafetyInventory($params));
		}
	}

	/**
	 * 根据条形码，查询医院信息, 销售出库单使用
	 */
	public function queryHospitalInfoByBarcode() {
		if (IS_POST) {
			$params = array(
				"barcode" => I("post.barcode")
			);
			$gs = new HospitalService();
			$this->ajaxReturn($gs->queryHospitalInfoByBarcode($params));
		}
	}

	/**
	 * 根据条形码，查询医院信息, 采购入库单使用
	 */
	public function queryHospitalInfoByBarcodeForPW() {
		if (IS_POST) {
			$params = array(
				"barcode" => I("post.barcode")
			);
			$gs = new HospitalService();
			$this->ajaxReturn($gs->queryHospitalInfoByBarcodeForPW($params));
		}
	}

	/**
	 * 通过Excel导入医院
	 */
	public function import() {
		if (IS_POST) {
			$us = new UserService();
			if (! $us->hasPermission(FIdConst::HOSPITAL_IMPORT)) {
				$this->ajaxReturn($this->noPermission("导入医院"));
				return;
			}

			$upload = new \Think\Upload();

			// 允许上传的文件后缀
			$upload->exts = array(
				'xls',
				'xlsx'
			);

			// 保存路径
			$upload->savePath = '/Hospital/';

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
				$ims = new ImportService();
				$this->ajaxReturn($ims->importHospitalFromExcelFile($params));
			}
		}
	}

	/**
	 * 获得所有的医院种类数
	 */
	public function getTotalHospitalCount() {
		if (IS_POST) {
			$params = array(
				"hospital_name" => I("post.hospital_name"),
				"hospital_type" => I("post.hospital_type")
			);

			$gs = new HospitalService();
			$this->ajaxReturn($gs->getTotalHospitalCount($params));
		}
	}

	/**
	 * 医院品牌主页面
	 */
	public function brandIndex() {
		$us = new UserService();

		if ($us->hasPermission(FIdConst::GOODS_BRAND)) {
			$this->initVar();

			$this->assign("title", "医院品牌");

			$this->display();
		} else {
			$this->gotoLoginPage("/Home/Hospital/brandIndex");
		}
	}

	/**
	 * 获得所有的品牌
	 */
	public function allBrands() {
		if (IS_POST) {
			$gs = new HospitalService();
			$this->ajaxReturn($gs->allBrands());
		}
	}

	/**
	 * 新增或编辑医院品牌
	 */
	public function editBrand() {
		if (IS_POST) {
			$params = array(
				"id" => I("post.id"),
				"name" => I("post.name"),
				"parentId" => I("post.parentId")
			);

			$gs = new HospitalService();
			$this->ajaxReturn($gs->editBrand($params));
		}
	}

	/**
	 * 获得某个品牌的上级品牌全称
	 */
	public function brandParentName() {
		if (IS_POST) {
			$params = array(
				"id" => I("post.id")
			);

			$gs = new HospitalService();
			$this->ajaxReturn($gs->brandParentName($params));
		}
	}

	/**
	 * 删除医院品牌
	 */
	public function deleteBrand() {
		if (IS_POST) {
			$params = array(
				"id" => I("post.id")
			);

			$gs = new HospitalService();
			$this->ajaxReturn($gs->deleteBrand($params));
		}
	}

	/**
	 * 某个医院的医院构成
	 */
	public function hospitalBOMList() {
		if (IS_POST) {
			$params = array(
				"id" => I("post.id")
			);

			$gs = new HospitalService();
			$this->ajaxReturn($gs->hospitalBOMList($params));
		}
	}

	/**
	 * 获取某个医院的药品信息
	 * @author huxinlu
	 */
	public function hospitalToDrug() {
		if (IS_POST) {
			$params = array(
				"user_id" => I("post.user_id"),
				"hospital_id" => I("post.hospital_id"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$gs = new HospitalService();
			$this->ajaxReturn($gs->hospitalToDrug($params));
		}
	}

	/**
	 * 获取某个用户已选择的某个医院的药品
	 * @author huxinlu
	 */
	public function selectedHospitalToDrug() {
		if (IS_POST) {
			$params = array(
				"user_id" => I("post.user_id"),
				"hospital_id" => I("post.hospital_id"),
				"page" => I("post.page"),
				"start" => I("post.start"),
				"limit" => I("post.limit")
			);
			$gs = new HospitalService();
			$this->ajaxReturn($gs->selectedHospitalToDrug($params));
		}
	}

	/**
	 * 可视或不可视所有医院(if_view=1,所有可视;if_view=0,所有不可视 )
	 * @author huxinlu
	 */
	public function viewAllHospital()
	{
		$us = new UserService();
		if (! $us->hasPermission(FIdConst::HOSPITAL_ADD_ALL)) {
			$this->ajaxReturn($this->noPermission("没有该权限"));
			return;
		}

		$params = array(
			"user_id" => I("post.user_id"),
			"if_view" => I("post.if_view"),
		);

		$gs = new HospitalService();
		$this->ajaxReturn($gs->viewAllHospital($params));
	}

	/**
	 * 导入医院列表
	 * @author huxinlu
	 */
	public function importHospitalExcelList()
	{
		$upload = new \Think\Upload();

		// 允许上传的文件后缀
		$upload->exts = array(
			'xls',
			'xlsx'
		);

		// 保存路径
		$upload->savePath = '/Hospital/';

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
			$ims = new ImportService();
			$this->ajaxReturn($ims->importHospitalFromExcelFile($params));
		}
	}


	/**
	 * 一次性导入地区对应医院数量的数据
	 * @author huxinlu
	 */
	public function importRegion2Hospital()
	{
		$hospital = new HospitalService();
		$result = $hospital->importRegion2Hospital();
		$this->ajaxReturn($result);
	}

	/**
	 * 删除所有医院
	 * @author huxinlu
	 */
	public function deleteAllHospital()
	{
		$us = new UserService();
		if (! $us->hasPermission(FIdConst::HOSPITAL_ADD_ALL)) {
			$this->ajaxReturn($this->noPermission("删除所有医院"));
			return;
		}

		$params = array(
			"user_id" => I("post.user_id"),
		);

		$gs = new HospitalService();
		$this->ajaxReturn($gs->addAllHospital($params));
	}

    /**
     * 获取医院缓存
     * @author wanbing.shi
     */
    public function getHospitalTempCount() {
        $gs = new HospitalService();
        $this->ajaxReturn($gs->getHospitalTempCount());
    }

    /**
     * 删除医院缓存
     * @author wanbing.shi
     */
    public function deleteTemp() {
        $gs = new HospitalService();
        $this->ajaxReturn($gs->deleteTemp());
    }

    /**
     * 获取医院缓存
     * @author wanbing.shi
     */
    public function getHospitalTempList() {
        $gs = new HospitalService();
        $this->ajaxReturn($gs->getHospitalTempList());
    }

    /**
     * 将缓存导入医院列表
     * @author wanbing.shi
     */
    public function importTempToHospital() {
        if (IS_POST) {

            $tempList = I('post.tempList');

            $gs = new HospitalService();
            $this->ajaxReturn($gs->importTempToHospital($tempList));

        }
    }

    /**
     * 删除医院缓存
     * @author wanbing.shi
     */
    public function deleteTempToHospital() {
        if (IS_POST) {

            $tempList = I('post.tempList');

            $gs = new HospitalService();
            $this->ajaxReturn($gs->deleteTempToHospital($tempList));

        }
    }
}

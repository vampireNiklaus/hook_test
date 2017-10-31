<?php

namespace Home\Service;

use Home\Common\FIdConst;
use Think\Exception;

/**
 * 业务员Service
 *
 * @author Baoyu Li
 */
class HospitalService extends PSIBaseService {
    private $LOG_CATEGORY_HOSPITAL = "基础数据-医院";
    private $LOG_HOSPITAL_TYPE = "基础数据-医院等级";

    /**
     * 返回所有医院等级
     */
    public function allTypes() {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $db = M();
        $sql = "select id, name
				from t_goods_unit
				order by convert(name USING gbk) collate gbk_chinese_ci";

        return $db->query($sql);
    }

    /**
     * 新建或者编辑医院等级
     */
    public function editType($params) {
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $name = $params["name"];

        $db = M();
        $db->startTrans();

        $log = null;

        if ($id) {
            // 编辑
            // 检查医院等级是否存在
            $sql = "select count(*) as cnt from t_goods_unit where name = '%s' and id <> '%s' ";
            $data = $db->query($sql, $name, $id);
            $cnt = $data[0]["cnt"];
            if ($cnt > 0) {
                $db->rollback();
                return $this->bad("医院等级 [$name] 已经存在");
            }

            $sql = "update t_goods_unit set name = '%s' where id = '%s' ";
            $rc = $db->execute($sql, $name, $id);
            if ($rc === false) {
                $db->rollback();
                return $this->sqlError(__LINE__);
            }

            $log = "编辑医院等级: $name";
        } else {
            // 新增
            // 检查医院等级是否存在
            $sql = "select count(*) as cnt from t_goods_unit where name = '%s' ";
            $data = $db->query($sql, $name);
            $cnt = $data[0]["cnt"];
            if ($cnt > 0) {
                $db->rollback();
                return $this->bad("医院等级 [$name] 已经存在");
            }

            $idGen = new IdGenService();
            $id = $idGen->newId();

            $us = new UserService();
            $dataOrg = $us->getLoginUserDataOrg();
            $companyId = $us->getCompanyId();

            $sql = "insert into t_goods_unit(id, name, data_org, company_id)
					values ('%s', '%s', '%s', '%s') ";
            $rc = $db->execute($sql, $id, $name, $dataOrg, $companyId);
            if ($rc === false) {
                $db->rollback();
                return $this->sqlError(__LINE__);
            }

            $log = "新增医院等级: $name";
        }

        // 记录业务日志
        if ($log) {
            $bs = new BizlogService();
            $bs->insertBizlog($log, $this->LOG_CATEGORY_UNIT);
        }

        $db->commit();

        return $this->ok($id);
    }

    /**
     * 删除医院等级
     */
    public function deleteType($params) {
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];

        $db = M();
        $db->startTrans();

        $sql = "select name from t_goods_unit where id = '%s' ";
        $data = $db->query($sql, $id);
        if (! $data) {
            $db->rollback();
            return $this->bad("要删除的医院等级不存在");
        }
        $name = $data[0]["name"];

        // 检查记录单位是否被使用
        $sql = "select count(*) as cnt from t_goods where unit_id = '%s' ";
        $data = $db->query($sql, $id);
        $cnt = $data[0]["cnt"];
        if ($cnt > 0) {
            $db->rollback();
            return $this->bad("医院等级 [$name] 已经被使用，不能删除");
        }

        $sql = "delete from t_goods_unit where id = '%s' ";
        $rc = $db->execute($sql, $id);
        if ($rc === false) {
            $db->rollback();
            return $this->sqlError(__LINE__);
        }

        $log = "删除医院等级: $name";
        $bs = new BizlogService();
        $bs->insertBizlog($log, $this->LOG_CATEGORY_UNIT);

        $db->commit();

        return $this->ok();
    }

    private function allRegionsInternal($db, $parentId, $rs, $params) {
        $hospital_name = $params["hospital_name"];
        $hospital_type = $params["hospital_type"];

        $result = array();
        $sql = "select  *
				from info_region r
				where (parent_id = '%s')
				";
        $queryParam = array();
        $queryParam[] = $parentId;
        if ($rs) {
            $sql .= " and " . $rs[0];
            $queryParam = array_merge($queryParam, $rs[1]);
        }

        $sql .= " order by id";
        $data = $db->query($sql, $queryParam);
        foreach ( $data as $i => $v ) {
            $id = $v["id"];
            $result[$i]["id"] = $v["id"];
            $result[$i]["region_name"] = $v["region_name"];
            $result[$i]["region_type"] = $v["region_type"];
            $result[$i]["parent_id"] = $v["parent_id"];

            $children = $this->allRegionsInternal($db, $id, $rs, $params); // 自身递归调用

            $result[$i]["children"] = $children;
            $result[$i]["leaf"] = count($children) == 0;
            $result[$i]["expanded"] = true;

            $result[$i]["cnt"] = $this->getHospitalCountWithAllSub($db, $id, $params, $rs);
        }

        return $result;
    }

    /**
     * 获得某个区域及其所属子区域下的所有医院的数量
     */
    private function getHospitalCountWithAllSub($db, $categoryId, $params, $rs) {
        $hospital_name = $params["hospital_name"];
        $hospital_type = $params["hospital_type"];

        $sql = "select count(*) as cnt
					from info_hospital h
					where h.region_id = '%s' ";
        $queryParam = array();
        $queryParam[] = $categoryId;
        if ($rs) {
            $sql .= " and " . $rs[0];
            $queryParam = array_merge($queryParam, $rs[1]);
        }
        if ($hospital_type) {
            $sql .= " and (h.hospital_type like '%s') ";
            $queryParam[] = "%{$hospital_type}%";
        }
        if ($hospital_name) {
            $sql .= " and (h.hospital_name like '%s' or h.pym like '%s') ";
            $queryParam[] = "%{$hospital_name}%";
            $queryParam[] = "%{$hospital_name}%";
        }


        $data = $db->query($sql, $queryParam);
        $result = $data[0]["cnt"];

        // 子区域
        $sql = "select id
				from info_region h
				where (parent_id = '%s')
				";
        $queryParam = array();
        $queryParam[] = $categoryId;
        if ($rs) {
            $sql .= " and " . $rs[0];
            $queryParam = array_merge($queryParam, $rs[1]);
        }

        $data = $db->query($sql, $queryParam);
        foreach ( $data as $v ) {
            // 递归调用自身
            $result += $this->getHospitalCountWithAllSub($db, $v["id"], $params, $rs);
        }
        return $result;
    }


    /**
     * 返回所有的区域
     */
    public function allRegions($params) {
        if($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $region_db = M('info_region');
        $provinces_regions = $region_db->field(array('id', 'region_name', 'hospital_count'))->where('parent_id = 0 AND hospital_count > 0')->select();
        foreach ($provinces_regions as $p_index => $province_region) {
            $provinces_regions[$p_index]['leaf'] =  false;
            $provinces_regions[$p_index]['expanded'] = true;
            $provinces_regions[$p_index]['children'] = $region_db->field(array('id', 'region_name', 'hospital_count'))->where('parent_id = %d', $province_region)->select();
            foreach ($provinces_regions[$p_index]['children'] as $c_index => $city_region) {
                $provinces_regions[$p_index]['children'][$c_index]['leaf'] = false;
                $provinces_regions[$p_index]['children'][$c_index]['expanded'] = true;
                $provinces_regions[$p_index]['children'][$c_index]['children'] = $region_db->field(array('id', 'region_name', 'hospital_count'))->where('parent_id = %d', $city_region)->select();
                foreach ($provinces_regions[$p_index]['children'][$c_index]['children'] as $index => $country_region) {
                    $provinces_regions[$p_index]['children'][$c_index]['children'][$index]['leaf'] = true;
                    $provinces_regions[$p_index]['children'][$c_index]['children'][$index]['expanded'] = true;
                    $provinces_regions[$p_index]['children'][$c_index]['children'][$index]['children'] = [];
                }
            }
        }
        return $provinces_regions;
    }

    /**
     * 同步子区域的full_name字段
     */
    private function updateSubRegionFullName($db, $id) {
        $sql = "select full_name from t_goods_category where id = '%s' ";
        $data = $db->query($sql, $id);
        if (! $data) {
            return true;
        }

        $fullName = $data[0]["full_name"];
        $sql = "select id, name from t_goods_category where parent_id = '%s' ";
        $data = $db->query($sql, $id);
        foreach ( $data as $v ) {
            $subId = $v["id"];
            $name = $v["name"];

            $subFullName = $fullName . "\\" . $name;
            $sql = "update t_goods_category
					set full_name = '%s'
					where id = '%s' ";
            $rc = $db->execute($sql, $subFullName, $subId);
            if ($rc === false) {
                return false;
            }

            $rc = $this->updateSubRegionFullName($db, $subId); // 递归调用自身
            if ($rc === false) {
                return false;
            }
        }

        return true;
    }

    /**
     * 获得某个区域的详情
     */
    public function getRegionInfo($params) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $id = $params["id"];
        $result = array();

        $db = M();
        $sql = "select code, name, parent_id from t_goods_category
				where id = '%s' ";
        $data = $db->query($sql, $id);
        if ($data) {
            $v = $data[0];
            $result["code"] = $v["code"];
            $result["name"] = $v["name"];
            $parentId = $v["parent_id"];
            $result["parentId"] = $parentId;
            if ($parentId) {
                $sql = "select full_name from t_goods_category where id = '%s' ";
                $data = $db->query($sql, $parentId);
                $result["parentName"] = $data[0]["full_name"];
            } else {
                $result["parentName"] = null;
            }
        }

        return $result;
    }

    /**
     * 新建或者编辑区域
     */
    public function editRegion($params) {
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $code = $params["code"];
        $name = $params["name"];
        $parentId = $params["parentId"];

        $db = M();
        $db->startTrans();

        if ($parentId) {
            // 检查id是否存在
            $sql = "select count(*) as cnt from t_goods_category where id = '%s' ";
            $data = $db->query($sql, $parentId);
            $cnt = $data[0]["cnt"];
            if ($cnt != 1) {
                $db->rollback();
                return $this->bad("上级分类不存在");
            }
        }

        if ($id) {
            // 编辑
            // 检查同编码的分类是否存在
            $sql = "select count(*) as cnt from t_goods_category where code = '%s' and id <> '%s' ";
            $data = $db->query($sql, $code, $id);
            $cnt = $data[0]["cnt"];
            if ($cnt > 0) {
                $db->rollback();
                return $this->bad("编码为 [{$code}] 的分类已经存在");
            }

            if ($parentId) {
                if ($parentId == $id) {
                    $db->rollback();
                    return $this->bad("上级分类不能是自身");
                }

                $tempParentId = $parentId;
                while ( $tempParentId != null ) {
                    $sql = "select parent_id from t_goods_category where id = '%s' ";
                    $d = $db->query($sql, $tempParentId);
                    if ($d) {
                        $tempParentId = $d[0]["parent_id"];

                        if ($tempParentId == $id) {
                            $db->rollback();
                            return $this->bad("不能选择下级分类作为上级分类");
                        }
                    } else {
                        $tempParentId = null;
                    }
                }

                $sql = "select full_name from t_goods_category where id = '%s' ";
                $data = $db->query($sql, $parentId);
                $fullName = $name;
                if ($data) {
                    $fullName = $data[0]["full_name"] . "\\" . $name;
                }

                $sql = "update t_goods_category
					set code = '%s', name = '%s', parent_id = '%s', full_name = '%s'
					where id = '%s' ";
                $rc = $db->execute($sql, $code, $name, $parentId, $fullName, $id);
                if ($rc === false) {
                    $db->rollback();
                    return $this->sqlError(__LINE__);
                }
            } else {
                $sql = "update t_goods_category
					set code = '%s', name = '%s', parent_id = null, full_name = '%s'
					where id = '%s' ";
                $rc = $db->execute($sql, $code, $name, $name, $id);
                if ($rc === false) {
                    $db->rollback();
                    return $this->sqlError(__LINE__);
                }
            }

            // 同步子区域的full_name字段
            $rc = $this->updateSubRegionFullName($db, $id);
            if ($rc === false) {
                $db->rollback();
                return $this->sqlError(__LINE__);
            }

            $log = "编辑区域: 编码 = {$code}， 分类名称 = {$name}";
        } else {
            // 新增
            // 检查同编码的分类是否存在
            $sql = "select count(*) as cnt from t_goods_category where code = '%s' ";
            $data = $db->query($sql, $code);
            $cnt = $data[0]["cnt"];
            if ($cnt > 0) {
                $db->rollback();
                return $this->bad("编码为 [{$code}] 的分类已经存在");
            }

            $idGen = new IdGenService();
            $id = $idGen->newId();
            $us = new UserService();
            $dataOrg = $us->getLoginUserDataOrg();
            $companyId = $us->getCompanyId();

            if ($parentId) {
                $sql = "select full_name from t_goods_category where id = '%s' ";
                $data = $db->query($sql, $parentId);
                $fullName = "";
                if ($data) {
                    $fullName = $data[0]["full_name"];
                    $fullName .= "\\" . $name;
                }

                $sql = "insert into t_goods_category (id, code, name, data_org, parent_id,
							full_name, company_id)
						values ('%s', '%s', '%s', '%s', '%s', '%s', '%s')";
                $rc = $db->execute($sql, $id, $code, $name, $dataOrg, $parentId, $fullName,
                    $companyId);
                if ($rc === false) {
                    $db->rollback();
                    return $this->sqlError(__LINE__);
                }
            } else {
                $sql = "insert into t_goods_category (id, code, name, data_org, full_name, company_id)
					values ('%s', '%s', '%s', '%s', '%s', '%s')";
                $rc = $db->execute($sql, $id, $code, $name, $dataOrg, $name, $companyId);
                if ($rc === false) {
                    $db->rollback();
                    return $this->sqlError(__LINE__);
                }
            }

            $log = "新增区域: 编码 = {$code}， 分类名称 = {$name}";
        }

        // 记录业务日志
        if ($log) {
            $bs = new BizlogService();
            $bs->insertBizlog($log, $this->LOG_CATEGORY_HOSPITAL);
        }

        $db->commit();

        return $this->ok($id);
    }

    /**
     * 删除区域
     */
    public function deleteRegion($params) {
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];

        $db = M();
        $db->startTrans();

        $sql = "select code, name from t_goods_category where id = '%s' ";
        $data = $db->query($sql, $id);
        if (! $data) {
            $db->rollback();
            return $this->bad("要删除的区域不存在");
        }
        $code = $data[0]["code"];
        $name = $data[0]["name"];

        $sql = "select count(*) as cnt from t_goods where category_id = '%s' ";
        $data = $db->query($sql, $id);
        $cnt = $data[0]["cnt"];
        if ($cnt > 0) {
            $db->rollback();
            return $this->bad("还有属于区域 [{$name}] 的医院，不能删除该分类");
        }

        $sql = "delete from t_goods_category where id = '%s' ";
        $rc = $db->execute($sql, $id);
        if ($rc === false) {
            $db->rollback();
            return $this->sqlError(__LINE__);
        }

        $log = "删除区域：  编码 = {$code}， 分类名称 = {$name}";
        $bs = new BizlogService();
        $bs->insertBizlog($log, $this->LOG_CATEGORY_HOSPITAL);

        $db->commit();

        return $this->ok();
    }

    /**
     * 医院列表
     */
    public function hospitalList($params) {
        //不需要再分页了
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $hospital_db = M('info_hospital');

        import("ORG.Util.Page");
        if($params['region_id']){
            $temp = M('info_region')->where('id='.$params['region_id'])->select();
            if($temp[0]['region_type'] == 1) {
                unset($params['region_id']);
                $whereStr = $this->likeSearch($params);
                $all_data = $hospital_db->where($whereStr)->select();
            }elseif ($temp[0]['region_type'] == 3) {
                $whereStr = $this->likeSearch($params);
                $all_data = $hospital_db->where($whereStr)->select();
            } else {
                $children=M('info_region')->where('parent_id='.$params['region_id'])->select();
                if(count($children)>0){
                    $all_data = array();
                    foreach ($children as $k=>$v){
                        $params['region_id'] = $v['id'];
                        $whereStr = $this->likeSearch($params);
                        $all_data_temp = $hospital_db->where($whereStr)->select();
                        if($all_data_temp != NULL) {
                            $all_data = array_merge($all_data, $all_data_temp);
                        }
                    }
                }else {
                    $whereStr = $this->likeSearch($params);
                    $all_data = $hospital_db->where($whereStr)->select();
                }
            }

        }else {
            $whereStr = $this->likeSearch($params);
            $all_data = $hospital_db->where($whereStr)->select();
        }
        return array(
            "hospitalList" => $all_data,
        );
    }

    /*
     * 根据区域id获取
     */
    public function searchByAreaId($id,$page,$limit,&$result=array()){
        $re=M('info_hospital')->where('region_id='.$id)->select();
        if(count($re)>0) {
            $result = array_merge($result, $re);
        }
        $children=M('info_region')->where('parent_id='.$id)->select();
        if(count($children)>0){
            foreach ($children as $k=>$v){
                $this->searchByAreaId($v['id'],$page,$limit,$result);
            }
        }
        return $result;
    }

    public function  getAllSubHospitalList($params){
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $hospital_db = M('info_hospital');
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        unset($params['page']);
        unset($params['start']);
        unset($params['limit']);

        import("ORG.Util.Page");
        $whereStr = $this->likeSearch($params);



    }
    public function getBrandFullNameById($db, $brandId) {
        $sql = "select full_name from t_goods_brand where id = '%s' ";
        $data = $db->query($sql, $brandId);
        if ($data) {
            return $data[0]["full_name"];
        } else {
            return null;
        }
    }

    /**
     * 新建或编辑医院
     */
    public function editHospital($params) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        //转换拼音码
        $ps = new PinyinService();
        $py = $ps->toPY($params['hospital_name']);
        $params['pym'] = $py;
        $hospital_db = D('info_hospital');
        $queryString = " hospital_name='".$params['hospital_name']."' ";
        if($params['id']){
            if(count($hospital_db->where($queryString." and id<>".$params['id'])->select())>0){
                return $this->bad("该名称的医院已经存在!请更换其他名称");
            }
            $hospital = $hospital_db->where('id = '.$params['id'])->find();
            if ($hospital['region_id'] != $params['region_id']) {
                //修改区域对应医院数量信息
                $this->deleteHospitalCountByRegion($hospital['region_id'], 1);
                $this->addHospitalCountByRegion($params['region_id'], 1);
            }
            $hospital_db->save($params);
        }else{
            if(count($hospital_db->where($queryString)->select())>0){
                return $this->bad("该名称的医院已经存在！请更换其他名称");
            }

            //修改区域对应医院数量信息
            $this->addHospitalCountByRegion($params['region_id'], 1);

            $params['id'] = $hospital_db->add($params);

        }
        return $this->ok($params['id']);
    }

    /**
     * 删除医院
     */
    public function deleteHospital($params) {
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }
        return $this->bad("医院涉及到很多重要业务信息，不能随便删除，请联系系统管理员");
    }

    /**
     * 医院字段，查询数据
     */
    public function queryData($queryKey) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        if ($queryKey == null) {
            $queryKey = "";
        }

        $sql = "select *
				from info_hospital
				where (hospital_name like '%".$queryKey."%' or pym like '%".$queryKey."%') ";
        $sql .= " order by hospital_name
				limit 20";
        return M()->query($sql);
    }

    /**
     * 医院字段，查询数据
     *
     * @param unknown $queryKey
     */
    public function queryDataWithSalePrice($queryKey) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        if ($queryKey == null) {
            $queryKey = "";
        }

        $key = "%{$queryKey}%";

        $sql = "select g.id, g.code, g.name, g.spec, u.name as unit_name, g.sale_price, g.memo
				from t_goods g, t_goods_unit u
				where (g.unit_id = u.id)
				and (g.code like '%s' or g.name like '%s' or g.py like '%s'
					or g.spec like '%s' or g.spec_py like '%s') ";

        $queryParams = array();
        $queryParams[] = $key;
        $queryParams[] = $key;
        $queryParams[] = $key;
        $queryParams[] = $key;
        $queryParams[] = $key;

        $ds = new DataOrgService();
        $rs = $ds->buildSQL("1001-01", "g");
        if ($rs) {
            $sql .= " and " . $rs[0];
            $queryParams = array_merge($queryParams, $rs[1]);
        }

        $sql .= " order by g.code
				limit 20";
        $data = M()->query($sql, $queryParams);
        $result = array();
        foreach ( $data as $i => $v ) {
            $result[$i]["id"] = $v["id"];
            $result[$i]["code"] = $v["code"];
            $result[$i]["name"] = $v["name"];
            $result[$i]["spec"] = $v["spec"];
            $result[$i]["unitName"] = $v["unit_name"];
            $result[$i]["salePrice"] = $v["sale_price"];
            $result[$i]["memo"] = $v["memo"];
        }

        return $result;
    }

    /**
     * 医院字段，查询数据
     */
    public function queryDataWithPurchasePrice($queryKey) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        if ($queryKey == null) {
            $queryKey = "";
        }

        $key = "%{$queryKey}%";

        $sql = "select g.id, g.code, g.name, g.spec, u.name as unit_name, g.purchase_price, g.memo
				from t_goods g, t_goods_unit u
				where (g.unit_id = u.id)
				and (g.code like '%s' or g.name like '%s' or g.py like '%s'
					or g.spec like '%s' or g.spec_py like '%s') ";

        $queryParams = array();
        $queryParams[] = $key;
        $queryParams[] = $key;
        $queryParams[] = $key;
        $queryParams[] = $key;
        $queryParams[] = $key;

        $ds = new DataOrgService();
        $rs = $ds->buildSQL("1001-01", "g");
        if ($rs) {
            $sql .= " and " . $rs[0];
            $queryParams = array_merge($queryParams, $rs[1]);
        }

        $sql .= " order by g.code
				limit 20";
        $data = M()->query($sql, $queryParams);
        $result = array();
        foreach ( $data as $i => $v ) {
            $result[$i]["id"] = $v["id"];
            $result[$i]["code"] = $v["code"];
            $result[$i]["name"] = $v["name"];
            $result[$i]["spec"] = $v["spec"];
            $result[$i]["unitName"] = $v["unit_name"];
            $result[$i]["purchasePrice"] = $v["purchase_price"] == 0 ? null : $v["purchase_price"];
            $result[$i]["memo"] = $v["memo"];
        }

        return $result;
    }

    /**
     * 获得某个医院的详情
     */
    public function getHospitalInfo($id, $regionId) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }
        $hospital_db = M("info_hospital");
        $region_db = M("info_region");
        $params = array(
            "id"=>$id
        );
        $hospital_data  = $hospital_db->where($params)->select();
        $params['id'] = $regionId;
        $region_info = $region_db->where($params)->select();

        $result = $hospital_data[0];
        $result['region_id'] = $region_info[0]['id'];
        $result['region_name'] = $region_info[0]['region_name'];
        return $result;

    }

    /**
     * 获得某个医院的安全库存列表
     */
    public function goodsSafetyInventoryList($params) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $id = $params["id"];

        $result = array();

        $db = M();
        $sql = "select u.name
				from t_goods g, t_goods_unit u
				where g.id = '%s' and g.unit_id = u.id";
        $data = $db->query($sql, $id);
        if (! $data) {
            return $result;
        }
        $goodsTypeName = $data[0]["name"];

        $sql = "select w.id as warehouse_id, w.code as warehouse_code, w.name as warehouse_name,
					s.safety_inventory, s.inventory_upper
				from t_warehouse w
				left join t_goods_si s
				on w.id = s.warehouse_id and s.goods_id = '%s'
				where w.inited = 1 ";
        $queryParams = array();
        $queryParams[] = $id;
        $ds = new DataOrgService();
        $rs = $ds->buildSQL(FIdConst::HOSPITAL, "w");
        if ($rs) {
            $sql .= " and " . $rs[0];
            $queryParams = array_merge($queryParams, $rs[1]);
        }
        $sql .= " order by w.code";
        $data = $db->query($sql, $queryParams);
        $r = array();
        foreach ( $data as $i => $v ) {
            $r[$i]["warehouseId"] = $v["warehouse_id"];
            $r[$i]["warehouseCode"] = $v["warehouse_code"];
            $r[$i]["warehouseName"] = $v["warehouse_name"];
            $r[$i]["safetyInventory"] = $v["safety_inventory"];
            $r[$i]["inventoryUpper"] = $v["inventory_upper"];
            $r[$i]["unitName"] = $goodsTypeName;
        }

        foreach ( $r as $i => $v ) {
            $sql = "select balance_count
					from t_inventory
					where warehouse_id = '%s' and goods_id = '%s' ";
            $data = $db->query($sql, $v["warehouseId"], $id);
            if (! $data) {
                $result[$i]["inventoryCount"] = 0;
            } else {
                $result[$i]["inventoryCount"] = $data[0]["balance_count"];
            }

            $result[$i]["warehouseCode"] = $v["warehouseCode"];
            $result[$i]["warehouseName"] = $v["warehouseName"];
            $result[$i]["safetyInventory"] = $v["safetyInventory"];
            $result[$i]["inventoryUpper"] = $v["inventoryUpper"];
            $result[$i]["unitName"] = $goodsTypeName;
        }

        return $result;
    }

    /**
     * 获得某个医院安全库存的详情
     */
    public function siInfo($params) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $id = $params["id"];

        $result = array();

        $db = M();
        $sql = "select u.name
				from t_goods g, t_goods_unit u
				where g.id = '%s' and g.unit_id = u.id";
        $data = $db->query($sql, $id);
        if (! $data) {
            return $result;
        }
        $goodsTypeName = $data[0]["name"];

        $sql = "select w.id as warehouse_id, w.code as warehouse_code,
					w.name as warehouse_name,
					s.safety_inventory, s.inventory_upper
				from t_warehouse w
				left join t_goods_si s
				on w.id = s.warehouse_id and s.goods_id = '%s'
				where w.inited = 1 ";
        $queryParams = array();
        $queryParams[] = $id;

        $ds = new DataOrgService();
        $rs = $ds->buildSQL(FIdConst::HOSPITAL, "w");
        if ($rs) {
            $sql .= " and " . $rs[0];
            $queryParams = array_merge($queryParams, $rs[1]);
        }

        $sql .= " order by w.code ";
        $data = $db->query($sql, $queryParams);
        foreach ( $data as $i => $v ) {
            $result[$i]["warehouseId"] = $v["warehouse_id"];
            $result[$i]["warehouseCode"] = $v["warehouse_code"];
            $result[$i]["warehouseName"] = $v["warehouse_name"];
            $result[$i]["safetyInventory"] = $v["safety_inventory"] ? $v["safety_inventory"] : 0;
            $result[$i]["inventoryUpper"] = $v["inventory_upper"] ? $v["inventory_upper"] : 0;
            $result[$i]["unitName"] = $goodsTypeName;
        }

        return $result;
    }

    /**
     * 设置医院的安全
     */
    public function editSafetyInventory($params) {
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $json = $params["jsonStr"];
        $bill = json_decode(html_entity_decode($json), true);
        if ($bill == null) {
            return $this->bad("传入的参数错误，不是正确的JSON格式");
        }

        $db = M();

        $id = $bill["id"];
        $items = $bill["items"];

        $idGen = new IdGenService();

        $db->startTrans();

        $sql = "select code, name, spec from t_goods where id = '%s'";
        $data = $db->query($sql, $id);
        if (! $data) {
            $db->rollback();
            return $this->bad("医院不存在，无法设置医院安全库存");
        }
        $goodsCode = $data[0]["code"];
        $goodsName = $data[0]["name"];
        $goodsSpec = $data[0]["spec"];

        $sql = "delete from t_goods_si where goods_id = '%s' ";
        $rc = $db->execute($sql, $id);
        if ($rc === false) {
            $db->rollback();
            return $this->sqlError(__LINE__);
        }

        foreach ( $items as $v ) {
            $warehouseId = $v["warehouseId"];
            $si = $v["si"];
            if (! $si) {
                $si = 0;
            }
            if ($si < 0) {
                $si = 0;
            }
            $upper = $v["invUpper"];
            if (! $upper) {
                $upper = 0;
            }
            if ($upper < 0) {
                $upper = 0;
            }
            $sql = "insert into t_goods_si(id, goods_id, warehouse_id, safety_inventory, inventory_upper)
						values ('%s', '%s', '%s', %d, %d)";
            $rc = $db->execute($sql, $idGen->newId(), $id, $warehouseId, $si, $upper);
            if ($rc === false) {
                $db->rollback();
                return $this->sqlError(__LINE__);
            }
        }

        $bs = new BizlogService();
        $log = "为医院[$goodsCode $goodsName $goodsSpec]设置安全库存";
        $bs->insertBizlog($log, $this->LOG_CATEGORY_HOSPITAL);

        $db->commit();

        return $this->ok();
    }

    /**
     * 通过条形码查询医院信息, 销售出库单使用
     */
    public function queryHospitalInfoByBarcode($params) {
        $barcode = $params["barcode"];

        $result = array();

        $db = M();
        $sql = "select g.id, g.code, g.name, g.spec, g.sale_price, u.name as unit_name
				from t_goods g, t_goods_unit u
				where g.bar_code = '%s' and g.unit_id = u.id ";
        $data = $db->query($sql, $barcode);

        if (! $data) {
            $result["success"] = false;
            $result["msg"] = "条码为[{$barcode}]的医院不存在";
        } else {
            $result["success"] = true;
            $result["id"] = $data[0]["id"];
            $result["code"] = $data[0]["code"];
            $result["name"] = $data[0]["name"];
            $result["spec"] = $data[0]["spec"];
            $result["salePrice"] = $data[0]["sale_price"];
            $result["unitName"] = $data[0]["unit_name"];
        }

        return $result;
    }

    /**
     * 通过条形码查询医院信息, 采购入库单使用
     */
    public function queryHospitalInfoByBarcodeForPW($params) {
        $barcode = $params["barcode"];

        $result = array();

        $db = M();
        $sql = "select g.id, g.code, g.name, g.spec, g.purchase_price, u.name as unit_name
				from t_goods g, t_goods_unit u
				where g.bar_code = '%s' and g.unit_id = u.id ";
        $data = $db->query($sql, $barcode);

        if (! $data) {
            $result["success"] = false;
            $result["msg"] = "条码为[{$barcode}]的医院不存在";
        } else {
            $result["success"] = true;
            $result["id"] = $data[0]["id"];
            $result["code"] = $data[0]["code"];
            $result["name"] = $data[0]["name"];
            $result["spec"] = $data[0]["spec"];
            $result["purchasePrice"] = $data[0]["purchase_price"];
            $result["unitName"] = $data[0]["unit_name"];
        }

        return $result;
    }

    /**
     * 查询医院种类总数
     */
    public function getTotalHospitalCount($params) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $hospital_db = M("info_hospital");
        $where = [];
        if (!empty($params['hospital_name'])) {
            $where['hospital_name'] = $params['hospital_name'];
        }

        if (!empty($params['hospital_type'])) {
            $where['hospital_type'] = $params['hospital_type'];
        }
        $data = $hospital_db->where($where)->select();
        $result["cnt"] = count($data);
        return $result;
    }

    /**
     * 获得所有的品牌
     */
    public function allBrands() {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $result = array();
        $sql = "select id, name, full_name
				from t_goods_brand b
				where (parent_id is null)
				";
        $queryParam = array();
        $ds = new DataOrgService();
        $rs = $ds->buildSQL(FIdConst::HOSPITAL_BRAND, "b");
        if ($rs) {
            $sql .= " and " . $rs[0];
            $queryParam = array_merge($queryParam, $rs[1]);
        }

        $sql .= " order by name";

        $db = M();
        $data = $db->query($sql, $queryParam);
        $result = array();
        foreach ( $data as $i => $v ) {
            $id = $v["id"];
            $result[$i]["id"] = $id;
            $result[$i]["text"] = $v["name"];
            $fullName = $v["full_name"];
            if (! $fullName) {
                $fullName = $v["name"];
            }
            $result[$i]["fullName"] = $fullName;

            $children = $this->allBrandsInternal($db, $id, $rs);

            $result[$i]["children"] = $children;
            $result[$i]["leaf"] = count($children) == 0;
            $result[$i]["expanded"] = true;
        }

        return $result;
    }

    private function allBrandsInternal($db, $parentId, $rs) {
        $result = array();
        $sql = "select id, name, full_name
				from t_goods_brand b
				where (parent_id = '%s')
				";
        $queryParam = array();
        $queryParam[] = $parentId;
        if ($rs) {
            $sql .= " and " . $rs[0];
            $queryParam = array_merge($queryParam, $rs[1]);
        }

        $sql .= " order by name";
        $data = $db->query($sql, $queryParam);
        foreach ( $data as $i => $v ) {
            $id = $v["id"];
            $result[$i]["id"] = $v["id"];
            $result[$i]["text"] = $v["name"];
            $fullName = $v["full_name"];
            if (! $fullName) {
                $fullName = $v["name"];
            }
            $result[$i]["fullName"] = $fullName;

            $children = $this->allBrandsInternal($db, $id, $rs); // 自身递归调用

            $result[$i]["children"] = $children;
            $result[$i]["leaf"] = count($children) == 0;
            $result[$i]["expanded"] = true;
        }

        return $result;
    }

    /**
     * 新增或编辑医院品牌
     */
    public function editBrand($params) {
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];
        $name = $params["name"];
        $parentId = $params["parentId"];

        $db = M();
        $db->startTrans();

        $log = null;

        $us = new UserService();
        $dataOrg = $us->getLoginUserDataOrg();
        $companyId = $us->getCompanyId();

        if ($id) {
            // 编辑品牌

            // 检查品牌是否存在
            $sql = "select name
					from t_goods_brand
					where id = '%s' ";
            $data = $db->query($sql, $id);
            if (! $data) {
                $db->rollback();
                return $this->bad("要编辑的品牌不存在");
            }
            if ($parentId) {
                // 检查上级品牌是否存在
                $sql = "select full_name
						from t_goods_brand
						where id = '%s' ";
                $data = $db->query($sql, $parentId);
                if (! data) {
                    $db->rollback();
                    return $this->bad("选择的上级品牌不存在");
                }
                $parentFullName = $data[0]["full_name"];

                // 上级品牌不能是自身
                if ($parentId == $id) {
                    $db->rollback();
                    return $this->bad("上级品牌不能是自身");
                }

                // 检查下级品牌不能是作为上级品牌
                $tempParentId = $parentId;
                while ( $tempParentId != null ) {
                    $sql = "select parent_id
							from t_goods_brand
							where id = '%s' ";
                    $data = $db->query($sql, $tempParentId);
                    if ($data) {
                        $tempParentId = $data[0]["parent_id"];
                    } else {
                        $tempParentId = null;
                    }

                    if ($tempParentId == $id) {
                        $db->rollback();
                        return $this->bad("下级品牌不能作为上级品牌");
                    }
                }
            }
            if ($parentId) {
                $fullName = $parentFullName . "\\" . $name;
                $sql = "update t_goods_brand
							set name = '%s', parent_id = '%s', full_name = '%s'
							where id = '%s' ";
                $rc = $db->execute($sql, $name, $parentId, $fullName, $id);
                if ($rc === false) {
                    $db->rollback();
                    return $this->sqlError(__LINE__);
                }
            } else {
                $sql = "update t_goods_brand
							set name = '%s', parent_id = null, full_name = '%s'
							where id = '%s' ";
                $rc = $db->execute($sql, $name, $name, $id);
                if ($rc === false) {
                    $db->rollback();
                    return $this->sqlError(__LINE__);
                }
            }

            // 同步下级品牌的full_name
            $this->updateSubBrandsFullName($db, $id);

            $log = "编辑医院品牌[$name]";
        } else {
            // 新增品牌

            // 检查上级品牌是否存在
            $fullName = $name;
            if ($parentId) {
                $sql = "select full_name
						from t_goods_brand
						where id = '%s' ";
                $data = $db->query($sql, $parentId);
                if (! $data) {
                    $db->rollback();
                    return $this->bad("所选择的上级医院品牌不存在");
                }
                $fullName = $data[0]["full_name"] . "\\" . $name;
            }

            $idGen = new IdGenService();
            $id = $idGen->newId($db);

            if ($parentId) {
                $sql = "insert into t_goods_brand(id, name, full_name, parent_id, data_org, company_id)
						values ('%s', '%s', '%s', '%s', '%s', '%s')";
                $rc = $db->execute($sql, $id, $name, $fullName, $parentId, $dataOrg, $companyId);
                if ($rc === false) {
                    $db->rollback();
                    return $this->sqlError(__LINE__);
                }
            } else {
                $sql = "insert into t_goods_brand(id, name, full_name, parent_id, data_org, company_id)
						values ('%s', '%s', '%s', null, '%s', '%s')";
                $rc = $db->execute($sql, $id, $name, $fullName, $dataOrg, $companyId);
                if ($rc === false) {
                    $db->rollback();
                    return $this->sqlError(__LINE__);
                }
            }

            $log = "新增医院品牌[$name]";
        }

        // 记录业务日志
        if ($log) {
            $bs = new BizlogService();
            $bs->insertBizlog($log, $this->LOG_CATEGORY_BRAND);
        }

        $db->commit();

        return $this->ok($id);
    }

    private function updateSubBrandsFullName($db, $parentId) {
        $sql = "select full_name from t_goods_brand where id = '%s' ";
        $data = $db->query($sql, $parentId);
        if (! $data) {
            return;
        }

        $parentFullName = $data[0]["full_name"];
        $sql = "select id, name
				from t_goods_brand
				where parent_id = '%s' ";
        $data = $db->query($sql, $parentId);
        foreach ( $data as $i => $v ) {
            $id = $v["id"];
            $fullName = $parentFullName . "\\" . $v["name"];
            $sql = "update t_goods_brand
					set full_name = '%s'
					where id = '%s' ";
            $db->execute($sql, $fullName, $id);

            // 递归调用自身
            $this->updateSubBrandsFullName($db, $id);
        }
    }

    /**
     * 获得某个品牌的上级品牌全称
     */
    public function brandParentName($params) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $result = array();

        $id = $params["id"];

        $db = M();
        $sql = "select name, parent_id
				from t_goods_brand
				where id = '%s' ";
        $data = $db->query($sql, $id);
        if (! $data) {
            return $result;
        }

        $result["name"] = $data[0]["name"];
        $parentId = $data[0]["parent_id"];
        $result["parentBrandId"] = $parentId;
        if ($parentId) {
            $sql = "select full_name
					from t_goods_brand
					where id = '%s' ";
            $data = $db->query($sql, $parentId);
            if ($data) {
                $result["parentBrandName"] = $data[0]["full_name"];
            } else {
                $result["parentBrandId"] = null;
                $result["parentBrandName"] = null;
            }
        } else {
            $result["parentBrandName"] = null;
        }

        return $result;
    }

    /**
     * 删除医院品牌
     */
    public function deleteBrand($params) {
        if ($this->isNotOnline()) {
            return $this->notOnlineError();
        }

        $id = $params["id"];

        $db = M();
        $db->startTrans();

        $sql = "select full_name from t_goods_brand where id = '%s' ";
        $data = $db->query($sql, $id);
        if (! $data) {
            $db->rollback();
            return $this->bad("要删除的品牌不存在");
        }
        $fullName = $data[0]["full_name"];

        $sql = "select count(*) as cnt from t_goods
				where brand_id = '%s' ";
        $data = $db->query($sql, $id);
        $cnt = $data[0]["cnt"];
        if ($cnt > 0) {
            $db->rollback();
            return $this->bad("品牌[$fullName]已经在医院中使用，不能删除");
        }

        $sql = "select count(*) as cnt from t_goods_brand where parent_id = '%s' ";
        $data = $db->query($sql, $id);
        $cnt = $data[0]["cnt"];
        if ($cnt > 0) {
            $db->rollback();
            return $this->bad("品牌[$fullName]还有子品牌，所以不能被删除");
        }

        $sql = "delete from t_goods_brand where id = '%s' ";
        $rc = $db->execute($sql, $id);
        if ($rc === false) {
            $db->rollback();
            return $this->sqlError(__LINE__);
        }

        $log = "删除医院品牌[$fullName]";
        $bs = new BizlogService();
        $bs->insertBizlog($log, $this->LOG_CATEGORY_BRAND);

        $db->commit();

        return $this->ok();
    }

    /**
     * 医院构成
     */
    public function goodsBOMList($params) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $dao = new HospitalBomDAO();
        return $dao->goodsBOMList($params);
    }

    /**
     * 根据医院信息得到相应的药品信息
     * @author huxinlu
     * @param $params
     * @return array
     */
    public function hospitalToDrug($params) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        $hospital_db = M('info_drug2hospital');
        import("ORG.Util.Page");
        if($params['hospital_id'] == ""){
            return $this->bad("请首先选择医院！");
        }

        $drug = $hospital_db->where('hospital_id in ('.$params['hospital_id'].')')->field('drug_id')->select();
        $drugID = [];
        foreach ($drug as $v) {
            $drugID[] = $v['drug_id'];
        }
        $drugIDs = implode(',',$drugID);

        if (!empty($drugIDs)) {
            $all_data = M('info_drug')->where("id in (".$drugIDs.")")->page($params['page'],$params['limit'])->select();
            $db = M("t_yewuset_user2hospital");
            foreach ($all_data as $k => $v) {
                $data = $db->where("drug_id = ".$v["id"]." and hospital_id in (".$params["hospital_id"].")"." and user_id = "."'".$params['user_id']."'")->find();
                if ($data) {
                    $all_data[$k]['type'] = 'selected';
                } else {
                    $all_data[$k]['type'] = 'unselected';
                }
            }
            $all_count = M('info_drug')->where("id in (".$drugIDs.")")->count();
        } else {
            $all_data = [];
            $all_count = 0;
        }


        return array(
            "drugList" => $all_data,
            "totalCount" => $all_count
        );
    }

    /**
     * 获取某个用户已选择的某个医院的药品
     * @author huxinlu
     * @param $params
     * @return array
     */
    public function selectedHospitalToDrug($params) {
        if ($this->isNotOnline()) {
            return $this->emptyResult();
        }

        import("ORG.Util.Page");
        $page = $params['page'];
        $start = $params['start'];
        $limit = $params['limit'];

        $db = M("t_yewuset_user2hospital");
        $data = $db
            ->alias('yewuset')
            ->join(" left join t_user as u on u.id='".$params['user_id']."'")
            ->join(" left join info_drug as drug on yewuset.drug_id=drug.id")
            ->join(" left join info_hospital as hos on yewuset.hospital_id=hos.id")
            ->where("user_id='".$params['user_id']."' and hos.id = '".$params['hospital_id']."'")
            ->field("hos.id as hospital_id,drug_id,hospital_name,common_name,jx,guige,manufacturer,yewuset.data_org")
            ->page($page,$limit)
            ->select();

        return array(
            "totalCount" => count($data),
            "hospitalDrug" => $data
        );
    }

    /**
     * 可视或不可视所有医院(if_view=1,所有可视;if_view=0,所有不可视 )
     * @author huxinlu
     * @return mixed
     */
    public function viewAllHospital($params)
    {
        M('t_user')->where("id='".$params['user_id']."'")->setField("all_hospital_view", $params['if_view']);
        return $this->ok();
    }

    /**
     * @author huxinlu
     * @param $categoryId
     * @return mixed
     */
    public function getAllCount($categoryId)
    {
        $db = M();
        $ds = new DataOrgService();
        $rs = $ds->buildSQL(FIdConst::HOSPITAL_REGION, "r");
        $sql = "select count(*) as cnt
					from info_hospital h
					where h.region_id = '%s' ";
        $queryParam = array();
        $queryParam[] = $categoryId;
        if ($rs) {
            $sql .= " and " . $rs[0];
            $queryParam = array_merge($queryParam, $rs[1]);
        }


        $data = $db->query($sql, $queryParam);
        $result = $data[0]["cnt"];

        // 子区域
        $sql = "select id
				from info_region h
				where (parent_id = '%s')
				";
        $queryParam = array();
        $queryParam[] = $categoryId;
        if ($rs) {
            $sql .= " and " . $rs[0];
            $queryParam = array_merge($queryParam, $rs[1]);
        }

        $data = $db->query($sql, $queryParam);
        foreach ( $data as $v ) {
            // 递归调用自身
            $result += $this->getAllCount($v["id"]);
        }
        return $result;
    }

    /**
     * 获取存入医院对应地区的数据
     * @author huxinlu
     * @param $array
     * @param $array_2
     * @return mixed
     */
    public function array_merge_rec($array,$array_2)
    {
        foreach ($array as $item) {
            $data = [
                'id' => $item['id'],
                'cnt' => $item['cnt'],
            ];
            array_push($array_2, $data);
            foreach ($item['children'] as $v) {
                $data = [
                    'id' => $v['id'],
                    'cnt' => $v['cnt'],
                ];
                array_push($array_2, $data);
                foreach ($v['children'] as $val) {
                    $data = [
                        'id' => $val['id'],
                        'cnt' => $val['cnt'],
                    ];
                    array_push($array_2, $data);
                }
            }
        }

        return $array_2;
    }

    /**
     * 导入医院相对应地区的数量
     * @author wanbing.shi
     * @return mixed
     */
    public function importRegion2Hospital()
    {
        $hospital_db = M('info_hospital');
        $region_db = M('info_region');
        $data = $hospital_db->field(array('region_id', "count(1)"))->group('region_id')->select();

        $region_db->startTrans();
        foreach ($data as $v) {
            if ($v['region_id']) {
                $data['id'] = $v['region_id'];
                $data['hospital_count'] = $v['count(1)'];
                $region_db->save($data);
//                $region_db->execute("UPDATE info_region SET hospital_count = ".$v['count(1)']." where id = ".$v['region_id']);
            }

//            $res = $region_db->where('id = '.$v['region_id'])->save($data);
//            $region_db->execute("UPDATE info_region SET hospital_count = ".$v['count(1)']." where id = ".$v['region_id']);
//            if(!$res) {
//                $region_db->rollback();
//            }
        }

        $regions = $region_db->field(array('parent_id', "sum(hospital_count)"))->where('parent_id != 0')->group('parent_id')->select();
        foreach ($regions as $v) {
            $data['id'] = $v['parent_id'];
            $data['hospital_count'] = $v['sum(hospital_count)'];
            $region_db->save($data);
        }

        $regions = $region_db->field(array('parent_id', "sum(hospital_count)"))->where('parent_id = 0')->group('parent_id')->select();
        foreach ($regions as $v) {
            $data['id'] = $v['parent_id'];
            $data['hospital_count'] = $v['sum(hospital_count)'];
            $region_db->save($data);
        }
        $region_db->commit();
        return true;
    }

    /**
     * 添加相应地区的医院数
     * @author wanbing.shi
     * @param $region_id    //地区ID
     * @param $hospital_count  //新增加医院数
     * @return bool   //添加是否成功
     */
    private function addHospitalCountByRegion($region_id, $hospital_count) {
        $region_db = M('info_region');
        $region_db->startTrans();
        while($region_id > 0) {
            $region2hospital = $region_db->where('id = '.$region_id)->find();
            if($region2hospital) {
                $region2hospital['hospital_count'] = $region2hospital['hospital_count'] + $hospital_count;
                $res = $region_db->where('id = '.$region_id)->save($region2hospital);
                if(!$res) {
                    $region_db->rollback();
                    return false;
                }
                $region_id = $region2hospital['parent_id'];
            }else {
                $region_db->rollback();
                return false;
            }
        }
        $region_db->commit();
        return true;
    }

    /**
     * 添加相应地区的医院数
     * @author wanbing.shi
     * @param $region_id   //地区ID
     * @param $hospital_count  //新删除医院数
     * @return bool   //删除是否成功
     */
    private function deleteHospitalCountByRegion($region_id, $hospital_count) {
        $region_db = M('info_region');
        $region_db->startTrans();
        while($region_id > 0) {
            $region2hospital = $region_db->where('region_id = '.$region_id)->find();
            if($region2hospital) {
                $region2hospital['hospital_count'] = $region2hospital['hospital_count'] - $hospital_count;
                $res = $region_db->where('region_id = '.$region_id)->save($region2hospital);
                if(!$res) {
                    $region_db->rollback();
                    return false;
                }
                $region_id = $region2hospital['parent_id'];
            }else {
                $region_db->rollback();
                return false;
            }
        }
        $region_db->commit();
        return false;
    }

    /**
     * 添加当前缓存中的医院数
     * @author wanbing.shi
     * @return bool   当前缓存中的医院数
     */
    public function getHospitalTempCount() {
        $temp_db = M('info_hospital_temp');
        $result['cnt'] = $temp_db->count('id');
        return $result;
    }

    /**
     * 删除当前医院缓存
     * @author wanbing.shi
     */
    public function deleteTemp() {
        $temp_db = M('info_hospital_temp');
        $res = $temp_db->execute("TRUNCATE table info_hospital_temp");
        if($res) {
            return  $this->ok();
        }else {
            return $this->bad('删除缓存失败');
        }
    }

    /**
     * 获取当前医院缓存
     * @author wanbing.shi
     */
    public function getHospitalTempList() {
        return M('info_hospital_temp')->select();
    }

    /**
     * 将缓存导入医院列表
     * @author wanbing.shi
     */
    public function importTempToHospital($tempList) {
        $hospital_db = M("info_hospital");
        $hospitalTemp_db = M("info_hospital_temp");

        $data = $hospitalTemp_db->where("id in (".$tempList.")")->field("id", true)->select();
        $hospital_region = $hospitalTemp_db->where("id in (".$tempList.")")->field(array('region_id', "count(1)"))->group('region_id')->select();

        $hospitalTemp_db->startTrans();
        $hospital_db->startTrans();
        try {
            $hospital_db->addAll($data);
            $hospitalTemp_db->where("id in (".$tempList.")")->delete();
            foreach ($hospital_region as $v) {
                $this->addHospitalCountByRegion($v['region_id'], $v['count(1)']);
            }
        } catch (Exception $e) {
            $hospitalTemp_db->rollback();
            $hospital_db->rollback();
            return  $this->bad('缓存导入失败');
        }

        $hospital_db->commit();
        $hospitalTemp_db->commit();
        return $this->ok();
    }

    /**
     * 删除医院缓存
     * @author wanbing.shi
     */
    public function deleteTempToHospital($tempList) {
        $hospitalTemp_db = M("info_hospital_temp");

        $hospitalTemp_db->startTrans();

        try {
            $hospitalTemp_db->where("id in (".$tempList.")")->delete();
            $smg = $hospitalTemp_db->getLastSql();
        } catch (Exception $e) {
            $hospitalTemp_db->rollback();
            return  $this->bad('缓存导入失败');
        }

        $hospitalTemp_db->commit();
        return $this->ok();
    }

}
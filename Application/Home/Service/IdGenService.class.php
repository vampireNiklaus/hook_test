<?php

namespace Home\Service;

/**
 * 生成UUIDService
 *
 * @author Baoyu Li
 */
class IdGenService {

	/**
	 * 创建一个新的UUID
	 */
	public function newId($db = null) {
		if (! $db) {
			$db = M();
		}
		
		$data = $db->query("select UUID() as uuid");
		return strtoupper($data[0]["uuid"]);
	}
}

<?php

namespace Home\Controller;

use Think\Controller;

/**
 * 关于Controller
 *
 * @author Baoyu Li
 *        
 */
class AboutController extends PSIBaseController {

	/**
	 * 关于 - 主页面
	 */
	public function index() {
		$this->initVar();
		
		$this->assign("title", "关于");
		
		$this->display();
	}
}
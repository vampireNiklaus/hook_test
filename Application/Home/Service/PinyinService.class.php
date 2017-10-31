<?php
namespace Home\Service;

require __DIR__ . '/../Common/Pinyin/pinyin.php';

/**
 * 拼音Service
 *
 * @author Baoyu Li
 */
class PinyinService {
	public function toPY($s) {
		return strtoupper(pinyin($s, "first"));
	}
}

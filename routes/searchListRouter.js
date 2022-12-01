const express = require('express');
const router = express.Router();

const searchListController = require('../controllers/searchListController');

// 검색어 입력시 + 카테고리 설정
router.get('', searchListController.searchList);

module.exports = router;

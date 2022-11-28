const express = require('express');
const router = express.Router();

// 토큰이 필요할시,
const { validateToken } = require('../middlewares/validateToken');
const sympathyController = require('../controllers/sympathyController');

router.post('', validateToken, sympathyController.sympathy); // 공감, 토큰 필요
router.delete('', validateToken, sympathyController.sympathyCancel); // 공감취소, 토큰 필요

module.exports = router;

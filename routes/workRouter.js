const express = require('express');
const router = express.Router();

// 토큰이 필요할시,
const { validateToken } = require('../middlewares/validateToken');
const workController = require('../controllers/workController');

// 카테고리별 총 게시물 수 + 최신 feed list
router.get('', workController.worksList);
router.get('/:sort', workController.worksList); // sort 종류 ('recommendpoint', 'sympathycnt')
router.get('/feed/:id', workController.feed);
router.get('/feed/:id/followcheck', validateToken, workController.followCheck); //토큰 필요

module.exports = router;

const express = require('express');
const router = express.Router();
const { validateToken } = require('../middlewares/validateToken');
const { asyncWrap } = require('../utils/util');
const workController = require('../controllers/workController');

// 카테고리별 총 게시물 수 + 최신 feed list
router.get('', asyncWrap(workController.worksList));
router.get('/feed/:id', asyncWrap(workController.feed));
router.get('/:sort', asyncWrap(workController.worksList)); // sort 종류 ('recommendpoint', 'sympathycnt')
router.delete('/feed/:id', validateToken, workController.deletefeed);

module.exports = router;

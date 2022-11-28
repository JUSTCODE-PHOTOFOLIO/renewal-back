const express = require('express');
const router = express.Router();

// 토큰이 필요할시,
const { validateToken } = require('../middlewares/validateToken');
const feedController = require('../controllers/feedController');

// 최신 feed list
router.get('/list', validateToken, feedController.feedsList);

module.exports = router;

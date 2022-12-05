const express = require('express');
const router = express.Router();

const { asyncWrap } = require('../utils/util');
const { validateToken } = require('../middlewares/validateToken');
const feedController = require('../controllers/feedController');

// 최신 feed list
router.get(
  '/list',
  asyncWrap(validateToken),
  asyncWrap(feedController.getFeedsList)
);

module.exports = router;

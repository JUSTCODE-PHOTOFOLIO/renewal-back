const express = require('express');
const router = express.Router();

const { asyncWrap } = require('../utils/util');
const channelController = require('../controllers/channelController');

// 최신 feed list
router.get('/:following_id', asyncWrap(channelController.getChannel));

module.exports = router;

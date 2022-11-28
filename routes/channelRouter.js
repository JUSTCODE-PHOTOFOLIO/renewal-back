const express = require('express');
const router = express.Router();

const channelController = require('../controllers/channelController');

// 최신 feed list
router.get('/:following_id', channelController.channel);

module.exports = router;

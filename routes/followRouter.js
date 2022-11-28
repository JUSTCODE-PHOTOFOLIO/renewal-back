const express = require('express');
const router = express.Router();

// 토큰이 필요할시,
const { validateToken } = require('../middlewares/validateToken');
const followController = require('../controllers/followController');

router.post('', validateToken, followController.following); //토큰 필요!!
router.delete('', validateToken, followController.followingCancel); //토큰 필요!!

module.exports = router;

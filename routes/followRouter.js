const express = require('express');
const router = express.Router();

const { asyncWrap } = require('../utils/util');
const { validateToken } = require('../middlewares/validateToken');
const followController = require('../controllers/followController');

// getFollow (팔로우 여부 확인)
router.post(
  '/check',
  asyncWrap(validateToken),
  asyncWrap(followController.followCheck)
);

router.post(
  '',
  asyncWrap(validateToken),
  asyncWrap(followController.following)
);
router.delete(
  '',
  asyncWrap(validateToken),
  asyncWrap(followController.followingCancel)
);

module.exports = router;

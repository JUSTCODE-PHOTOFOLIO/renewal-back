const express = require('express');
const router = express.Router();

const { asyncWrap } = require('../utils/util');
const { validateToken } = require('../middlewares/validateToken');
const followController = require('../controllers/followController');

// getFollow (팔로우 여부 확인)
router.post(
  '/check',
  asyncWrap(validateToken),
  asyncWrap(followController.getFollowResult)
);

router.post(
  '',
  asyncWrap(validateToken),
  asyncWrap(followController.createFollow)
);
router.delete(
  '',
  asyncWrap(validateToken),
  asyncWrap(followController.deleteFollow)
);

module.exports = router;

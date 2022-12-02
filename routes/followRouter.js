const express = require('express');
const router = express.Router();

const { asyncWrap } = require('../utils/util');
const { validateToken } = require('../middlewares/validateToken');
const followController = require('../controllers/followController');

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

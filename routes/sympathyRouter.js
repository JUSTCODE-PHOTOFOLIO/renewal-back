const express = require('express');
const router = express.Router();

const { asyncWrap } = require('../utils/util');
const { validateToken } = require('../middlewares/validateToken');
const sympathyController = require('../controllers/sympathyController');

router.post(
  '',
  asyncWrap(validateToken),
  asyncWrap(sympathyController.sympathy)
);
router.delete(
  '',
  asyncWrap(validateToken),
  asyncWrap(sympathyController.sympathyCancel)
);

module.exports = router;

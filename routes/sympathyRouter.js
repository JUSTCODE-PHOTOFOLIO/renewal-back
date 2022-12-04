const express = require('express');
const router = express.Router();

const { asyncWrap } = require('../utils/util');
const { validateToken } = require('../middlewares/validateToken');
const sympathyController = require('../controllers/sympathyController');

router.get(
  '/:id',
  asyncWrap(validateToken),
  asyncWrap(sympathyController.findSympathyOfFeedByUser)
);
router.post(
  '',
  asyncWrap(validateToken),
  asyncWrap(sympathyController.createSympathy)
);
router.delete(
  '',
  asyncWrap(validateToken),
  asyncWrap(sympathyController.deleteSympathy)
);

module.exports = router;

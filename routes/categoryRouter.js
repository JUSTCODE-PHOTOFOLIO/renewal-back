const express = require('express');
const router = express.Router();

const { asyncWrap } = require('../utils/util');
const categoryController = require('../controllers/categoryController');

router.get('/tags', asyncWrap(categoryController.findTagCount));
router.get('/:categoryName', asyncWrap(categoryController.findCategoryList));

module.exports = router;

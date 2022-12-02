const express = require('express');
const router = express.Router();

const { asyncWrap } = require('../utils/util');
const categoryController = require('../controllers/categoryController');

router.get('/tags', asyncWrap(categoryController.tagCount));
router.get('/:categoryName', asyncWrap(categoryController.categoryList));

module.exports = router;

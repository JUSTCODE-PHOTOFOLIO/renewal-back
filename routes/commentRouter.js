const express = require('express');
const router = express.Router();

// 토큰이 필요할시,
const { validateToken } = require('../middlewares/validateToken');
const commentController = require('../controllers/commentController');

router.post('/', validateToken, commentController.postComment);
router.patch('/', validateToken, commentController.modifiyComment);
router.delete('/', validateToken, commentController.deleteComment);

module.exports = router;

const express = require('express');
const router = express.Router();
const { upload } = require('../utils/util');

const { asyncWrap } = require('../utils/util');
const { validateToken } = require('../middlewares/validateToken');
const userController = require('../controllers/userController');

//회원가입
router.post(
  '/signup',
  upload.single('profile'),
  asyncWrap(userController.createUser)
);

//로그인
router.post('/login', asyncWrap(userController.loginUser));
//계정정보조회페이지
router.post(
  '/accountInfo',
  asyncWrap(validateToken),
  asyncWrap(userController.getAccountInfo)
);

//계정정보수정
router.patch(
  '/accountInfo',
  asyncWrap(validateToken),
  asyncWrap(userController.modifyAccountInfo)
);
//계정삭제
router.delete(
  '/accountInfo',
  asyncWrap(validateToken),
  asyncWrap(userController.deleteAccount)
);

//테스트
router.get('/test', userController.test);

module.exports = router;

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');

const { validateToken } = require('../middlewares/validateToken');
const userController = require('../controllers/userController');

//회원가입
router.post('/signup', upload.single('profile'), userController.createUser);

//로그인
router.post('/login', userController.loginUser);
//계정정보조회페이지
router.post('/accountInfo', validateToken, userController.getAccountInfo);

//계정정보수정
router.patch('/accountInfo', validateToken, userController.modifyAccountInfo);
//계정삭제
router.delete('/accountInfo', validateToken, userController.deleteAccount);

// 업로드 관련 뭔가가 빠진듯 서버 안돌아가서 주석처리
// router.get('/test', userController.layerConnectionTest);

module.exports = router;

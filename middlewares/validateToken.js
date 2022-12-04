const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
  // 인증 완료
  try {
    // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰을 req.decoded에 반환
    let token = req.headers.authorization;
    if (!token) {
      throw { status: 401, message: `TOKEN IS NOT EXISTS` };
    }
    token = token.includes('Bearer') ? token.replace(/^Bearer\s+/, '') : token;
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
    req.user_id = verifiedToken.id;
    next();
  } catch (error) {
    // 인증 실패
    // 유효시간이 초과된 경우
    if (error.name === 'TokenExpiredError') {
      res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.',
      });
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        code: 401,
        message: '유효하지 않은 토큰입니다.',
      });
    }

    res.status(error.status).json({ message: error.message });
  }
};

module.exports = { validateToken };

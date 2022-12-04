const sympathyDao = require('../models/sympathyDao');

// 피드 상세에서 로그인유저의 공감여부 확인
const findSympathyOfFeedByUser = async (posting_id, user_id) => {
  return await sympathyDao.findSympathyOfFeedByUser(posting_id, user_id);
};

// 공감
const createSympathy = async (posting_id, user_id, sympathy_id) => {
  const findSympathyOfFeedByUser = await sympathyDao.findSympathyOfFeedByUser(
    posting_id,
    user_id
  );
  if (findSympathyOfFeedByUser === '0') {
    return await sympathyDao.createSympathy(posting_id, user_id, sympathy_id);
  } else {
    return await sympathyDao.updateSympathy(posting_id, user_id, sympathy_id);
  }
};

// 공감취소
const deleteSympathy = async (posting_id, user_id) => {
  return await sympathyDao.deleteSympathy(posting_id, user_id);
};

module.exports = {
  findSympathyOfFeedByUser,
  createSympathy,
  deleteSympathy,
};

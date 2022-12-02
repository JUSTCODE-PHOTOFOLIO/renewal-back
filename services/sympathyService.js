const sympathyDao = require('../models/sympathyDao');

// 공감
const sympathy = async (posting_id, user_id, sympathy_id) => {
  return await sympathyDao.sympathy(posting_id, user_id, sympathy_id);
};

// 공감취소
const sympathyCancel = async (posting_id, user_id) => {
  return await sympathyDao.sympathyCancel(posting_id, user_id);
};

module.exports = {
  sympathy,
  sympathyCancel,
};

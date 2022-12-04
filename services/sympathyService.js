const sympathyDao = require('../models/sympathyDao');

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
  createSympathy,
  deleteSympathy,
};

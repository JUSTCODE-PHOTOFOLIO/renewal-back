const sympathyDao = require('../models/sympathyDao');

// 공감
const sympathy = async (posting_id, user_id, sympathy_id) => {
  try {
    const result = await sympathyDao.sympathy(posting_id, user_id, sympathy_id);
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// 공감취소
const sympathyCancel = async (posting_id, user_id) => {
  try {
    const result = await sympathyDao.sympathyCancel(posting_id, user_id);
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = {
  sympathy,
  sympathyCancel,
};

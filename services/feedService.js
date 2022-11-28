const feedDao = require('../models/feedDao');

// 최신 feed list
const feedsList = async user_id => {
  try {
    const result = await feedDao.feedsList(user_id);
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};
module.exports = { feedsList };

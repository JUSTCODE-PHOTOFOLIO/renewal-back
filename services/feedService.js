const feedDao = require('../models/feedDao');

// 최신 feed list
const getFeedsList = async user_id => {
  return await feedDao.getFeedsList(user_id);
};
module.exports = { getFeedsList };

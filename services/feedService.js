const feedDao = require('../models/feedDao');

// 최신 feed list
const feedsList = async user_id => {
  return await feedDao.feedsList(user_id);
};
module.exports = { feedsList };

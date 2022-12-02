const feedService = require('../services/feedService');

// 최신 feed list
const feedsList = async (req, res) => {
  let user_id = req.user_id;
  const result = await feedService.feedsList(user_id);
  res.status(200).json(result);
};

module.exports = { feedsList };

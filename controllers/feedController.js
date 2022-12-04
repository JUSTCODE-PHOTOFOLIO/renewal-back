const feedService = require('../services/feedService');

// 최신 feed list
const getFeedsList = async (req, res) => {
  let user_id = req.user_id;
  const result = await feedService.getFeedsList(user_id);
  res.status(200).json(result);
};

module.exports = { getFeedsList };

const feedService = require('../services/feedService');

// 최신 feed list
const feedsList = async (req, res) => {
  try {
    user_id = req.user_id;
    const result = await feedService.feedsList(user_id);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = { feedsList };

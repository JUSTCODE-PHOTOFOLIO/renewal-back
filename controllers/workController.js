const workService = require('../services/workService');
const userService = require('../services/userService');

// 카테고리별 총 게시물 수 + 최신 feed list
const getWorkList = async (req, res) => {
  const { sort } = req.query;
  const result = await workService.getWorkList(sort);
  res.status(200).json(result);
};

// 지정된 피드 상세
const getFeed = async (req, res) => {
  const { id } = req.params;
  const result = await workService.getFeed(id);
  res.status(200).json(result);
};

const deletefeed = async (req, res) => {
  user_id = req.user_id;
  const { id } = req.params;
  // const { posting_id } = req.body;
  const posting_id = id;
  const REQUIRE_KEYS = [user_id, posting_id];

  Object.keys(REQUIRE_KEYS).map(key => {
    if (!REQUIRE_KEYS[key]) {
      throw new Error(`KEY_ERROR: ${key}`);
    }
  });

  const userInfoById = await userService.getAccountInfo(user_id);

  if (user_id !== userInfoById.id) {
    throw new Error(`ONLY WRITER CAN DELETE THE FEED`);
  }

  await workService.deletefeed(posting_id);

  res.status(204).json({ data: null });
};

module.exports = {
  getWorkList,
  getFeed,
  deletefeed,
};

const followService = require('../services/followService');

const keyError = REQUIRE_KEYS => {
  Object.keys(REQUIRE_KEYS).map(key => {
    if (!REQUIRE_KEYS[key]) {
      throw new Error(`KEY_ERROR: ${key}`);
    }
  });
};

// 상세피드에서 로그인유저의 팔로잉 체크여부
const getFollowResult = async (req, res) => {
  const { id } = req.body;
  const user_id = req.user_id;
  const result = await followService.getFollowResult(id, user_id);
  res.status(200).json(result);
};

// 팔로우 체결
const createFollow = async (req, res) => {
  const { following_id } = req.body;
  const user_id = req.user_id;

  const REQUIRE_KEYS = { following_id };
  keyError(REQUIRE_KEYS);

  const result = await followService.createFollow(following_id, user_id);
  res.status(200).json(result);
};

//팔로우 취소
const deleteFollow = async (req, res) => {
  const { following_id } = req.body;
  const user_id = req.user_id;

  const REQUIRE_KEYS = { following_id };
  keyError(REQUIRE_KEYS);

  const result = await followService.deleteFollow(following_id, user_id);
  res.status(200).json(result);
};

module.exports = {
  getFollowResult,
  createFollow,
  deleteFollow,
};

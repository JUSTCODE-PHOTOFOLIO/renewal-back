const followService = require('../services/followService');

const keyError = REQUIRE_KEYS => {
  Object.keys(REQUIRE_KEYS).map(key => {
    if (!REQUIRE_KEYS[key]) {
      throw new Error(`KEY_ERROR: ${key}`);
    }
  });
};

// 팔로우 체결
const following = async (req, res) => {
  const { following_id } = req.body;
  const user_id = req.user_id;

  const REQUIRE_KEYS = { following_id };
  keyError(REQUIRE_KEYS);

  const result = await followService.following(following_id, user_id);
  res.status(200).json(result);
};

//팔로우 취소
const followingCancel = async (req, res) => {
  const { following_id } = req.body;
  const user_id = req.user_id;

  const REQUIRE_KEYS = { following_id };
  keyError(REQUIRE_KEYS);

  const result = await followService.followingCancel(following_id, user_id);
  res.status(200).json(result);
};

module.exports = {
  following,
  followingCancel,
};

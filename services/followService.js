const followDao = require('../models/followDao');

// 팔로우 체결
const following = async (following_id, user_id) => {
  try {
    const result = await followDao.following(following_id, user_id);
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// 팔로우 체결
const followingCancel = async (following_id, user_id) => {
  try {
    const result = await followDao.followingCancel(following_id, user_id);
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = {
  following,
  followingCancel,
};

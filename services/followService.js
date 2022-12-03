const followDao = require('../models/followDao');

// 상세피드에서 팔로우 체결유무 확인
const followCheck = async (id, user_id) => {
  return await followDao.followCheck(id, user_id);
};

// 팔로우 체결
// TODO 팔로우 체크 도입해서 중복팔로우 되지 않게
const following = async (following_id, user_id) => {
  return await followDao.following(following_id, user_id);
};

// 팔로우 체결
const followingCancel = async (following_id, user_id) => {
  return await followDao.followingCancel(following_id, user_id);
};

module.exports = {
  followCheck,
  following,
  followingCancel,
};

const followDao = require('../models/followDao');

// 상세피드에서 팔로우 체결유무 확인
const followCheck = async (id, user_id) => {
  return await followDao.followCheck(id, user_id);
};

// 팔로우 체결
const following = async (following_id, user_id) => {
  const followCheck = await followDao.isFollow(following_id, user_id);
  if (followCheck.follow_check === true) {
    throw { status: 400, message: 'ALREADY FOLLOWED' };
  }
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

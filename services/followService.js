const followDao = require('../models/followDao');

// 상세피드에서 팔로우 체결유무 확인
const getFollowResult = async (id, user_id) => {
  return await followDao.getFollowResult(id, user_id);
};

// 팔로우 체결
const createFollow = async (following_id, user_id) => {
  const followCheck = await followDao.isFollow(following_id, user_id);
  if (followCheck.follow_check === true) {
    throw { status: 400, message: 'ALREADY FOLLOWED' };
  }
  return await followDao.createFollow(following_id, user_id);
};

// 팔로우 체결
const deleteFollow = async (following_id, user_id) => {
  return await followDao.deleteFollow(following_id, user_id);
};

module.exports = {
  getFollowResult,
  createFollow,
  deleteFollow,
};

const workDao = require('../models/workDao');

// 상세페드에서 팔로우 체결유무 확인
const followCheck = async (id, user_id) => {
  try {
    const result = await workDao.followCheck(id, user_id);
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// 카테고리별 총 게시물 수 + 최신 feed list
const worksList = async sort => {
  try {
    const result = await workDao.worksList(sort);
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// 지정된 피드 상세
const feed = async id => {
  try {
    const result = await workDao.feed(id);
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = {
  followCheck,
  worksList,
  feed,
};

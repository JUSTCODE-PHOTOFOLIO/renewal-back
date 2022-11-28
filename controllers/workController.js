const workService = require('../services/workService');

// 상세피드에서 로그인유저의 팔로잉 체크여부
const followCheck = async (req, res) => {
  try {
    const { id } = req.params;
    user_id = req.user_id;
    const result = await workService.followCheck(id, user_id);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// 카테고리별 총 게시물 수 + 최신 feed list
const worksList = async (req, res) => {
  try {
    const { sort } = req.params;
    const result = await workService.worksList(sort);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// 지정된 피드 상세
const feed = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('id is ', id);
    const result = await workService.feed(id);
    res.status(200).json(result);
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

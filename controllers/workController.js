const workService = require('../services/workService');

// 카테고리별 총 게시물 수 + 최신 feed list
const worksList = async (req, res) => {
  const { sort } = req.query;
  const result = await workService.worksList(sort);
  res.status(200).json(result);
};

// 지정된 피드 상세
const feed = async (req, res) => {
  const { id } = req.params;
  const result = await workService.feed(id);
  res.status(200).json(result);
};

module.exports = {
  worksList,
  feed,
};

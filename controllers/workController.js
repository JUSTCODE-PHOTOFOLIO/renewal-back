const workService = require('../services/workService');

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

module.exports = {
  getWorkList,
  getFeed,
};

const searchListService = require('../services/searchListService');

// 검색어 입력시 + 카테고리 설정
const searchList = async (req, res) => {
  const { query } = req.query;
  const { category_id } = req.query;
  const result = await searchListService.searchList(query, category_id);
  res.status(200).json(result);
};

module.exports = { searchList };

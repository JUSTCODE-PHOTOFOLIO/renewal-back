const categoryService = require('../services/categoryService');

// tag별 피드 개수
const tagCount = async (req, res) => {
  const result = await categoryService.tagCount();
  res.status(200).json({ data: result });
};

// 카테고리별 피드 리스트
const categoryList = async (req, res) => {
  const { categoryName } = req.params;
  const result = await categoryService.categoryList(categoryName);
  res.status(200).json(result);
};

module.exports = {
  tagCount,
  categoryList,
};

const categoryService = require('../services/categoryService');

// tag별 피드 개수
const tagCount = async (req, res) => {
  try {
    const result = await categoryService.tagCount();
    res.status(200).json({ data: result });
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// 카테고리별 피드 리스트
const categoryList = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const result = await categoryService.categoryList(categoryName);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = {
  tagCount,
  categoryList,
};

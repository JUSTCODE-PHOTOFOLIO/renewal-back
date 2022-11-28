const categoryDao = require('../models/categoryDao');

// tag별 피드 개수
const tagCount = async () => {
  try {
    const result = await categoryDao.tagCount();
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// 카테고리별 피드 리스트
const categoryList = async categoryName => {
  try {
    const result = await categoryDao.categoryList(categoryName);
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = {
  tagCount,
  categoryList,
};
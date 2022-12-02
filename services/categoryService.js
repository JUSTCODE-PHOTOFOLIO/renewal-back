const categoryDao = require('../models/categoryDao');

// tag별 피드 개수
const tagCount = async () => {
  return await categoryDao.tagCount();
};

// 카테고리별 피드 리스트
const categoryList = async categoryName => {
  const findCategoryName = await categoryDao.findCategoryName(categoryName);
  if (!findCategoryName.check_categoryName) {
    throw { statusCode: 400, message: `DO NOT EXISTS CATEGORY NAME` };
  } else {
    return await categoryDao.categoryList(categoryName);
  }
};

module.exports = {
  tagCount,
  categoryList,
};

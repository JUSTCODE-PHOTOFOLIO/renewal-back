const searchListDao = require('../models/searchListDao');

// 검색어 입력시 + 카테고리 설정
const getSearchList = async (query, category_name) => {
  return await searchListDao.getSearchList(query, category_name);
};

module.exports = { getSearchList };

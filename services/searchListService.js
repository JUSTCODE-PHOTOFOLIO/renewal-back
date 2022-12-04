const searchListDao = require('../models/searchListDao');

// 검색어 입력시 + 카테고리 설정
const getSearchList = async (query, category_id) => {
  return await searchListDao.getSearchList(query, category_id);
};

module.exports = { getSearchList };

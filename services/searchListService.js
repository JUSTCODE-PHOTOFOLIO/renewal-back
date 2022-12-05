const searchListDao = require('../models/searchListDao');

// 검색어 입력시 + 카테고리 설정
const getSearchList = async (query, category_name) => {
  const changeDao = category_name
    ? searchListDao.getSearchListWithCategory(query, category_name)
    : searchListDao.getSearchList(query);
  return await changeDao;
};

module.exports = { getSearchList };

const searchListDao = require('../models/searchListDao');

// 검색어 입력시 + 카테고리 설정
const searchList = async (query, category_id) => {
  try {
    const result = await searchListDao.searchList(query, category_id);
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = { searchList };

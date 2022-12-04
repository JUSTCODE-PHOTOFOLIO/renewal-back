const workDao = require('../models/workDao');

// 카테고리별 총 게시물 수 + 최신 feed list
const worksList = async sort => {
  // sort 종류 ('recommendpoint', 'sympathycnt')
  const defaultOrder = 'ORDER BY wp.created_at DESC';
  const recommendPoint = `CONCAT(b.sympathy_cnt + a.comment_cnt) recommendpoint,`;

  let orderByItem = sort;
  let isSelect = '';
  const changeSort = sort => {
    if (sort === 'sympathycnt') {
      orderByItem = 'sympathy_cnt';
    } else if (sort === 'recommendpoint') {
      orderByItem = 'recommendpoint';
      isSelect = recommendPoint;
    }
    return orderByItem;
  };
  changeSort(sort);

  const sortOfOrder = sort ? `ORDER BY ${orderByItem} DESC` : defaultOrder;
  return await workDao.worksList(isSelect, sortOfOrder);
};

// 지정된 피드 상세
const feed = async id => {
  return await workDao.feed(id);
};

module.exports = {
  worksList,
  feed,
};

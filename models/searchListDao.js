const myDataSource = require('.');

const findQuerySearchResult = `
  WITH tables1 AS (
    SELECT
      wp.id AS id,
      COUNT(*) AS comment_cnt
    FROM
      Works_Posting wp
    JOIN Comment c ON
      wp.id = c.posting_id
    GROUP BY
      wp.id 
  ),
  
  tables2 AS (
    SELECT
      wp.id AS id,
      COUNT(*) AS sympathy_cnt
    FROM
      Works_Posting wp
    JOIN Works_Sympathy_Count wsc ON
      wp.id = wsc.posting_id
    LEFT JOIN Works_Sympathy ws ON
      wsc.sympathy_id = ws.id
    GROUP BY
      wp.id 
  ),
  tables3 AS (
    SELECT
      id,
      posting_id,
      upload_url AS img_url
    FROM
      upload_file
    WHERE
      (posting_id,
      id) 
      IN (
        SELECT
          posting_id,
          MAX(id)
        FROM
          upload_file
        WHERE
          file_sort_id = 1
        GROUP BY
          posting_id ) 
              ) 
            
  SELECT
    wp.id,
    u.kor_name AS nickname,
    u.profile_image,
    c.img_url,
    wp.title,
    IFNULL(a.comment_cnt, '0') comment_cnt,
    IFNULL(b.sympathy_cnt, '0') sympathy_cnt,
    wp.view_count,
    SUBSTRING(wp.created_at, 1, 10) AS created_at
  FROM
    Works_Posting wp
  LEFT JOIN Users u ON
    wp.user_id = u.id
  LEFT JOIN tables3 c ON
    c.posting_id = wp.id
  LEFT JOIN tables1 a ON
    a.id = wp.id
  LEFT JOIN tables2 b ON
    b.id = wp.id
  `;

// 검색어 입력시 + 카테고리 설정
const searchList = async (query, category_id) => {
  try {
    if (!category_id) {
      const resultCount = await myDataSource.query(
        `
        SELECT 
          COUNT(*) result_cnt
        FROM 
          Works_Posting wp  
        WHERE 
          wp.title  LIKE "%${query}%" OR wp.content LIKE "%${query}%" 
        ORDER BY 
          wp.created_at DESC 
        `
      );

      const searchResult = await myDataSource.query(
        `
       ${findQuerySearchResult}
        WHERE 
          wp.title LIKE '%${query}%' OR wp.content LIKE '%${query}%'
        ORDER BY 
          wp.created_at DESC 
        `
      );
      let result = { resultCount, searchResult };
      return result;
    } else {
      const resultCount = await myDataSource.query(
        `
        SELECT 
          COUNT(*) result_cnt
        FROM 
          Works_Posting wp  
        WHERE 
          wp.title LIKE "%${query}%" OR wp.content LIKE "%${query}%" AND wp.category_id = '${category_id}'
        ORDER BY 
          wp.created_at DESC 
        `
      );

      const searchResult = await myDataSource.query(
        `
        ${findQuerySearchResult}
        WHERE 
          wp.title LIKE '%${query}%' OR wp.content LIKE '%${query}%' AND wp.category_id = '${category_id}'
        ORDER BY 
          wp.created_at DESC 
      `
      );

      let result = { resultCount, searchResult };
      return result;
    }
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = { searchList };

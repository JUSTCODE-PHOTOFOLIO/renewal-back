const myDataSource = require('.');

// 카테고리별 피드 리스트 - 1.fashion 2.pattern 3.travel 4.animal

const findCategoryName = async categoryName => {
  return await myDataSource
    .query(
      `
    SELECT
        EXISTS(
                SELECT *
                FROM
                    Works_Category
                WHERE
                    eng_category_name = ( ? )
            ) as check_categoryName
    `,
      [categoryName]
    )
    .then(value => {
      const [item] = value;
      return {
        check_categoryName: item.check_categoryName == 1,
      };
    });
};
const categoryList = async categoryName => {
  let result = await myDataSource.query(
    `
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
              posting_id 
          ) 
        ) 
        
        SELECT
          wp.id,
          c.img_url,
          wc.category_name,
          wc.eng_category_name,
          u.kor_name AS nickname,
          wp.title,
          IFNULL(a.comment_cnt, '0') AS comment_cnt,
          IFNULL(b.sympathy_cnt, '0') AS sympathy_cnt,
          wp.view_count,
          SUBSTRING(wp.created_at, 1, 10) created_at
        FROM
          Works_Posting wp
        JOIN Users u ON
          wp.user_id = u.id
        LEFT JOIN Works_Category wc ON
          wp.category_id = wc.id
        LEFT JOIN tables1 a ON
          a.id = wp.id
        LEFT JOIN tables2 b ON
          b.id = wp.id
        LEFT JOIN tables3 c ON
          c.posting_id = wp.id
        WHERE
          wc.eng_category_name = ( ? )
        ORDER BY
          wp.created_at DESC
      `,
    [categoryName]
  );
  return result;
};

// tag별 피드 개수
const tagCount = async () => {
  return await myDataSource.query(
    `
      SELECT
        wtn.id,
        wtn.name,
        count(DISTINCT(wpt.id)) tag_cnt
      FROM
        Works_Posting_tags wpt
      JOIN Works_tag_names wtn ON
        wpt.tag_id = wtn.id
      GROUP BY
        wtn.id
      `
  );
};

module.exports = {
  tagCount,
  categoryList,
  findCategoryName,
};

const { DataSource } = require('typeorm');
const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource.initialize();

// 검색어 입력시 + 카테고리 설정
const searchList = async (query, category_id) => {
  try {
    if (!category_id) {
      const resultCount = await myDataSource.query(
        `
        SELECT COUNT(*) result_cnt
        from Works_Posting wp  
        WHERE wp.title  LIKE "%${query}%" OR wp.content LIKE "%${query}%" 
        ORDER BY wp.created_at DESC 
        `
      );

      const searchResult = await myDataSource.query(
        `
        with tables1 as (
          select wp.id as id, COUNT(*) as comment_cnt FROM Works_Posting wp 
          join Comment c on wp.id = c.posting_id 
          GROUP BY wp.id 
        ), tables2 as (
          SELECT wp.id as id, COUNT(*) as sympathy_cnt from Works_Posting wp 
          join Works_Sympathy_Count wsc on wp.id = wsc.posting_id 
          left join Works_Sympathy ws on wsc.sympathy_id = ws.id 
          GROUP BY wp.id 
        ), tables3 as (
          select id, posting_id, upload_url as img_url from upload_file
          WHERE (posting_id, id) 
          IN (select posting_id, MAX(id) from upload_file WHERE file_sort_id = 1 group by posting_id ) 
        ) 
        SELECT wp.id, u.kor_name as nickname, u.profile_image,  c.img_url, wp.title, IFNULL(a.comment_cnt, '0') comment_cnt, IFNULL(b.sympathy_cnt, '0') sympathy_cnt, wp.view_count, SUBSTRING(wp.created_at,1,10) as created_at
        from Works_Posting wp 
        left join Users u on wp.user_id = u.id 
        left JOIN tables3 c on c.posting_id = wp.id
        left join tables1 a on a.id = wp.id 
        left JOIN tables2 b on b.id = wp.id 
        WHERE wp.title  LIKE '%${query}%' OR wp.content LIKE '%${query}%'
        ORDER BY wp.created_at DESC 
        `
      );
      let result = { resultCount, searchResult };
      return result;
    } else {
      const resultCount = await myDataSource.query(
        `
      SELECT COUNT(*) result_cnt
      from Works_Posting wp  
      WHERE wp.title LIKE "%${query}%" OR wp.content LIKE "%${query}%" AND wp.category_id = '${category_id}'
      ORDER BY wp.created_at DESC 
      `
      );

      const searchResult = await myDataSource.query(
        `
      with tables1 as (
        select wp.id as id, COUNT(*) as comment_cnt FROM Works_Posting wp 
        join Comment c on wp.id = c.posting_id 
        GROUP BY wp.id 
      ), tables2 as (
        SELECT wp.id as id, COUNT(*) as sympathy_cnt from Works_Posting wp 
        join Works_Sympathy_Count wsc on wp.id = wsc.posting_id 
        left join Works_Sympathy ws on wsc.sympathy_id = ws.id 
        GROUP BY wp.id 
      ), tables3 as (
        select id, posting_id, upload_url as img_url from upload_file
        WHERE (posting_id, id) 
        IN (select posting_id, MAX(id) from upload_file WHERE file_sort_id = 1 group by posting_id ) 
      ) 
      SELECT wp.id, wp.category_id, u.kor_name as nickname, u.profile_image,  c.img_url, wp.title, 
      IFNULL(a.comment_cnt, '0') comment_cnt, IFNULL(b.sympathy_cnt, '0') sympathy_cnt, wp.view_count, SUBSTRING(wp.created_at,1,10) as created_at
      from Works_Posting wp 
      left join Users u on wp.user_id = u.id 
      left JOIN tables3 c on c.posting_id = wp.id
      left join tables1 a on a.id = wp.id 
      left JOIN tables2 b on b.id = wp.id 
      WHERE wp.title  LIKE '%${query}%' OR wp.content LIKE '%${query}%' AND wp.category_id = '${category_id}'
      ORDER BY wp.created_at DESC 
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

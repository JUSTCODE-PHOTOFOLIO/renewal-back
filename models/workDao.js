const myDataSource = require('.');

// 카테고리별 총 게시물 수 + 최신 feed list
const worksList = async sort => {
  try {
    if (!sort) {
      const categorySortCountList = await myDataSource.query(
        `
    SELECT wc.id, wc.category_name, wc.eng_category_name, count(*) category_cnt 
    FROM Works_Category wc 
    LEFT JOIN Works_Posting wp 
    ON wc.id = wp.category_id 
    GROUP BY wc.id
    `
      );

      const worksFeedList = await myDataSource.query(
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
    
      SELECT wp.id, u.kor_name as nickname, u.profile_image,  c.img_url, wp.title, IFNULL(a.comment_cnt, '0') comment_cnt, 
        IFNULL(b.sympathy_cnt, '0') sympathy_cnt, wp.view_count, SUBSTRING(wp.created_at,1,10) as created_at
      from Works_Posting wp 
      left join Users u on wp.user_id = u.id 
      left JOIN tables3 c on c.posting_id = wp.id
      left join tables1 a on a.id = wp.id 
      left JOIN tables2 b on b.id = wp.id 
      ORDER BY wp.created_at DESC 
      `
      );
      let result = { categorySortCountList, worksFeedList };
      return result;
    } else {
      const categorySortCountList = await myDataSource.query(
        `
      SELECT wc.id, wc.category_name, wc.eng_category_name, count(*) category_cnt 
      FROM Works_Category wc 
      LEFT JOIN Works_Posting wp 
      ON wc.id = wp.category_id 
      GROUP BY wc.id
      `
      );
      // sort 종류 ('recommendpoint', 'sympathycnt')
      const worksFeedList = await myDataSource.query(
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
        SELECT concat(b.sympathy_cnt + a.comment_cnt) recommendpoint, wp.id, u.kor_name as nickname, u.profile_image,  c.img_url, wp.title, 
          IFNULL(a.comment_cnt, '0') comment_cnt, IFNULL(b.sympathy_cnt, '0') sympathycnt, wp.view_count, SUBSTRING(wp.created_at,1,10) as created_at
        from Works_Posting wp 
        left join Users u on wp.user_id = u.id 
        left JOIN tables3 c on c.posting_id = wp.id
        left join tables1 a on a.id = wp.id 
        left JOIN tables2 b on b.id = wp.id 
        ORDER BY ${sort} DESC 
        `
      );
      let result = { categorySortCountList, worksFeedList };
      return result;
    }
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// feed 글쓴이와 유저와의 팔로우 관계
const followCheck = async (id, user_id) => {
  try {
    const checkFollow = await myDataSource.query(
      `
    select EXISTS (select f.id from Follow f
      left join Works_Posting wp on wp.user_id = f.following_id
      where wp.id = '${id}' and follower_id = '${user_id}') as success
    `
    );
    let result = { checkFollow };
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// feed 상세
const feed = async id => {
  try {
    // feed img_url 배열(다수의 이미지가 있을 시)
    let feedImgArr = await myDataSource.query(
      `
      SELECT 
        COUNT(uf.upload_url) file_cnt, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
            "file_sort", fs.file_sort, 
            "img_url", uf.upload_url
          )
        ) as fileInfo
      from upload_file uf  
      left join file_sort fs on uf.file_sort_id = fs.id 
      where uf.posting_id = '${id}' and uf.file_sort_id = 1
      `
    );
    feedImgArr = [...feedImgArr].map(item => {
      return {
        ...item,
        fileInfo: JSON.parse(item.fileInfo),
      };
    });

    // feed 정보와 사용자 정보 + 태그 카운트
    let feedWithTags = await myDataSource.query(
      `
      SELECT
      	wp.id, wp.user_id, u.kor_name, wp.title, wp.content, wp.view_count, 
	      ps.status, SUBSTRING(wp.created_at,1,10) as created_at,
        u.nickname, u.profile_image,
	      COUNT(wpt.id) as tag_cnt,
	      JSON_ARRAYAGG(
          JSON_OBJECT(
            "tag_name", wtn.name
          )
	      ) as tagInfo
      from Works_Posting wp
      join Users u on wp.user_id = u.id
      join public_status ps on wp.status_id = ps.id
      join Works_Category wc on wc.id = wp.category_id
      left join Works_Posting_tags wpt  ON wp.id = wpt.posting_id
      left join Works_tag_names wtn on wpt.tag_id = wtn.id
      where wp.id = '${id}'
      `
    );

    feedWithTags = [...feedWithTags].map(item => {
      return {
        ...item,
        tagInfo: JSON.parse(item.tagInfo),
      };
    });

    let feedCommentInfo = await myDataSource.query(
      `
      SELECT c.id, c.user_id, u.kor_name as kor_name, c.comment, 
        SUBSTRING(c.created_at,1,10) as created_at , 
        SUBSTRING(c.updated_at,1,10) as updated_at  
      from Comment c 
      left join Works_Posting wp on c.posting_id = wp.id
      left join Users u ON u.id = c.user_id
      where wp.id = '${id}'
      order by created_at ASC 
      `
    );

    // feed 글쓴이의 다른 작품들
    let moreFeedinfo = await myDataSource.query(
      `
      with tables1 as (
        select id, posting_id, upload_url as img_url,
        SUBSTRING(created_at,1,10) as created_at
        from upload_file
        WHERE (posting_id, id)
        IN (select posting_id, MAX(id) from upload_file WHERE file_sort_id = 1 group by posting_id )
      ), tables2 as (
        SELECT * from Works_Posting wp
        WHERE wp.id = '${id}'
      )
      SELECT
        COUNT(wp.id) as user_feed_cnt,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                "id", wp.id,
                "title", wp.title,
                "img_url", a.img_url,
                "created_at", a.created_at
              ) 
          )  
          as more_feed 
      from Works_Posting wp
      left JOIN tables1 a on a.id = wp.id
      left join tables2 b on b.user_id = wp.user_id
      WHERE wp.user_id = b.user_id AND NOT wp.id  = '${id}'
      `
    );
    moreFeedinfo = [...moreFeedinfo].map(item => {
      return {
        ...item,
        more_feed: JSON.parse(item.more_feed),
      };
    });

    // feed 글쓴이에 대한 팔로워 정보
    let writerInfo = await myDataSource.query(
      `
      SELECT
        wp.id, u.id as id, u.login_id login_id, u.kor_name kor_name, 
        u.eng_name eng_name, u.profile_image profile_image, u.nickname nickname,  
        COUNT(f.follower_id) as follower_cnt,
        JSON_ARRAYAGG(
          JSON_OBJECT(
          "follower_id", f.follower_id,
          "follower_name", u2.nickname
          )
        ) as follower_list,
        ( 
          SELECT COUNT(f.following_id)		
          from Works_Posting wp
          left join Users u on u.id = wp.user_id  
          left join Follow f on f.follower_id = u.id 
          left join Users u2 on u2.id = f.following_id 
          WHERE wp.id = '${id}'
        ) as following_cnt,
        ( 
        SELECT 
          JSON_ARRAYAGG(
            JSON_OBJECT(
            "following_id", f.following_id,
            "following_name", u2.nickname
            )
          )
        from Works_Posting wp
        left join Users u on u.id = wp.user_id  
        left join Follow f on f.follower_id = u.id 
        left join Users u2 on u2.id = f.following_id 
        WHERE wp.id = '${id}'
        ) as following_list
        from Works_Posting wp
        left join Users u on u.id = wp.user_id
        left join Follow f on f.following_id = u.id  
        left join Users u2 on u2.id = f.follower_id 
        where wp.id = '${id}'
      `
    );

    writerInfo = [...writerInfo].map(item => {
      return {
        ...item,
        follower_list: JSON.parse(item.follower_list),
        following_list: JSON.parse(item.following_list),
      };
    });

    // feed + 총 공감수
    let sympathyCount = await myDataSource.query(
      `
      SELECT COUNT(*) as total_sympathy_cnt
      from Works_Sympathy_Count wsc 
      left JOIN Works_Sympathy ws on ws.id  = wsc.sympathy_id 
      left join Users u on u.id = wsc.user_id 
      left join Works_Posting wp ON wsc.posting_id = wp.id 
      where wp.id = '${id}'
      `
    );

    // feed + 공감별 개수
    let sympathySortCount = await myDataSource.query(
      `
      with tables as (
        SELECT wp.id id,  ws.sympathy_sort sympathy_sort, 
          IFNULL(COUNT(wsc.id), '0') as sympathy_cnt
        FROM  Works_Sympathy ws
          LEFT JOIN Works_Sympathy_Count wsc on ws.id  = wsc.sympathy_id 
          LEFT JOIN Users u on u.id = wsc.user_id 
          LEFT JOIN Works_Posting wp ON wsc.posting_id = wp.id 
          WHERE wp.id = '${id}'
          GROUP by ws.sympathy_sort
          )
      
      SELECT a.id, ws.sympathy_sort, IFNULL(a.sympathy_cnt, '0') sympathy_cnt from Works_Sympathy ws 
      LEFT JOIN tables a on a.sympathy_sort = ws.sympathy_sort 
      `
    );

    let anotherFeedList = await myDataSource.query(
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
      SELECT wp.id, wp.user_id, u.nickname, u.profile_image,  c.img_url, wp.title, 
        IFNULL(a.comment_cnt, '0') comment_cnt, IFNULL(b.sympathy_cnt, '0') sympathy_cnt, wp.view_count, SUBSTRING(wp.created_at,1,10) as created_at
      from Works_Posting wp 
      left join Users u on wp.user_id = u.id 
      left JOIN tables3 c on c.posting_id = wp.id
      left join tables1 a on a.id = wp.id 
      left JOIN tables2 b on b.id = wp.id 
      where wp.id not in ("${id}")
      ORDER BY wp.created_at DESC
      `
    );

    // 조회수 카운팅 (IP주소나 시간만료 같은 장치는 아직 없음.)
    const viewCount = await myDataSource.query(
      `
      UPDATE Works_Posting SET view_count = view_count + 1
      WHERE id = '${id}'
      `
    );

    let result = {
      feedImgArr,
      feedWithTags,
      feedCommentInfo,
      moreFeedinfo,
      writerInfo,
      sympathyCount,
      sympathySortCount,
      anotherFeedList,
    };
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = {
  followCheck,
  worksList,
  feed,
};

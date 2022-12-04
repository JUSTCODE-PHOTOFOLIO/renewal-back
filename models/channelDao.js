const myDataSource = require('.');

const getChannel = async (following_id, user_id) => {
  let writerInfo = await myDataSource.query(
    `
    SELECT 
      id, 
      nickname, 
      kor_name, 
      eng_name, 
      email, 
      profile_image 
    FROM 
      Users 
    where 
      id =( ? )
    `,
    [following_id]
  );
  let userFollowingInfo = await myDataSource.query(
    `
    SELECT COUNT(following_id) as following_cnt, 
      JSON_ARRAYAGG(
        JSON_OBJECT(
        "follower_id", follower_id,
        "following_id", following_id
          )
        ) as following_info
    FROM Follow
    WHERE following_id = ( ? )
    `,
    [following_id]
  );
  userFollowingInfo = [...userFollowingInfo].map(item => {
    return {
      ...item,
      following_info: JSON.parse(item.following_info),
    };
  });

  let userFollowerInfo = await myDataSource.query(
    `
    SELECT 
        COUNT(follower_id) as follower_cnt, 
        JSON_ARRAYAGG(
          JSON_OBJECT(
          "following_id", following_id,
          "follower_id", follower_id
            )
          ) as follower_info
    FROM Follow
    WHERE follower_id = ( ? )`,
    [following_id]
  );
  userFollowerInfo = [...userFollowerInfo].map(item => {
    return {
      ...item,
      follower_info: JSON.parse(item.follower_info),
    };
  });

  let usersPosts = await myDataSource.query(
    `
    WITH tables1 AS (
      SELECT 
          wp.id AS id, 
          COUNT(*) AS comment_cnt 
      FROM Works_Posting wp 
      JOIN Comment c 
          ON wp.id = c.posting_id 
      GROUP BY wp.id 
    ), tables2 AS (
      SELECT 
          wp.id AS id, 
          COUNT(*) AS sympathy_cnt 
      FROM Works_Posting wp 
      JOIN Works_Sympathy_Count wsc 
          ON wp.id = wsc.posting_id 
      LEFT JOIN Works_Sympathy ws 
          ON wsc.sympathy_id = ws.id 
      GROUP BY wp.id 
    ), tables3 AS (
      SELECT 
          id, 
          posting_id, 
          upload_url AS img_url 
      FROM upload_file
      WHERE (posting_id, id) 
        IN (
        SELECT 
            posting_id, 
            MAX(id) 
        FROM upload_file 
        WHERE file_sort_id = 1 
        GROUP BY posting_id ) 
    )
    SELECT 
        wp.id, 
        wp.user_id, 
        u.nickname, 
        u.profile_image, 
        c.img_url,
        wp.title, 
        IFNULL(a.comment_cnt, '0') comment_cnt, 
        IFNULL(b.sympathy_cnt, '0') sympathy_cnt, 
        wp.view_count, 
        SUBSTRING(wp.created_at,1,10) as created_at
    FROM Works_Posting wp 
    LEFT JOIN Users u ON wp.user_id = u.id 
    LEFT JOIN tables3 c ON c.posting_id = wp.id
    LEFT JOIN tables1 a ON a.id = wp.id 
    LEFT JOIN tables2 b ON b.id = wp.id 
    WHERE wp.user_id = ( ? )
    ORDER BY wp.id DESC
    `,
    [following_id]
  );
  return {
    writerInfo,
    userFollowingInfo,
    userFollowerInfo,
    usersPosts,
  };
};

module.exports = {
  getChannel,
};

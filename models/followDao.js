const myDataSource = require('.');

// feed 글쓴이와 유저와의 팔로우 관계
const followCheck = async (id, user_id) => {
  return await myDataSource
    .query(
      `
      SELECT
        EXISTS (
          SELECT
            f.id
          FROM
            Follow f
          LEFT JOIN Works_Posting wp ON
            wp.user_id = f.following_id
          WHERE
            wp.id = ?
            AND follower_id = ?
        ) AS success
    `,
      [id, user_id]
    )
    .then(value => {
      const [item] = value;
      return {
        follow_check: item.success == 1,
      };
    });
};

// follow여부 확인 유닛
const isFollow = async (following_id, user_id) => {
  return await myDataSource
    .query(
      `
      SELECT
        count(*) AS follow_check
      FROM
        Follow
      WHERE
        following_id = ?
        AND follower_id = ?
    `,
      [following_id, user_id]
    )
    .then(value => {
      const [item] = value;
      return {
        follow_check: item.follow_check == 1,
      };
    });
};
// follow 체결 관련
const following = async (following_id, user_id) => {
  await myDataSource.query(
    `
      INSERT
        INTO
        Follow (following_id,
        follower_id)
      VALUES 
        (?,?)
    `,
    [following_id, user_id]
  );
  return isFollow(following_id, user_id);
};

// follow 취소 관련
const followingCancel = async (following_id, user_id) => {
  await myDataSource.query(
    `
      DELETE
      FROM
        Follow
      WHERE
        following_id = ?
        AND follower_id = ?
    `,
    [following_id, user_id]
  );
  return isFollow(following_id, user_id);
};

module.exports = {
  isFollow,
  followCheck,
  following,
  followingCancel,
};

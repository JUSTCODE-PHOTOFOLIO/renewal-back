const myDataSource = require('.');

// follow 체결 관련
const following = async (following_id, user_id) => {
  try {
    const follow = await myDataSource.query(
      `
      INSERT
        INTO
        Follow (following_id,
        follower_id)
      VALUES 
        ('${following_id}',
        '${user_id}')
    `
    );
    const followingResult = await myDataSource.query(
      `
      SELECT
        *
      FROM
        Follow f
      WHERE
        following_id = '${following_id}'
        AND follower_id = '${user_id}'
    `
    );
    let result = { followingResult };
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// follow 취소 관련
const followingCancel = async (following_id, user_id) => {
  try {
    const deleteFollow = await myDataSource.query(
      `
      DELETE
      FROM
        Follow
      WHERE
        following_id = '${following_id}'
        AND follower_id = '${user_id}'
    `
    );
    const deleteResult = await myDataSource.query(
      `
      SELECT
        count(*)
      FROM
        Follow f
      WHERE
        following_id = '${following_id}'
        AND follower_id = '${user_id}'
    `
    );
    let result = { deleteResult };
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = {
  following,
  followingCancel,
};

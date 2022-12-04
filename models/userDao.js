const myDataSource = require('.');

const getUserById = async login_id => {
  const userId = await myDataSource.query(
    `
    SELECT id, email FROM Users WHERE login_id= ?
  `,
    [login_id]
  );
  return userId;
};

const getUserByEmail = async email => {
  const userEmail = await myDataSource.query(
    `
    SELECT id, email FROM Users WHERE email= ?
  `,
    [email]
  );
  return userEmail;
};

const createUserInDb = async (
  login_id,
  hashed_password,
  kor_name,
  eng_name,
  nickname,
  email,
  profile_image
) => {
  await myDataSource.query(
    `
    INSERT INTO Users (login_id, password, kor_name, eng_name, nickname, email, profile_image)
    VALUES ( ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      login_id,
      hashed_password,
      kor_name,
      eng_name,
      nickname,
      email,
      profile_image,
    ]
  );
};

const findDbUser = async login_id => {
  const [dbUser] = await myDataSource.query(
    `
  SELECT id, email, kor_name, password, profile_image
    FROM Users WHERE login_id = ?
    `,
    [login_id]
  );
  return dbUser;
};

const getAccountInfo = async user_id => {
  const [userInfoById] = await myDataSource.query(
    `
  SELECT * FROM Users WHERE id = ?
  `,
    [user_id]
  );
  return userInfoById;
};

const modifyAccountInfo = async (
  user_id,
  kor_name,
  eng_name,
  email,
  nickname
) => {
  await myDataSource.query(
    `
    UPDATE Users 
    SET 
        kor_name= ?, 
        eng_name= ?, 
        email= ?, 
        nickname= ? 
    WHERE 
        id=?;
    `,
    [kor_name, eng_name, email, nickname, user_id]
  );
  const [userdata] = await myDataSource.query(
    `
  SELECT * FROM Users WHERE id= ?
  `,
    [user_id]
  );
  return userdata;
};

const deleteAccount = async user_id => {
  await myDataSource.query(
    `
    SET foreign_key_checks = 0
    `
  );
  let feedsBasket = [];
  const feedsWrittenByUser = await myDataSource.query(
    `SELECT id FROM Works_posting WHERE user_id = (?)`,
    [user_id]
  );
  for (let i = 0; i < feedsWrittenByUser.length; i++) {
    feedsBasket.push(feedsWrittenByUser[i]);
  }
  for (let i = 0; i < feedsBasket.length; i++) {
    const tagsIdsOnSelectedPost = await myDataSource.query(
      `SELECT tag_id FROM Works_Posting_tags wpt WHERE posting_id = (?)`, //<---sql
      [feedsBasket[i].id]
    );
    let tagIdBasket = [];
    for (let j = 0; j < tagsIdsOnSelectedPost.length; j++) {
      tagIdBasket.push(tagsIdsOnSelectedPost[j].tag_id);
    }
    let tagsShouldBeDeletedFromDB = [];
    for (let j = 0; j < tagIdBasket.length; j++) {
      let tagCountForDesignatedArticle = await myDataSource.query(
        `SELECT tag_id FROM Works_Posting_tags wpt WHERE tag_id = ${tagIdBasket[j]}`
      );
      if (tagCountForDesignatedArticle.length < 2) {
        tagsShouldBeDeletedFromDB.push(tagCountForDesignatedArticle);
      }
    }
    await myDataSource.query(
      `DELETE FROM Works_Posting_tags WHERE posting_id = (?)`,
      [feedsBasket[i].id]
    );
    for (let j = 0; j < tagsShouldBeDeletedFromDB.length; j++) {
      await myDataSource.query(
        `DELETE FROM Works_Tag_names WHERE id = ${tagsShouldBeDeletedFromDB[j][0].tag_id}`
      );
    }
    await myDataSource.query(`DELETE FROM Comment WHERE posting_id = (?)`, [
      feedsBasket[i].id,
    ]);
    await myDataSource.query(
      `DELETE FROM Works_Sympathy_Count WHERE posting_id = (?)`,
      [feedsBasket[i].id]
    );
    await myDataSource.query(`DELETE FROM Works_posting WHERE id = (?)`, [
      feedsBasket[i].id,
    ]);
  }

  await myDataSource.query(
    `
    DELETE FROM
               Users
           WHERE id= ?
    `,
    [user_id]
  );
  await myDataSource.query(
    `
    SET foreign_key_checks = 1
    `
  );
};

module.exports = {
  getUserById,
  getUserByEmail,
  createUserInDb,
  findDbUser,
  getAccountInfo,
  modifyAccountInfo,
  deleteAccount,
};

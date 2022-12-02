const myDataSource = require('.');

const getUserById = async login_id => {
  const userId = await myDataSource.query(
    `
    SELECT id, email FROM Users WHERE login_id= (?)
  `,
    [login_id]
  );
  return userId;
};

const getUserByEmail = async email => {
  const userEmail = await myDataSource.query(
    `
    SELECT id, email FROM Users WHERE email= (?)
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
    FROM Users WHERE login_id = (?)
    `,
    [login_id]
  );
  return dbUser;
};

const getAccountInfo = async user_id => {
  const [userInfoById] = await myDataSource.query(
    `
  SELECT * FROM Users WHERE id = (?);
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
    `UPDATE Users SET kor_name=(?), eng_name=(?), email=(?), nickname=(?) WHERE user_id=(?);`,
    [kor_name, eng_name, email, nickname, user_id]
  );
  const [userdata] = await myDataSource.query(
    `
  SELECT * FROM Users WHERE user_id=(?);
  `,
    [user_id]
  );
  return userdata;
};

const deleteAccount = async user_id => {
  await myDataSource.query(`SET foreign_key_checks = 0`);
  await myDataSource.query(`DELETE FROM Users WHERE user_id=(?)`, [user_id]);
  await myDataSource.query(`SET foreign_key_checks = 1`);
};

// const layerConnectionTest = async () => {
//   console.log('I am in userDao');
// };

module.exports = {
  getUserById,
  getUserByEmail,
  createUserInDb,
  findDbUser,
  getAccountInfo,
  modifyAccountInfo,
  deleteAccount,
};

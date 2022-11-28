const { DataSource } = require('typeorm');
const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});
const bcrypt = require('bcryptjs');

myDataSource.initialize();

const getUserById = async login_id => {
  const userId = await myDataSource.query(`
    SELECT id, email FROM Users WHERE email= '${login_id}'
  `);
  return userId;
};

const getUserByEmail = async email => {
  const userEmail = await myDataSource.query(`
    SELECT id, email FROM Users WHERE email= '${email}'
  `);
  return userEmail;
};

const createUserInDb = async (
  login_id,
  password,
  kor_name,
  eng_name,
  nickname,
  email,
  profile_image
) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      myDataSource.query(`
    INSERT INTO Users (login_id, password, kor_name, eng_name, nickname, email, profile_image)
    VALUES (
      '${login_id}', '${hash}', '${kor_name}', '${eng_name}', '${nickname}', '${email}'
      , '${profile_image}'
    )
  `);
    });
  });
};

const findDbUser = async login_id => {
  const [dbUser] = await myDataSource.query(`
  SELECT id, email, kor_name, password, profile_image
    FROM Users WHERE login_id = '${login_id}'
    `);
  return dbUser;
};

const getAccountInfo = async user_id => {
  const [userdata] = await myDataSource.query(`
  SELECT * FROM Users WHERE ID = '${user_id}';
  `);
  return userdata;
};

const modifyAccountInfo = async (
  user_id,
  kor_name,
  eng_name,
  email,
  nickname
) => {
  await myDataSource.query(
    `UPDATE Users SET kor_name='${kor_name}', eng_name='${eng_name}', email='${email}', nickname='${nickname}' WHERE id='${user_id}';`
  );
  const [userdata] = await myDataSource.query(`
  SELECT * FROM Users WHERE ID = '${user_id}';
  `);
  return userdata;
};

const deleteAccount = async user_id => {
  await myDataSource.query(`SET foreign_key_checks = 0`);
  await myDataSource.query(`DELETE FROM Users WHERE id='${user_id}'`);
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

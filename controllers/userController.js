// const { json } = require('express');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const createUser = async (req, res) => {
  const {
    login_id,
    password,
    password_check,
    kor_name,
    eng_name,
    nickname,
    email,
  } = req.body;

  const profile_image = req.file.location;

  const REQUIRE_KEYS = [
    login_id,
    password,
    password_check,
    kor_name,
    eng_name,
    nickname,
    email,
  ];

  Object.keys(REQUIRE_KEYS).map(key => {
    if (!REQUIRE_KEYS[key]) {
      throw new Error(`KEY_ERROR: ${key}`);
    }
  });

  await userService.createUser(
    login_id,
    password,
    password_check,
    kor_name,
    eng_name,
    nickname,
    email,
    profile_image
  );

  res.status(201).json({ message: '회원가입 되었습니다.' });
};

const loginUser = async (req, res) => {
  const { login_id, password } = req.body;

  const REQUIRED_KEYS = { login_id, password };

  Object.keys(REQUIRED_KEYS).map(key => {
    if (!REQUIRED_KEYS[key]) {
      const error = new Error(`KEY_ERROR: ${key}`);
      error.statusCode = 400;
      throw error;
    }
  });

  const result = await userService.loginUser(login_id, password);
  const name = result.kor_name;
  const profile = result.profile_image;
  const id = result.id;
  const userEmail = result.email;
  token = jwt.sign(
    {
      type: 'JWT',
      name: name,
      profile: profile,
      id: id,
      email: userEmail,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: '3000000000000000000m', // 만료시간 30분
      issuer: '토큰발급자',
    }
  );
  res.status(200).json({
    code: 200,
    message: '토큰이 발급되었습니다.',
    token: token,
    id: id,
    name: name,
    profile: profile,
  });
};

const getAccountInfo = async (req, res) => {
  user_id = req.user_id;
  if (!user_id) {
    const error = new Error('No user_id in req');
    error.statusCode = 404;
    throw error;
  }
  const userInfoById = await userService.getAccountInfo(user_id);
  res.status(200).json({ data: userInfoById });
};

const modifyAccountInfo = async (req, res) => {
  user_id = req.user_id;
  const { kor_name, eng_name, email, nickname } = req.body;
  const essentialKeys = { kor_name, eng_name, email, nickname };
  if (!user_id) {
    const error = new Error('NO USER_ID IN REQ');
    error.statusCode = 404;
    throw error;
  }
  Object.keys(essentialKeys).map(key => {
    if (!essentialKeys[key]) {
      const error = new Error(`KEY_ERROR : '${key}'`);
      error.statusCode = 400;
      throw error;
    }
  });
  const userdata = await userService.modifyAccountInfo(
    user_id,
    kor_name,
    eng_name,
    email,
    nickname
  );
  res
    .status(200)
    .json({ message: 'USER INFORMATION HAS BEEN MODIFIED', data: userdata });
  console.log(`USER_ID ${user_id}'s INFORMATION HAS BEEN MODIFIED`);
};

const deleteAccount = async (req, res) => {
  user_id = req.user_id;
  if (!user_id) {
    const error = new Error('NO USER_ID IN REQ');
    error.statusCode = 404;
    throw error;
  }
  await userService.deleteAccount(user_id);
  res.status(200).json({
    message: `USER ${user_id}'s HAS BEEN REMOVED`,
  });
  console.log(`USER ${user_id}'s HAS BEEN REMOVED`);
};

const test = async (req, res) => {
  const user = await userService.test();
  // console.log(user);
  // console.log(user.created_at);
  // console.log(typeof user.created_at);
  // console.log(typeof user);
  // console.log(typeof user.id);
  // console.log(typeof user.login_id);
  // console.log(Object.keys(user.created_at));
  // console.log(Object.values(user.created_at));
  // console.log(Object.keys(user));
  // console.log(Object.values(user));
  let date = new Date();
  const userWillbeDeletedAtThisMoment = user.created_at; //실제로는 user.delete_at이 될 듯
  const date2 = new Date(userWillbeDeletedAtThisMoment);
  const deleteAfterThisSeconds = date2 - date;
  setTimeout(() => {
    console.log('정해진 시간 후에 나올 메세지');
  }, deleteAfterThisSeconds);

  console.log(deleteAfterThisSeconds);

  res.status(200).json({
    message: `USER INFORMATION IS BEING DISPLAYED`,
  });
};
module.exports = {
  createUser,
  loginUser,
  getAccountInfo,
  modifyAccountInfo,
  deleteAccount,
  test,
};

const userDao = require('../models/userDao');
const bcrypt = require('bcryptjs');

const createUser = async (
  login_id,
  password,
  password_check,
  kor_name,
  eng_name,
  nickname,
  email,
  profile_image
) => {
  const num = /[0-9]/g;
  const eng = /[a-z]/gi;
  const spe = /[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi;
  const korAll = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  const korWord = /[가-힣]/;
  const korJaMo = /[ㄱ-ㅎ|ㅏ-ㅣ]/;
  const reg_email =
    /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

  if (login_id.length < 4 || login_id.length > 12) {
    throw new Error('아이디를 4자리 ~ 12자리 이내로 입력해주세요.');
  }

  if (login_id.search(/\s/) != -1) {
    throw new Error('아이디는 공백 없이 입력해주세요.');
  }

  const userId = await userDao.getUserById(login_id);

  if (userId.length !== 0) {
    throw new Error('해당 아이디가 이미 존재합니다.');
  }

  if (password !== password_check) {
    throw new Error('비밀번호가 서로 다릅니다.');
  }

  if (password.length < 8 || password.length > 20) {
    throw new Error('비밀번호는 8자리 ~ 20자리 이내로 입력해주세요.');
  }

  if (password.search(/\s/) != -1) {
    throw new Error('비밀번호는 공백 없이 입력해주세요.');
  }

  if (
    password.search(num) < 0 ||
    password.search(eng) < 0 ||
    password.search(spe) < 0
  ) {
    throw new Error('영문, 숫자, 특수문자를 혼합하여 입력해주세요.');
  }

  if (password.search(korAll) > 0) {
    throw new Error('한글은 안되요.');
  }

  if (kor_name.search(korWord) < 0 || kor_name.search(korJaMo) > 0) {
    throw new Error('자음, 모음은 안되요.');
  }

  if (kor_name.length < 2 || kor_name.length > 6) {
    throw new Error('한국 이름 다시 확인해주세요.');
  }

  if (
    kor_name.search(num) > 0 ||
    kor_name.search(eng) > 0 ||
    kor_name.search(spe) > 0
  ) {
    throw new Error('한글만 가능해요.');
  }

  if (eng_name.length < 3 || kor_name.length > 15) {
    throw new Error('영문 이름 다시 확인해주세요.');
  }

  if (
    eng_name.search(num) > 0 ||
    eng_name.search(korAll) > 0 ||
    eng_name.search(spe) > 0
  ) {
    throw new Error('영어만 가능해요.');
  }

  if (!reg_email.test(email)) {
    throw new Error('이메일 확인 부탁드립니다');
  }

  const userEmail = await userDao.getUserByEmail(email);

  if (userEmail.length !== 0) {
    throw new Error('해당 이메일이 이미 존재합니다.');
  }

  const salt = bcrypt.genSaltSync();
  const hashed_password = bcrypt.hashSync(password, salt);

  await userDao.createUserInDb(
    login_id,
    hashed_password,
    kor_name,
    eng_name,
    nickname,
    email,
    profile_image
  );
};

const loginUser = async (login_id, password) => {
  const dbUser = await userDao.findDbUser(login_id);
  if (!dbUser) {
    const error = new Error('회원가입 내역이 없으시네요.');
    error.status = 404;
    throw error;
  }
  const pwSame = bcrypt.compareSync(password, dbUser.password);
  if (!pwSame) {
    const error = new Error('비밀번호가 다릅니다.');
    error.status = 400;
    throw error;
  }
  return dbUser;
};

const getAccountInfo = async user_id => {
  const userInfoById = await userDao.getAccountInfo(user_id);
  return userInfoById;
};

const modifyAccountInfo = async (
  user_id,
  kor_name,
  eng_name,
  email,
  nickname
) => {
  const userdata = await userDao.modifyAccountInfo(
    user_id,
    kor_name,
    eng_name,
    email,
    nickname
  );
  return userdata;
};

const deleteAccount = async user_id => {
  await userDao.deleteAccount(user_id);
};

const test = async (req, res) => {
  const user = await userDao.test();
  return user;
};

module.exports = {
  createUser,
  loginUser,
  getAccountInfo,
  modifyAccountInfo,
  deleteAccount,
  test,
};

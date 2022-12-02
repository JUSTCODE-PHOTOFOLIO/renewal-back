const { red } = require('cli-color');

const errorHandler = (err, _1, res, _2) => {
  // 흐름상 에러가 검출되면 로그 표시 및 클라이언트에게 전달
  let responseInfo = err;
  if (err.sqlMessage) {
    console.log(err.sqlMessage);
    responseInfo = { message: 'failed', status: 500, ...err };
  }
  console.log(`${red('ERR\t|')}`, err);
  res
    .status(responseInfo.status || 500)
    .json({ message: responseInfo.message || '' });
};

module.exports = { errorHandler };

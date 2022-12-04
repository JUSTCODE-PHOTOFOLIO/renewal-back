const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const { yellow, red, blue, green } = require('cli-color');

aws.config.loadFromPath(__dirname + '/../config/s3.json');

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'photofolio-renewal',
    acl: 'public-read',
    key: function (req, file, cb) {
      // console.log(file),
      cb(null, Date.now() + '.' + file.originalname.split('.').pop()); // 이름 설정
    },
  }),
});

const util = {
  success: (status, message, data) => {
    return {
      status: status,
      success: true,
      message: message,
      data: data,
    };
  },
  fail: (status, message) => {
    return {
      status: status,
      success: false,
      message: message,
    };
  },
};

function asyncWrap(asyncController) {
  return async (req, res, next) => {
    try {
      await asyncController(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

function bodyText(req) {
  let bodyText = '';
  if (req.method !== 'GET') {
    bodyText = `${yellow('BODY\t|')}`;
    bodyText +=
      Object.keys(req.body)
        .map((key, index) => {
          return `${index === 0 ? '' : '\t' + yellow('|')} ${green.italic(
            key
          )} ${req.body[key]}`;
        })
        .join('\n') + '\n';
  }
  return bodyText;
}

function morganCustomFormat(tokens, req, res) {
  return [
    `\n= ${red('MESSAGE')} =`,
    '\n',
    `${blue('URL\t| ')}`,
    tokens.url(req, res),
    '\n',
    `${blue('METHOD\t| ')}`,
    tokens.method(req, res),
    '\n',
    bodyText(req),
    `${blue('STATUS\t| ')}`,
    tokens.status(req, res),
    '\n',
    `${blue('RESP\t| ')}`,
    tokens['response-time'](req, res),
    'ms',
    `${blue('\nDATE\t|')} `,
    new Date().toLocaleTimeString(),
    '\n',
  ].join('');
}

function errorHandler(err, _1, res, _2) {
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
}

module.exports = {
  morganCustomFormat,
  asyncWrap,
  errorHandler,
  util,
  upload,
};

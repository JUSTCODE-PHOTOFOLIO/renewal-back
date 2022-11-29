// const { yellow, red, blue, green } = require('cli-color');

// multer파일도 같이 미들웨어에서, 유틸 폴더로 이동 및 정리!!

// const util = {
//     success: (status, message, data) => {
//       return {
//         status: status,
//         success: true,
//         message: message,
//         data: data
//       }
//     },
//     fail: (status, message) => {
//       return {
//         status: status,
//         success: false,
//         message: message
//       }
//     }
//   }

// function bodyText(req) {
//   let bodyText = '';
//   if (req.method !== 'GET') {
//     bodyText = `${yellow('BODY\t|')}`;
//     bodyText +=
//       Object.keys(req.body)
//         .map((key, index) => {
//           return `${index === 0 ? '' : '\t' + yellow('|')} ${green.italic(
//             key
//           )} ${req.body[key]}`;
//         })
//         .join('\n') + '\n';
//   }
//   return bodyText;
// }

// function morganCustomFormat(tokens, req, res) {
//   return [
//     `\n= ${red('MESSAGE')} =`,
//     '\n',
//     `${blue('URL\t| ')}`,
//     tokens.url(req, res),
//     '\n',
//     `${blue('METHOD\t| ')}`,
//     tokens.method(req, res),
//     '\n',
//     bodyText(req),
//     `${blue('STATUS\t| ')}`,
//     tokens.status(req, res),
//     '\n',
//     `${blue('RESP\t| ')}`,
//     tokens['response-time'](req, res),
//     'ms',
//     `${blue('\nDATE\t|')} `,
//     new Date().toLocaleTimeString(),
//     '\n',
//   ].join('');
// }

// module.exports = { bodyText, morganCustomFormat };

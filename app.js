const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const multer = require('multer');
const morgan = require('morgan');
const { morganCustomFormat } = require('./utils/util');

let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

const createApp = () => {
  const app = express();
  app.use(cors(corsOptions));
  app.use(morgan(morganCustomFormat));

  app.use(express.json());
  app.use(routes);

  app.use(multer);

  app.use((err, req, res, next) => {
    const { statusCode, message } = err;
    console.error(err);
    res.status(statusCode || 500).json({ message });
  });

  return app;
};

module.exports = { createApp };

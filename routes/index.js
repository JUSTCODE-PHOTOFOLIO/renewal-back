const express = require('express');
const router = express.Router();

const { errorHandler } = require('../utils/util');

const userRouter = require('./userRouter');
const categoryRouter = require('./categoryRouter');
const feedRouter = require('./feedRouter');
const workRouter = require('./workRouter');
const searchListRouter = require('./searchListRouter');
const sympathyRouter = require('./sympathyRouter');
const followRouter = require('./followRouter');
const channelRouter = require('./channelRouter');
const commentRouter = require('./commentRouter');

const uploadRouter = require('./uploadRouter');

router.use('/user', userRouter);
router.use('/works', workRouter); // TODO Refactoring - Inchan
router.use('/feeds', feedRouter);
router.use('/category', categoryRouter);
router.use('/searchlist', searchListRouter);
router.use('/upload', uploadRouter);
router.use('/sympathy', sympathyRouter); // TODO Refactoring - Inchan
router.use('/follow', followRouter);
router.use('/channel', channelRouter);
router.use('/comments', commentRouter);

router.use(errorHandler);

module.exports = router;

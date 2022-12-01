const express = require('express');
const router = express.Router();

const userRouter = require('./userRouter');
const postRouter = require('./workRouter');
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
router.use('/feeds', feedRouter); // TODO Refactoring - Inchan
router.use('/category', categoryRouter); // TODO Refactoring - Inchan
router.use('/searchlist', searchListRouter); // TODO Refactoring - Inchan
router.use('/upload', uploadRouter);
router.use('/sympathy', sympathyRouter); // TODO Refactoring - Inchan
router.use('/follow', followRouter); // TODO Refactoring - Inchan
router.use('/channel', channelRouter); // TODO Refactoring - Inchan
router.use('/comments', commentRouter);

module.exports = router;

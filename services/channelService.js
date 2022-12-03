const channelDao = require('../models/channelDao');

const getChannel = async (following_id, user_id) => {
  return await channelDao.getChannel(following_id, user_id);
};

module.exports = {
  getChannel,
};

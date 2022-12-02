const channelDao = require('../models/channelDao');

const channel = async (following_id, user_id) => {
  return await channelDao.channel(following_id, user_id);
};

module.exports = {
  channel,
};

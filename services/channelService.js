const channelDao = require('../models/channelDao');

const channel = async (following_id, user_id) => {
  const result = await channelDao.channel(following_id, user_id);
  return result;
};

module.exports = {
  channel,
};

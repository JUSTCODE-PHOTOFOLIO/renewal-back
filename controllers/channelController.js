const channelService = require('../services/channelService');

// channel 내용 출력
const getChannel = async (req, res) => {
  const user_id = req.user_id;
  const { following_id } = req.params;
  const result = await channelService.getChannel(following_id, user_id);
  res.status(200).json(result);
};

module.exports = {
  getChannel,
};

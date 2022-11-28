const channelService = require('../services/channelService');

// channel 내용 출력
const channel = async (req, res) => {
  user_id = req.user_id;
  const { following_id } = req.params;
  console.log(user_id);
  console.log(following_id);
  // const following_id = id;
  const result = await channelService.channel(following_id, user_id);
  res.status(200).json(result);
};

module.exports = {
  channel,
};

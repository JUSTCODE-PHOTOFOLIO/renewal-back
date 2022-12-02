const sympathyService = require('../services/sympathyService');

// 공감
const sympathy = async (req, res) => {
  const { posting_id, sympathy_id } = req.body;
  let user_id = req.user_id;
  const result = await sympathyService.sympathy(
    posting_id,
    user_id,
    sympathy_id
  );
  res.status(200).json(result);
};

// 공감 취소
const sympathyCancel = async (req, res) => {
  const { posting_id } = req.body;
  let user_id = req.user_id;
  const result = await sympathyService.sympathyCancel(posting_id, user_id);
  res.status(200).json(result);
};

module.exports = {
  sympathy,
  sympathyCancel,
};

const sympathyService = require('../services/sympathyService');

// 공감
const sympathy = async (req, res) => {
  try {
    const { posting_id, sympathy_id } = req.body;
    user_id = req.user_id;
    const result = await sympathyService.sympathy(
      posting_id,
      user_id,
      sympathy_id
    );
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// 공감 취소
const sympathyCancel = async (req, res) => {
  try {
    const { posting_id } = req.body;
    user_id = req.user_id;
    const result = await sympathyService.sympathyCancel(posting_id, user_id);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = {
  sympathy,
  sympathyCancel,
};

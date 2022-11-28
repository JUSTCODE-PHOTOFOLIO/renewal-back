const commentDao = require('../models/commentDao');

const postComment = async (comment, id, user_id) => {
  const postedComment = await commentDao.postComment(comment, id, user_id);
  return postedComment;
};

const modifiyComment = async (id, comment, user_id, comment_id) => {
  const modifedComment = await commentDao.modifiyComment(
    id,
    comment,
    user_id,
    comment_id
  );
  return modifedComment;
};

const deleteComment = async (user_id, comment_id) => {
  await commentDao.deleteComment(user_id, comment_id);
};

module.exports = { postComment, modifiyComment, deleteComment };

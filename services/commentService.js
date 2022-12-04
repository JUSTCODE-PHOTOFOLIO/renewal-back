const commentDao = require('../models/commentDao');

const postComment = async (comment, id, user_id) => {
  const postedComment = await commentDao.postComment(comment, id, user_id);
  return postedComment;
};

const modifiyComment = async (id, comment, user_id, comment_id) => {
  const selectedComment = await commentDao.selectComment(comment_id);
  //댓글이 존재하지 않을 경우 에러 발생
  if (!selectedComment) {
    const error = new Error('COMMENT DOES NOT EXIST');
    error.statusCode = 404;
    throw error;
  }
  //로그인한 사용자와 댓글 작성자가 다를 경우 에러 발생
  if (selectedComment.user_id !== user_id) {
    const error = new Error('ONLY WRITER CAN MODIFY COMMENT');
    error.statusCode = 404;
    throw error;
  }
  const modifedComment = await commentDao.modifiyComment(
    id,
    comment,
    user_id,
    comment_id
  );
  return modifedComment;
};

const deleteComment = async (user_id, comment_id) => {
  const selectedComment = await commentDao.selectComment(comment_id);
  //댓글이 존재하지 않을 경우 에러 발생
  if (!selectedComment) {
    const error = new Error('COMMENT DOES NOT EXIST');
    error.statusCode = 404;
    throw error;
  }

  //로그인한 사용자와 댓글 작성자가 다를 경우 에러 발생
  if (selectedComment.user_id !== user_id) {
    const error = new Error('ONLY WRITER CAN DELETE COMMENT');
    error.statusCode = 404;
    throw error;
  }
  await commentDao.deleteComment(user_id, comment_id);
};

module.exports = { postComment, modifiyComment, deleteComment };

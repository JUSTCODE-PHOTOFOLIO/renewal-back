const commentService = require('../services/commentService');

const postComment = async (req, res) => {
  try {
    user_id = req.user_id;
    // user_id = 작성자의 id
    const { id, comment } = req.body;
    // id = 게시물의 id
    if (!comment) {
      //댓글 내용이 없을 경우 에러 발생
      const error = new Error('COMMENT TEXT NEEDED');
      error.statusCode = 404;
      throw error;
    }
    // 게시물id가 없을 경우 에러 발생
    if (!id) {
      const error = new Error('VALID POSTING ID NEEDED');
      error.statusCode = 404;
      throw error;
    }
    const postedComment = await commentService.postComment(
      comment,
      id,
      user_id
    );
    res.status(200).json({
      data: postedComment,
    });
    console.log('COMMENT POSTED');
  } catch (error) {
    console.log(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

const modifiyComment = async (req, res) => {
  try {
    user_id = req.user_id;
    //user_id = 작성자의 id
    const { comment, id, comment_id } = req.body;
    //id = 게시물의 id
    //comment_id = 댓글의 id
    const modifiedComment = await commentService.modifiyComment(
      id,
      comment,
      user_id,
      comment_id
    );
    res.status(200).json({
      data: modifiedComment,
    });
    console.log('COMMENT MODIFIED');
  } catch (error) {
    console.log(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    user_id = req.user_id;
    const { comment_id } = req.body;
    await commentService.deleteComment(user_id, comment_id);
    res.status(200).json({ message: 'COMMENT DELETED' });
    console.log('COMMENT DELETED');
  } catch (error) {
    console.log(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

module.exports = { postComment, modifiyComment, deleteComment };

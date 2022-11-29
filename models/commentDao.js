const myDataSource = require('.');

const postComment = async (comment, id, user_id) => {
  await myDataSource.query(
    `INSERT Comment SET comment='${comment}', posting_id=${id}, user_id=${user_id};`
  );
  const allCommentsAfterModifying = await myDataSource.query(
    `
    SELECT c.id, c.user_id, c.posting_id, u.kor_name, c.comment, SUBSTRING(c.created_at,1,10) as created_at, SUBSTRING(c.updated_at,1,10) as updated_at 
    FROM Comment c
    LEFT JOIN Users u on u.id = c.user_id where posting_id = ${id}
    order by c.id asc;
    `
  );
  return allCommentsAfterModifying;
};

const modifiyComment = async (id, comment, user_id, comment_id) => {
  const [selectedComment] = await myDataSource.query(
    `SELECT * FROM Comment where id=${comment_id}`
  );
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
  await myDataSource.query(
    `UPDATE Comment SET Comment='${comment}', user_id=${user_id}, posting_id=${id} WHERE id=${comment_id};`
  );
  const allCommentsAfterModifying = await myDataSource.query(
    `SELECT * FROM Comment where posting_id = ${id} 
    order by created_at asc;`
  );
  return allCommentsAfterModifying;
};

const deleteComment = async (user_id, comment_id) => {
  console.log(user_id);
  console.log(comment_id);
  const [selectedComment] = await myDataSource.query(
    `SELECT * FROM Comment where id=${comment_id}`
  );
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
  await myDataSource.query(`DELETE FROM Comment where id=${comment_id}`);
};

module.exports = { postComment, modifiyComment, deleteComment };

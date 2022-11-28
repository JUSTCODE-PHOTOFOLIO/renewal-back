const { DataSource } = require('typeorm');
const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

myDataSource.initialize();

// 공감
const sympathy = async (posting_id, user_id, sympathy_id) => {
  try {
    const checkSympathy = await myDataSource.query(
      `
    SELECT COUNT(*) check_cnt FROM Works_Sympathy_Count wsc
    WHERE posting_id = '${posting_id}' and user_id = '${user_id}'
    `
    );
    let checkValue = checkSympathy[0].check_cnt;
    console.log('checkValue =', checkValue);
    if (checkValue == 0) {
      const insertSympathy = await myDataSource.query(
        `
      INSERT INTO Works_Sympathy_Count (user_id, posting_id, sympathy_id)
      VALUES ('${user_id}', '${posting_id}', '${sympathy_id}')
      `
      );
      const result = await myDataSource.query(
        `
      SELECT * FROM Works_Sympathy_Count wsc 
      WHERE user_id = '${user_id}' and posting_id = '${posting_id}'
      `
      );

      const resultCount = await myDataSource.query(
        `
        with tables as (
          SELECT wp.id id,  ws.sympathy_sort sympathy_sort, 
            IFNULL(COUNT(wsc.id), '0') as sympathy_cnt
          FROM  Works_Sympathy ws
            LEFT JOIN Works_Sympathy_Count wsc on ws.id  = wsc.sympathy_id 
            LEFT JOIN Users u on u.id = wsc.user_id 
            LEFT JOIN Works_Posting wp ON wsc.posting_id = wp.id 
            WHERE wp.id = '${posting_id}'
            GROUP by ws.sympathy_sort
            )
        
        SELECT a.id, ws.sympathy_sort, IFNULL(a.sympathy_cnt, '0') sympathy_cnt from Works_Sympathy ws 
        LEFT JOIN tables a on a.sympathy_sort = ws.sympathy_sort `
      );
      let totalResult = { result, resultCount };
      return totalResult;
    } else if (checkValue == 1) {
      const insertSympathy = await myDataSource.query(
        `
      UPDATE Works_Sympathy_Count SET sympathy_id = '${sympathy_id}'
      WHERE user_id = '${user_id}' and posting_id = '${posting_id}'
      `
      );
      const result = await myDataSource.query(
        `
      SELECT * FROM Works_Sympathy_Count wsc 
      WHERE user_id = '${user_id}' and posting_id = '${posting_id}'
      `
      );

      const resultCount = await myDataSource.query(
        `
        with tables as (
          SELECT wp.id id,  ws.sympathy_sort sympathy_sort, 
            IFNULL(COUNT(wsc.id), '0') as sympathy_cnt
          FROM  Works_Sympathy ws
            LEFT JOIN Works_Sympathy_Count wsc on ws.id  = wsc.sympathy_id 
            LEFT JOIN Users u on u.id = wsc.user_id 
            LEFT JOIN Works_Posting wp ON wsc.posting_id = wp.id 
            WHERE wp.id = '${posting_id}'
            GROUP by ws.sympathy_sort
            )
        
        SELECT a.id, ws.sympathy_sort, IFNULL(a.sympathy_cnt, '0') sympathy_cnt from Works_Sympathy ws 
        LEFT JOIN tables a on a.sympathy_sort = ws.sympathy_sort `
      );
      let totalResult = { result, resultCount };
      return totalResult;
    }
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

// 공감 취소
const sympathyCancel = async (posting_id, user_id) => {
  try {
    const deleteSympathy = await myDataSource.query(
      `
    DELETE FROM Works_Sympathy_Count 
    WHERE user_id = '${user_id}' and posting_id = '${posting_id}'
    `
    );
    const checkSympathy = await myDataSource.query(
      `
    SELECT COUNT(*) check_cnt FROM Works_Sympathy_Count wsc
    WHERE posting_id = '${posting_id}' and user_id = '${user_id}'
    `
    );
    let result = { checkSympathy };
    return result;
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message });
  }
};

module.exports = {
  sympathy,
  sympathyCancel,
};

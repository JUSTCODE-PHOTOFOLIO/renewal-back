const myDataSource = require('.');

// 공감
const createSympathy = async (posting_id, user_id, sympathy_id) => {
  const checkSympathy = await myDataSource.query(
    `
      SELECT
        COUNT(*) check_cnt
      FROM
        Works_Sympathy_Count wsc
      WHERE
        posting_id = ?
        AND user_id = ?
    `,
    [posting_id, user_id]
  );
  let checkValue = checkSympathy[0].check_cnt;

  // TODO 서비스단으로 올리기
  if (checkValue == 0) {
    await myDataSource.query(
      `
        INSERT
          INTO
          Works_Sympathy_Count (user_id,
          posting_id,
          sympathy_id)
        VALUES ( ?, ?, ?)
      `,
      [user_id, posting_id, sympathy_id]
    );
    const result = await myDataSource.query(
      `
        SELECT
          *
        FROM
          Works_Sympathy_Count wsc
        WHERE
          user_id = ?
          AND posting_id = ?
      `,
      [user_id, posting_id, sympathy_id, user_id, posting_id]
    );

    const resultCount = await myDataSource.query(
      `
        WITH tables AS (
          SELECT
            wp.id AS id,
            ws.sympathy_sort AS sympathy_sort,
            IFNULL(COUNT(wsc.id), '0') AS sympathy_cnt
          FROM
            Works_Sympathy ws
          LEFT JOIN Works_Sympathy_Count wsc ON
            ws.id = wsc.sympathy_id
          LEFT JOIN Users u ON
            u.id = wsc.user_id
          LEFT JOIN Works_Posting wp ON
            wsc.posting_id = wp.id
          WHERE
            wp.id = ?
          GROUP BY
            ws.sympathy_sort
          )

        SELECT
          a.id,
          ws.sympathy_sort,
          IFNULL(a.sympathy_cnt, '0') AS sympathy_cnt
        FROM
          Works_Sympathy ws
        LEFT JOIN tables a ON
          a.sympathy_sort = ws.sympathy_sort `,
      [posting_id]
    );
    return { result, resultCount };
  } else if (checkValue == 1) {
    await myDataSource.query(
      `
      UPDATE
        Works_Sympathy_Count
      SET
        sympathy_id = ?
      WHERE
        user_id = ?
        AND posting_id = ?
      `,
      [sympathy_id, user_id, posting_id]
    );
    const result = await myDataSource.query(
      `
        SELECT
          *
        FROM
          Works_Sympathy_Count wsc
        WHERE
          user_id = ?
          AND posting_id = ?
      `,
      [user_id, posting_id]
    );

    const resultCount = await myDataSource.query(
      `
      WITH
          tables AS (SELECT
             wp.id AS id,
             ws.sympathy_sort AS sympathy_sort,
             IFNULL(COUNT(wsc.id), '0') AS sympathy_cnt
         FROM
             Works_Sympathy ws
                 LEFT JOIN Works_Sympathy_Count wsc ON
                 ws.id = wsc.sympathy_id
                 LEFT JOIN Users u ON
                 u.id = wsc.user_id
                 LEFT JOIN Works_Posting wp ON
                 wsc.posting_id = wp.id
         WHERE
             wp.id = ?
         GROUP BY
             ws.sympathy_sort)

      SELECT
          a.id,
          ws.sympathy_sort,
          IFNULL(a.sympathy_cnt, '0') AS sympathy_cnt
      FROM
          Works_Sympathy ws
              LEFT JOIN tables a ON
              a.sympathy_sort = ws.sympathy_sort
      `,
      [posting_id]
    );
    return { result, resultCount };
  }
};

// 공감 취소
const deleteSympathy = async (posting_id, user_id) => {
  await myDataSource.query(
    `
      DELETE
      FROM
        Works_Sympathy_Count
      WHERE
        user_id = ?
        AND posting_id = ?
    `,
    [user_id, posting_id]
  );
  const checkSympathy = await myDataSource.query(
    `
      SELECT
        COUNT(*) check_cnt
      FROM
        Works_Sympathy_Count wsc
      WHERE
        posting_id = ?
        AND user_id = ?
    `,
    [posting_id, user_id]
  );
  return { checkSympathy };
};

module.exports = {
  createSympathy,
  deleteSympathy,
};

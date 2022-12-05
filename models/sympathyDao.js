const myDataSource = require('.');

// 피드에서 로그인유저의 공감여부 확인하기
const findSympathyOfFeedByUser = async (posting_id, user_id) => {
  return await myDataSource
    .query(
      `
      SELECT
        COUNT(*) checkSympathyByUser
      FROM
        Works_Sympathy_Count wsc
      WHERE
        posting_id = ?
        AND user_id = ?
    `,
      [posting_id, user_id]
    )
    .then(value => {
      const [item] = value;
      console.log('dao result =', item.checkSympathyByUser);
      return {
        checkSympathyByUser: item.checkSympathyByUser === '1',
      };
    });
};

// 공감하기
const createSympathy = async (posting_id, user_id, sympathy_id) => {
  await myDataSource.query(
    `
        INSERT
        INTO
            Works_Sympathy_Count (user_id,
                                  posting_id,
                                  sympathy_id)
        VALUES
            (?, ?, ?)
    `,
    [user_id, posting_id, sympathy_id]
  );

  const getSympathyByUser = await myDataSource.query(
    `
        SELECT *
        FROM
            Works_Sympathy_Count wsc
        WHERE
            user_id = ?
          AND posting_id = ?
    `,
    [user_id, posting_id]
  );

  const getSympathiesCount = await myDataSource.query(
    `
        WITH
            tables AS (SELECT
                           wp.id                      AS id,
                           ws.sympathy_sort           AS sympathy_sort,
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
  return { getSympathyByUser, getSympathiesCount };
};

// 공감 수정하기
const updateSympathy = async (posting_id, user_id, sympathy_id) => {
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

  const getSympathyByUser = await myDataSource.query(
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

  const getSympathiesCount = await myDataSource.query(
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
  return { getSympathyByUser, getSympathiesCount };
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

  const getSympathiesCount = await myDataSource.query(
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

  return { getSympathiesCount };
};

module.exports = {
  findSympathyOfFeedByUser,
  createSympathy,
  updateSympathy,
  deleteSympathy,
};

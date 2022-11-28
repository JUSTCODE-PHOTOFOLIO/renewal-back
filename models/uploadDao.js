const { DataSource } = require('typeorm');
const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});
myDataSource.initialize()

const worksCategory = async (category_name) => {
  const [categoryId] = await myDataSource.query(`
    SELECT id FROM Works_Category WHERE category_name = '${category_name}'
  `);
  const category_id = categoryId.id
  return category_id;
};

const publicStatus = async (public_status) => {
  const [statusId] = await myDataSource.query(`
    SELECT id FROM public_status WHERE status = '${public_status}'
  `);
  const status_id = statusId.id
  return status_id;
};

const findTilte = async (title, user_id) => {
  const tilteName = await myDataSource.query(`
  SELECT title FROM Works_Posting WHERE title = '${title}' and user_id = '${user_id}'
`);
  return tilteName
}


const uploadForm = async (title, content, user_id, category_id, status_id) => {
  const posting = await myDataSource.query(`
  INSERT INTO Works_Posting (user_id, category_id, title, content, status_id)
  VALUES ('${user_id}', '${category_id}', '${title}', '${content}', '${status_id}')
  `)
  return posting
}

const worksPosting = async (user_id, title) => {
  const postingId = await myDataSource.query(`
    SELECT id FROM Works_Posting WHERE user_id = '${user_id}' AND title='${title}'
  `)
  const posting_id = postingId[0].id
  return posting_id
}

const uploadImages = async (posting_id, path) => {
  for (let i = 0; i < path.length; i++) {
    await myDataSource.query(`
  INSERT INTO upload_file (posting_id, file_sort_id, upload_url)
  VALUES ('${posting_id}', '1', '${path[i]}')
  `)
  }
}

const worksTagNames = async (arrayTag) => {
  for (let i = 0; i < arrayTag.length; i++) {
  await myDataSource.query(`
  INSERT INTO Works_tag_names (name)
  VALUES ('${arrayTag[i]}')
  `)
  } 
}

const deleteOverlapTag = async () => {
  const noOverlapTag = await myDataSource.query(`
    DELETE a FROM Works_tag_names a , Works_tag_names b WHERE a.id > b.id AND a.name = b.name;
  `)
  return noOverlapTag
}

const findTagId = async (arrayTag) => {
  const tagIdArray= []
  for (let i = 0; i < arrayTag.length; i++) {
  const [tagId] = await myDataSource.query(`
    SELECT id FROM Works_tag_names WHERE name = '${arrayTag[i]}'
    `)
    tagIdArray.push(tagId.id)
  }
  return tagIdArray
}

const worksPostingTags = async (tagId, posting_id) => {
  for (let i = 0; i < tagId.length; i++)
  await myDataSource.query(`
  INSERT INTO Works_Posting_tags (tag_id, posting_id)
  VALUES ('${tagId[i]}', '${posting_id}')
  `)
}




module.exports = { 
  worksCategory, publicStatus, findTilte, uploadForm, worksPosting, worksTagNames, deleteOverlapTag, uploadImages, findTagId, worksPostingTags
}
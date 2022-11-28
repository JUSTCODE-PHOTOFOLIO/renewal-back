const uploadDao = require('../models/uploadDao');


const uploadImages = async (title, content, arrayTag, image, category_name, user_id, public_status) => {
  const path = image.map(img => img.location);
  if (image === undefined) {
    throw new Error("이미지가 존재하지 않습니다")
  }

  if (!title) {
    throw new Error("제목을 입력해주세요")
  }

  if (arrayTag.length > 10) {
    throw new Error("태그는 10개까지만 할 수 있어요.")
  }
  const category_id = await uploadDao.worksCategory(category_name);
  const status_id = await uploadDao.publicStatus(public_status);
  const tilteName = await uploadDao.findTilte(title, user_id);

  if (tilteName.length !==0 ) {
    throw new Error('같은 제목이 이미 존재합니다.');
  }

  await uploadDao.uploadForm(title, content, user_id, category_id, status_id);
  const posting_id = await uploadDao.worksPosting(user_id, title);
  await uploadDao.uploadImages(posting_id, path);
  await uploadDao.worksTagNames(arrayTag);
  await uploadDao.deleteOverlapTag();
  const tagId = await uploadDao.findTagId(arrayTag);
  await uploadDao.worksPostingTags(tagId, posting_id)
}



module.exports = { uploadImages }

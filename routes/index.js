const express = require('express')
const v1 = express()
v1.use('/auth', require('../apps/auth'))
// v1.use('/subject', require('../apps/subject'))
// v1.use('/subject-follow', require('../apps/subjectFollow'))
v1.use('/history', require('../apps/history'))

v1.use('/note', require('../apps/note'))
v1.use('/search', require('../apps/search'))
v1.use('/keywords', require('../apps/keywords'))
v1.use('/similar', require('../apps/similar'))

v1.use('/note-star', require('../apps/noteStar'))
v1.use('/statistic', require('../apps/statistic'))
v1.use('/tag', require('../apps/tag'))

// v1.use('/post-top', require('../apps/postTop'))
// v1.use('/post-recommend', require('../apps/postRecommend'))

// v1.use('/medias', require('../apps/medias'))
// v1.use('/thumb', require('../apps/thumb'))
// v1.use('/comment', require('../apps/comment'))
// v1.use('/comment-thumb', require('../apps/commentThumb'))

module.exports = function (app) {
    app.use('/v1',v1)
}

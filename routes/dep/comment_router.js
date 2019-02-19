'use strict';

const express = require('express');
const router = express.Router();
// const bugApp = require('../apps/bug_app');
const comment_app = require('../apps/comment_app')
const isAppExisted = require('../utils/validate').isAppExisted
// const isBugExisted = require('../utils/validate').isBugExisted;

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/:dirId',
    comment_app.createComment);

router.get('/:dirId',
    comment_app.getCommentList);

router.delete('/:commentId',
    comment_app.deleteComment);

// router.post('/upload',
//     multipartMiddleware,
//     comment_app.uploadFile);

// router.get('/download/:mediaId',
//     comment_app.download)


// router.post('/createLink',
//     comment_app.createLink);

// router.delete('/:fileId', 
//     comment_app.deleteFile);

// router.post('/insertOneLog',
//     comment_app.insertOneLog);

// router.get('/getShortcuts/:appId',
//     comment_app.getShortcuts);

module.exports = router;
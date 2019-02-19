'use strict';

const express = require('express');
const router = express.Router();
// const bugApp = require('../apps/bug_app');
const category_app = require('../apps/category_app')
const isAppExisted = require('../utils/validate').isAppExisted
// const isBugExisted = require('../utils/validate').isBugExisted;

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.get('/',category_app.getCategories)

router.post('/new',category_app.createCate)

router.post('/order/:id/:order',category_app.modifyOrder)

router.delete('/:categoryId',category_app.deleteById)

// router.get('/:dirId',
//     comment_app.getCommentList);


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

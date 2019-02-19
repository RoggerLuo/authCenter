
const express = require('express');
const router = express.Router();
// const bugApp = require('../apps/bug_app');
const detail_app = require('../apps/detail_app')
const isAppExisted = require('../utils/validate').isAppExisted
// const isBugExisted = require('../utils/validate').isBugExisted;

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

router.post('/upload',
    multipartMiddleware,
    detail_app.uploadFile);

router.get('/getList/:appId/:father',
    detail_app.getFileList);

router.get('/download/:mediaId',
    detail_app.download)

router.post('/createDir',
    detail_app.createDir);

router.post('/createLink',
    detail_app.createLink);

router.delete('/:fileId', 
    detail_app.deleteFile);

router.post('/insertOneLog',
    detail_app.insertOneLog);

router.get('/getShortcuts/:appId',
    detail_app.getShortcuts);

router.get('/pdf/:mediaId',detail_app.previewPdf);


// router.get('/:appId', 
//  isAppExisted('req.params.appId'), 
//  bugApp.getBugs);

// router.get('/type/:appId', 
//  isAppExisted('req.params.appId'), 
//  bugApp.getBugTypes);

// router.post('/:appId', 
//  isAppExisted('req.params.appId'), 
//  bugApp.createBug);

// router.get('/:appId/:bugId', 
//  isAppExisted('req.params.appId'), 
//  bugApp.getBugById);

// router.delete('/:appId/:bugId', 
//  // isBugExisted('req.params.appId', 'req.params.bugId'), 
//  bugApp.deleteBugById);


module.exports = router;

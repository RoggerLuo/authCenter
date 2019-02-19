// 1. 新建错误
// 2. 查看错误
// 3. 删除错误
// 4. 查询应用所有错误

'use strict';

const express = require('express');
const router = express.Router();
const bugApp = require('../apps/bug_app');

const isAppExisted = require('../utils/validate').isAppExisted;
const isBugExisted = require('../utils/validate').isBugExisted;

router.get('/:appId', 
	isAppExisted('req.params.appId'), 
	bugApp.getBugs);

router.get('/type/:appId', 
	isAppExisted('req.params.appId'), 
	bugApp.getBugTypes);

router.post('/:appId', 
	isAppExisted('req.params.appId'), 
	bugApp.createBug);

router.get('/:appId/:bugId', 
	isAppExisted('req.params.appId'), 
	bugApp.getBugById);

router.delete('/:appId/:bugId', 
	isBugExisted('req.params.appId', 'req.params.bugId'), 
	bugApp.deleteBugById);


module.exports = router;
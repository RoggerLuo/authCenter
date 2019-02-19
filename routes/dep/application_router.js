// 1. 获取用户应用列表
// 2. 新建应用
// 3. 查看应用
// 4. 修改应用
// 5. 删除应用

'use strict';

const express = require('express');
const router = express.Router();
const applicationApp = require('../apps/application_app');

const isAppExisted = require('../utils/validate').isAppExisted;

router.get('/', applicationApp.getApps);
router.post('/', applicationApp.createApp);
router.get('/:id', applicationApp.getAppById);
router.put('/:id', isAppExisted('req.params.id'), applicationApp.updateAppById);
router.delete('/:appId', applicationApp.deleteAppById);
router.post('/categorize',applicationApp.categorize);

module.exports = router;
const express = require('express')
const router = express.Router()
const app = require('../apps/subject')
const isAppExisted = require('../utils/validate').isAppExisted

router.get('/', app.getList)
router.post('/',app.create)
router.delete('/:_id',app.deleteOne)

router.get('/bannedUsers',app.getbannedusers)
router.get('/bannedusersAdd',app.getbannedusersadd)
router.get('/postAdmin',app.getpostAdmin)
router.get('/post/details',app.getpostdetails)
// router.get('/bannedusersAdd',app.getbannedusersAdd)
// router.post('/', applicationApp.createApp)
// router.get('/:id', applicationApp.getAppById)
// router.put('/:id', isAppExisted('req.params.id'), applicationApp.updateAppById)
// router.delete('/:appId', applicationApp.deleteAppById)
// router.post('/categorize',applicationApp.categorize)

module.exports = router
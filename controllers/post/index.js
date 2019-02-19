const express = require('express')
const router = express.Router()
const app = require('./app')
router.post('/',app.create)
router.get('/', app.getList)
router.get('/:_id', app.getOne)
router.delete('/:_id',app.deleteOne)
// router.get('/search', app.search) 

// const isAppExisted = require('../utils/validate').isAppExisted
// router.get('/bannedUsers',app.getbannedusers)
// router.get('/bannedusersAdd',app.getbannedusersadd)
// router.get('/postAdmin',app.getpostAdmin)
// router.get('/post/details',app.getpostdetails)
// router.get('/bannedusersAdd',app.getbannedusersAdd)
// router.post('/', applicationApp.createApp)
// router.get('/:id', applicationApp.getAppById)
// router.put('/:id', isAppExisted('req.params.id'), applicationApp.updateAppById)
// router.delete('/:appId', applicationApp.deleteAppById)
// router.post('/categorize',applicationApp.categorize)

module.exports = router
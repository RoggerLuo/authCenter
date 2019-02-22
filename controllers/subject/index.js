const express = require('express')
const router = express.Router()
const app = require('./controller')
router.get('/', app.getList)
router.post('/',app.create)

router.delete('/:_id',app.deleteOne)

router.get('/bannedUsers',app.getbannedusers)
router.get('/bannedusersAdd',app.getbannedusersadd)
router.get('/postAdmin',app.getpostAdmin)
router.get('/post/details',app.getpostdetails)

module.exports = router
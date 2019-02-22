const express = require('express')
const router = express.Router()
const app = require('./controller')
router.get('/',app.getRecommend)
router.post('/:_id',app.recommendCreate)
router.delete('/:_id',app.recommendDelete)

module.exports = router
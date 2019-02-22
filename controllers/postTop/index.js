const express = require('express')
const router = express.Router()
const app = require('./controller')
router.get('/',app.getTop)
router.post('/:_id',app.topCreate)
router.delete('/:_id',app.topDelete)

module.exports = router